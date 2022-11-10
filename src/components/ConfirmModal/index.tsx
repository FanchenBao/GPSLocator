/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, View, TouchableOpacity} from 'react-native';
import {DarkModalBase} from '../DarkModalBase/index';

type PropsT = {
  onCancelPress: () => void;
  onOkPress: () => void;
  prompt: string;
  visible: boolean;
  showCancelButton?: boolean;
};

export const ConfirmModal: React.FC<PropsT> = props => {
  const {
    onCancelPress,
    onOkPress,
    prompt,
    visible,
    showCancelButton = true,
  } = props;

  return (
    <DarkModalBase visible={visible} onRequestClose={onCancelPress}>
      <View style={viewStyles.container}>
        <View style={viewStyles.promptContainer}>
          <Text style={textStyles.promptText}>{prompt}</Text>
        </View>

        <View style={viewStyles.buttonContainer}>
          {showCancelButton && (
            <TouchableOpacity
              style={[
                viewStyles.button,
                {borderWidth: 1, borderColor: 'black'},
              ]}
              onPress={() => onCancelPress()}>
              <Text style={textStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[viewStyles.button, {backgroundColor: '#2196F3'}]}
            onPress={() => onOkPress()}>
            <Text style={[textStyles.buttonText, {color: 'white'}]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DarkModalBase>
  );
};
