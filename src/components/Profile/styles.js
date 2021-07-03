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
  },
  idvSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  switch: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  logoutButtonContainer: {
    flex: 1,
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
  logoutText: {
    fontSize: 20,
    color: 'black',
  },
});
