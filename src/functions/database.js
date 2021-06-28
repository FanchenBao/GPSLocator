/**
 *
 * @format
 * @flow
 */

import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';

// Import Types
import type {GeoPosition} from 'react-native-geolocation-service';

export const uploadGPS = (
  gpsRecords: Array<GeoPosition>,
  onUploadSuccess: () => void,
  onUploadError: string => void,
) => {
  const date = format(new Date(), 'MM-dd-yyyy');
  const curTime = format(new Date(), 'HH-mm-ss');
  firestore()
    .collection('data')
    .doc(date)
    .update({[curTime]: gpsRecords})
    .then(onUploadSuccess)
    .catch(err => onUploadError(err));
};
