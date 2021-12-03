/**
 * @format
 */

import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'white',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  header: {
    flex: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'green',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    // borderWidth: 2,
    // borderColor: 'purple',
  },
  inputTextContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    justifyContent: 'flex-end',
    marginBottom: 10,
    // borderWidth: 2,
    // borderColor: 'blue',
  },

  passwordContainer: {
    marginTop: 10,
    // borderWidth: 2,
    // borderColor: 'green',
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
});

export const textStyles = StyleSheet.create<{[k: string]: TextStyle}>({
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
