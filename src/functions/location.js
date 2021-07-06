/**
 *
 * @format
 * @flow
 */

import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {hasLocationPermission} from './permission.js';
import appConfig from '../../app.json';

// Import Types
import type {GeoPosition} from 'react-native-geolocation-service';

/**
Get the current GPS location. If error, show the error message as an alert.
@param onLocationObtained A callback function to handle the location obtained.
@param highAccuracy A flag to indicate whether we want high accuracy in GPS.
@param forceLocation A flag to indicate whether to force request high accurate
  GPS.
@param locationDialog A flag to indicate whether to enable a dialog (Android
  only) when location service is to be requested.
@return None.
 */
export const getLocation = async (
  onLocationObtained: (?GeoPosition) => void,
  highAccuracy: boolean,
  forceLocation: boolean,
  locationDialog: boolean,
): Promise<void> => {
  const hasPermission = await hasLocationPermission();
  if (!hasPermission) {
    return;
  }

  Geolocation.getCurrentPosition(
    position => onLocationObtained(position),
    error => {
      Alert.alert(`Code ${error.code}`, error.message);
      onLocationObtained(null);
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: highAccuracy,
      timeout: appConfig.timeout,
      maximumAge: appConfig.maxGPSAge,
      distanceFilter: 0,
      forceRequestLocation: forceLocation,
      showLocationDialog: locationDialog,
    },
  );
};

/**
Get the current GPS location constantly at a predefined interval. Think of this
as a GPS location service that constantly upates the GPS data.
@param onLocationUpdatesEnabled A callback function to handle the start of the
  location update service. For instance, this function can be used to set a
  flag indicating the service has been turned on.
@param onLocationObtained A callback function to handle the location obtained.
@param watchId A useRef object that stores the ID number of the watchPosition
  function. This will be used to terminate the watchPosition function.
@param highAccuracy A flag to indicate whether we want high accuracy in GPS.
@param forceLocation A flag to indicate whether to force request high accurate
  GPS.
@param locationDialog A flag to indicate whether to enable a dialog (Android
  only) when location service is to be requested.
@return None.
 */
export const getLocationUpdates = async (
  onLocationUpdatesEnabled: boolean => void,
  onLocationObtained: (?GeoPosition) => void,
  watchId: {current: null | number},
  gpsInterval: number,
  highAccuracy: boolean,
  forceLocation: boolean,
  locationDialog: boolean,
): Promise<void> => {
  const hasPermission = await hasLocationPermission();
  if (!hasPermission) {
    return;
  }

  onLocationUpdatesEnabled(true);

  watchId.current = Geolocation.watchPosition(
    position => onLocationObtained(position),
    error => {
      Alert.alert(`Code ${error.code}`, error.message);
      onLocationObtained(null);
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: highAccuracy,
      distanceFilter: 0,
      interval: gpsInterval,
      fastestInterval: gpsInterval,
      forceRequestLocation: forceLocation,
      showLocationDialog: locationDialog,
    },
  );
};
