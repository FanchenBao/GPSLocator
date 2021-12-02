/**
 *
 * @format
 */

import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Slider from '@react-native-community/slider';
import {AppContext} from '../../context/store';
import {viewStyles, textStyles} from './styles';

// Types
import {MapTypes} from 'react-native-maps';
interface PropsT {
  widthPct: number; // pct of total width that this component occupies. This must agree with the side drawer open state.
}

export const Profile: React.FC<PropsT> = props => {
  const {widthPct} = props;
  const {
    highAccuracy,
    setHighAccuracy,
    locationDialog,
    setLocationDialog,
    forceLocation,
    setForceLocation,
    gpsInterval,
    setGPSInterval,
    mapType,
    setMapType,
  } = React.useContext(AppContext);
  const [slideVal, setSlideVal] = React.useState(gpsInterval / 1000);

  const {width} = Dimensions.get('window');
  const switches = [
    {
      onValueChange: () => setHighAccuracy(!highAccuracy),
      value: highAccuracy,
      text: 'High Accuracy',
      enable: true,
    },
    {
      onValueChange: () => setForceLocation(!forceLocation),
      value: forceLocation,
      text: 'Force Location',
      enable: true,
    },
    {
      onValueChange: () => setLocationDialog(!locationDialog),
      value: locationDialog,
      text: 'Location Dialog',
      enable: Platform.OS === 'android',
    },
  ];
  return (
    <View style={[viewStyles.container, {width: width * widthPct}]}>
      <View style={viewStyles.header}>
        <Text style={textStyles.headerText}>Profile</Text>
      </View>
      <View style={viewStyles.switchContainer}>
        {switches
          .filter(({enable}) => enable)
          .map(({onValueChange, value, text}) => (
            <View style={viewStyles.idvSwitch} key={text}>
              <View style={viewStyles.switchTextContainer}>
                <Text style={textStyles.switchText}>{text}</Text>
              </View>
              <Switch
                trackColor={{false: 'lightgrey', true: '#cfe8fc'}}
                thumbColor={value ? '#2196F3' : '#bfbfbf'}
                onValueChange={onValueChange}
                value={value}
                style={viewStyles.switch}
              />
            </View>
          ))}
      </View>
      <View style={viewStyles.sliderContainer}>
        <Text
          style={
            textStyles.switchText
          }>{`GPS Update Interval: ${slideVal.toFixed(1)} s`}</Text>
        <Slider
          style={[
            viewStyles.slider,
            Platform.OS === 'android' && {
              width: '60%',
              transform: [{scaleX: 1.5}, {scaleY: 1.5}],
            },
          ]}
          minimumValue={0.1}
          maximumValue={5}
          value={slideVal}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#bfbfbf"
          step={0.5}
          onValueChange={val => setSlideVal(val)}
          onSlidingComplete={val => setGPSInterval(val * 1000)}
        />
      </View>
      <View style={viewStyles.mapTypeContainer}>
        {['satellite', 'standard'].map(mt => (
          <TouchableOpacity
            key={mt}
            style={[
              viewStyles.mapTypeButton,
              {
                backgroundColor: mapType === mt ? '#2196F3' : 'lightgrey',
              },
            ]}
            onPress={() => setMapType(mt as MapTypes)}>
            <Text
              style={[
                textStyles.buttonText,
                {color: mapType === mt ? 'white' : '#999999'},
              ]}>
              {mt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={viewStyles.logoutButtonContainer}>
        <TouchableOpacity
          style={viewStyles.logoutButton}
          onPress={() =>
            auth()
              .signOut()
              .catch(err => console.log(err))
          }>
          <Text style={textStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
