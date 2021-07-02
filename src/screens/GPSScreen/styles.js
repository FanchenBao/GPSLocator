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
    // alignItems: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '77%',
  },
  contentContainer: {
    height: '23%',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 10,
    backgroundColor: 'white',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  msgContainer: {
    height: '8%',
    paddingVertical: 5,
    // borderWidth: 2,
    // borderColor: 'red',
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
    width: 120,
    borderRadius: 15,
  },
  recordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderRadius: 15,
  },
  resultContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
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
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'blue',
  },
  userLogoContainer: {
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'auto', // magic use of margin: auto, see this https://hackernoon.com/flexbox-s-best-kept-secret-bd3d892826b6
    marginLeft: 'auto',
    marginTop: 20,
    marginRight: 20,
    backgroundColor: 'white',
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  link: {
    fontSize: 15,
    color: 'black',
  },
});
