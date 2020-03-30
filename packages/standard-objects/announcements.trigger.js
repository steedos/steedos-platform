const _ = require("underscore");

const addNotifications = function (userId, doc, members) {
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
    let notificationDoc = {
        name: notificationTitle,
        body: doc.name,
        related_to: {
            o: "announcements",
            ids: [doc._id]
        },
        related_name: doc.name,
        from: userId,
        space: doc.space
    };
    Creator.addNotifications(notificationDoc, userId, members);
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