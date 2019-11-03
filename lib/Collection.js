"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = __importStar(require("./store"));
var types_1 = require("./types");
var utils_1 = require("./utils");
var DocumentRef_1 = __importDefault(require("./fields/DocumentRef"));
var Query_1 = __importDefault(require("./Query"));
/**
 * Firestorm representation of a collection reference.
 * @typeparam T The entity for the collection documents.
 * @typeparam P The entity for the collection parent.
 */
var Collection = /** @class */ (function () {
    /**
     * Create a collection reference from an [[Entity]] and optional parent.
     * @param E The entity class for the collections documents.
     * @param parent The parent document for the collection.
     */
    function Collection(E, parent) {
        this._Entity = E;
        this._parent = parent || null;
        this._path = this.buildPath();
        this._native = this.buildNative();
    }
    Object.defineProperty(Collection.prototype, "path", {
        /**
         * The path to this collection.
         */
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "parent", {
        /**
         * The parent document reference for the collection.
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "native", {
        /**
         * The native firestore collection reference.
         */
        get: function () {
            return this._native;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * Creates the path to the collection.
     */
    Collection.prototype.buildPath = function () {
        var collectionName = store_1.getRepository(this._Entity.prototype.constructor.name).collectionConfig.name;
        var p = "/" + collectionName;
        if (this._parent) {
            p = "" + this._parent.path + p;
        }
        return p;
    };
    /**
     * @hidden
     * Creates the native firestore reference.
     */
    Collection.prototype.buildNative = function () {
        var firestore = store_1.default().firestore;
        if (firestore) {
            return firestore.collection(this._path);
        }
        else {
            throw new Error('Undefined firestore');
        }
    };
    ;
    /**
     * Gets a document reference from the collection.
     * @param id The document ID.
     */
    Collection.prototype.doc = function (id) {
        return DocumentRef_1.default(id, this._Entity, this);
    };
    /**
     * Gets a document with a provided ID
     * @param id The ID of the document.
     *
     * @returns The entity.
     */
    Collection.prototype.get = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._native.doc(id).get().then(function (snapshot) {
                if (snapshot.exists) {
                    resolve(utils_1.FirestoreSerializer.deserialize(snapshot, _this._Entity, _this));
                }
                return resolve(null);
            });
        });
    };
    /**
     * Updates a document from an entity instance.
     * @param entity The entity (with ID) to update.
     *
     * @returns The updated entity.
     */
    Collection.prototype.update = function (entity) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!entity.id) {
                throw new Error("An ID must be provided when updating " + entity.constructor.name);
            }
            var _a = utils_1.FirestoreSerializer.serialize(entity, types_1.WriteTypes.Update), id = _a.id, data = __rest(_a, ["id"]);
            _this._native.doc(id).update(data).then(function () {
                _this.get(entity.id).then(function (updatedEntity) {
                    resolve(updatedEntity);
                });
            });
        });
    };
    ;
    /**
     * Creates a new document from an entity instance.
     * @param entity An instance of the entity.
     *
     * @returns The created entity.
     */
    Collection.prototype.create = function (entity) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a = utils_1.FirestoreSerializer.serialize(entity, types_1.WriteTypes.Create), id = _a.id, data = __rest(_a, ["id"]);
            if (id) {
                _this._native.doc(id).set(data).then(function () {
                    _this.get(id).then(function (snapshot) {
                        resolve(snapshot);
                    });
                });
            }
            else {
                _this._native.add(data).then(function (result) {
                    _this.get(result.id).then(function (snapshot) {
                        resolve(snapshot);
                    });
                });
            }
        });
    };
    ;
    /**
     * Finds a list of documents based on a criteria.
     * @param query The query parameters.
     * @deprecated since v1.1, use query() method to build queries instead.
     * @returns A list of entities matching the criteria.
     */
    Collection.prototype.find = function (query) {
        var _this = this;
        return new Promise(function (resolve) {
            var querySnapshotPromise;
            if (query) {
                var fields = store_1.getRepository(_this._Entity.prototype.constructor.name).fields;
                querySnapshotPromise = utils_1.QueryBuilder.query(_this, fields, query).get();
            }
            else {
                querySnapshotPromise = _this._native.get();
            }
            querySnapshotPromise.then(function (querySnapshot) {
                resolve(querySnapshot.docs.map(function (snapshot) {
                    return utils_1.FirestoreSerializer.deserialize(snapshot, _this._Entity, _this);
                }));
            });
        });
    };
    /**
     * Removes a document from the collection.
     * @param id The document ID to remove.
     */
    Collection.prototype.remove = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._native.doc(id).delete().then(function () {
                resolve();
            });
        });
    };
    /**
     * Entry point for building queries.
     */
    Collection.prototype.query = function () {
        return new Query_1.default(this._Entity, this, this._native);
    };
    return Collection;
}());
/**
 * Collection factory
 * @returns A collection reference.
 */
exports.default = (function (model, parent) { return new Collection(model, parent); });
