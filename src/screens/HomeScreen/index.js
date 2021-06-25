/**
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Switch,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import appConfig from '../../../app.json';
import {getLocation, getLocationUpdates} from '../../functions/location';
import {styles} from './styles.js';

// Import types
import type {Node} from 'react';

export const HomeScreen = (): Node => {
  const [forceLocation, setForceLocation] = React.useState(true);
  const [highAccuracy, setHighAccuracy] = React.useState(true);
  const [locationDialog, setLocationDialog] = React.useState(true);
  const [observing, setObserving] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  const watchId = React.useRef(null);

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
    }
  }, []);

  // This is called when the home screen is unmounted. Since the app only has
  // one screen, it is the same as when the app is closed.
  React.useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  return (
    <View style={styles.mainContainer}>
      {/* <MapView coords={location?.coords || null} /> */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <View style={styles.buttons}>
            <Button
              title={observing ? 'Stop Observing' : 'Start Observing'}
              onPress={() => {
                observing
                  ? removeLocationUpdates()
                  : getLocationUpdates(
                      setObserving,
                      setLocation,
                      watchId,
                      highAccuracy,
                      forceLocation,
                      locationDialog,
                    );
              }}
              color={observing ? 'red' : '#2196F3'}
            />
          </View>
        </View>
        <View style={styles.result}>
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
      </ScrollView>
    </View>
  );
};
