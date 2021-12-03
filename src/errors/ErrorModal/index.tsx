/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {viewStyles, textStyles} from './styles';
import {DarkModalBase} from '../../components/DarkModalBase/index';

// Types
type PropsT = {
  msg: string; // error message
  onOkPress: () => void;
  visible: boolean;
};

/**
Show error message in a Modal, suitable for use in the MapScreen.
 */
export const ErrorModal: React.FC<PropsT> = props => {
  const {msg, onOkPress, visible} = props;

  return (
    <DarkModalBase onRequestClose={onOkPress} visible={visible}>
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.errorContainer}>
          <View style={viewStyles.errorTextContainer}>
            <Text style={textStyles.errorText}>{msg}</Text>
          </View>
        </View>
        <TouchableOpacity style={viewStyles.okContainer} onPress={onOkPress}>
          <Text style={textStyles.retryText}>OK</Text>
        </TouchableOpacity>
      </View>
    </DarkModalBase>
  );
};
