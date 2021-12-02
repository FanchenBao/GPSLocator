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
};

export const AppContext = React.createContext<ContextT.StateT>(initialState);

export const Provider: React.FC = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = {
    highAccuracy: state.highAccuracy,
    forceLocation: state.forceLocation,
    locationDialog: state.locationDialog,
    gpsInterval: state.gpsInterval,
    mapType: state.mapType,
    setHighAccuracy: (val: boolean) => {
      dispatch({type: actions.SET_HIGH_ACCURACY, highAccuracy: val});
    },
    setForceLocation: (val: boolean) => {
      dispatch({type: actions.SET_FORCE_LOCATION, forceLocation: val});
    },
    setLocationDialog: (val: boolean) => {
      dispatch({type: actions.SET_LOCATION_DIALOG, locationDialog: val});
    },
    setGPSInterval: (val: number) => {
      dispatch({type: actions.SET_GPS_INTERVAL, gpsInterval: val});
    },
    setMapType: (val: MapTypes) => {
      dispatch({type: actions.SET_MAP_TYPE, mapType: val});
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
