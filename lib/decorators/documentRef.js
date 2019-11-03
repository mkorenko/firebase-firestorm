"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var FieldUtils_1 = __importDefault(require("../utils/FieldUtils"));
var store_1 = require("../store");
var __1 = require("..");
/**
 * Deserializes a firestore document reference into a firestorm document reference.
 * @param isArray Is the field an array.
 * @param value The firestore geopoint(s) representation.
 */
var serialize = function (isArray, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) { return v.native; });
};
/**
 * Deserializes firestore document ref(s) into our representation.
 * @param isArray Is the field an array.
 * @param entity The entity of the document.
 * @param value The firestore document ref(s).
 */
var deserialize = function (isArray, entity, value) {
    var deserializeValue = function (firestoreDocRef) {
        var parentEntityName = entity.prototype.constructor.name;
        var firestoreParent = firestoreDocRef.parent || null;
        /**
         * Recursive function to construct the parent tree of a document referenc.e
         * @param entityName Name of the entity (in the repository store).
         * @param firestoreCollectionRef The firestore collection reference.
         */
        var buildCollectionTree = function (entityName, firestoreCollectionRef) {
            var collectionRepository = store_1.getRepository(entityName);
            if (collectionRepository.entity) {
                if (!collectionRepository.parent) {
                    return __1.Collection(collectionRepository.entity);
                }
                if (firestoreCollectionRef.parent
                    && firestoreCollectionRef.parent.parent
                    && collectionRepository.parent.entity) {
                    return __1.Collection(collectionRepository.entity, __1.DocumentRef(firestoreCollectionRef.parent.id, collectionRepository.entity, buildCollectionTree(collectionRepository.parent.entity.prototype.constructor.name, firestoreCollectionRef.parent.parent)));
                }
            }
        };
        return __1.DocumentRef(firestoreDocRef.id, entity, buildCollectionTree(parentEntityName, firestoreParent));
    };
    if (isArray) {
        return value.map(deserializeValue);
    }
    else {
        return deserializeValue(value);
    }
};
/**
 * Converts a document reference into a human-readable format.
 * If the document ref's data has been fetched, include the data,
 * otherwise skip it.
 * @param isArray Is the field an array.
 * @param value Our document ref(s) to convert.
 */
var toData = function (isArray, value) {
    var valueToData = function (v) {
        if (v.isFetched() && v.cached !== null) {
            return v.cached.toData();
        }
    };
    if (isArray) {
        return value.map(valueToData).filter(function (v) { return Boolean(v); });
    }
    else {
        return valueToData(value);
    }
};
/**
 * Registers a document reference field.
 * @param docRefConfig The field configuration.
 */
function default_1(docRefConfig) {
    return function (target, key) {
        var type = Reflect.getMetadata('design:type', target, key);
        var field = FieldUtils_1.default.configure(docRefConfig, key, type(), types_1.FieldTypes.DocumentReference);
        field.entity = docRefConfig.entity;
        // Serialization Functions
        field.serialize = function (value) {
            return serialize(field.isArray, value);
        };
        field.deserialize = function (value) {
            return deserialize(field.isArray, field.entity, value);
        };
        field.toData = function (value) {
            return toData(field.isArray, value);
        };
        // Register the document reference field.
        var repository = store_1.getOrCreateRepository(target.constructor.name);
        repository.fields.set(key, field);
    };
}
exports.default = default_1;
;
