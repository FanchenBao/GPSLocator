/**
@flow
 */

import * as React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

// Import types
import type {Node} from 'react';

type PropsT = {
  // The actual component of the screen which is to be wrapped by
  // HideInteraction
  children?: Node,
  // Action to perform when any part of the HideInteraction is pressed. Write
  // the logic of hiding interaction in this callback.
  onPress: () => void,
};

/**
  This component functions as a wrapper for an entire screen, such that when
  user wants to dismiss any interaction, such as keyboard or a dropdown list,
	he/she only needs to touch any area on the screen.

  Reference: https://reactnativecode.com/react-native-hide-dismiss-keyboard/
 */
export const HideInteraction = (props: PropsT): Node => {
  const {children, onPress} = props;
  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      {children}
    </TouchableWithoutFeedback>
  );
};
