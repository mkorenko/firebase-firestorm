"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("../firestore");
/**
 * Wrapper for firestore server timestamp, mainly used to keep
 * imports clean when using the library.
 */
var Timestamp = /** @class */ (function () {
    function Timestamp(seconds, nanoseconds) {
        this._native = new firestore_1.firestore.Timestamp(seconds, nanoseconds);
    }
    Timestamp.fromDate = function (date) {
        var native = firestore_1.firestore.Timestamp.fromDate(date);
        return new Timestamp(native.seconds, native.nanoseconds);
    };
    Timestamp.fromMillis = function (millis) {
        var native = firestore_1.firestore.Timestamp.fromMillis(millis);
        return new Timestamp(native.seconds, native.nanoseconds);
    };
    Object.defineProperty(Timestamp.prototype, "native", {
        get: function () {
            return this._native;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timestamp.prototype, "nanoseconds", {
        get: function () {
            return this._native.nanoseconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timestamp.prototype, "seconds", {
        get: function () {
            return this._native.seconds;
        },
        enumerable: true,
        configurable: true
    });
    Timestamp.prototype.toDate = function () {
        return this._native.toDate();
    };
    Timestamp.prototype.toMillis = function () {
        return this._native.toMillis();
    };
    Timestamp.prototype.isEqual = function (other) {
        return this._native.isEqual(other.native);
    };
    return Timestamp;
}());
exports.default = Timestamp;
