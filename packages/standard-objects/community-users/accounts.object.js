Creator.Objects['accounts'].triggers = {
    "before.update.server.disableSpaceUsers": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (_.has(modifier.$set, 'is_supplier') || _.has(modifier.$set, 'is_customer')) {
                if(!Creator.isSpaceAdmin(doc.space, userId)){
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
            if (modifier.$set.is_supplier === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch();
                var contactIds = _.uniq(_.compact(_.pluck(contacts, '_id')));
                var supplierContactIds = _.uniq(_.compact(_.pluck(db.space_users.direct.find({contact_id:{$in: contactIds}, is_supplier: true, space: doc.space}).fetch(), 'contact_id')));
                Creator.getCollection("contacts").direct.update({_id:{$in: supplierContactIds}}, {$unset: {user: 1}}, {
                    multi: true
                });
                db.space_users.direct.update({contact_id:{$in: contactIds}, is_supplier: true, space: doc.space}, {$set: {user_accepted: false}, $unset: {contact_id: 1}}, {
                    multi: true
                });
            }

            if (modifier.$set.is_customer === false) {
                var contacts = Creator.getCollection("contacts").find({account: doc._id, space: doc.space, user: {$exists: true}}, {fields: {_id:1}}).fetch();
                var contactIds = _.uniq(_.compact(_.pluck(contacts, '_id')));
                var customerContactIds = _.uniq(_.compact(_.pluck(db.space_users.direct.find({contact_id:{$in: contactIds}, is_customer: true, space: doc.space}).fetch(), 'contact_id')));
                Creator.getCollection("contacts").direct.update({_id:{$in: customerContactIds}}, {$unset: {user: 1}}, {
                    multi: true
                });
                db.space_users.direct.update({contact_id:{$in: contactIds}, is_customer: true, space: doc.space}, {$set: {user_accepted: false}, $unset: {contact_id: 1}}, {
                    multi: true
                });
            }
        }
    }
}