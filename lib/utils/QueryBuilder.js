"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility functions to build firestore-compatiable queries.
 */
var QueryBuilder = /** @class */ (function () {
    function QueryBuilder() {
    }
    /**
     * Converts a firestom query into a firestore query.
     * @param collectionRef The native firestore collection reference.
     * @param query The firestorm query
     */
    QueryBuilder.query = function (collection, fields, query) {
        var collectionRef = collection.native;
        var whereQueries = query.where, orderByQueries = query.orderBy, startAfterQuery = query.startAfter, startAtQuery = query.startAt, endAtQuery = query.endAt, endBeforeQuery = query.endBefore, limitQuery = query.limit;
        var q = (whereQueries || []).reduce(function (accum, curr) {
            var property = curr[0], operator = curr[1], value = curr[2];
            var field = fields.get(property);
            if (field) {
                return accum.where(field.name, operator, value);
            }
            throw new Error("Could not find property " + property + " in collection " + collection.path);
        }, collectionRef);
        if (orderByQueries) {
            orderByQueries.forEach(function (obq) {
                q = q.orderBy(obq[0], obq[1] || 'asc');
            });
            if (startAtQuery || startAfterQuery) {
                var addedStartAt = false;
                if (startAtQuery) {
                    addedStartAt = true;
                    q = q.startAt(startAtQuery);
                }
                if (startAfterQuery && !addedStartAt) {
                    q = q.startAfter(startAfterQuery);
                }
            }
            if (endAtQuery || endBeforeQuery) {
                var addedEndAt = false;
                if (endAtQuery) {
                    addedEndAt = true;
                    q = q.endAt(endAtQuery);
                }
                if (endBeforeQuery && !addedEndAt) {
                    q = q.endBefore(endBeforeQuery);
                }
            }
        }
        if (limitQuery) {
            q = q.limit(limitQuery);
        }
        return q;
    };
    return QueryBuilder;
}());
exports.default = QueryBuilder;
