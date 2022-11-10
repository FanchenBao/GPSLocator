/**
 * @format
 */

declare namespace FirestoreT {
  interface EmitterT {
    thingName: string;
    type: 'dev' | 'prod';
  }
  interface RecordT {
    latitude: number;
    longitude: number;
    timestamp: number;
  }
  interface GPSRecordsT {
    [macPrefix: string]: Array<RecordT>;
  }

  interface AppConfigT {
    emitDuration: number;
    emitRepeats: number;
  }
}
