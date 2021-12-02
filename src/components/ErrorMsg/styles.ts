/**
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFE6F0',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  successContainer: {
    backgroundColor: '#ccffcc',
  },
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  text: {
    fontSize: 14,
    color: '#FF4D94',
  },
  successText: {
    color: '#ccffcc',
  },
});
