/**
 *
 * @format
 */

import * as React from 'react';
import {Text, View, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {viewStyles, textStyles} from './styles';
import {HideInteraction} from '../../components/hideInteraction';
import auth from '@react-native-firebase/auth';
import {AppContext} from '../../context/store';

// import types
import {StackScreenProps} from '@react-navigation/stack';

type PropsT = StackScreenProps<NavigationT.RootStackT, 'LogIn'>;

/**
  Home screen.

  The purpose of the home screen is very simple: force a user to log in. The
  reason for log in is to that Firestore does not allow write permission unless
  a user has been authenticated. Thus, login is necessary.
 */
export const HomeScreen: React.FC<PropsT> = _ => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {hasInternet, setError} = React.useContext(AppContext);

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
      const err = signInError as FirebaseT.NativeFirebaseErrorT;
      switch (err.code) {
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
          console.log(err);
          setError('Internal error!');
      }
    }
  };

  return (
    <HideInteraction onPress={() => Keyboard.dismiss()}>
      <View style={viewStyles.container}>
        <View style={viewStyles.header}>
          <Text style={textStyles.headerText}>GPS Locator</Text>
        </View>

        <View style={viewStyles.content}>
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
        </View>

        <View style={viewStyles.interaction}>
          <View style={viewStyles.loginButtonContainer}>
            <TouchableOpacity
              style={viewStyles.loginButton}
              onPress={() => onPress()}>
              <Text style={textStyles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </HideInteraction>
  );
};
