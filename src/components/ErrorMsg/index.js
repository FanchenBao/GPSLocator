/**
 * Route from the selected parking to selected building
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {View, Text} from 'react-native';
import {viewStyles, textStyles} from './styles.js';

// Import types
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed to UserSelectScreen from its parent, if applicable
type OwnPropsT = {|
  msg: string,
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
A component to produce error message
 */
export const ErrorMsg = (props: PropsT): Node => {
  const {msg} = props;
  return (
    <View style={viewStyles.container} testID="errorMsg">
      <Text style={textStyles.text}>{msg}</Text>
    </View>
  );
};

/**
A componenent to produce success message
 */
export const SuccessMsg = (props: PropsT): Node => {
  const {msg} = props;
  return (
    <View
      style={[viewStyles.container, viewStyles.successContainer]}
      testID="successMsg">
      <Text style={[textStyles.text, textStyles.successText]}>{msg}</Text>
    </View>
  );
};
