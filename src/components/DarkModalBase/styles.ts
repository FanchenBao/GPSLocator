/**
 * @format
 */

import {StyleSheet, ViewStyle} from 'react-native';

export const viewStyles = StyleSheet.create<{[k: string]: ViewStyle}>({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 27,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
