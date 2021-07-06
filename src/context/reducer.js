/**
 *
 * @format
 * @flow
 */
import {actions} from './actions.js';

// Import types
import type {StateT} from './store.js';
import type {ActionT} from './actions.js';

export const reducer = (state: StateT, action: ActionT): StateT => {
  switch (action.type) {
    case actions.SET_OPEN_PROFILE:
      return {...state, openProfile: action.openProfile};
    case actions.SET_CLOSE_PROFILE:
      return {...state, closeProfile: action.closeProfile};
    case actions.SET_HIGH_ACCURACY:
      return {...state, highAccuracy: action.highAccuracy};
    case actions.SET_FORCE_LOCATION:
      return {...state, forceLocation: action.forceLocation};
    case actions.SET_LOCATION_DIALOG:
      return {...state, locationDialog: action.locationDialog};
    case actions.SET_GPS_INTERVAL:
      return {...state, gpsInterval: action.gpsInterval};
    case actions.SET_MAP_TYPE:
      return {...state, mapType: action.mapType};
    default:
      return state;
  }
};
