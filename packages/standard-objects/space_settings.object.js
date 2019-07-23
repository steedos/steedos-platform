db.space_settings = new Meteor.Collection('space_settings');

db.space_settings._simpleSchema = new SimpleSchema({
    space: {
        type: String
    },
    key: {
        type: String
    },
    value: {
        type: Object,
        blackbox: true
    },
    is_public: {
        type: Boolean
    }
});

if (Meteor.isServer) {
    db.space_settings.before.insert(function (userId, doc) {
        if (!doc.space) {
            throw new Meteor.Error(400, "space_settings_error_space_isRequired");
        }
        if (!_.isBoolean(doc.is_public)) {
            throw new Meteor.Error(400, "space_settings_error_public_isRequired");
        }
    });
    Meteor.publish('space_settings', function (spaceId) {
        var selector;
        if (!this.userId) {
            return this.ready();
        }
        if (!spaceId) {
            return this.ready();
        }
        selector = {
            space: spaceId,
            is_public: true
        };
        return db.space_settings.find(selector);
    });
    Meteor.methods({
        'set_space_settings': function (spaceId, key, values, is_public) {
            var space, space_user;
            if (!this.userId) {
                throw new Meteor.Error(400, "space_settings_error_no_permission");
            }
            space_user = db.space_users.findOne({
                space: spaceId,
                user: this.userId
            });
            space = db.spaces.findOne({
                _id: spaceId
            });
            if (!space_user || !space || space.admins.indexOf(this.userId) < 0) {
                throw new Meteor.Error(400, "space_settings_error_no_permission");
            }
            return db.space_settings.upsert({
                space: spaceId,
                key: key
            }, {
                    space: spaceId,
                    key: key,
                    values: values,
                    is_public: is_public
                });
        }
    });
}