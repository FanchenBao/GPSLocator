/**
 * Route from the selected parking to selected building
 *
 * @format
 */

import * as React from 'react';
import {View, Text} from 'react-native';
import {viewStyles, textStyles} from './styles';

// types
interface PropsT {
  msg: string;
}

/**
A component to produce error message
 */
export const ErrorMsg: React.FC<PropsT> = props => {
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
export const SuccessMsg: React.FC<PropsT> = props => {
  const {msg} = props;
  return (
    <View
      style={[viewStyles.container, viewStyles.successContainer]}
      testID="successMsg">
      <Text style={[textStyles.text, textStyles.successText]}>{msg}</Text>
    </View>
  );
};
