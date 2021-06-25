/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {SafeAreaView} from 'react-native';
import {HomeScreen} from './src/screens/HomeScreen/index.js';

const App: () => Node = () => {
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <HomeScreen />
    </SafeAreaView>
  );
};

export default App;
