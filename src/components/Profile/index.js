/* eslint-disable react-native/no-inline-styles */
/**
 *
 * @format
 * @flow
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
import {AppContext} from '../../context/store.js';
import {viewStyles, textStyles} from './styles';

// Import types
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed from its parent, if applicable
type OwnPropsT = {|
  widthPct: number, // pct of total width that this component occupies. This must agree with the side drawer open state.
|};

// Type for the props mapped to dispatch
type DispatchToPropsT = {||};

// Type for ALL props
type PropsT = {|
  ...OwnPropsT,
  ...StatePropsT,
  ...DispatchToPropsT,
|};

export const Profile = (props: PropsT): Node => {
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
            onPress={() => setMapType(mt)}>
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
