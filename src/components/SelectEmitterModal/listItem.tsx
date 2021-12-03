/**
 * @format
 */

import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {viewStyles, textStyles} from './styles';

type PropsT = {
  isSelected: boolean;
  id: string;
  onPress: (id: string) => void;
};

/**
A component to render each list item for schools and campuses drop down.
 */
export const ListItem: React.FC<PropsT> = props => {
  const {isSelected, id, onPress} = props;
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      style={[
        viewStyles.listButton,
        {backgroundColor: isSelected ? '#2196F3' : 'white'},
      ]}>
      <Text style={textStyles.listText}>{`Emitter-${id}`}</Text>
    </TouchableOpacity>
  );
};
