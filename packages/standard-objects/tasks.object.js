var objectql = require('@steedos/objectql');
var _ = require("underscore");

var addNotifications = function(userId, doc, assignees){
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
    var notificationTitle = fromUser.name + t('tasks_js_addNotifications_notificationTitle', {}, fromUser.locale);
    var notificationDoc = {
        name: notificationTitle,
        body: doc.name,
        related_to: {
            o: "tasks",
            ids: [doc._id]
        },
        related_name: doc.name,
        from: userId,
        space: doc.space
    };
    Creator.addNotifications(notificationDoc, userId, assignees);
}

var removeNotifications = function(doc, assignees){
    Creator.removeNotifications(doc, assignees, "tasks");
}

Creator.Objects['tasks'].triggers = {
    "after.insert.server.tasks": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            if(doc.assignees && doc.assignees.length){
                addNotifications(userId, doc, doc.assignees);
            }
        }
    },
    "before.update.server.tasks": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            // 考虑到单字段编辑把doc集成过去
            var newDoc = Object.assign({}, doc, modifier.$set);
            var docAssignees = doc.assignees || [];
            var setAssignees = newDoc.assignees || [];
            var addAssignees = _.difference(setAssignees, docAssignees);
            var removedAssignees = _.difference(docAssignees, setAssignees);
            if(addAssignees.length){
                addNotifications(userId, newDoc, addAssignees);
            }
            if(removedAssignees.length){
                removeNotifications(newDoc, removedAssignees);
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
