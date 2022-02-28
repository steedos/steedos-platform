
Meteor.startup(function () {
    if (Meteor.isServer) {
        //创建数据库索引
        if (Meteor.isServer) {
            db.space_users._ensureIndex({
                "user_accepted": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "user": 1,
                "user_accepted": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "user": 1,
                "space": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "space": 1,
                "user_accepted": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "space": 1,
                "user": 1,
                "user_accepted": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "space": 1,
                "manager": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "manager": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "space": 1,
                "created": 1
            }, {
                background: true
            });
            db.space_users._ensureIndex({
                "space": 1,
                "created": 1,
                "modified": 1
            }, {
                background: true
            });
            return;
        }
    }
});