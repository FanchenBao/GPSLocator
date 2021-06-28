/**
 * @flow
 */

import {StyleSheet} from 'react-native';

// Import types
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

export const viewStyles: {[string]: ViewStyleProp} = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'white',
    // borderWidth: 2
    // borderColor: 'blue',
  },
  header: {
    flex: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'green',
  },
  logo: {
    width: 167.74,
    height: 38.57,
  },

  content: {
    flex: 1,
    alignSelf: 'stretch',
    // borderWidth: 2,
    // borderColor: 'purple',
  },
  dummyContent: {
    flex: 1.5,
  },
  inputTextContainer: {
    flex: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    justifyContent: 'flex-end',
    // borderWidth: 2,
    // borderColor: 'blue',
  },

  passwordContainer: {
    flex: 1.2,
    flexDirection: 'row',
    // borderWidth: 2,
    // borderColor: 'green',
  },
  eyeContainer: {
    justifyContent: 'flex-end',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  eye: {
    paddingBottom: 7,
  },
  msgContainer: {
    flex: 1.5,
    paddingVertical: 10,
    // borderWidth: 2,
    // borderColor: 'blue',
  },

  interaction: {
    flex: 1.2,
    alignSelf: 'stretch',
    // borderWidth: 2,
    // borderColor: 'cyan',
  },
  loginButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderWidth: 2,
    // borderColor: 'black',
  },
  loginButton: {
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  interactionTextContainerContainer: {
    flex: 1,
  },
  interactionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'grey',
  },
  dummyInteraction: {
    flex: 1.5,
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  textInput: {
    paddingBottom: 10,
    color: 'black',
    fontSize: 16,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 20,
  },
});
