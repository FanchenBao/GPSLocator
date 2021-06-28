/**
 *
 * @format
 * @flow
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
    flex: 3,
  },
  contentContainer: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  msgContainer: {
    flex: 1,
    paddingVertical: 10,
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
  logoutButton: {
    padding: 6,
    backgroundColor: 'orange',
    borderRadius: 10,
    marginRight: 10,
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  link: {
    fontSize: 15,
    color: 'black',
  },
});
