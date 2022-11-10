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
import {rainbow} from '../../constant/colors';

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
  const {count, onCounterPress, maxCount} = props;
  const [confirmModalVisible, setConfirmModalVisible] =
    React.useState<boolean>(false);
  const defaultBgdColor = 'yellow';
  const [bgdColor, setBgdColor] = React.useState<string>(defaultBgdColor);

  React.useEffect(() => {
    if (count === maxCount) {
      const interval = setInterval(() => {
        setBgdColor(rainbow[Math.floor(Math.random() * rainbow.length)]);
      }, 500);
      return () => clearInterval(interval);
    } else if (count === 0) {
      setBgdColor(defaultBgdColor);
    }
  }, [count, maxCount]);

  return (
    <>
      <TouchableOpacity
        style={[viewStyles.emitCounter, {backgroundColor: bgdColor}]}
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
