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

type PropsT = {
  onCancelPress: () => void;
  visible: boolean;
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  data: Array<string>;
  itemDisplayPrefix: string;
  title: string;
};

/**
 * Use this modal to create a list of string-based options to select. Only one
 * option can be selected. Once selected, press the OK button to confirm and
 * exit the modal.
 */
export const SelectStringItemModal: React.FC<PropsT> = props => {
  const {
    onCancelPress,
    visible,
    selectedItem,
    setSelectedItem,
    data,
    itemDisplayPrefix,
    title,
  } = props;
  const [localSelectedItem, setLocalSelectedItem] =
    React.useState(selectedItem);

  return (
    <DarkModalBase visible={visible} onRequestClose={onCancelPress}>
      <View style={viewStyles.contentContainer}>
        <View style={viewStyles.headerContainer}>
          <Text style={textStyles.headerText}>{title}</Text>
        </View>
        <View style={viewStyles.listContainer}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <ListItem
                isSelected={localSelectedItem === item}
                id={item}
                displayPrefix={itemDisplayPrefix}
                onPress={id => setLocalSelectedItem(id)}
              />
            )}
            keyExtractor={item => item}
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
              {
                backgroundColor:
                  localSelectedItem === '' ? 'lightgrey' : '#2196F3',
              },
            ]}
            onPress={() => {
              setSelectedItem(localSelectedItem);
              onCancelPress();
            }}
            disabled={localSelectedItem === ''}>
            <Text
              style={[
                textStyles.buttonText,
                {color: localSelectedItem === '' ? 'white' : 'black'},
              ]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </DarkModalBase>
  );
};
