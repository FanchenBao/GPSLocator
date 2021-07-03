/**
 *
 * @format
 * @flow
 */

import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';

// Import Types
import type {GeoPosition} from 'react-native-geolocation-service';

/**
Upload recorded GPS data to firestore.

This is basically a wrapper for the firestore API. NOTE that the document name
is the date and each entry in the document has the current timestamp as the
field name.
@param gpsRecords An array of GeoPositions provided by react-native-geolocation-service
  that are recorded for a period of time.
@return A void promise.
 */
export const uploadGPS = async (
  gpsRecords: Array<GeoPosition>,
): Promise<void> => {
  const date = format(new Date(), 'MM-dd-yyyy');
  const curTime = format(new Date(), 'HH-mm-ss');
  return await firestore()
    .collection('data')
    .doc(date)
    .set({[curTime]: gpsRecords}, {merge: true});
};
