const core = require('@steedos/core');
db.steedos_keyvalues = core.newCollection('steedos_keyvalues');

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