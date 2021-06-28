/**
 * @flow
 */

import {StyleSheet} from 'react-native';

// Import types
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

export const viewStyles: {[string]: ViewStyleProp} = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFE6F0',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  successContainer: {
    backgroundColor: '#ccffcc',
  },
});

export const textStyles: {[string]: TextStyleProp} = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#FF4D94',
  },
  successText: {
    color: '#ccffcc',
  },
});
