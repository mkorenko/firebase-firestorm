"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var CloudFirestore = __importStar(require("@google-cloud/firestore"));
var Timestamp = app_1.firestore ? app_1.firestore.Timestamp : CloudFirestore.Timestamp;
var GeoPoint = app_1.firestore ? app_1.firestore.GeoPoint : CloudFirestore.GeoPoint;
var FieldValue = app_1.firestore ? app_1.firestore.FieldValue : CloudFirestore.FieldValue;
exports.firestore = {
    Timestamp: Timestamp,
    GeoPoint: GeoPoint,
    FieldValue: FieldValue,
};
