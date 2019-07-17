db.apps = new Meteor.Collection('apps');

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