/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-29 11:50:10
 * @Description: 
 */

if (Meteor.isServer) {

    db.organizations._ensureIndex({
        "space": 1,
        "users": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "_id": 1,
        "space": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "name": 1,
        "space": 1,
        "_id": 1,
        "parent": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "parents": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "parents": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "space": 1,
        "created": 1
    }, {
        background: true
    });
    db.organizations._ensureIndex({
        "space": 1,
        "created": 1,
        "modified": 1
    }, {
        background: true
    });
}