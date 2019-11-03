"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var FieldUtils_1 = __importDefault(require("../utils/FieldUtils"));
var store_1 = require("../store");
function default_1(fieldConfig) {
    return function (target, key) {
        var type = Reflect.getMetadata('design:type', target, key);
        var field = FieldUtils_1.default.configure(fieldConfig || {}, key, type(), types_1.FieldTypes.Standard);
        field.serialize = function (value) { return value; };
        field.deserialize = function (value) { return value; };
        field.toData = function (value) { return value; };
        var repository = store_1.getOrCreateRepository(target.constructor.name);
        repository.fields.set(key, field);
    };
}
exports.default = default_1;
;
