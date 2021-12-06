/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {DarkModalBase} from '../DarkModalBase/index';

type PropsT = {
  onCancelPress: () => void;
  visible: boolean;
  macPrefix: string;
};

export const DeleteEmissionModal: React.FC<PropsT> = props => {
  const {onCancelPress, visible, macPrefix} = props;
  const [confirmEnable, setConfirmEnable] = React.useState<boolean>(false);

  const onChangeText = (text: string) => setConfirmEnable(text === macPrefix);

  return (
    <DarkModalBase visible={visible} onRequestClose={onCancelPress}>
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.headerContainer}>
          <Text style={textStyles.headerText}>Delete Emission</Text>
        </View>
        <View style={viewStyles.descContainer}>
          <Text style={textStyles.descText}>
            {'This is to confirm the deletion of the emission session ' +
              `prefixed by "${macPrefix}". This action CANNOT be undone!`}
          </Text>
        </View>
        <View style={viewStyles.textInputContainer}>
          <TextInput
            style={viewStyles.textInput}
            placeholder="Type the MAC prefix to confirm"
            onChangeText={onChangeText}
          />
        </View>
        <View style={viewStyles.buttonContainer}>
          <TouchableOpacity
            style={[viewStyles.button, {borderWidth: 1, borderColor: 'black'}]}
            onPress={onCancelPress}>
            <Text style={textStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              viewStyles.button,
              {backgroundColor: confirmEnable ? 'red' : 'lightgrey'},
            ]}
            onPress={() => {
              onCancelPress();
            }}
            disabled={!confirmEnable}>
            <Text style={[textStyles.buttonText, {color: 'white'}]}>
              DELETE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </DarkModalBase>
  );
};
