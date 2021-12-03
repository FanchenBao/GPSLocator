/**
 * @format
 */

import * as React from 'react';
import {View, Modal} from 'react-native';
import {viewStyles} from './styles';

type PropsT = {
  onRequestClose: () => void;
  visible: boolean;
};

/**
  This is the generic component for a dark modal base, upon which other info
  can be displayed, such as error/success message, simple dialogs, etc.

  NOTE: this component automatically sets status bar color to dark in Android
  (not applicable in iOS). But when the modal disappears, user must manually
  set status bar color back to previous value.
*/
export const DarkModalBase: React.FC<PropsT> = props => {
  const {children, onRequestClose, visible} = props;

  return (
    <Modal
      animationType="none"
      transparent={true}
      // We treat the modal as always showing and use unmount to remove it. We
      // do this because the unmount function cannot be called when the modal
      // is simply not being shown. Thus, unmounting the modal is crucial.
      visible={visible}
      onRequestClose={() => onRequestClose()}>
      <View style={viewStyles.modalContainer}>{children}</View>
    </Modal>
  );
};
