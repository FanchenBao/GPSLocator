/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 27,
    padding: 30,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginBottom: 24,
  },
  listContainer: {
    height: 120,
    width: 200,
    alignSelf: 'center',
    marginBottom: 24,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  listButton: {
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 15,
    paddingVertical: 3,
  },
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  headerText: {
    color: 'black',
    fontSize: 20,
  },
  listText: {
    color: 'black',
    fontSize: 17,
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
  },
});
