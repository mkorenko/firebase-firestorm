"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var store = {
    repositories: new Map(),
    config: {
        fieldConversion: types_1.FieldConversionType.NoConversion,
    }
};
/**
 * Initializes firestorm with an instance of firestore.
 * @param firestore A firestore instance.
 * @param config Configuration options for firestorm.
 */
exports.initialize = function (firestore, config) {
    store.firestore = firestore;
    if (config) {
        Object.keys(config).forEach(function (key) {
            store.config[key] = config[key];
        });
    }
};
/**
 * Resets the store
 */
exports.destroy = function () {
    store = {
        repositories: store.repositories,
        firestore: undefined,
        config: {
            fieldConversion: types_1.FieldConversionType.NoConversion,
        },
    };
};
/**
 * Gets a repository with a given name
 * @param key The name of the [[Entity]] class
 */
exports.getRepository = function (key) {
    if (store.repositories.has(key)) {
        return store.repositories.get(key);
    }
    throw new Error("Repository " + key + " is not defined");
};
/**
 * Creates a repository with a given name if it doesn't
 * exist, and returns the repository.
 * @param key The name of the [[Entity]] class
 */
exports.getOrCreateRepository = function (key) {
    if (!store.repositories.has(key)) {
        store.repositories.set(key, {
            collectionConfig: {},
            fields: new Map(),
            subcollections: new Map(),
        });
    }
    return exports.getRepository(key);
};
exports.default = (function () { return store; });
