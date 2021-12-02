/**
 * @format
 */

declare namespace FirebaseT {
  type UserT =
    | import('@react-native-firebase/auth').FirebaseAuthTypes.User
    | null;
  type NativeFirebaseErrorT =
    import('@react-native-firebase/app').ReactNativeFirebase.NativeFirebaseError;
}
