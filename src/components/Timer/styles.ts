/**
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  timerContainer: {
    position: 'absolute',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    bottom: 0.5 * height,
    flexDirection: 'row',
    width: 0.3 * width,
  },
  timer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'red',
    // borderWidth: 2,
  },
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  timerText: {
    fontSize: 30,
  },
});
