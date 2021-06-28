/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './src/screens/HomeScreen/index.js';
import {GPSScreen} from './src/screens/GPSScreen/index.js';
import auth from '@react-native-firebase/auth';

// Import type
import type {Node} from 'react';

const Stack = createStackNavigator();

const App: () => Node = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  // Handle user state changes
  const onAuthStateChanged = currentUser => {
    setUser(currentUser);
    if (initializing) {
      setInitializing(false);
    }
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
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
              <Stack.Screen name="Log In" component={HomeScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
