Creator.Objects['accounts'].triggers = {
    "before.update.server.disableSpaceUsers": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (_.has(modifier.$set, 'is_partner') || _.has(modifier.$set, 'is_customer')) {
                if(Creator.isSpaceAdmin(doc.space, userId)){
                    throw new Error('not permission');
                }
            }
        }
    },
    "after.update.server.disableSpaceUsers": {
        on: "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (modifier.$set.is_partner === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch()
                db.space_users.direct.update({contact_id:{$in: _.pluck(contacts, '_id')}, is_partner: true, space: doc.space}, {$set: {user_accepted: false}}, {
                    multi: true
                });
            }

            if (modifier.$set.is_customer === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch()
                db.space_users.direct.update({contact_id:{$in: _.pluck(contacts, '_id')}, is_customer: true, space: doc.space}, {$set: {user_accepted: false}}, {
                    multi: true
                });
            }
        }
    }
}