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
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
  },
  switchContainer: {
    flex: 0.3,
    justifyContent: 'space-evenly',
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
  },
  idvSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  switch: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  sliderContainer: {
    flex: 0.3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'lightgrey',
  },
  slider: {
    width: '80%',
  },
  mapTypeContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  mapTypeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 100,
    borderRadius: 15,
  },
  logoutButtonContainer: {
    flex: 0.8,
    // borderWidth: 2,
    // borderColor: 'red',
  },
  logoutButton: {
    marginTop: 'auto',
    // marginBottom: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  headerText: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
  switchText: {
    fontSize: 20,
    color: 'black',
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
});
