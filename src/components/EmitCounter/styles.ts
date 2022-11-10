/**
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  emitCounter: {
    position: 'absolute',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    bottom: 0.4 * height,
  },
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  emitCounter: {
    fontSize: 25,
  },
});
