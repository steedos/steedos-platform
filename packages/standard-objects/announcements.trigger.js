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
        name: doc.name,
        body: notificationTitle,
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

const removeNotifications = function(doc, members){
    Creator.removeNotifications(doc, members, "announcements");
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
    },
    afterUpdate: async function () {
        const previousDoc = this.previousDoc;
        // 因为afterUpdate中没有this.doc._id，所以把this.id集成过去
        let doc = Object.assign({}, this.doc, {_id: this.id});
        const userId = this.userId;

        if(doc.members){
            // 编辑单个非members字段时，doc.members为空
            let oldMembers = previousDoc.members || [];
            let newMembers = doc.members || [];
            let addMembers = _.difference(newMembers, oldMembers);
            let subMembers = _.difference(oldMembers, newMembers);
            doc = Object.assign({}, previousDoc, doc);//编辑单个字段时，space,name,body等字段都可以为空，需要从previousDoc中集成过来
            if (addMembers.length) {
                addNotifications(userId, doc, addMembers);
            }
            if (subMembers.length) {
                removeNotifications(doc, subMembers);
            }
        }
    },
    afterDelete: async function () {
        // 因为afterDelete中没有this.doc，所以用this.previousDoc
        const doc = this.previousDoc;
        let members = doc.members;
        if(members && members.length){
            removeNotifications(doc, members);
        }
    }
}