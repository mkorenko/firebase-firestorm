"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("./store");
/**
 * Represention of a document in a collection.
 */
var Entity = /** @class */ (function () {
    function Entity() {
    }
    /**
     * Converts an entity into a human-readable format.
     */
    Entity.prototype.toData = function () {
        var _this = this;
        var fields = store_1.getRepository(this.constructor.name).fields;
        var result = {};
        result.id = this.id;
        fields.forEach(function (fieldConfig, key) {
            var k = key;
            result[key] = fieldConfig.toData(_this[k]);
        });
        Object.keys(result).forEach(function (key) {
            result[key] === undefined ? delete result[key] : '';
        });
        return result;
    };
    return Entity;
}());
exports.default = Entity;
