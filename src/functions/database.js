/**
 *
 * @format
 * @flow
 */

import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';

// Import Types
import type {GeoPosition} from 'react-native-geolocation-service';

export const uploadGPS = async (
  gpsRecords: Array<GeoPosition>,
  // onUploadSuccess: () => void,
  // onUploadError: string => void,
): Promise<void> => {
  const date = format(new Date(), 'MM-dd-yyyy');
  const curTime = format(new Date(), 'HH-mm-ss');
  // const docRef = await firestore().collection('data').doc(date);
  // const docSnapshot = await docRef.get();
  // if (docSnapshot.exists) {
  //   return await docRef.update({[curTime]: gpsRecords});
  // } else {
  //   return await docRef.set({[curTime]: gpsRecords});
  // }
  return await firestore()
    .collection('data')
    .doc(date)
    .set({[curTime]: gpsRecords}, {merge: true});
};
