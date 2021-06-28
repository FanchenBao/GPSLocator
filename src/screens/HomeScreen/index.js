/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {viewStyles, textStyles} from './styles';
import {ErrorMsg} from '../../components/ErrorMsg/index.js';
import {HideInteraction} from '../../components/hideInteraction.js';
import {networkStatusListener} from '../../functions/network.js';
import auth from '@react-native-firebase/auth';

// import types
import type {
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation-stack';
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed to UserSelectScreen from its parent, if applicable
type OwnPropsT = {|
  navigation: NavigationScreenProp<NavigationRoute>,
|};

// Type for the props mapped to dispatch
type DispatchToPropsT = {||};

// Type for ALL props
type PropsT = {|
  ...OwnPropsT,
  ...StatePropsT,
  ...DispatchToPropsT,
|};

/**
  Home screen.

  The purpose of the home screen is very simple: force any user to log in. The
  reason for log in is to that Firestore does not allow write permission unless
  a user has been authenticated. Thus, login is necessary.
 */
export const HomeScreen = (props: PropsT): Node => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [hasInternet, setHasInternet] = React.useState(true);

  const onPress = async () => {
    if (!hasInternet) {
      return;
    }
    if (password === '' || email === '') {
      setError('Email or password is wrong');
      return;
    }
    try {
      setError('');
      await auth().signInWithEmailAndPassword(email, password);
    } catch (signInError) {
      switch (signInError.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Email or password is wrong');
          break;
        case 'auth/too-many-requests':
          setError(
            'Too many failed login attempts. To resetore your account, please reset your password.',
          );
          break;
        default:
          console.log(signInError);
          setError('Internal error!');
      }
    }
  };

  // Hook
  React.useEffect(() => {
    const subscriber = networkStatusListener(setHasInternet, setError, error);
    return subscriber;
  }, [error]);

  return (
    <SafeAreaView style={viewStyles.safeAreaContainer}>
      <HideInteraction onPress={() => Keyboard.dismiss()}>
        <View style={viewStyles.container}>
          <View style={viewStyles.header}>
            <Text style={textStyles.headerText}>GPS Locator</Text>
          </View>

          <View style={viewStyles.content}>
            <View style={viewStyles.dummyContent} />
            <View style={viewStyles.inputTextContainer}>
              <TextInput
                style={textStyles.textInput}
                autoCorrect={false}
                placeholder="Email"
                placeholderTextColor="lightgrey"
                value={email}
                onChangeText={text => {
                  setEmail(text.trim().toLowerCase());
                }}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            </View>
            <View style={viewStyles.passwordContainer}>
              <View style={viewStyles.inputTextContainer}>
                <TextInput
                  style={textStyles.textInput}
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor="lightgrey"
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  textContentType="password"
                />
              </View>
            </View>
            <View style={viewStyles.msgContainer}>
              {error !== '' ? <ErrorMsg msg={error} /> : null}
            </View>
          </View>

          <View style={viewStyles.interaction}>
            <View style={viewStyles.loginButtonContainer}>
              <TouchableOpacity
                style={viewStyles.loginButton}
                onPress={() => onPress()}>
                <Text style={textStyles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
            <View style={viewStyles.dummyInteraction} />
          </View>
        </View>
      </HideInteraction>
    </SafeAreaView>
  );
};
