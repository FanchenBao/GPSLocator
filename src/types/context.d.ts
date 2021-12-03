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
    emitters: {[emitterId: string]: FirestoreT.EmitterT};
    error: string;
    hasInternet: boolean;
    setHighAccuracy: (val: boolean) => void;
    setForceLocation: (val: boolean) => void;
    setLocationDialog: (val: boolean) => void;
    setGPSInterval: (val: number) => void;
    setMapType: (val: import('react-native-maps').MapTypes) => void;
    setEmitters: (val: {[emitterId: string]: FirestoreT.EmitterT}) => void;
    setError: (val: string) => void;
    setHasInternet: (val: boolean) => void;
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
  interface SetEmittersActionT {
    type: string;
    emitters: {[emitterId: string]: FirestoreT.EmitterT};
  }
  interface SetErrorActionT {
    type: string;
    error: string;
  }
  interface SetHasInternetActionT {
    type: string;
    hasInternet: boolean;
  }
  type ActionT =
    | SetHighAccuracyActionT
    | SetForceLocationActionT
    | SetLocationDialogActionT
    | SetGPSIntervalActionT
    | SetMapTypeActionT
    | SetEmittersActionT
    | SetErrorActionT
    | SetHasInternetActionT;
}
