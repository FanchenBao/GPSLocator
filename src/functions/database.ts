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
@param macPrefix mac address prefix
@param emitter alias ID of the sensor used as emitter. For instance 06, 09, etc.
@param gpsRecords An array of GeoPositions provided by react-native-geolocation-service
  that are recorded for a period of time.
@return A void promise.
 */
export const uploadGPS = async (
  macPrefix: string,
  emitter: string,
  gpsRecords: Array<FirestoreT.RecordT>,
): Promise<void> => {
  const date = format(new Date(), 'MM-dd-yyyy');
  return await db
    .collection('data')
    .doc(date)
    .set({[emitter]: {[macPrefix]: gpsRecords}}, {merge: true});
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

export const deleteEmissionMacPrefix = async (
  macPrefix: string,
  emitter: string,
): Promise<void> => {
  const date = format(new Date(), 'MM-dd-yyyy');
  const docSnapshot = await db.collection('data').doc(date).get();
  if (docSnapshot.exists) {
    const data = docSnapshot.data() as FirestoreT.GPSRecordsT;
    if (!(macPrefix in data[emitter])) {
      throw new Error(`Emission prefixed by "${macPrefix}" does NOT exist!`);
    }
    await db
      .collection('data')
      .doc(date)
      .update({[`${emitter}.${macPrefix}`]: firestore.FieldValue.delete()});
  } else {
    throw new Error(`Emission document with id "${date}" does NOT exist!`);
  }
};

export const getAppConfig = async (): Promise<FirestoreT.AppConfigT> => {
  const docSnapshot = await db.collection('app').doc('config').get();
  return docSnapshot.data() as FirestoreT.AppConfigT;
};
