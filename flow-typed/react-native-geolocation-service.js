/**
 *
 * @format
 * @flow strict-local
 *
 * This is a custom-modified flow type stub, obtained from here:
 * https://github.com/Agontuk/react-native-geolocation-service/blob/master/index.d.ts
 */

const POSITION_ERROR = Object.freeze({
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
  PLAY_SERVICE_NOT_AVAILABLE: 4,
  SETTINGS_NOT_SATISFIED: 5,
  INTERNAL_ERROR: -1,
});

declare module 'react-native-geolocation-service' {
  declare type AuthorizationLevel = 'always' | 'whenInUse';

  declare type AuthorizationResult =
    | 'disabled'
    | 'granted'
    | 'denied'
    | 'restricted';

  declare type AccuracyIOS =
    | 'bestForNavigation'
    | 'best'
    | 'nearestTenMeters'
    | 'hundredMeters'
    | 'kilometer'
    | 'threeKilometers'
    | 'reduced';

  declare type AccuracyAndroid = 'high' | 'balanced' | 'low' | 'passive';

  declare interface BaseOptions {
    accuracy?: {
      android?: AccuracyAndroid,
      ios?: AccuracyIOS,
    };
    enableHighAccuracy?: boolean;
    distanceFilter?: number;
    showLocationDialog?: boolean;
    forceRequestLocation?: boolean;
  }

  declare interface GeoOptions extends BaseOptions {
    timeout?: number;
    maximumAge?: number;
  }

  declare interface GeoWatchOptions extends BaseOptions {
    interval?: number;
    fastestInterval?: number;
    useSignificantChanges?: boolean;
    showsBackgroundLocationIndicator?: boolean;
  }

  // PositionError is a enum. To convert the original enum to somthing flow
  // lokes, we use the method described here:
  // https://stackoverflow.com/a/49105296/9723036
  declare type PositionError = $Values<typeof POSITION_ERROR>;

  declare interface GeoError {
    code: PositionError;
    message: string;
  }

  declare interface GeoCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
    altitudeAccuracy?: number | null;
  }

  declare interface GeoPosition {
    coords: GeoCoordinates;
    timestamp: number;
    mocked?: boolean;
    provider?: 'fused' | 'gps' | 'network' | 'passive';
  }

  declare type SuccessCallback = (position: GeoPosition) => void;

  declare type ErrorCallback = (error: GeoError) => void;

  declare function requestAuthorization(
    authorizationLevel: AuthorizationLevel,
  ): Promise<AuthorizationResult>;

  declare function getCurrentPosition(
    successCallback: SuccessCallback,
    errorCallback?: ErrorCallback,
    options?: GeoOptions,
  ): void;

  declare function watchPosition(
    successCallback: SuccessCallback,
    errorCallback?: ErrorCallback,
    options?: GeoWatchOptions,
  ): number;

  declare function clearWatch(watchID: number): void;

  declare function stopObserving(): void;
}
