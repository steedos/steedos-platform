/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-28 14:18:04
 * @Description: 
 */

if (Meteor.isServer) {
    try {
        db.steedos_keyvalues._ensureIndex({
            "space": 1
        }, {
            background: true
        });
    } catch (error) {

    }
    try {
        db.steedos_keyvalues._ensureIndex({
            "user": 1
        }, {
            background: true
        });
    } catch (error) {

    }
    try {
        db.steedos_keyvalues._ensureIndex({
            "key": 1
        }, {
            background: true
        });
    } catch (error) {

    }

    db.steedos_keyvalues._ensureIndex({
        "user": 1,
        "space": 1,
        "key": 1
    }, {
        background: true
    });
}