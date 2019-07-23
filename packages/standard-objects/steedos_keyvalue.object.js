db.steedos_keyvalues = new Meteor.Collection('steedos_keyvalues');

db.steedos_keyvalues._simpleSchema = new SimpleSchema({
    space: {
        type: String
    },
    user: {
        type: String
    },
    key: {
        type: String
    },
    value: {
        type: Object,
        blackbox: true
    }
});

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

if (Meteor.isServer) {
    Meteor.publish('steedos_keyvalues', function () {
        var selector;
        if (!this.userId) {
            return this.ready();
        }
        selector = {
            user: this.userId
        };
        return db.steedos_keyvalues.find(selector);
    });
}