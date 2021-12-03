/**
 *
 * @format
 */

import * as React from 'react';
import {reducer} from './reducer';
import {actions} from './actions';
import {MapTypes} from 'react-native-maps';

const initialState: ContextT.StateT = {
  highAccuracy: true,
  forceLocation: true,
  locationDialog: true,
  gpsInterval: 100, // millisecond unit. 1000 millisecond = 1 second
  mapType: 'satellite',
  emitters: {},
  error: '',
  hasInternet: true,
  selectedEmitter: '',
  setHighAccuracy: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setForceLocation: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setLocationDialog: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setGPSInterval: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setMapType: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setEmitters: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setError: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setHasInternet: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
  setSelectedEmitter: () => {
    // Placeholder for the set function, which will be defined in Provider
  },
};

export const AppContext = React.createContext<ContextT.StateT>(initialState);

export const Provider: React.FC = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = {
    ...state,
    setHighAccuracy: React.useCallback((val: boolean) => {
      dispatch({type: actions.SET_HIGH_ACCURACY, highAccuracy: val});
    }, []),
    setForceLocation: React.useCallback((val: boolean) => {
      dispatch({type: actions.SET_FORCE_LOCATION, forceLocation: val});
    }, []),
    setLocationDialog: React.useCallback((val: boolean) => {
      dispatch({type: actions.SET_LOCATION_DIALOG, locationDialog: val});
    }, []),
    setGPSInterval: React.useCallback((val: number) => {
      dispatch({type: actions.SET_GPS_INTERVAL, gpsInterval: val});
    }, []),
    setMapType: React.useCallback((val: MapTypes) => {
      dispatch({type: actions.SET_MAP_TYPE, mapType: val});
    }, []),
    setEmitters: React.useCallback(
      (val: {[emitterId: string]: FirestoreT.EmitterT}) => {
        dispatch({type: actions.SET_EMITTERS, emitters: val});
      },
      [],
    ),
    setError: React.useCallback((val: string) => {
      dispatch({type: actions.SET_ERROR, error: val});
    }, []),
    setHasInternet: React.useCallback((val: boolean) => {
      dispatch({type: actions.SET_HAS_INTERNET, hasInternet: val});
    }, []),
    setSelectedEmitter: React.useCallback((val: string) => {
      dispatch({type: actions.SET_SELECTED_EMITTER, selectedEmitter: val});
    }, []),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
