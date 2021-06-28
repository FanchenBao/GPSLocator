/* eslint-disable react-native/no-inline-styles */
/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {getLocationUpdates, getLocation} from '../../functions/location';
import {networkStatusListener} from '../../functions/network.js';
import {uploadGPS} from '../../functions/database.js';
import {viewStyles, textStyles} from './styles.js';
import {ErrorMsg} from '../../components/ErrorMsg/index.js';

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

export const GPSScreen = (props: PropsT): Node => {
  const {navigation} = props;
  const [observing, setObserving] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  const [initLocation, setInitLocation] = React.useState(null);
  const [error, setError] = React.useState('');
  const [hasInternet, setHasInternet] = React.useState(true);

  const watchId = React.useRef(null);
  const records = React.useRef([]);

  // The actions to perform when recording ends.
  const stopRecording = React.useCallback(() => {
    setRecording(false);
    if (records.current && records.current.length) {
      uploadGPS(
        records.current,
        () => Toast.show('GPS recordings SAVED!'),
        err => {
          console.log(err);
          setError('Save GPS recordings FAILED. Cannot upload data!');
        },
      );
    }
    records.current = [];
  }, []);

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
    getLocation(setInitLocation, true, true, true);
  }, []);

  // Add log out button on the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            auth()
              .signOut()
              .catch(err => console.log(err))
          }
          style={viewStyles.logoutButton}>
          <Text style={textStyles.link}>Log Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={viewStyles.container}>
      {initLocation && (
        <MapView
          // We do not specify provider because for iOS, we cannot use Google
          // maps due to us having a swift file in the iOS project. Recall that
          // the swift file is added for react-native-geolocation-service. It
          // has been documented that when the iOS project is a mixture of
          // objective C and swift, we cannot use Google-Maps-iOS-Utils directly
          // see: https://github.com/googlemaps/google-maps-ios-utils/blob/b721e95a500d0c9a4fd93738e83fc86c2a57ac89/Swift.md
          // Given that we do not need extensive features in maps, we can live
          // with using Apple maps.
          provider={PROVIDER_GOOGLE}
          style={viewStyles.map}
          initialRegion={{
            latitude: initLocation.coords.latitude,
            longitude: initLocation.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
          moveOnMarkerPress={false}>
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
      {/* <View style={viewStyles.dummyContentContainer} /> */}
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
    </View>
  );
};
