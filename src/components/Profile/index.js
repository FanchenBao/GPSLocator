/**
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Text, View, TouchableOpacity, Switch, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import {viewStyles, textStyles} from './styles';

// Import types
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed from its parent, if applicable
type OwnPropsT = {|
  switches: Array<{
    onValueChange: () => void,
    value: boolean,
    text: string,
    enable: boolean,
  }>, // An array of variables for the switches
  widthPct: number, // pct of total width that this component occupies. This must agree with the side drawer open state.
|};

// Type for the props mapped to dispatch
type DispatchToPropsT = {||};

// Type for ALL props
type PropsT = {|
  ...OwnPropsT,
  ...StatePropsT,
  ...DispatchToPropsT,
|};

export const Profile = (props: PropsT): Node => {
  const {switches, widthPct} = props;
  const {width} = Dimensions.get('window');
  return (
    <View style={[viewStyles.container, {width: width * widthPct}]}>
      <View style={viewStyles.header}>
        <Text style={textStyles.headerText}>Profile</Text>
      </View>
      <View style={viewStyles.switchContainer}>
        {switches
          .filter(({enable}) => enable)
          .map(({onValueChange, value, text}) => (
            <View style={viewStyles.idvSwitch} key={text}>
              <View style={viewStyles.switchTextContainer}>
                <Text style={textStyles.switchText}>{text}</Text>
              </View>
              <Switch
                trackColor={{false: 'lightgrey', true: '#cfe8fc'}}
                thumbColor={value ? '#2196F3' : '#bfbfbf'}
                onValueChange={onValueChange}
                value={value}
                style={viewStyles.switch}
              />
            </View>
          ))}
      </View>
      <View style={viewStyles.logoutButtonContainer}>
        <TouchableOpacity
          style={viewStyles.logoutButton}
          onPress={() =>
            auth()
              .signOut()
              .catch(err => console.log(err))
          }>
          <Text style={textStyles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
