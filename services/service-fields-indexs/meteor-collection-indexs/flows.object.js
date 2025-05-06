/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-05-06 19:31:13
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
    try {
        db.flows._ensureIndex({
            "form": 1
        }, {
            background: true
        });
    } catch (error) {
        
    }
    db.flows._ensureIndex({
        "space": 1,
        "form": 1,
        "state:": 1
    }, {
        background: true
    });
    db.flows._ensureIndex({
        "space": 1,
        "category": 1,
        "state": 1,
        "sort_no:": 1
    }, {
        background: true
    });
}
