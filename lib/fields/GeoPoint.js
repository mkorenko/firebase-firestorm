"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("../firestore");
/**
 * Wrapper for firestore geopoint class, mainly used to keep
 * imports clean when using the library.
 */
var GeoPoint = /** @class */ (function () {
    function GeoPoint(latitude, longitude) {
        this._native = new firestore_1.firestore.GeoPoint(latitude, longitude);
    }
    Object.defineProperty(GeoPoint.prototype, "native", {
        get: function () {
            return this._native;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoPoint.prototype, "latitude", {
        get: function () {
            return this._native.latitude;
        },
        set: function (value) {
            this._native = new firestore_1.firestore.GeoPoint(value, this.longitude);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoPoint.prototype, "longitude", {
        get: function () {
            return this._native.longitude;
        },
        set: function (value) {
            this._native = new firestore_1.firestore.GeoPoint(this.latitude, value);
        },
        enumerable: true,
        configurable: true
    });
    GeoPoint.prototype.isEqual = function (other) {
        return this._native.isEqual(other.native);
    };
    return GeoPoint;
}());
exports.default = GeoPoint;
