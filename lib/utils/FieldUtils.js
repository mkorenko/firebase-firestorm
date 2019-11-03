"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = __importDefault(require("../store"));
var types_1 = require("../types");
var _1 = require(".");
/**
 * Utility functions for fields.
 */
var FieldUtils = /** @class */ (function () {
    function FieldUtils() {
    }
    /**
     * Produces the metadata for a field based on the field configuration, and firestorm configuration.
     * @param fieldConfig The field configuration specified in the decorator.
     * @param property The name of the class field property.
     * @param type The type of the field.
     *
     * @returns The configured field.
     */
    FieldUtils.configure = function (fieldConfig, property, type, fieldType) {
        var config = store_1.default().config;
        var name = '';
        // Providing a field name in the config overrides an conversions.
        if (fieldConfig.name) {
            name = fieldConfig.name;
        }
        else {
            switch (config.fieldConversion) {
                case types_1.FieldConversionType.ToKebabCase:
                    name = _1.CaseConverter.camelToKebabCase(property);
                    break;
                case types_1.FieldConversionType.ToSnakeCase:
                    name = _1.CaseConverter.camelToSnakeCase(property);
                    break;
                case types_1.FieldConversionType.ToCamelCase:
                    name = _1.CaseConverter.toCamelCase(property);
                    break;
                default:
                    name = property;
                    break;
            }
        }
        return {
            name: name,
            type: fieldType,
            isArray: Array.isArray(type),
            deserialize: function () { return null; },
            serialize: function () { return null; },
            toData: function () { return null; },
        };
    };
    ;
    /**
     * Utility for running a processor function on a field value or array of values.
     * @param isArray Whether the field is configured to have array values.
     * @param fieldValue The value(s) for the field.
     * @param processSingle Process a single value.
     */
    FieldUtils.process = function (isArray, fieldValue, processSingle) {
        if (isArray) {
            return fieldValue.map(processSingle);
        }
        else {
            return processSingle(fieldValue);
        }
    };
    ;
    return FieldUtils;
}());
exports.default = FieldUtils;
