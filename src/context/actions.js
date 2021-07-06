/**
 *
 * @format
 * @flow
 */

export const actions = {
  SET_HIGH_ACCURACY: 'SET_HIGH_ACCURACY',
  SET_FORCE_LOCATION: 'SET_FORCE_LOCATION',
  SET_LOCATION_DIALOG: 'SET_LOCATION_DIALOG',
  SET_GPS_INTERVAL: 'SET_GPS_INTERVAL',
  SET_MAP_TYPE: 'SET_MAP_TYPE',
};

type SetHighAccuracyActionT = {
  type: typeof actions.SET_HIGH_ACCURACY,
  highAccuracy: boolean,
};
type SetForceLocationActionT = {
  type: typeof actions.SET_FORCE_LOCATION,
  forceLocation: boolean,
};
type SetLocationDialogActionT = {
  type: typeof actions.SET_LOCATION_DIALOG,
  locationDialog: boolean,
};
type SetGPSIntervalActionT = {
  type: typeof actions.SET_GPS_INTERVAL,
  gpsInterval: number,
};
type SetMapTypeActionT = {type: typeof actions.SET_MAP_TYPE, mapType: string};

export type ActionT =
  | SetHighAccuracyActionT
  | SetForceLocationActionT
  | SetLocationDialogActionT
  | SetGPSIntervalActionT
  | SetMapTypeActionT;
