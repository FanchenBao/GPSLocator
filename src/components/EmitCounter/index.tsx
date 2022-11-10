/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, TouchableOpacity} from 'react-native';
import {ConfirmModal} from '../ConfirmModal';

type PropsT = {
  onCounterPress: () => void;
  count: number;
  maxCount: number; // if count reaches this value, we show rainbow
};

/**
 * This component is shown as a button on the app that displays the number of
 * times emission has been triggered. It resets itself when it is pressed and
 * the reset request is confirmed.
 */
export const EmitCounter: React.FC<PropsT> = props => {
  const {count, onCounterPress} = props;
  const [confirmModalVisible, setConfirmModalVisible] =
    React.useState<boolean>(false);

  return (
    <>
      <TouchableOpacity
        style={viewStyles.emitCounter}
        onPress={() => {
          if (count > 0) {
            setConfirmModalVisible(true);
          }
        }}>
        <Text style={textStyles.emitCounter}>{`Emit Count ${count}`}</Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={confirmModalVisible}
        prompt="Are you sure to reset the emission counter?"
        onOkPress={() => {
          onCounterPress();
          setConfirmModalVisible(false);
        }}
        onCancelPress={() => setConfirmModalVisible(false)}
      />
    </>
  );
};
