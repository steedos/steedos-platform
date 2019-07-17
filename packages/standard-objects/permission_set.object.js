Creator.Objects['permission_set'].triggers = {
    "before.insert.server.check": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            var newName;
            // console.log "before.insert.server.check,doc:", doc
            newName = doc != null ? doc.name : void 0;
            if (newName && Creator.getCollection("permission_set").findOne({
                space: doc.space,
                name: newName
            }, {
                    fields: {
                        name: 1
                    }
                })) {
                throw new Meteor.Error(500, "对象名称不能重复");
            }
        }
    },
    "before.update.server.check": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var newName, ref;
            newName = (ref = modifier.$set) != null ? ref.name : void 0;
            if (newName && Creator.getCollection("permission_set").findOne({
                space: doc.space,
                name: newName,
                _id: {
                    $ne: doc._id
                }
            }, {
                    fields: {
                        name: 1
                    }
                })) {
                throw new Meteor.Error(500, "对象名称不能重复");
            }
        }
    }
}