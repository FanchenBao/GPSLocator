/* eslint-disable react-native/no-inline-styles */
/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Text, View, TouchableOpacity, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-simple-toast';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {getLocationUpdates, getLocation} from '../../functions/location';
import {networkStatusListener} from '../../functions/network.js';
import {uploadGPS} from '../../functions/database.js';
import {viewStyles, textStyles} from './styles.js';
import {ErrorMsg} from '../../components/ErrorMsg/index.js';
import {SideDrawer} from '../../components/SideDrawer/index.js';
import {Profile} from '../../components/Profile/index.js';
import UserLogo from '../../assets/user.svg';

// Import types
import type {
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation-stack';
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed to UserSelectScreen from its parent, if applicable
type OwnPropsT = {|
  navigation: NavigationScreenProp<NavigationRoute>,
|};

// Type for the props mapped to dispatch
type DispatchToPropsT = {||};

// Type for ALL props
type PropsT = {|
  ...OwnPropsT,
  ...StatePropsT,
  ...DispatchToPropsT,
|};

/**
GPSScreen

This is the screen that shows the Google Map, allows user to capture and record
GPS, and offer a few configurations.
 */
export const GPSScreen = (props: PropsT): Node => {
  const [observing, setObserving] = React.useState(false);
  const [recording, setRecording] = React.useState(false); // record all GPS data in one session
  const [location, setLocation] = React.useState(null); // record current GPS data
  const [region, setRegion] = React.useState(null); // record current map view region
  const [error, setError] = React.useState('');
  const [hasInternet, setHasInternet] = React.useState(true);
  const [openProfile, setOpenProfile] = React.useState(false); // Flag to indicate the opening of user prefernce
  const [highAccuracy, setHighAccuracy] = React.useState(true);
  const [forceLocation, setForceLocation] = React.useState(true);
  const [locationDialog, setLocationDialog] = React.useState(true);
  const [mapType, setMapType] = React.useState('satellite');

  const watchId = React.useRef(null);
  const records = React.useRef([]);
  const mapRef = React.useRef(null);

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
  }, []);

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

  // Internet connection check. If internet is lost, display error message and
  // discard all recorded GPS data. This essentially forces a redo of the
  // previous data collection.
  React.useEffect(() => {
    const subscriber = networkStatusListener(
      setHasInternet,
      setError,
      error,
      () => {
        setRecording(false);
        records.current = [];
      },
    );
    return subscriber;
  }, [error]);

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
      true,
      true,
      true,
    );
  }, []);

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
        onPress={() => setOpenProfile(true)}>
        <UserLogo width={30} height={30} />
      </TouchableOpacity>
      <View style={viewStyles.msgContainer}>
        {error !== '' ? <ErrorMsg msg={error} /> : null}
      </View>
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              observing
                ? removeLocationUpdates()
                : getLocationUpdates(
                    setObserving,
                    setLocation,
                    watchId,
                    true,
                    true,
                    true,
                  );
            }}
            style={[
              viewStyles.gpsButton,
              {backgroundColor: observing ? 'red' : '#2196F3'},
            ]}>
            <Text style={textStyles.buttonText}>
              {observing ? 'Stop GPS' : 'Start GPS'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              // only record if we are already observing GPS
              () => (recording ? stopRecording() : setRecording(observing))
            }
            style={[
              viewStyles.recordButton,
              {
                backgroundColor: hasInternet
                  ? recording
                    ? 'red'
                    : '#40ff00'
                  : 'grey',
              },
            ]}
            disabled={!hasInternet}>
            <Text style={textStyles.buttonText}>
              {recording ? 'Stop Record' : 'Start Record'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={viewStyles.resultContainer}>
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
      </View>
      <SideDrawer
        openWidthPct={0.7}
        peekWidthPct={0}
        maxWidthPct={0.8}
        nonSlideOpen={openProfile}
        onDrawerOpen={() => setOpenProfile(false)}>
        <Profile
          widthPct={0.7}
          switches={[
            {
              value: highAccuracy,
              onValueChange: () => setHighAccuracy(preS => !preS),
              text: 'High Accuracy',
              enable: true,
            },
            {
              value: forceLocation,
              onValueChange: () => setForceLocation(preS => !preS),
              text: 'Force Location',
              enable: true,
            },
            {
              value: locationDialog,
              onValueChange: () => setLocationDialog(preS => !preS),
              text: 'Location Dialog',
              enable: Platform.OS === 'android',
            },
          ]}
          mapType={mapType}
          setMapType={setMapType}
        />
      </SideDrawer>
    </View>
  );
};
