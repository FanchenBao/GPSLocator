/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {viewStyles, textStyles} from './styles';
import {Text, TouchableOpacity, Vibration} from 'react-native';
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
  const defaultBgdColor = 'yellow';
  const [bgdColor, setBgdColor] = React.useState<string>(defaultBgdColor);

  React.useEffect(() => {
    if (timerOn && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerOn, timeLeft]);

  React.useEffect(() => {
    const rainbow = [
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
        setBgdColor(rainbow[Math.floor(Math.random() * rainbow.length)]);
        Vibration.vibrate(200);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [timeLeft, timerOn]);

  React.useEffect(() => {
    if (!timerOn) {
      setBgdColor(defaultBgdColor);
      setTimeLeft(totalTime);
    }
  }, [timerOn, totalTime]);

  return (
    <>
      {/* <View style={[viewStyles.timerContainer, ]}> */}
      <TouchableOpacity
        style={[viewStyles.timer, {backgroundColor: bgdColor}]}
        onPress={() => {
          if (timeLeft < totalTime) {
            setConfirmModalVisible(true);
          }
        }}>
        <TimerIcon height={35} width={27} scale={0.06} />
        <Text style={textStyles.timerText}>{timeLeft}</Text>
      </TouchableOpacity>
      {/* </View> */}

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
