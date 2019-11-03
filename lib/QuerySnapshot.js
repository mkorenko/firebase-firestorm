"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
/**
 * A wrapper around the Firestore QuerySnapshot class.
 */
var QuerySnapshot = /** @class */ (function () {
    /**
     * Creates a query snapshot from firestore snapshot.
     * @param nativeSnapshot The native query snapshot.
     * @param Entity The entity to represention.
     * @param collection The collection for the entity.
     * @param query The query which was run.
     */
    function QuerySnapshot(nativeSnapshot, Entity, collection, query) {
        var _this = this;
        /**
         * Helper function to deserialize snapshot value.
         * @hidden
         */
        this.deserializeValue = function (nativeValue) {
            return utils_1.FirestoreSerializer.deserialize(nativeValue, _this._Entity, _this._collection);
        };
        this._Entity = Entity;
        this._collection = collection;
        this._nativeSnapshot = nativeSnapshot;
        this._docs = nativeSnapshot.docs.map(this.deserializeValue);
        this._query = query;
    }
    Object.defineProperty(QuerySnapshot.prototype, "docs", {
        /**
         * The docs in the snapshot.
         */
        get: function () { return this._docs; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuerySnapshot.prototype, "size", {
        /**
         * The number of docs in the snapshot.
         */
        get: function () { return this._nativeSnapshot.size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuerySnapshot.prototype, "empty", {
        /**
         * Whether or not the snapshot is empty.
         */
        get: function () { return this._nativeSnapshot.size === 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuerySnapshot.prototype, "metadata", {
        /**
         * The snapshot metadata.
         */
        get: function () { return this._nativeSnapshot.metadata; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuerySnapshot.prototype, "query", {
        /**
         * The query which resulted in the snapshot.
         */
        get: function () { return this._query; },
        enumerable: true,
        configurable: true
    });
    /**
     * Executes a callback function on the snapshot docs.
     * @param callback The function to run on each doc.
     */
    QuerySnapshot.prototype.forEach = function (callback) {
        this._docs.forEach(callback);
    };
    /**
     * Returns an array of the document changes since the last snapshot.
     * @param opts Options to control what type of changes to include in the results.
     */
    QuerySnapshot.prototype.docChanges = function (opts) {
        var _this = this;
        var changes = this._nativeSnapshot.docChanges(opts).map(function (change) {
            var doc = _this.deserializeValue(change.doc);
            return {
                doc: doc,
                newIndex: change.newIndex,
                oldIndex: change.oldIndex,
                type: change.type,
            };
        });
        return changes;
    };
    return QuerySnapshot;
}());
exports.default = QuerySnapshot;
