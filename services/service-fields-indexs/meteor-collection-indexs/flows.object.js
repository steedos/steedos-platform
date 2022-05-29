/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-29 11:41:22
 * @Description: 
 */
if (Meteor.isServer) {

    db.flows._ensureIndex({
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "role": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "space": 1,
        "app": 1,
        "created": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "space": 1,
        "app": 1,
        "created": 1,
        "current.modified": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "name": 1,
        "space": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "form": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "current.steps.approver_roles": 1,
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "_id": 1,
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "space": 1,
        "form": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "form": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "space": 1,
        "form": 1,
        "state:": 1
    }, {
        background: true
    });
}
