"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Collection_1 = __importDefault(require("../Collection"));
var store_1 = require("../store");
var DocumentSnapshot_1 = __importDefault(require("../DocumentSnapshot"));
/**
 * Representation of a Document Reference
 * @typeparam T The entity for the document reference.
 */
var DocumentRef = /** @class */ (function () {
    /**
     * Create a document reference using a document ID,
     * entity and parent collection.
     * @param id The document ID.
     * @param model The entity class for the document.
     * @param parent The parent collection.
     */
    function DocumentRef(id, model, parent) {
        this._id = id;
        this._cachedDocument = null;
        this._model = model;
        this._parent = parent;
        this._path = this.buildPath();
        this._native = this.buildNative();
    }
    Object.defineProperty(DocumentRef.prototype, "id", {
        /**
         * Get the document ID.
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentRef.prototype, "cached", {
        /**
         * Get the cached document data.
         */
        get: function () {
            if (!this._cachedDocument) {
                throw new Error('Can not fetch cached document reference, call get() first.');
            }
            return this._cachedDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentRef.prototype, "path", {
        /**
         * Get the path to the document.
         */
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentRef.prototype, "parent", {
        /**
         * Get the parent collection.
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentRef.prototype, "native", {
        /**
         * Get the firestore document reference.
         */
        get: function () {
            return this._native;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Append the document ID to the path.
     */
    DocumentRef.prototype.buildPath = function () {
        return this._parent.path + "/" + this._id;
    };
    /**
     * Get the firestore document reference from the path.
     */
    DocumentRef.prototype.buildNative = function () {
        return this._parent.native.doc(this._id);
    };
    /**
     * Gets the data from the document reference.
     */
    DocumentRef.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this._cachedDocument === null) {
                _this._native.get().then(function (snapshot) {
                    _this._cachedDocument = utils_1.FirestoreSerializer.deserialize(snapshot, _this._model, _this.parent);
                    resolve(_this._cachedDocument);
                });
            }
            else {
                resolve(_this._cachedDocument);
            }
        });
    };
    /**
     * Returns whether we have already fetched the document data.
     */
    DocumentRef.prototype.isFetched = function () {
        return this._cachedDocument !== null;
    };
    /**
     * Get a subcollection for a document.
     * @param collectionModel The entity for the collection.
     */
    DocumentRef.prototype.collection = function (collectionModel) {
        var childRepository = store_1.getRepository(collectionModel.prototype.constructor.name);
        var currentSubcollections = store_1.getRepository(this._model.prototype.constructor.name).subcollections;
        var collectionExists = currentSubcollections.has(childRepository.collectionConfig.name);
        if (collectionExists) {
            return Collection_1.default(collectionModel, this);
        }
        throw new Error("Could not find collection " + collectionModel.prototype.constructor.name + " in parent " + this._model.prototype.constructor.name);
    };
    /**
     * Attaches a listener for snapshot events for the document
     * @param onNext Callback which is called when a new snapshot is available.
     * @param onError Callback which is called when listen fails.
     * @returns The unsubscribe function for the listener.
     */
    DocumentRef.prototype.onSnapshot = function (onNext, onError) {
        var _this = this;
        return this._native.onSnapshot(function (snapshot) {
            onNext(_this.buildSnapshot(snapshot));
        }, onError);
    };
    /**
     * Creates a firestorm snapshot from the firestore snapshot.
     * @param nativeSnapshot The native query document snapshot.
     */
    DocumentRef.prototype.buildSnapshot = function (nativeSnapshot) {
        return new DocumentSnapshot_1.default(nativeSnapshot, this._model, this._parent);
    };
    return DocumentRef;
}());
/**
 * DocumentRef Factory
 */
exports.default = (function (id, model, parent) { return new DocumentRef(id, model, parent); });
