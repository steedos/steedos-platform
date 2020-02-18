const _ = require("underscore");

const addNotifications = function (userId, doc, members) {
    members = _.difference(members, [userId]);
    if (!members.length) {
        return;
    }
    const fromUser = Creator.getCollection("users").findOne({
        _id: userId
    }, {
            fields: {
                name: 1
            }
        });
    const notificationTitle = fromUser.name;
    const now = new Date();
    let notificationDoc = {
        name: notificationTitle,
        body: doc.name,
        related_to: {
            o: "cms_posts",
            ids: [doc._id]
        },
        related_name: doc.name,
        from: userId,
        space: doc.space,
        created: now,
        modified: now,
        created_by: userId,
        modified_by: userId
    };
    const collection = Creator.getCollection("notifications");
    let bulk = collection.rawCollection().initializeUnorderedBulkOp();
    members.forEach(function (member) {
        let bulkDoc = _.clone(notificationDoc);
        bulkDoc._id = collection._makeNewID();
        bulkDoc.owner = member;
        return bulk.insert(bulkDoc);
    });
    return bulk.execute().catch(function (error) {
        console.error("文章通知数据插入失败，错误信息：", error);
    });
}

const removeNotifications = function (doc, members) {
    const collection = Creator.getCollection("notifications");
    let bulk = collection.rawCollection().initializeUnorderedBulkOp();
    members.forEach(function (member) {
        bulk.find({
            "related_to.o": "cms_posts",
            "related_to.ids": doc._id,
            owner: member
        }).remove();
    });
    return bulk.execute().catch(function (error) {
        console.error("文章通知数据删除失败，错误信息：", error);
    });
}

const getPostMembers = function (doc, isModifierSet) {
    var members, organizations, users;
    organizations = doc.members && doc.members.organizations;
    users = doc.members && doc.members.users;
    members = [];
    if (organizations != null ? organizations.length : void 0 || users != null ? users.length : void 0) {
        if (users != null ? users.length : void 0) {
            members = users;
        }
        if (organizations != null ? organizations.length : void 0) {
            db.organizations.find({
                _id: {
                    $in: organizations
                }
            }, {
                    fields: {
                        _id: 1
                    }
                }).forEach(function (organizationItem) {
                    var organizationUsers;
                    organizationUsers = organizationItem.calculateUsers(true);
                    members = members.concat(organizationUsers);
                });
        }
    }
    return _.uniq(members);
};

module.exports = {

    listenTo: 'cms_posts',

    afterInsert: async function (userId, doc) {
        const members = getPostMembers(doc);
        if (members && members.length) {
            addNotifications(userId, doc, members);
        }
    },
    beforeUpdate: async function (userId, doc, fieldNames, modifier, options) {
        let oldMembers = getPostMembers(doc);
        let newMembers = getPostMembers(modifier.$set, true);
        let addMembers = _.difference(newMembers, oldMembers);
        let subMembers = _.difference(oldMembers, newMembers);
        if (addMembers.length) {
            addNotifications(userId, doc, addMembers);
        }
        if (subMembers.length) {
            removeNotifications(doc, subMembers);
        }
    }
}