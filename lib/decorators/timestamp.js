"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("../firestore");
var types_1 = require("../types");
var FieldUtils_1 = __importDefault(require("../utils/FieldUtils"));
var store_1 = require("../store");
var fields_1 = require("../fields");
/**
 * Serializes our representation of a timestamp to firestores.
 * @param isArray Is the field an array.
 * @param updateOnWrite Should the value be auto-updated on creation & updates.
 * @param updateOnCreate Should the value be auto-updated on creation.
 * @param updateOnUpdate Should the value be auto-updated on updates.
 * @param writeType Whether the write is a create or update.
 * @param value A manual value to provide.
 */
var serialize = function (isArray, updateOnWrite, updateOnCreate, updateOnUpdate, writeType, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) {
        var isAutoWriteCondition = writeType === types_1.WriteTypes.Create && (updateOnWrite || updateOnCreate);
        var isAutoUpdateConfition = writeType === types_1.WriteTypes.Update && (updateOnWrite || updateOnUpdate);
        if (isAutoWriteCondition || isAutoUpdateConfition) {
            return firestore_1.firestore.FieldValue.serverTimestamp();
        }
        else if (v && v.native) {
            return v.native;
        }
        else {
            return undefined;
        }
    });
};
/**
 * Deserializes a firestore timestamp into a firestorm timestamp.
 * @param isArray Is the field an array.
 * @param value The firestore timestamp to deserialize.
 */
var deserialize = function (isArray, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) {
        return new fields_1.Timestamp(v.seconds, v.nanoseconds);
    });
};
/**
 * Converts a firestorm timestamp into a string representation.
 * @param isArray Is the field an array.
 * @param format A custom formatter for the date value.
 * @param value A firestorm timestamp.
 */
var toData = function (isArray, format, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) { return format(v.toDate()); });
};
function default_1(fieldConfig) {
    return function (target, key) {
        var _fieldConfig = fieldConfig || {};
        // Configure the field.
        var type = Reflect.getMetadata('design:type', target, key);
        var field = FieldUtils_1.default.configure(_fieldConfig, key, type(), types_1.FieldTypes.Timestamp);
        field.updateOnWrite = _fieldConfig.updateOnWrite || false;
        field.updateOnCreate = _fieldConfig.updateOnCreate || false;
        field.updateOnUpdate = _fieldConfig.updateOnUpdate || false;
        field.format = _fieldConfig.format || (function (date) { return date.toLocaleString(); });
        field.deserialize = function (value) {
            return deserialize(field.isArray, value);
        };
        // Serialization Functions.
        field.serialize = function (value, writeType) {
            return serialize(field.isArray, field.updateOnWrite, field.updateOnCreate, field.updateOnUpdate, writeType, value);
        };
        field.toData = function (value) {
            return toData(field.isArray, field.format, value);
        };
        // Register the timestamp field.
        var repository = store_1.getOrCreateRepository(target.constructor.name);
        repository.fields.set(key, field);
    };
}
exports.default = default_1;
;
