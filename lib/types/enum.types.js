"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldConversionType;
(function (FieldConversionType) {
    FieldConversionType["ToCamelCase"] = "toCamelCase";
    FieldConversionType["ToSnakeCase"] = "toSnakeCase";
    FieldConversionType["ToKebabCase"] = "toKebabCase";
    FieldConversionType["NoConversion"] = "noConversion";
})(FieldConversionType = exports.FieldConversionType || (exports.FieldConversionType = {}));
;
var FieldTypes;
(function (FieldTypes) {
    FieldTypes["Standard"] = "standard";
    FieldTypes["Map"] = "map";
    FieldTypes["DocumentReference"] = "documentReference";
    FieldTypes["Timestamp"] = "timestamp";
    FieldTypes["GeoPoint"] = "geoPoint";
})(FieldTypes = exports.FieldTypes || (exports.FieldTypes = {}));
;
var WriteTypes;
(function (WriteTypes) {
    WriteTypes[WriteTypes["Create"] = 0] = "Create";
    WriteTypes[WriteTypes["Update"] = 1] = "Update";
})(WriteTypes = exports.WriteTypes || (exports.WriteTypes = {}));
;
