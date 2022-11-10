/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  container: {
    backgroundColor: 'white',
    borderRadius: 27,
    padding: 30,
    justifyContent: 'flex-start',
  },
  promptContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    paddingVertical: 4,
  },
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  promptText: {
    color: 'black',
    fontSize: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
  },
});
