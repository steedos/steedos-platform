if (Meteor.isServer) {
    db.users._ensureIndex({
        "is_deleted": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "email": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "is_deleted": 1,
        "email": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "_id": 1,
        "created": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "_id": 1,
        "created": 1,
        "modified": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1
    }, {
        background: true
    });
    // console.log("getSteedosToken: ",Steedos.getSteedosToken);
    db.users._ensureIndex({
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1,
        "created": 1
    }, Steedos.formatIndex(["primary_email_verified", "locale", "name", "_id", "mobile", "created"]));
    db.users._ensureIndex({
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1,
        "created": 1,
        "last_logon": 1
    }, Steedos.formatIndex(["primary_email_verified", "locale", "name", "_id", "mobile", "created", "last_logon"]));
    db.users._ensureIndex({
        "imo_uid": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "qq_open_id": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "created": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "last_logon": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "created": 1,
        "modified": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "name": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "lastLogin": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "status": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "active": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "type": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "steedos_id": 1
    }, {
        background: true
    });
    db.users._ensureIndex({
        "services.weixin.openid.appid": 1,
        "services.weixin.openid._id": 1
    }, Steedos.formatIndex(["services.weixin.openid.appid", "services.weixin.openid._id"]));
}