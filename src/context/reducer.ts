/**
 *
 * @format
 */
import {actions} from './actions';

export const reducer = (
  state: ContextT.StateT,
  action: ContextT.ActionT,
): ContextT.StateT => {
  switch (action.type) {
    case actions.SET_HIGH_ACCURACY:
      return {
        ...state,
        highAccuracy: (action as ContextT.SetHighAccuracyActionT).highAccuracy,
      };
    case actions.SET_FORCE_LOCATION:
      return {
        ...state,
        forceLocation: (action as ContextT.SetForceLocationActionT)
          .forceLocation,
      };
    case actions.SET_LOCATION_DIALOG:
      return {
        ...state,
        locationDialog: (action as ContextT.SetLocationDialogActionT)
          .locationDialog,
      };
    case actions.SET_GPS_INTERVAL:
      return {
        ...state,
        gpsInterval: (action as ContextT.SetGPSIntervalActionT).gpsInterval,
      };
    case actions.SET_MAP_TYPE:
      return {
        ...state,
        mapType: (action as ContextT.SetMapTypeActionT).mapType,
      };
    default:
      return state;
  }
};
