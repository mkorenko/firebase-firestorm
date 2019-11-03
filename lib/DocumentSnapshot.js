"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var DocumentSnapshot = /** @class */ (function () {
    /**
     * Creates a document snapshot.
     * @param nativeSnapshot The firestore DocumentSnapshot.
     * @param Entity The entity to represent.
     * @param collection The parent collection for the entity.
     */
    function DocumentSnapshot(nativeSnapshot, Entity, collection) {
        this._nativeSnapshot = nativeSnapshot;
        this._doc = utils_1.FirestoreSerializer.deserialize(nativeSnapshot, Entity, collection);
    }
    Object.defineProperty(DocumentSnapshot.prototype, "doc", {
        /**
         * The document in the snapshot.
         */
        get: function () { return this._doc; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentSnapshot.prototype, "exists", {
        /**
         * Whether or not the document exists.
         */
        get: function () { return this._nativeSnapshot.exists; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentSnapshot.prototype, "ref", {
        /**
         * The document reference.
         */
        get: function () { return this._doc.ref; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentSnapshot.prototype, "metadata", {
        /**
         * The metadata for the reference.
         */
        get: function () { return this._nativeSnapshot.metadata; },
        enumerable: true,
        configurable: true
    });
    return DocumentSnapshot;
}());
exports.default = DocumentSnapshot;
