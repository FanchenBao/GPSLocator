/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, View, TouchableOpacity, FlatList} from 'react-native';
import {DarkModalBase} from '../DarkModalBase/index';
import {ListItem} from './listItem';
import {AppContext} from '../../context/store';

type PropsT = {
  onCancelPress: () => void;
  visible: boolean;
};

export const SelectEmitterModal: React.FC<PropsT> = props => {
  const {onCancelPress, visible} = props;
  const {emitters, selectedEmitter, setSelectedEmitter} =
    React.useContext(AppContext);
  const [localEmitter, setLocaEmitter] = React.useState(selectedEmitter);

  return (
    <DarkModalBase visible={visible} onRequestClose={onCancelPress}>
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.headerContainer}>
          <Text style={textStyles.headerText}>Select Emitter</Text>
        </View>
        <View style={viewStyles.listContainer}>
          <FlatList
            data={Object.keys(emitters)}
            renderItem={({item}) => (
              <ListItem
                isSelected={localEmitter === item}
                id={item}
                onPress={id => {
                  setLocaEmitter(id);
                }}
              />
            )}
            keyExtractor={item => item}
          />
        </View>
        <View style={viewStyles.buttonContainer}>
          <TouchableOpacity
            style={[viewStyles.button, {borderWidth: 2, borderColor: 'black'}]}
            onPress={onCancelPress}>
            <Text style={textStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[viewStyles.button, {backgroundColor: '#2196F3'}]}
            onPress={() => {
              setSelectedEmitter(localEmitter);
              onCancelPress();
            }}>
            <Text style={textStyles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DarkModalBase>
  );
};
