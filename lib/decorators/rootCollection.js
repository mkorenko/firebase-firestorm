"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../store");
/**
 * Registers a collection with firestorm.
 * @param config The configuration for the collection.
 */
exports.default = (function (config) {
    return function (target) {
        var repository = store_1.getOrCreateRepository(target.prototype.constructor.name);
        repository.collectionConfig = config;
        repository.entity = target.prototype.constructor;
    };
});
