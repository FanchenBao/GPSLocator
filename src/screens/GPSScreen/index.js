/* eslint-disable react-native/no-inline-styles */
/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Alert, Text, View, TouchableOpacity} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import {format} from 'date-fns';
import Toast from 'react-native-simple-toast';
import {getLocationUpdates} from '../../functions/location';
import {networkStatusListener} from '../../functions/network.js';
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
  const [error, setError] = React.useState('');
  const [hasInternet, setHasInternet] = React.useState(true);

  const watchId = React.useRef(null);
  const records = React.useRef([]);

  // The actions to perform when recording ends.
  const stopRecording = React.useCallback(() => {
    setRecording(false);
    if (records.current && records.current.length) {
      firestore()
        .collection('data')
        .doc(format(new Date(), 'MM-dd-yyyy_HH-mm-ss'))
        .set({gps: records.current})
        .then(() => Toast.show('GPS recordings SAVED!'))
        .catch(err => {
          console.log(err);
          setError('Save GPS recordings FAILED. Cannot upload data!');
        });
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
      {/* <MapView coords={location?.coords || null} /> */}
      <View style={viewStyles.dummyContentContainer} />
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.msgContainer}>
          {error !== '' ? <ErrorMsg msg={error} /> : null}
        </View>
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
