/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from './src/context/store';
import {name as appName} from './app.json';

const appWrapper = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => appWrapper);
