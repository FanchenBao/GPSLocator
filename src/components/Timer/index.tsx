/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {View, Text, TouchableOpacity, Vibration} from 'react-native';
import {ConfirmModal} from '../ConfirmModal';
import {TimerIcon} from '../SVG/timerIcon';

type PropsT = {
  timerOn: boolean;
  turnOffTimer: () => void;
  totalTime: number;
};

/**
 * This component is shown as a button on the app that displays a timer. By
 * pressing on the button, we reset the timer
 */
export const Timer: React.FC<PropsT> = props => {
  const {timerOn, turnOffTimer, totalTime} = props;
  const [confirmModalVisible, setConfirmModalVisible] =
    React.useState<boolean>(false);
  const [timeLeft, setTimeLeft] = React.useState<number>(totalTime);
  const [bgdColor, setBgdColor] = React.useState<string>('yellow');

  React.useEffect(() => {
    if (timerOn && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerOn, timeLeft]);

  React.useEffect(() => {
    const allColors = [
      'red',
      'orange',
      'yellow',
      'green',
      'cyan',
      'blue',
      'purple',
    ];
    if (timerOn && timeLeft === 0) {
      const interval = setInterval(() => {
        setBgdColor(allColors[Math.floor(Math.random() * allColors.length)]);
        Vibration.vibrate(200);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [timeLeft, timerOn]);

  React.useEffect(() => {
    if (!timerOn) {
      setBgdColor('yellow');
      setTimeLeft(totalTime);
    }
  }, [timerOn, totalTime]);

  return (
    <>
      <View style={[viewStyles.timerContainer, {backgroundColor: bgdColor}]}>
        <TimerIcon height="90%" width="55%" scale={0.06} />
        <TouchableOpacity
          style={[viewStyles.timer]}
          onPress={() => {
            if (timeLeft < totalTime) {
              setConfirmModalVisible(true);
            }
          }}>
          <Text style={textStyles.timerText}>{timeLeft}</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={confirmModalVisible}
        prompt="Are you sure to reset the timer?"
        onOkPress={() => {
          turnOffTimer();
          setConfirmModalVisible(false);
        }}
        onCancelPress={() => setConfirmModalVisible(false)}
      />
    </>
  );
};