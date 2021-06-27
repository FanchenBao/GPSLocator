/* eslint-disable react-native/no-inline-styles */
/**
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {Alert, Text, View, TouchableOpacity} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {format} from 'date-fns';
import Toast from 'react-native-simple-toast';
import {getLocationUpdates} from '../../functions/location';
import {viewStyles, textStyles} from './styles.js';

// Import types
import type {Node} from 'react';

export const HomeScreen = (): Node => {
  const [observing, setObserving] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  const watchId = React.useRef(null);
  const records = React.useRef([]);

  // The actions to perform when recording ends.
  const stopRecording = React.useCallback(() => {
    setRecording(false);
    if (records.current && records.current.length) {
      // RNFS.writeFile(
      //   // Use timestamp as file name. To locate the saved file, print out
      //   // RNFS.DocumentDirectoryPath to see the absolute path of the folder,
      //   // and then follow the instruction:
      //   // https://stackoverflow.com/a/54840183/9723036
      //   RNFS.DocumentDirectoryPath +
      //     '/' +
      //     format(new Date(), 'MM-dd-yyyy_HH-mm-ss') +
      //     '.json',
      //   JSON.stringify(records.current),
      //   'utf8',
      // )
      //   .then(success => Toast.show('GPS recordings SAVED!'))
      //   .catch(err => Alert.alert(err.code, err.message));
      console.log(records.current);
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

  return (
    <View style={viewStyles.container}>
      {/* <MapView coords={location?.coords || null} /> */}
      <View style={viewStyles.dummyContentContainer} />
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
              {backgroundColor: recording ? 'red' : '#40ff00'},
            ]}>
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
