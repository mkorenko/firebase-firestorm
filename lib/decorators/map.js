"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var FieldUtils_1 = __importDefault(require("../utils/FieldUtils"));
var store_1 = require("../store");
/**
 * Deserializes an object to a firestorm object.
 * @param isArray Is the field an array.
 * @param value The registered fields of the object.
 * @param field The fields for the object.
 */
var deserialize = function (isArray, value, fields, Entity) {
    return FieldUtils_1.default.process(isArray, value, function (v) {
        var result = new Entity();
        fields.forEach(function (value, key) {
            if (v[value.name]) {
                result[key] = value.deserialize(v[value.name]);
            }
        });
        return result;
    });
};
/**
 * Serializes an firestorm object into a firestore object;
 * @param isArray Whether the field is an array.
 * @param value The firestorm object.
 * @param fields The registered fields of the object.
 * @param writeType Whether it is a create or update operation.
 */
var serialize = function (isArray, value, fields, writeType) {
    return FieldUtils_1.default.process(isArray, value, function (v) {
        var result = {};
        fields.forEach(function (value, key) {
            if (v[key] || value.type === types_1.FieldTypes.Timestamp) {
                result[value.name] = value.serialize(v[key], writeType);
                if (!result[value.name])
                    delete result[value.name];
            }
        });
        return result;
    });
};
/**
 * Converts our object to human-readable format.
 * @param isArray Whether the field is an aray
 * @param value The firestorm geopoint(s) representation.
 * @param fields The registered fields of the object.
 */
var toData = function (isArray, value, fields) {
    return FieldUtils_1.default.process(isArray, value, function (v) {
        var result = {};
        fields.forEach(function (fieldConfig, key) {
            result[key] = fieldConfig.toData(v[key]);
        });
        Object.keys(result).forEach(function (key) {
            result[key] === undefined ? delete result[key] : '';
        });
        return result;
    });
};
/**
 * Registers a new map with firestorm.
 * @param fieldConfig The field configuration
 */
function default_1(fieldConfig) {
    if (fieldConfig === void 0) { fieldConfig = {}; }
    return function (target, key) {
        var type = Reflect.getMetadata('design:type', target, key);
        var field = FieldUtils_1.default.configure(fieldConfig, key, new type(), types_1.FieldTypes.Map);
        if (field.isArray && !fieldConfig.entity) {
            throw new Error("Map arrays must be provided with an entity in " + target + "[" + key + "]");
        }
        field.entity = fieldConfig.entity || type;
        var repository = store_1.getOrCreateRepository(target.constructor.name);
        repository.fields.set(key, field);
        var childRepository = store_1.getOrCreateRepository(field.entity.prototype.constructor.name);
        childRepository.parent = repository;
        field.serialize = function (value, writeType) {
            return serialize(field.isArray, value, childRepository.fields, writeType);
        };
        field.deserialize = function (value) {
            return deserialize(field.isArray, value, childRepository.fields, field.entity);
        };
        field.toData = function (value) {
            return toData(field.isArray, value, childRepository.fields);
        };
    };
}
exports.default = default_1;
;
