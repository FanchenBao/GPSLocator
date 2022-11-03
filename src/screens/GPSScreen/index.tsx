/**
 *
 * @format
 */

import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-simple-toast';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import functions from '@react-native-firebase/functions';
import {format, utcToZonedTime} from 'date-fns-tz';
import {getLocationUpdates, getLocation} from '../../functions/location';
import {networkStatusListener} from '../../functions/network';
import {uploadGPS} from '../../functions/database';
import {viewStyles, textStyles} from './styles';
import {SideDrawer} from '../../components/SideDrawer/index';
import {Profile} from '../../components/Profile/index';
import {HideInteraction} from '../../components/hideInteraction';
import UserLogo from '../../assets/user.svg';
import {AppContext} from '../../context/store';
import {SelectStringItemModal} from '../../components/SelectStringItemModal';
import {DeleteEmissionModal} from '../../components/DeleteEmissionModal';

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
  const [deleteEmissionModalVisible, setDeleteEmissionModalVisible] =
    React.useState<boolean>(false);
  const [selectSensorTypeModalVisible, setSelectSensorTypeModalVisible] =
    React.useState<boolean>(false);
  const [macPrefix, setMacPrefix] = React.useState<string>('');
  const [numOfProbeRequest, setNumOfProbeRequest] = React.useState<{
    [sensorId: string]: number;
  }>({'??': 0});
  const [recordEmitLoading, setRecordEmitLoading] =
    React.useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = React.useState<boolean>(false);
  // Context
  const {
    highAccuracy,
    forceLocation,
    locationDialog,
    gpsInterval,
    mapType,
    hasInternet,
    setSelectedEmitter,
    selectedEmitter,
    setSelectedSensorType,
    selectedSensorType,
    emitters,
    setError,
  } = React.useContext(AppContext);

  const watchId = React.useRef(null);
  const records = React.useRef<Array<FirestoreT.RecordT>>([]);
  const mapRef = React.useRef<MapView>(null);

  // The actions to perform when recording ends.
  const stopRecording = () => {
    setRecording(false);
    if (records.current && records.current.length) {
      uploadGPS(macPrefix, records.current)
        .then(() => Toast.show('GPS recordings SAVED!'))
        .catch(err => {
          console.log(err);
          setError(`Save GPS recordings FAILED. \n${err}`);
        });
    }
  };

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

  // Function that queries the number of probe request recorded on the
  // localization database.
  const queryProbeRequestCount = async () => {
    if (records.current.length === 0) {
      throw new Error('Probe request records is empty');
    }
    const resp = await functions().httpsCallable('probeRequestCountApp')({
      timeStart: format(
        utcToZonedTime(
          new Date(records.current[0].timestamp - 1000 * 60),
          'UTC',
        ),
        'yyyy-MM-dd HH:mm:ss',
        {timeZone: 'UTC'},
      ),
      timeEnd: format(
        utcToZonedTime(
          new Date(
            records.current[records.current.length - 1].timestamp + 1000 * 60,
          ),
          'UTC',
        ),
        'yyyy-MM-dd HH:mm:ss',
        {timeZone: 'UTC'},
      ),
      macPrefix: macPrefix,
    });
    if (resp.data.status === 'success') {
      setNumOfProbeRequest(JSON.parse(resp.data.message));
    } else {
      setError(
        `ERROR: Failed to query probe request count. ${resp.data.message}`,
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////
  // Functions to handle communication with the emitter                   //
  //////////////////////////////////////////////////////////////////////////
  // Send a command to an emitter to start emitting mock probe request.
  const emitStart = (thingName: string, type: 'dev' | 'prod') => {
    functions()
      .httpsCallable('commandEmitterApp')({
        cmd: 'emit_start',
        thingName: thingName,
        type: type,
      })
      .then(resp => {
        setRecordEmitLoading(false);
        if (resp.data.status === 'success') {
          setMacPrefix(resp.data.message);
        } else {
          // command failed
          records.current = [];
          setRecording(false);
          setError(`ERROR: ${resp.data.message}.\nRecord & emit terminated`);
        }
      })
      .catch(err => {
        setRecordEmitLoading(false);
        setRecording(false);
        records.current = [];
        setError(`ERROR: ${err}.\nRecord & emit terminated`);
      });
  };

  // Send a command to an emitter to terminate emitting mock probe request.
  const emitEnd = (thingName: string, type: 'dev' | 'prod') => {
    functions()
      .httpsCallable('commandEmitterApp')({
        cmd: 'emit_end',
        thingName: thingName,
        type: type,
      })
      .then(resp => {
        if (resp.data.status === 'success') {
          Toast.show(resp.data.message);
          // Check the probe request count for emission just completed
          queryProbeRequestCount()
            .then(() => setRecordEmitLoading(false))
            .catch(err => {
              setError(`ERROR: Failed to query probe request count. ${err}`);
              setRecordEmitLoading(false);
            });
        } else {
          setError(`ERROR: Terminating emitter failed. ${resp.data.message}.`);
          setRecordEmitLoading(false);
        }
      })
      .catch(err => {
        setError(`ERROR: Terminating emitter failed. ${err}.`);
        setRecordEmitLoading(false);
      });
  };

  // Callback function when the record & emit button is pressed
  const onRecordEmitButtonPress = () => {
    if (!observing) {
      setError('Must start GPS before recording');
    } else if (!selectedEmitter) {
      setError('Must select an emitter before emitting');
    } else if (!selectedSensorType) {
      setError('Must select a sensor type before emitting');
    } else {
      // only record if we are already observing GPS and an emitter has been
      // specified.
      if (recording) {
        stopRecording();
        setRecordEmitLoading(true);
        emitEnd(
          emitters[selectedEmitter].thingName,
          emitters[selectedEmitter].type,
        );
      } else {
        records.current = [];
        setRecording(observing);
        setRecordEmitLoading(true);
        setMacPrefix('');
        setNumOfProbeRequest(
          Object.fromEntries(Object.keys(numOfProbeRequest).map(k => [k, 0])),
        );
        emitStart(
          emitters[selectedEmitter].thingName,
          emitters[selectedEmitter].type,
        );
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
      setRecording(false);
    }
  }, []);

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
  // NOTE: 2021-12-04. We do not push the full content of location anymore,
  // because it is not necessary. We will not use the GPS data for serious
  // data analysis. Instead, we add a new field to record macPrefix. It is
  // easier to include macPrefix at this stage than later during the data
  // uploading stage.
  React.useEffect(() => {
    if (recording && location) {
      records.current.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      });
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
            <View style={viewStyles.leftButtonContainer}>
              <TouchableOpacity
                onPress={() => setSelectEmitterModalVisible(true)}
                style={[
                  viewStyles.button,
                  {
                    borderWidth: 1,
                    borderColor: 'black',
                  },
                ]}>
                <Text style={[textStyles.buttonText, {color: 'black'}]}>
                  {selectedEmitter
                    ? `Emitter-${selectedEmitter}`
                    : 'Select Emitter'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectSensorTypeModalVisible(true)}
                style={[
                  viewStyles.button,
                  {
                    borderWidth: 1,
                    borderColor: 'black',
                  },
                ]}>
                <Text style={[textStyles.buttonText, {color: 'black'}]}>
                  {selectedSensorType
                    ? `Sensor-${selectedSensorType}`
                    : 'Select Sensor Type'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVerifyLoading(true);
                  queryProbeRequestCount()
                    .then(() => setVerifyLoading(false))
                    .catch(err => {
                      setError(
                        `ERROR: Failed to query probe request count. ${err}`,
                      );
                      setVerifyLoading(false);
                    });
                }}
                style={[
                  viewStyles.button,
                  {
                    borderWidth: 1,
                    borderColor: 'black',
                    width: 150,
                  },
                ]}>
                {verifyLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text style={[textStyles.buttonText, {color: 'black'}]}>
                    Verify Last Emission
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteEmissionModalVisible(true)}
                style={[
                  viewStyles.button,
                  {
                    borderWidth: 1,
                    borderColor:
                      macPrefix === '' || recording ? 'lightgrey' : 'red',
                    width: 150,
                  },
                ]}
                disabled={macPrefix === '' || recording}>
                <Text
                  style={[
                    textStyles.buttonText,
                    {
                      color:
                        macPrefix === '' || recording ? 'lightgrey' : 'red',
                    },
                  ]}>
                  Del Last Emission
                </Text>
              </TouchableOpacity>
            </View>
            <View style={viewStyles.rightButtonContainer}>
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
                  {backgroundColor: observing ? 'red' : '#2196F3', height: 40},
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
                    width: 150,
                    height: 40,
                    backgroundColor: hasInternet
                      ? recording
                        ? 'red'
                        : '#40ff00'
                      : 'grey',
                  },
                ]}
                disabled={!hasInternet}>
                {recordEmitLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={textStyles.buttonText}>
                    {recording ? 'Stop Record & Emit' : 'Start Record & Emit'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={viewStyles.resultContainer}>
            <View style={viewStyles.leftResultContainer}>
              <Text>Lat: {location?.coords?.latitude || ''}</Text>
              <Text>Lng: {location?.coords?.longitude || ''}</Text>
              <Text>Accuracy: {location?.coords?.accuracy}</Text>
              <Text>
                {'\n'}
                {location?.timestamp
                  ? new Date(location.timestamp).toLocaleString()
                  : ''}
              </Text>
            </View>
            <View style={viewStyles.rightResultContainer}>
              <Text>{`MAC Prefix: ${macPrefix}`}</Text>
              <Text>Probe Request Recorded:</Text>
              <View style={viewStyles.probeRequestCountContainer}>
                <FlatList
                  data={Object.keys(numOfProbeRequest)}
                  renderItem={({item}) => (
                    <TouchableOpacity>
                      <Text>{`sensor-${item}: ${numOfProbeRequest[item]}`}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item}
                />
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
      <SelectStringItemModal
        visible={selectEmitterModalVisible}
        onCancelPress={() => setSelectEmitterModalVisible(false)}
        selectedItem={selectedEmitter}
        setSelectedItem={setSelectedEmitter}
        data={Object.keys(emitters)}
        itemDisplayPrefix="Emitter"
        title="Select Emitter"
      />

      {/* This modal is used to select which type of sensor is going to
      capture the * mock probe request. When the test is run on campus, both the
      sensors and * the emitter are of dev type. However, when we move the test
      to WPB, the * emitters remain dev, yet the sensors are of prod type. This
      modal allows * the tester to choose which type of sensor is receiving the
      signal. This * choice will affect where probe request count is queried,
      i.e. either from * the dev or prod database. The choice of sensor type
      does not, however, have * any impact on where the mock probe requests
      land, because that is determined * by the sensors, which is out of the
      control of this app. */}
      <SelectStringItemModal
        visible={selectSensorTypeModalVisible}
        onCancelPress={() => setSelectSensorTypeModalVisible(false)}
        selectedItem={selectedSensorType}
        setSelectedItem={setSelectedSensorType}
        data={['dev', 'prod']}
        itemDisplayPrefix="Type"
        title="Select Sensor Type"
      />

      <DeleteEmissionModal
        visible={deleteEmissionModalVisible}
        onCancelPress={() => setDeleteEmissionModalVisible(false)}
        onDeleteSuccess={() => {
          setMacPrefix('');
          setNumOfProbeRequest(
            Object.fromEntries(Object.keys(numOfProbeRequest).map(k => [k, 0])),
          );
        }}
        macPrefix={macPrefix}
      />
    </View>
  );
};
