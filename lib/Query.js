"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QuerySnapshot_1 = __importDefault(require("./QuerySnapshot"));
var store_1 = require("./store");
/**
 * Firestorm representation of a query. Queries can be chained
 * together, as per the standard firestore SDK.
 * @typeparam T The entity for the query.
 */
var Query = /** @class */ (function () {
    /**
     * Create a collection query for an [[Entity]].
     * @param Entity T The entity to represent.
     * @param collection The collection to query.
     * @param fields The list of field for the collection.
     * @param native The native firestore query.
     */
    function Query(Entity, collection, native) {
        this._Entity = Entity;
        this._collection = collection;
        this._native = native;
    }
    /**
     * Gets field path string from property key or property path array
     * @param propertyOrPropPathArray
     */
    Query.prototype.getFieldPath = function (propertyOrPropPathArray) {
        var propPathArray = Array.isArray(propertyOrPropPathArray) ?
            propertyOrPropPathArray :
            [propertyOrPropPathArray];
        var propertyIdx = 0;
        var Entity = this._Entity;
        var paths = [];
        do {
            var fields = store_1.getRepository(Entity.prototype.constructor.name).fields;
            var property = propPathArray[propertyIdx];
            var field = fields.get(property);
            if (!field) {
                throw new Error("Could not find property in " + this._collection.path);
            }
            paths.push(field.name);
            propertyIdx++;
            Entity = field.entity;
        } while (propertyIdx < propPathArray.length);
        return paths.join('.');
    };
    /**
     * Applies a where filter to the query.
     * @param property The property to query.
     * @param op The operation to apply.
     * @param value The value to test for.
     */
    Query.prototype.where = function (propertyOrPropPathArray, op, value) {
        var fieldPath = this.getFieldPath(propertyOrPropPathArray);
        return this.appendNativeQuery(this._native.where(fieldPath, op, value));
    };
    /**
     * Applies an order by filter to the query.
     * @param property The property to order by.
     * @param sort The order direction. Default value is ascending.
     */
    Query.prototype.orderBy = function (propertyOrPropPathArray, sort) {
        var fieldPath = this.getFieldPath(propertyOrPropPathArray);
        return this.appendNativeQuery(this._native.orderBy(fieldPath, sort));
    };
    /**
     * Applies a limit filter to the query.
     * @param amount The maximum number of documents to return.
     */
    Query.prototype.limit = function (amount) {
        return this.appendNativeQuery(this._native.limit(amount));
    };
    /**
     * Applies a start at filter to the query.
     * @param fieldValues The field values to start this query at, in order of the query's order by.
     */
    Query.prototype.startAt = function () {
        var _a;
        var fieldValues = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fieldValues[_i] = arguments[_i];
        }
        return this.appendNativeQuery((_a = this._native).startAt.apply(_a, fieldValues));
    };
    /**
     * Applies a start after filter to the query.
     * @param fieldValues The field values to start this query after, in order of the query's order by.
     */
    Query.prototype.startAfter = function () {
        var _a;
        var fieldValues = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fieldValues[_i] = arguments[_i];
        }
        return this.appendNativeQuery((_a = this._native).startAfter.apply(_a, fieldValues));
    };
    /**
     * Applies an end at filter to the query.
     * @param fieldValues The field values to end this query at, in order of the query's order by.
     */
    Query.prototype.endAt = function () {
        var _a;
        var fieldValues = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fieldValues[_i] = arguments[_i];
        }
        return this.appendNativeQuery((_a = this._native).endAt.apply(_a, fieldValues));
    };
    /**
     * Applies an end before filter to the query.
     * @param fieldValues The field values to end this query before, in order of the query's order by.
     */
    Query.prototype.endBefore = function () {
        var _a;
        var fieldValues = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fieldValues[_i] = arguments[_i];
        }
        return this.appendNativeQuery((_a = this._native).endBefore.apply(_a, fieldValues));
    };
    /**
     * Attaches a listener to the query.
     * @param onNext Callback which is called when new snapshot is available.
     * @param onError Callback which is called when an error occurs.
     * @returns An unsubscribe function.
     */
    Query.prototype.onSnapshot = function (onNext, onError) {
        var _this = this;
        return this._native.onSnapshot(function (snapshot) { onNext(_this.buildSnapshot(snapshot)); }, onError);
    };
    Query.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._native.get().then(function (snapshot) {
                resolve(_this.buildSnapshot(snapshot));
            });
        });
    };
    /**
     * Appends a query to the current query.
     * @param query The query to append.
     */
    Query.prototype.appendNativeQuery = function (query) {
        return new Query(this._Entity, this._collection, query);
    };
    /**
     * Creates a firestorm snapshot from the firestore snapshot.
     * @param nativeSnapshot The native query document snapshot.
     */
    Query.prototype.buildSnapshot = function (nativeSnapshot) {
        return new QuerySnapshot_1.default(nativeSnapshot, this._Entity, this._collection, this);
    };
    return Query;
}());
exports.default = Query;
