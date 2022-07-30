const core = require('@steedos/core');
db.apps = Creator.Collections.apps ? Creator.Collections.apps : core.newCollection('apps')

db.apps.isInternalApp = function (url) {
    var app_url, i, len, ref;
    if (url && db.apps.INTERNAL_APPS) {
        ref = db.apps.INTERNAL_APPS;
        for (i = 0, len = ref.length; i < len; i++) {
            app_url = ref[i];
            if (url.startsWith(app_url)) {
                return true;
            }
        }
    }
    return false;
};

if (Meteor.isServer) {
    db.apps.allow({
        insert: function (userId, doc) {
            if (!Steedos.isSpaceAdmin(doc.space, userId)) {
                return false;
            } else {
                return true;
            }
        },
        update: function (userId, doc) {
            if (!Steedos.isSpaceAdmin(doc.space, userId)) {
                return false;
            } else {
                return true;
            }
        },
        remove: function (userId, doc) {
            if (!Steedos.isSpaceAdmin(doc.space, userId)) {
                return false;
            } else {
                return true;
            }
        }
    });
}

if (Meteor.isServer) {
    // db.apps.before.insert (userId, doc) ->
    // 	doc.internal = db.apps.isInternalApp(doc.url)
    // 	return
    db.apps.before.update(function (userId, doc, fieldNames, modifier, options) {
        return modifier.$set = modifier.$set || {};
    });
}

Fiber = require('fibers')

var getUserOrganizations = function(userId, spaceId){
    var space_user = db.space_users.findOne({user:userId,space:spaceId}, {fields:{organizations:1}})
    if(!space_user){
        return []
    }
    var organizations = space_user.organizations
    if(!organizations){
        return []
    }
    var userOrgs = db.organizations.find({_id:{$in:organizations}}).fetch()
    var parents = _.flatten(_.pluck(userOrgs, 'parents'))
	return _.union(organizations,parents)
}

var getUserApps = function (userId, spaceId) {
    var userOrgs = getUserOrganizations(userId, spaceId);
    var selector = {
        $or: [
            {$or: [{space: {$exists: false}}, {space: spaceId}]},
            { 'members.organizations': {$in: userOrgs} },
            { 'members.users': {$in: [ userId ]} }
        ]
    }
    return db.apps.find(selector, {sort: {sort: 1}}).fetch();
};

// Creator.Objects['apps'].methods = {
//     safe_apps: function (req, res) {
//         return Fiber(function () {
//             var userSession = req.user
//             var userId = userSession.userId
//             var spaceId = userSession.spaceId
//             var apps = getUserApps(userId, spaceId);
//             return res.send({
//                 "@odata.count": apps.length,
//                 value: apps
//             });
//         }).run();
//     }
// }