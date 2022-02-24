
if (Meteor.isServer) {
    db.steedos_keyvalues._ensureIndex({
        "space": 1
    }, {
        background: true
    });
    db.steedos_keyvalues._ensureIndex({
        "user": 1
    }, {
        background: true
    });
    db.steedos_keyvalues._ensureIndex({
        "key": 1
    }, {
        background: true
    });
    db.steedos_keyvalues._ensureIndex({
        "user": 1,
        "space": 1,
        "key": 1
    }, {
        background: true
    });
}