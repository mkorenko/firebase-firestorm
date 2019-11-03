import { firestore as firebaseFirestore } from 'firebase/app';
import * as CloudFirestore from '@google-cloud/firestore';
export declare namespace firestore {
    type Timestamp = firebaseFirestore.Timestamp | CloudFirestore.Timestamp;
    type GeoPoint = firebaseFirestore.GeoPoint | CloudFirestore.GeoPoint;
    type FieldValue = firebaseFirestore.FieldValue | CloudFirestore.FieldValue;
    type QuerySnapshot = firebaseFirestore.QuerySnapshot;
    type WhereFilterOp = firebaseFirestore.WhereFilterOp;
    type OrderByDirection = firebaseFirestore.OrderByDirection;
    type CollectionReference = firebaseFirestore.CollectionReference;
    type DocumentChangeType = firebaseFirestore.DocumentChangeType;
    type DocumentReference = firebaseFirestore.DocumentReference;
    type DocumentSnapshot = firebaseFirestore.DocumentSnapshot;
    type Query = firebaseFirestore.Query;
    type Firestore = firebaseFirestore.Firestore;
    type SnapshotMetadata = firebaseFirestore.SnapshotMetadata;
    type SnapshotListenOptions = firebaseFirestore.SnapshotListenOptions;
}
export declare const firestore: {
    Timestamp: typeof firebaseFirestore.Timestamp;
    GeoPoint: typeof firebaseFirestore.GeoPoint;
    FieldValue: typeof firebaseFirestore.FieldValue;
};
