/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[name: string]: ViewStyle}>({
  contentContainer: {
    backgroundColor: '#FFE6F0',
    borderRadius: 10,
    padding: 15,
  },
  errorContainer: {
    paddingBottom: 5,
  },
  errorTextContainer: {
    marginLeft: 5,
  },
  okContainer: {
    alignItems: 'center',
    width: 40,
    alignSelf: 'flex-end',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
});

export const textStyles = StyleSheet.create<{[name: string]: TextStyle}>({
  errorText: {
    fontSize: 14,
    color: '#FF4D94',
  },
  okText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
