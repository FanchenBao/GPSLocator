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
}
