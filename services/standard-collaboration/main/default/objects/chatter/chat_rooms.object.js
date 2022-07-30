Creator.Objects['chat_rooms'].triggers = Object.assign({}, Creator.Objects['chat_rooms'].triggers,{
    "after.insert.server.rooms": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            return _.forEach(doc.members, function (m) {
                return Creator.getCollection("chat_subscriptions").insert({
                    related_to: {
                        o: 'chat_rooms',
                        ids: [doc._id]
                    },
                    name: '',
                    last_message_text: '',
                    unread: 0,
                    owner: m,
                    space: doc.space
                });
            });
        }
    }
})