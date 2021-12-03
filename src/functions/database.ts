/**
 *
 * @format
 */

import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';

// Import Types
import {GeoPosition} from 'react-native-geolocation-service';

const db = firestore(); // connection to the firestore

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
  return await db
    .collection('data')
    .doc(date)
    .set({[curTime]: gpsRecords}, {merge: true});
};

/**
A wrapper function to get all emitter information only ONCE.
@return An object of emitter information. The key is emitter id, and the value
  contains the emitter thing name, which is used for command-and-response with
  the emitter
 */
export const getEmitters = async (): Promise<{
  [emitterId: string]: FirestoreT.EmitterT;
}> => {
  const querySnapshot = await db
    .collection<FirestoreT.EmitterT>('emitters')
    .get();
  return Object.fromEntries(
    querySnapshot.docs.map(ele => [ele.id, ele.data()]),
  );
};
