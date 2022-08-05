Creator.Objects['chat_messages'].triggers = Object.assign({}, Creator.Objects['chat_messages'].triggers,{
    "after.insert.server.chatMessages": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            var _id, object_name, ref, ref1;
            Creator.getCollection("chat_subscriptions").upsert({
                space: doc.space,
                owner: doc.owner,
                'related_to.o': doc.related_to.o,
                'related_to.ids': doc.related_to.ids
            }, {
                    $set: {
                        unread: 0,
                        last_message_text: doc.name,
                        last_message_date: new Date(),
                        modified: new Date(),
                        modified_by: userId
                    }
                }, {
                    multi: true
                });
            Creator.getCollection("chat_subscriptions").update({
                space: doc.space,
                owner: {
                    $ne: doc.owner
                },
                'related_to.o': doc.related_to.o,
                'related_to.ids': doc.related_to.ids
            }, {
                    $inc: {
                        unread: 1
                    },
                    $set: {
                        last_message_text: doc.name,
                        last_message_date: new Date(),
                        modified: new Date(),
                        modified_by: userId
                    }
                }, {
                    multi: true
                });
            // 更新chat_messages的related_to表，统一记录消息数量
            object_name = (ref = doc.related_to) != null ? ref.o : void 0;
            _id = (ref1 = doc.related_to) != null ? ref1.ids[0] : void 0;
            if (object_name && _id) {
                return Creator.getCollection(object_name, doc.space).direct.update({
                    _id: _id
                }, {
                        $inc: {
                            message_count: 1
                        }
                    });
            }
        }
    }
})