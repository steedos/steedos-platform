var objectql = require('@steedos/objectql');
var _ = require("underscore");

var addNotifications = function(userId, doc, assignees){
    if(doc.created_by){
        userId = doc.created_by;
    }
    assignees = _.difference(assignees, [userId]);
    if(!assignees.length){
        return;
    }
    var fromUser = Creator.getCollection("users").findOne({
        _id: userId
    }, {
        fields: {
            name: 1,
            locale: 1
        }
    });
    var notificationTitle = fromUser.name + t('events_js_addNotifications_notificationTitle', {}, fromUser.locale) ;
    var notificationDoc = {
        name: notificationTitle,
        body: doc.name,
        related_to: {
            o: "events",
            ids: [doc._id]
        },
        related_name: doc.name,
        from: userId,
        space: doc.space
    };

    Creator.addNotifications(notificationDoc, userId, assignees);
}

let removeNotifications = function(doc, assignees){
    Creator.removeNotifications(doc, assignees, "events");
}

Creator.Objects['events'].triggers = {
    "after.insert.server.events": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            if(doc.assignees && doc.assignees.length){
                addNotifications(userId, doc, doc.assignees);
            }
        }
    },
    "before.update.server.events": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            var docAssignees = doc.assignees;
            var setAssignees = modifier.$set.assignees;
            if(!docAssignees){
                docAssignees = [];
            }
            if(!setAssignees){
                setAssignees = [];
            }
            var addAssignees = _.difference(setAssignees, docAssignees);
            var removedAssignees = _.difference(docAssignees, setAssignees);
            if(addAssignees.length){
                addNotifications(userId, doc, addAssignees);
            }
            if(removedAssignees.length){
                removeNotifications(doc, removedAssignees);
            }
        }
    },
    "before.remove.server.tasks": {
        on: "server",
        when: "before.remove",
        todo: function (userId, doc) {
            let removedAssignees = doc.assignees;
            if(removedAssignees && removedAssignees.length){
                removeNotifications(doc, removedAssignees);
            }
        }
    }
}
