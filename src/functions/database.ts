/**
 *
 * @format
 */

import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';

const db = firestore(); // connection to the firestore

/**
Upload recorded GPS data to firestore.

This is basically a wrapper for the firestore API. NOTE that the document name
is the date and each entry in the document has the MAC address prefix as the
field name.
@param gpsRecords An array of GeoPositions provided by react-native-geolocation-service
  that are recorded for a period of time.
@return A void promise.
 */
export const uploadGPS = async (
  macPrefix: string,
  gpsRecords: Array<FirestoreT.RecordT>,
): Promise<void> => {
  const date = format(new Date(), 'MM-dd-yyyy');
  return await db
    .collection('data')
    .doc(date)
    .set({[macPrefix]: gpsRecords}, {merge: true});
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

export const deleteEmission = async (macPrefix: string): Promise<void> => {
  const docSnapshot = await db.collection('data').doc(macPrefix).get();
  if (docSnapshot.exists) {
    await docSnapshot.ref.delete();
  } else {
    throw new Error(`Emission prefixed by "${macPrefix}" does NOT exist!`);
  }
};
