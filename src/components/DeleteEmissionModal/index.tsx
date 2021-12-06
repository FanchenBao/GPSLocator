/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, View, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import Toast from 'react-native-simple-toast';
import {DarkModalBase} from '../DarkModalBase/index';
import {deleteEmissionMacPrefix} from '../../functions/database';
import {AppContext} from '../../context/store';
import {HideInteraction} from '../hideInteraction';

type PropsT = {
  onCancelPress: () => void;
  onDeleteSuccess: () => void;
  visible: boolean;
  macPrefix: string;
};

export const DeleteEmissionModal: React.FC<PropsT> = props => {
  const {onCancelPress, onDeleteSuccess, visible, macPrefix} = props;
  const [confirmEnable, setConfirmEnable] = React.useState<boolean>(false);
  const {setError} = React.useContext(AppContext);

  const onChangeText = (text: string) => setConfirmEnable(text === macPrefix);

  return (
    <DarkModalBase visible={visible} onRequestClose={onCancelPress}>
      <HideInteraction onPress={() => Keyboard.dismiss()}>
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
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={viewStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                viewStyles.button,
                {borderWidth: 1, borderColor: 'black'},
              ]}
              onPress={() => {
                setConfirmEnable(false);
                onCancelPress();
              }}>
              <Text style={textStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                viewStyles.button,
                {backgroundColor: confirmEnable ? 'red' : 'lightgrey'},
              ]}
              onPress={async () => {
                setConfirmEnable(false);
                onCancelPress();
                try {
                  await deleteEmissionMacPrefix(macPrefix);
                  onDeleteSuccess();
                  Toast.show(
                    `Emission prefixed with "${macPrefix}" has been deleted`,
                  );
                } catch (err) {
                  setError(
                    `ERROR: Failed to delete emission prefixed with "${macPrefix}".\n${err}`,
                  );
                }
              }}
              disabled={!confirmEnable}>
              <Text style={[textStyles.buttonText, {color: 'white'}]}>
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </HideInteraction>
    </DarkModalBase>
  );
};
