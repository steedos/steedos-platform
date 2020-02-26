const _ = require("underscore");

const addNotifications = function (userId, doc, members) {
    // members = _.difference(members, [userId]);
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
            o: "announcements",
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
        console.error("公告通知数据插入失败，错误信息：", error);
    });
}

const removeNotifications = function (doc, members) {
    const collection = Creator.getCollection("notifications");
    let bulk = collection.rawCollection().initializeUnorderedBulkOp();
    members.forEach(function (member) {
        bulk.find({
            "related_to.o": "announcements",
            "related_to.ids": doc._id,
            owner: member
        }).remove();
    });
    return bulk.execute().catch(function (error) {
        console.error("公告通知数据删除失败，错误信息：", error);
    });
}

module.exports = {
    listenTo: 'announcements',
    afterInsert: async function () {
        const doc = this.doc;
        const userId = this.userId;
        const members = doc.members;
        if (members && members.length) {
            addNotifications(userId, doc, members);
        }
    }
}