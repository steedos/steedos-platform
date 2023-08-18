const _ = require("underscore");
const objectql = require("@steedos/objectql");

const addNotifications = async function (userId, doc, members) {
    members = _.difference(members, [userId]);
    if (!members.length) {
        return;
    }
    const fromUser = await objectql.getObject('users').findOne(userId, {fields: ['name']})
    const notificationTitle = fromUser.name;
    let notificationDoc = {
        name: doc.name,
        body: notificationTitle,
        related_to: {
            o: "cms_posts",
            ids: [doc._id]
        },
        related_name: doc.name,
        from: userId,
        space: doc.space
    };
    await objectql.getSteedosSchema().broker.call('notifications.add', {
        message: notificationDoc,
        from: userId,
        to: members
    })
}

const removeNotifications = async function(doc, members){
    await objectql.getSteedosSchema().broker.call('notifications.remove', {
        doc,
        assignees: members,
        objectName: "cms_posts"
    })
}

const getPostMembers = async function (doc, isModifierSet) {
    var members, organizations, users;
    organizations = doc.members && doc.members.organizations;
    users = doc.members && doc.members.users;
    members = [];
    if (organizations != null ? organizations.length : void 0 || users != null ? users.length : void 0) {
        if (users != null ? users.length : void 0) {
            members = users;
        }
        if (organizations != null ? organizations.length : void 0) {
            for (const orgId of organizations) {
                const organizationUsers = await objectql.getSteedosSchema().broker.call('organizations.calculateUsers', {orgId: orgId, isIncludeParents: true})
                members = members.concat(organizationUsers);
            }
        }
    }
    return _.uniq(members);
};

module.exports = {
    listenTo: 'cms_posts',
    afterInsert: async function () {
        const doc = this.doc;
        const userId = this.userId;
        if(doc.site){
            var site = db.cms_sites.findOne({_id: doc.site}, {fields:{enable_post_permissions:1}})
            if(site && site.enable_post_permissions){
                // 站点启用文章级权限时发送通知
                const members = await getPostMembers(doc);
                if (members && members.length) {
                    addNotifications(userId, doc, members);
                }
            }
        }
    },
    afterUpdate: async function () {
        const previousDoc = this.previousDoc;
        // 因为afterUpdate中没有this.doc._id，所以把this.id集成过去，考虑到单字段编辑把previousDoc也集成过去
        let doc = Object.assign({}, previousDoc, this.doc, {_id: this.id});
        const userId = this.userId;

        if(doc.site){
            var site = db.cms_sites.findOne({_id: doc.site}, {fields:{enable_post_permissions:1}})
            if(site && site.enable_post_permissions){
                // 站点启用文章级权限时发送通知
                let oldMembers = await getPostMembers(previousDoc);
                let newMembers = await getPostMembers(doc, true);
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
    },
    afterDelete: async function () {
        // 因为afterDelete中没有this.doc，所以用this.previousDoc
        const doc = this.previousDoc;
        if(doc.site){
            var site = db.cms_sites.findOne({_id: doc.site}, {fields:{enable_post_permissions:1}})
            if(site && site.enable_post_permissions){
                // 站点启用文章级权限时移除通知
                const members = await getPostMembers(doc);
                if (members && members.length) {
                    removeNotifications(doc, members);
                }
            }
        }
    }
}