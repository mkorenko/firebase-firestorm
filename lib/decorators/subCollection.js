"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("../store");
/**
 * Registers a subcollection with firestorm.
 * @param config The subcollection configuration.
 */
exports.default = (function (config) {
    return function (target) {
        // Get the parent based on the Entity class.
        var parentRepository = store_1.getOrCreateRepository(target.constructor.name);
        var entity = config.entity, name = config.name;
        // Create a repository for the subcollection and register it as a child
        // of the parent.
        var repository = store_1.getOrCreateRepository(entity.prototype.constructor.name);
        repository.collectionConfig = { entity: entity, name: name };
        repository.parent = parentRepository;
        repository.entity = entity;
        parentRepository.subcollections.set(name, repository);
    };
});
