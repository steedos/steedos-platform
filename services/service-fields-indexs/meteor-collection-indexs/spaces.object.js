
if (Meteor.isServer) {
    db.spaces._ensureIndex({
        "is_paid": 1
    }, {
        background: true
    });
    db.spaces._ensureIndex({
        "name": 1,
        "is_paid": 1
    }, {
        background: true
    });
    db.spaces._ensureIndex({
        "_id": 1,
        "created": 1
    }, {
        background: true
    });
    db.spaces._ensureIndex({
        "_id": 1,
        "created": 1,
        "modified": 1
    }, {
        background: true
    });
}
