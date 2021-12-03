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
    flexDirection: 'row',
    paddingBottom: 5,
  },
  errorTextContainer: {
    marginLeft: 5,
  },
  okContainer: {
    alignItems: 'flex-end',
  },
});

export const textStyles = StyleSheet.create<{[name: string]: TextStyle}>({
  errorText: {
    fontSize: 14,
    color: '#FF4D94',
  },
  retryText: {
    fontSize: 14,
    color: '#2196F3',
  },
});
