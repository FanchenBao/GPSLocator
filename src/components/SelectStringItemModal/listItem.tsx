/**
 * @format
 */

import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {viewStyles, textStyles} from './styles';

type PropsT = {
  isSelected: boolean;
  id: string;
  displayPrefix: string;
  onPress: (id: string) => void;
};

/**
A component to render each list item for schools and campuses drop down.
 */
export const ListItem: React.FC<PropsT> = props => {
  const {isSelected, id, displayPrefix, onPress} = props;
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      style={[
        viewStyles.listButton,
        {backgroundColor: isSelected ? '#2196F3' : 'white'},
      ]}>
      <Text style={textStyles.listText}>{`${displayPrefix}-${id}`}</Text>
    </TouchableOpacity>
  );
};
