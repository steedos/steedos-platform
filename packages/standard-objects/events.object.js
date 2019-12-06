var objectql = require('@steedos/objectql');
var _ = require("underscore");

var addNotifications = function(userId, doc, assignees){
    var fromUser = Creator.getCollection("users").findOne({
        _id: userId
    }, {
        fields: {
            name: 1
        }
    });
    var notificationTitle = fromUser.name + " 为您安排了日程";
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
    var collection = Creator.getCollection("notifications");
    assignees.forEach(function(assignee){
        notificationDoc.owner = assignee;
        collection.insert(notificationDoc);
    });
}

var removeNotifications = function(doc, assignees){
    var collection = Creator.getCollection("notifications");
    assignees.forEach(function(assignee){
        collection.remove({
            "related_to.o": "events",
            "related_to.ids": doc._id,
            owner: assignee
        });
    });
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
    }
}
