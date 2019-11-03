"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var store_1 = require("../store");
var DocumentRef_1 = __importDefault(require("../fields/DocumentRef"));
var Collection_1 = __importDefault(require("../Collection"));
/**
 * Class to help with serialization between [[Entity]] objects and firestore documents.
 */
var FirestoreSerializer = /** @class */ (function () {
    function FirestoreSerializer() {
    }
    /**
     * Serializes an [[Entity]] to an object which can be inserted into firestore.
     * @param entity Our representation of the entity.
     */
    FirestoreSerializer.serialize = function (entity, writeType) {
        var fields = store_1.getRepository(entity.constructor.name).fields;
        var serialized = {};
        serialized.id = entity.id;
        fields.forEach(function (value, key) {
            var k = key;
            if (entity[k] || value.type === types_1.FieldTypes.Timestamp) {
                serialized[key] = value.serialize(entity[k], writeType);
                if (!serialized[key])
                    delete serialized[key];
            }
        });
        return serialized;
    };
    /**
     * Deserializes a firestore document into an [[Entity]].
     * @param doc The firestore document.
     * @param Model The [[Entity]] class to create an instance of.
     */
    FirestoreSerializer.deserialize = function (doc, Model, parentCollection) {
        var _a = store_1.getRepository(Model.prototype.constructor.name), fields = _a.fields, subcollections = _a.subcollections;
        var deserialized = new Model();
        deserialized.id = doc.id;
        var ref = DocumentRef_1.default(deserialized.id, Model, parentCollection);
        deserialized.ref = ref;
        var docData = doc.data();
        // Deserialize each of the registered fields.
        fields.forEach(function (value, key) {
            if (docData[value.name]) {
                var k = key;
                deserialized[k] = value.deserialize(docData[value.name]);
            }
        });
        // Create collection references for registered subcollections.
        subcollections.forEach(function (value, key) {
            if (value.entity) {
                var k = key;
                deserialized[k] = Collection_1.default(value.entity, ref);
            }
        });
        return deserialized;
    };
    return FirestoreSerializer;
}());
exports.default = FirestoreSerializer;
