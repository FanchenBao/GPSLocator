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
import {Provider} from './src/context/store';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator<NavigationT.RootStackT>();

const App: React.FC = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<FirebaseT.UserT>();

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
  return (
    <Provider>
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
      </SafeAreaView>
    </Provider>
  );
};

export default App;
