/**
 *
 * @format
 */

import * as React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-simple-toast';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import functions from '@react-native-firebase/functions';
import {getLocationUpdates, getLocation} from '../../functions/location';
import {networkStatusListener} from '../../functions/network';
import {uploadGPS} from '../../functions/database';
import {viewStyles, textStyles} from './styles';
import {SideDrawer} from '../../components/SideDrawer/index';
import {Profile} from '../../components/Profile/index';
import {HideInteraction} from '../../components/hideInteraction';
import UserLogo from '../../assets/user.svg';
import {AppContext} from '../../context/store';
import {SelectEmitterModal} from '../../components/SelectEmitterModal';

// import types
import {StackScreenProps} from '@react-navigation/stack';
import {GeoPosition} from 'react-native-geolocation-service';
import {Region} from 'react-native-maps';

type PropsT = StackScreenProps<NavigationT.RootStackT, 'GPS'>;

/**
GPSScreen

This is the screen that shows the Google Map, allows user to capture and record
GPS, and offer a few configurations.
 */
export const GPSScreen: React.FC<PropsT> = _ => {
  const [observing, setObserving] = React.useState<boolean>(false);
  const [recording, setRecording] = React.useState<boolean>(false); // record all GPS data in one session
  const [location, setLocation] = React.useState<GeoPosition | null>(null); // record current GPS data
  const [region, setRegion] = React.useState<Region | null>(null); // record current map view region
  const [nonSlideOpen, setNonSlideOpen] = React.useState<boolean>(false);
  const [selectEmitterModalVisible, setSelectEmitterModalVisible] =
    React.useState<boolean>(false);
  const [commandResp, setCommandResp] = React.useState<{
    macPrefix: string;
    probeRequestRecorded: {[sensorId: string]: number};
  }>({
    macPrefix: '',
    probeRequestRecorded: {unknown1: 0, unknown2: 0, unknown3: 0, unknown4: 0},
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    highAccuracy,
    forceLocation,
    locationDialog,
    gpsInterval,
    mapType,
    hasInternet,
    selectedEmitter,
    emitters,
    setError,
  } = React.useContext(AppContext);

  const watchId = React.useRef(null);
  const records = React.useRef<Array<GeoPosition>>([]);
  const mapRef = React.useRef<MapView>(null);

  // The actions to perform when recording ends.
  const stopRecording = React.useCallback(() => {
    setRecording(false);
    if (records.current && records.current.length) {
      uploadGPS(records.current)
        .then(() => Toast.show('GPS recordings SAVED!'))
        .catch(err => {
          console.log(err);
          setError('Save GPS recordings FAILED. Cannot upload data!');
        });
    }
    records.current = [];
  }, [setError]);

  // Check whether the current GPS location is within the boundary of the
  // screen. This makes use of the latitudeDelta and longitudeDelta. For a
  // detailed explanation of this delta concept, refer to this SO answer:
  // https://stackoverflow.com/a/36688156/9723036
  const locationInMapView = React.useCallback(() => {
    return (
      location &&
      region &&
      location.coords.latitude >= region.latitude - region.latitudeDelta / 2 &&
      location.coords.latitude <= region.latitude + region.latitudeDelta / 2 &&
      location.coords.longitude >=
        region.longitude - region.longitudeDelta / 2 &&
      location.coords.longitude <= region.longitude + region.longitudeDelta / 2
    );
  }, [region, location]);

  //////////////////////////////////////////////////////////////////////////
  // Functions to handle communication with the emitter                   //
  //////////////////////////////////////////////////////////////////////////
  // Send a command to an emitter to start emitting mock probe request.
  const emitStart = (thingName: string) => {
    functions()
      .httpsCallable('commandEmitterApp')({
        cmd: 'emit_start',
        thingName: thingName,
      })
      .then(resp => {
        setLoading(false);
        if (resp.data.status === 'success') {
          setCommandResp({...commandResp, macPrefix: resp.data.message});
        } else {
          // command failed
          records.current = [];
          setRecording(false);
          setError(`ERROR: ${resp.data.message}.\nRecord & emit terminated`);
        }
      })
      .catch(err => {
        setLoading(false);
        setRecording(false);
        records.current = [];
        setError(`ERROR: ${err}.\nRecord & emit terminated`);
      });
  };

  // Send a command to an emitter to terminate emitting mock probe request.
  const emitEnd = (thingName: string) => {
    functions()
      .httpsCallable('commandEmitterApp')({
        cmd: 'emit_end',
        thingName: thingName,
      })
      .then(resp => {
        setLoading(false);
        if (resp.data.status === 'success') {
          console.log(resp.data.message);
        } else {
          setError(`ERROR: ${resp.data.message}.`);
        }
      })
      .catch(err => {
        setLoading(false);
        setError(`ERROR: ${err}.`);
      });
  };

  // Callback function when the record & emit button is pressed
  const onRecordEmitButtonPress = () => {
    if (!observing) {
      setError('Must start GPS before recording');
    } else if (!selectedEmitter) {
      setError('Must select an emitter before emitting');
    } else {
      // only record if we are already observing GPS and an emitter has been
      // specified.
      if (recording) {
        stopRecording();
        setLoading(true);
        setCommandResp({
          ...commandResp,
          probeRequestRecorded: Object.fromEntries(
            Object.keys(commandResp.probeRequestRecorded).map(k => [k, 0]),
          ),
        });
        emitEnd(emitters[selectedEmitter].thingName);
      } else {
        setRecording(observing);
        setLoading(true);
        setCommandResp({...commandResp, macPrefix: ''});
        emitStart(emitters[selectedEmitter].thingName);
      }
    }
  };

  /////////////////
  // React Hooks //
  /////////////////
  // Use `useCallback` hook to ensure that `removeLocationUpdates` does not
  // change between re-rendering. This is good practice because
  // `removeLocationUpdates` is a deps for another `userEffect` hook.
  // For best practice in `userCallback`, see this article:
  // https://dmitripavlutin.com/dont-overuse-react-usecallback/
  const removeLocationUpdates = React.useCallback(() => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
      stopRecording();
    }
  }, [stopRecording]);

  // This is called when the home screen is unmounted. Since the app only has
  // one screen, it is the same as when the app is closed.
  React.useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  // When the record button is pressed, pushing the current location to the
  // records ref, which serves as temporary storage of all the GPS data in the
  // current recording session. This useEffect hook is triggered each time
  // location is updated.
  React.useEffect(() => {
    if (recording && location) {
      records.current.push(location);
    }
  }, [location, recording]);

  // Internet connection check. If internet is lost,
  // discard all recorded GPS data. This essentially forces a redo of the
  // previous data collection. Note that we use dummy values for all error-
  // related actions, because internet-loss error has already been handled
  // in App.tsx.
  React.useEffect(() => {
    const subscriber = networkStatusListener(
      () => {
        // placeholder, no op
      },
      () => {
        // placeholder, no op
      },
      '',
      () => {
        records.current = [];
      },
    );
    return subscriber;
  }, []);

  // Obtain initial geolocation for Google Maps, and do this only once.
  React.useEffect(() => {
    getLocation(
      loc => {
        if (loc) {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      },
      highAccuracy,
      forceLocation,
      locationDialog,
    );
  }, [highAccuracy, forceLocation, locationDialog]);

  // Automatically switch map view if the current location is out of the bound
  // of the screen. NOTE: we are using mapRef.current.animateToRegion to
  // manually change region. This is a recommended behavior from this post:
  // https://github.com/react-native-maps/react-native-maps/issues/3639#issuecomment-737045732
  // Using the `region` prop within MapView and `onRegionChangeComplete` or
  // `onRegionChange` results in unwanted map moves that I cannot explain.
  React.useEffect(() => {
    if (location && region && !locationInMapView()) {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        });
      }
    }
  }, [location, region, mapRef, locationInMapView]);

  return (
    <View style={viewStyles.container}>
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={viewStyles.map}
          mapType={mapType}
          initialRegion={region}
          moveOnMarkerPress={false}
          onRegionChangeComplete={region_ => setRegion(region_)}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              tracksViewChanges={false}>
              <View style={viewStyles.circle} />
            </Marker>
          )}
        </MapView>
      )}
      <TouchableOpacity
        style={viewStyles.userLogoButton}
        onPress={() => setNonSlideOpen(true)}>
        <UserLogo width={30} height={30} />
      </TouchableOpacity>
      <HideInteraction onPress={() => setNonSlideOpen(false)}>
        <View style={viewStyles.contentContainer}>
          <View style={viewStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setSelectEmitterModalVisible(true)}
              style={[
                viewStyles.button,
                {
                  borderWidth: 2,
                  borderColor: 'black',
                  width: 100,
                },
              ]}>
              <Text style={[textStyles.buttonText, {color: 'black'}]}>
                {selectedEmitter
                  ? `Emitter-${selectedEmitter}`
                  : 'Select Emitter'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                observing
                  ? removeLocationUpdates()
                  : getLocationUpdates(
                      setObserving,
                      setLocation,
                      watchId,
                      gpsInterval,
                      highAccuracy,
                      forceLocation,
                      locationDialog,
                    );
              }}
              style={[
                viewStyles.button,
                {backgroundColor: observing ? 'red' : '#2196F3'},
              ]}>
              <Text style={textStyles.buttonText}>
                {observing ? 'Stop GPS' : 'Start GPS'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onRecordEmitButtonPress}
              style={[
                viewStyles.button,
                {
                  width: 130,
                  backgroundColor: hasInternet
                    ? recording
                      ? 'red'
                      : '#40ff00'
                    : 'grey',
                },
              ]}
              disabled={!hasInternet}>
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text style={textStyles.buttonText}>
                  {recording ? 'Stop Record & Emit' : 'Start Record & Emit'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={viewStyles.resultContainer}>
            <View style={viewStyles.leftResultContainer}>
              <Text>Latitude: {location?.coords?.latitude || ''}</Text>
              <Text>Longitude: {location?.coords?.longitude || ''}</Text>
              <Text>Accuracy: {location?.coords?.accuracy}</Text>
              <Text>
                Timestamp:{' '}
                {location?.timestamp
                  ? new Date(location.timestamp).toLocaleString()
                  : ''}
              </Text>
            </View>
            <View style={viewStyles.rightResultContainer}>
              <Text>{`MAC Prefix: ${commandResp.macPrefix}`}</Text>
              <Text>Probe Request Recorded:</Text>
              <View style={viewStyles.probeRequestCountContainer}>
                {Object.keys(commandResp.probeRequestRecorded).map(k => (
                  <Text
                    key={
                      k
                    }>{`${k}: ${commandResp.probeRequestRecorded[k]}`}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </HideInteraction>
      <SideDrawer
        openWidthPct={0.7}
        peekWidthPct={0}
        maxWidthPct={0.8}
        nonSlideOpen={nonSlideOpen}
        onDrawerOpen={() => setNonSlideOpen(true)}
        onDrawerPeek={() => setNonSlideOpen(false)}>
        <Profile widthPct={0.7} />
      </SideDrawer>
      <SelectEmitterModal
        visible={selectEmitterModalVisible}
        onCancelPress={() => setSelectEmitterModalVisible(false)}
      />
    </View>
  );
};
