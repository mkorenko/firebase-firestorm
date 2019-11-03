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
 * Deserializes a firestore geopoint into a firestorm geopoint.
 * @param isArray Is the field an array.
 * @param value The firestore geopoint(s) representation.
 */
var deserialize = function (isArray, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) { return new __1.GeoPoint(v.latitude, v.longitude); });
};
/**
 * Serializes our representation of a geopoint into a firestorm geopoint;
 * @param isArray Whether the field is an array.
 * @param value The firestorm geopoint(s) representation.
 */
var serialize = function (isArray, value) {
    return FieldUtils_1.default.process(isArray, value, function (v) { return v.native; });
};
/**
 * Converts our firestorm representation of geopoint to human-readable format.
 * @param isArray Whether the field is an aray
 * @param value The firestorm geopoint(s) representation.
 */
var toData = function (isArray, value) { return FieldUtils_1.default.process(isArray, value, function (v) { return ({
    latitude: v.latitude,
    longitude: v.longitude,
}); }); };
/**
 * Registers a geopoint field.
 * @param fieldConfig The field configuration for the geopoint.
 */
function default_1(fieldConfig) {
    return function (target, key) {
        var type = Reflect.getMetadata('design:type', target, key);
        // Process the field configuration.
        var field = FieldUtils_1.default.configure(fieldConfig || {}, key, type(), types_1.FieldTypes.GeoPoint);
        // Serialization Functions
        field.deserialize = function (value) { return deserialize(field.isArray, value); };
        field.serialize = function (value) { return serialize(field.isArray, value); };
        field.toData = function (value) { return toData(field.isArray, value); };
        // Register the field for the parent entity.
        var repository = store_1.getOrCreateRepository(target.constructor.name);
        repository.fields.set(key, field);
    };
}
exports.default = default_1;
;
