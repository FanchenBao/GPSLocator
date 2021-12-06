/**
 *
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  container: {
    flex: 1,
    // alignItems: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: '62%',
  },
  contentContainer: {
    height: '38%',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'white',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  buttonContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  leftButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rightButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderRadius: 10,
    paddingVertical: 5,
  },
  resultContainer: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 20,
    // borderWidth: 2,
    // borderColor: 'black',
  },
  leftResultContainer: {
    flex: 1,
  },
  rightResultContainer: {
    flex: 1,
  },
  probeRequestCountContainer: {
    marginLeft: 20,
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
  userLogoButton: {
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

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
  link: {
    fontSize: 15,
    color: 'black',
  },
});
