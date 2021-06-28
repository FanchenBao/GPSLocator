/**
 *
 * @format
 * @flow
 */
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import appConfig from '../../app.json';

/**
Obtain permission to use GPS data on iOS.

Note that if GPS is currently disabled, the user is guided to the settings to
enable it, if desired.

@return True if user has granted the permission, otherwise false.
 */
const hasPermissionIOS = async (): Promise<boolean> => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      'Location Services Permission',
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      [
        {
          text: 'Go to Settings',
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert('Unable to open settings');
            });
          },
        },
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

/**
Obtain permission to use GPS data on Android.

Permission request will bring up a custom pop up to explain why the permission
is needed. If granted, future requests always return "granted" and not bother
a user with the pop up. The same happens if the request result is "never_ask_again",
where further requsts do not bring out the pop up.

If "denied" is used, then each time hasPermissionAndroid is called, the custom
will pop up.

@return True if user has granted the permission, otherwise false.
 */
const hasPermissionAndroid = async (): Promise<boolean> => {
  if (Platform.Version < 23) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Services Permission',
      message: `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      buttonPositive: 'OK',
    },
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

/**
Obtain permission to use location services. If not enabled, ask user for
permission. If user has denied or disabled it entirely, return False. If user
grants it, return True.
 */
export const hasLocationPermission = async (): Promise<boolean> => {
  return Platform.OS === 'ios'
    ? await hasPermissionIOS()
    : await hasPermissionAndroid();
};
