/**
 *
 * @format
 * @flow strict-local
 */

import {StyleSheet} from 'react-native';

// Import types
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

export const viewStyles: {[string]: ViewStyleProp} = StyleSheet.create({
  container: {
    flex: 1,
  },
  dummyContentContainer: {
    flex: 3.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  gpsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 15,
  },
  recordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 15,
  },
  resultContainer: {
    flex: 2,
    justifyContent: 'center',
    width: '70%',
    padding: 10,
    // borderWidth: 2,
    // borderColor: 'black',
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});
