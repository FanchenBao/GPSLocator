/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './src/screens/HomeScreen/index';
import {GPSScreen} from './src/screens/GPSScreen/index';
import auth from '@react-native-firebase/auth';
import {AppContext} from './src/context/store';
import {getEmitters} from './src/functions/database';
import {ErrorModal} from './src/errors/ErrorModal';
import {networkStatusListener} from './src/functions/network';

const Stack = createStackNavigator<NavigationT.RootStackT>();

const App: React.FC = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<FirebaseT.UserT>();

  // Context
  const {setEmitters, error, setError, setHasInternet} =
    React.useContext(AppContext);

  // Handle user state changes
  const onAuthStateChanged = (currentUser: FirebaseT.UserT) => {
    setUser(currentUser);
    if (initializing) {
      setInitializing(false);
    }
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  // Download info of all emitters
  React.useEffect(() => {
    // console.log('getEmitters called');
    getEmitters()
      .then(emittersObj => {
        setEmitters(emittersObj);
      })
      .catch(e => {
        console.log(e);
        setError('Getting emitter list failed.');
      });
  }, [setEmitters, setError]);

  // Check internet connection
  React.useEffect(() => {
    const subscriber = networkStatusListener(setHasInternet, setError, error);
    return subscriber;
  }, [error, setError, setHasInternet]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {user ? ( // Follow best practice: https://reactnavigation.org/docs/auth-flow
            <>
              <Stack.Screen
                name="GPS"
                options={{gestureEnabled: false}}
                component={GPSScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="LogIn" component={HomeScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <ErrorModal
        msg={error}
        onOkPress={() => setError('')}
        visible={error !== ''}
      />
    </SafeAreaView>
  );
};

export default App;
