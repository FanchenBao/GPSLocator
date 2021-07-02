/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Animated, View, Dimensions, PanResponder} from 'react-native';
import {styles} from './styles.js';

// Import types
import type {Node} from 'react';

// Define types (use exact types as much as possible)
// Type for the props acquired from the center store
type StatePropsT = {||};

// Type for the props passed from its parent, if applicable
type OwnPropsT = {|
  children?: Node,
  peekWidthPct: number, // width of the peek state as percentage of total width
  openWidthPct: number, // width of the open state as percentage of total width
  maxWidthPct: number, // maximum pct of width allowed for a user to drag the drawer.
  expandable?: boolean, // whether the drawer is expandable. If set to false, the drawer cannot expand beyond the peek state
  nonSlideOpen?: boolean, // a flag indicating whether the drawer should open without user sliding. Useful when the drawer needs to be opened programmatically. Default to false.
  onDrawerOpen?: () => void, // callback when the drawer is in open state.
  onDrawerPeek?: () => void, // callback when the drawer is in peek state.
|};

// Type for the props mapped to dispatch
type DispatchToPropsT = {||};

// Type for ALL props
type PropsT = {|
  ...OwnPropsT,
  ...StatePropsT,
  ...DispatchToPropsT,
|};

const HorizontalLine = () => <View style={styles.horizontalLine} />;

/**
	Function component of SideDrawer
	Inspired by: https://dev.to/johannawad/creating-a-swipe-up-bottom-drawer-in-react-native-no-external-libraries-3ng1
 */
export const SideDrawer = (props: PropsT): Node => {
  const {children, peekWidthPct, openWidthPct, maxWidthPct} = props;
  // Specify default prop values
  const expandable = props.expandable === undefined ? true : props.expandable;
  const nonSlideOpen =
    props.nonSlideOpen === undefined ? false : props.nonSlideOpen;
  const onDrawerOpen = React.useCallback(() => {
    if (props.onDrawerOpen) {
      props.onDrawerOpen();
    }
  }, [props]);
  const onDrawerPeek = React.useCallback(() => {
    if (props.onDrawerPeek) {
      props.onDrawerPeek();
    }
  }, [props]);

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

  const getNextDeltaX = React.useCallback(
    (nextState: number): number => {
      switch (nextState) {
        case DrawerState.Open:
          return DrawerState.Peek - DrawerState.Open; // negative value, going up
        case DrawerState.Peek:
          return 0; // We start at peek. If end at peek as well, no move
        default:
          return 0;
      }
    },
    [DrawerState],
  );

  const animate = React.useCallback(
    (nextDeltaX: number) => {
      Animated.spring(deltaX, {
        toValue: nextDeltaX,
        speed: 40,
        useNativeDriver: false,
      }).start();
    },
    [deltaX],
  );

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, {dx}) =>
        expandable && Math.abs(dx) >= 10, // enable pan only if there is sufficient finger movement
      onPanResponderGrant: () => deltaX.setOffset(deltaX._value),
      onPanResponderMove: (event, {dx}) => {
        // prevent user from moving the drawer too high
        deltaX.setValue(Math.max(dx, state._value - width * maxWidthPct));
      },
      onPanResponderRelease: (event, {dx}) => {
        deltaX.flattenOffset();
        const nextState = getNextState(state._value, dx);
        state.setValue(nextState);
        animate(getNextDeltaX(nextState));
      },
    }),
  ).current;

  // Perform non-slide open of the drawer
  React.useEffect(() => {
    if (state._value === DrawerState.Peek && nonSlideOpen) {
      state.setValue(DrawerState.Open);
      animate(getNextDeltaX(DrawerState.Open));
    }
  }, [state, DrawerState, animate, getNextDeltaX, nonSlideOpen]);

  // on drawer open or peek callback
  React.useEffect(() => {
    if (state._value === DrawerState.Open) {
      onDrawerOpen();
    }
    if (state._value === DrawerState.Peek) {
      onDrawerPeek();
    }
  }, [state, DrawerState, onDrawerOpen, onDrawerPeek]);

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
      <HorizontalLine />
      {children}
    </Animated.View>
  );
};
