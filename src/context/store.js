/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {reducer} from './reducer.js';
import {actions} from './actions.js';

// Import types
import type {Node} from 'react';
export type StateT = {
  highAccuracy: boolean,
  forceLocation: boolean,
  locationDialog: boolean,
  gpsInterval: number,
  mapType: string,
};

const initialState: StateT = {
  highAccuracy: true,
  forceLocation: true,
  locationDialog: true,
  gpsInterval: 100, // millisecond unit. 1000 millisecond = 1 second
  mapType: 'satellite',
};

type PropsT = {
  children?: Node,
};

export const AppContext: Object = React.createContext();

export const Provider = (props: PropsT): Node => {
  const {children} = props;
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
    setMapType: (val: string) => {
      dispatch({type: actions.SET_MAP_TYPE, mapType: val});
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
