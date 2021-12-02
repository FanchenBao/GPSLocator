/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Animated, Dimensions, PanResponder} from 'react-native';
import {styles} from './styles';

interface PropsT {
  peekWidthPct: number; // width of the peek state as percentage of total width
  openWidthPct: number; // width of the open state as percentage of total width
  maxWidthPct: number; // maximum pct of width allowed for a user to drag the drawer.
  expandable?: boolean; // whether the drawer is expandable. If set to false, the drawer cannot expand beyond the peek state
  nonSlideOpen?: boolean; // a flag indicating whether the drawer should open without user sliding. Useful when the drawer needs to be opened programmatically. Default to false.
  onDrawerOpen?: () => void; // callback when the drawer is in open state.
  onDrawerPeek?: () => void; // callback when the drawer is in peek state.
}

/**
	Function component of SideDrawer
	Inspired by: https://dev.to/johannawad/creating-a-swipe-up-bottom-drawer-in-react-native-no-external-libraries-3ng1
 */
export const SideDrawer: React.FC<PropsT> = props => {
  const {
    children,
    peekWidthPct,
    openWidthPct,
    maxWidthPct,
    expandable = true,
    nonSlideOpen = false,
    onDrawerOpen = () => {
      // placeholder function
    },
    onDrawerPeek = () => {
      // placeholder function
    },
  } = props;

  const {width} = Dimensions.get('window');
  // State is the width of the drawer
  const DrawerState = React.useMemo(
    () => ({
      Open: width * openWidthPct,
      Peek: width * peekWidthPct,
    }),
    [openWidthPct, peekWidthPct, width],
  );
  const deltaX = React.useRef(new Animated.Value(0)).current;
  const state = React.useRef(new Animated.Value(DrawerState.Peek)).current;
  const delta = 10; // change SideDrawer state if finger slides is larger than this value

  // Since we only have two states, the next state is easy to compute. If dx is
  // going down (positive value), we always go for Peek state. Otherwise, we
  // always go for Open. There is no need to check the current state.
  const getNextState = (currState: number, dx: number): number => {
    if (dx > 0) {
      return dx > delta ? DrawerState.Peek : currState;
    } else {
      return -dx > delta ? DrawerState.Open : currState;
    }
  };

  // Obtain the deltaX needed to reach the next drawer state.
  const getNextDeltaX = React.useCallback(
    (nextState: number): number => {
      switch (nextState) {
        case DrawerState.Open:
          return DrawerState.Peek - DrawerState.Open; // negative value, going left
        case DrawerState.Peek:
          return 0; // We start at peek. If end at peek as well, no move
        default:
          return 0;
      }
    },
    [DrawerState],
  );

  // Callbacks upon Open or Peek drawer state is reached.
  const onReachNextState = React.useCallback(
    (nextState: number): void => {
      switch (nextState) {
        case DrawerState.Open:
          return onDrawerOpen();
        case DrawerState.Peek:
          return onDrawerPeek();
        default:
          return;
      }
    },
    [DrawerState, onDrawerOpen, onDrawerPeek],
  );

  // Animate the movement of the drawer. Note that since the animation always
  // finishes at a new drawer state, we place the onReachNewState() callback
  // upon animation completion.
  const animate = React.useCallback(
    (nextState: number) => {
      // NOTE: It is paramount to flattenOffset() such that the direct value
      // change that follows will not be affected by any extra offset.
      deltaX.flattenOffset();
      Animated.spring(deltaX, {
        toValue: getNextDeltaX(nextState),
        speed: 40,
        useNativeDriver: false,
      }).start(({finished}) => {
        // Callback upon successful animation.
        if (finished) {
          state.setValue(nextState);
          onReachNextState(nextState);
        }
      });
    },
    [state, deltaX, getNextDeltaX, onReachNextState],
  );

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, {dx}) =>
        expandable && Math.abs(dx) >= 10, // enable pan only if there is sufficient finger movement
      onPanResponderGrant: _ => {
        // NOTE: It is paramount that we use extractOffset() instead of
        // setOffset(deltaX._value), because setOffset(deltaX._value) retains
        // the original value, which essentially changes the overall output
        // of deltaX. What we want is to move everything from value to offset
        // while not changing the overall output.
        deltaX.extractOffset();
      },
      onPanResponderMove: (event, {dx}) => {
        // prevent user from moving the drawer too much
        // @ts-ignore: state._value is a private value not exposed for use
        deltaX.setValue(Math.max(dx, state._value - width * maxWidthPct));
      },
      onPanResponderRelease: (event, {dx}) => {
        // @ts-ignore: state._value is a private value not exposed for use
        animate(getNextState(state._value, dx));
      },
    }),
  ).current;

  // Perform non-slide open or close of the drawer
  React.useEffect(() => {
    // @ts-ignore: state._value is a private value not exposed for use
    if (state._value === DrawerState.Peek && nonSlideOpen) {
      animate(DrawerState.Open);
      // @ts-ignore: state._value is a private value not exposed for use
    } else if (state._value === DrawerState.Open && !nonSlideOpen) {
      animate(DrawerState.Peek);
    }
  });

  return (
    <Animated.View
      style={[
        styles.drawerContainer,
        {
          width: width,
          left: width - DrawerState.Peek,
          transform: [{translateX: deltaX}],
        },
      ]}
      /* Refers to the PanResponder created above */
      {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};
