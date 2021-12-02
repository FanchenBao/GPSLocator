/**
 * @format
 */

declare namespace ContextT {
  interface StateT {
    highAccuracy: boolean;
    forceLocation: boolean;
    locationDialog: boolean;
    gpsInterval: number;
    mapType: import('react-native-maps').MapTypes;
    setHighAccuracy: (val: boolean) => void;
    setForceLocation: (val: boolean) => void;
    setLocationDialog: (val: boolean) => void;
    setGPSInterval: (val: number) => void;
    setMapType: (val: import('react-native-maps').MapTypes) => void;
  }

  interface SetHighAccuracyActionT {
    type: string;
    highAccuracy: boolean;
  }
  interface SetForceLocationActionT {
    type: string;
    forceLocation: boolean;
  }
  interface SetLocationDialogActionT {
    type: string;
    locationDialog: boolean;
  }
  interface SetGPSIntervalActionT {
    type: string;
    gpsInterval: number;
  }
  interface SetMapTypeActionT {
    type: string;
    mapType: import('react-native-maps').MapTypes;
  }

  type ActionT =
    | SetHighAccuracyActionT
    | SetForceLocationActionT
    | SetLocationDialogActionT
    | SetGPSIntervalActionT
    | SetMapTypeActionT;
}
