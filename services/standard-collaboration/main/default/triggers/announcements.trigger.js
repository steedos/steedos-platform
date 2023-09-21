const _ = require("underscore");
const auth = require('@steedos/auth');
var steedosFilters = require("@steedos/filters");
const objectql = require("@steedos/objectql");

const addNotifications = async function (userId, doc, members) {
    if(doc.created_by){
        userId = doc.created_by;
    }
    if (!members.length) {
        return;
    }
    const fromUser = await objectql.getObject('users').findOne(userId, {fields: ['name']});
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
        objectName: "announcements"
    })
}

const getAnnouncementsMembers = async function (doc, isModifierSet) {
    var members, organizations, users;
    organizations = doc.organizations;
    users = doc.members;
    members = [];
    if (organizations && organizations.length || users && users.length) {
        if (users?.length) {
            members = users;
        }
        if (organizations && organizations.length) {
            for (const orgId of organizations) {
                const organizationUsers = await objectql.getSteedosSchema().broker.call('organizations.calculateUsers', {orgId: orgId, isIncludeParents: true})
                members = members.concat(organizationUsers);
            }
        }
    }
    return _.uniq(members);
};

module.exports = {
    listenTo: 'announcements',

    beforeFind: async function(){
        const { userId, spaceId, query } = this;
        if(userId && spaceId){
            const userSession = await auth.getSessionByUserId(userId, spaceId);
            if(userSession.profile != 'admin'){
                const orgs = userSession.organizations_parents;
                const permissionFilters = [['members','=', userId], 'or', ['organizations','in', orgs], 'or', ['owner','=', userId]];
                const odataFilter = steedosFilters.formatFiltersToODataQuery(permissionFilters);
                if(!_.isArray(query.filters)){
                    if(!query.filters){
                        query.filters = odataFilter;
                    }else{
                        query.filters = `(${query.filters}) and (${odataFilter})`
                    }
                }
            }
        }
    },
    beforeAggregate: async function(){
        const { userId, spaceId, query } = this;
        if(userId && spaceId){
            const userSession = await auth.getSessionByUserId(userId, spaceId);
            if(userSession.profile != 'admin'){
                const permissionFilters = [['members','=', userId], 'or', ['owner','=', userId]];
                const odataFilter = steedosFilters.formatFiltersToODataQuery(permissionFilters);
                if(!_.isArray(query.filters)){
                    if(!query.filters){
                        query.filters = odataFilter;
                    }else{
                        query.filters = `(${query.filters}) and (${odataFilter})`
                    }
                }
            }
        }
    },
    afterInsert: async function () {
        const doc = this.doc;
        const userId = this.userId;
        const members = await getAnnouncementsMembers(doc);
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
            doc = Object.assign({}, previousDoc, doc);//编辑单个字段时，space,name,body等字段都可以为空，需要从previousDoc中集成过来
            let oldMembers = await getAnnouncementsMembers(previousDoc);
            let newMembers = await getAnnouncementsMembers(doc, true);
            let addMembers = _.difference(newMembers, oldMembers);
            let subMembers = _.difference(oldMembers, newMembers);
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
        const members = await getAnnouncementsMembers(doc);
        if (members && members.length) {
            removeNotifications(doc, members);
        }
    }
}