const objectql = require('@steedos/objectql');
const steedosAuth = require('@steedos/auth');
const core = require('@steedos/core');
const auth = steedosAuth.auth;
const getSteedosSchema = objectql.getSteedosSchema;
const util = core.Util;
const _ = require('underscore');

Creator.Objects['notifications'].methods = {
    markReadAll: async function (req, res) {
        let userSession = req.user;
        let error;
        let updatedCount = await objectql.getObject("notifications").directUpdateMany([
            ["space", "=", userSession.spaceId],
            ["owner", "=", userSession.userId],
            [["is_read", "=", null], 'or', ["is_read", "=", false]]
        ], {
            is_read: true
        }).catch((ex) => {
            console.error(ex);
            error = ex;
            return 0;
        });
        if(error){
            res.status(500).send({
                "error": error,
                "success": false
            });
        }
        else{
            return res.send({
                markedCount: updatedCount,
                "success": true
            });
        }
    },
    read: async function (req, res) {
        let { _id: record_id } = req.params;
        let { rootUrl, appId } = req.query;
        let userSession = await auth(req, res);
        let req_async = _.has(req.query, 'async');
        if (userSession.userId) {
            let record = await getSteedosSchema().getObject("notifications").findOne(record_id, { fields: ['owner', 'is_read', 'related_to', 'space', 'url'] });
            if(!record){
                // 跳转到通知记录界面会显示为404效果
                let redirectUrl = util.getObjectRecordRelativeUrl("notifications", record_id);
                if(req.get("X-Requested-With") === 'XMLHttpRequest'){
                    return res.status(200).send({
                        "status": 404,
                        "redirect": redirectUrl
                    });
                }else{
                    return res.redirect(redirectUrl);
                }
            }
            if(!record.related_to && !record.url){
                return res.status(401).send({
                    "error": "Validate Request -- Missing related_to or url",
                    "success": false
                });
            }
            if(!record.is_read && record.owner === userSession.userId){
                // 没有权限时，只是不修改is_read值，但是允许跳转到相关记录查看
                await getSteedosSchema().getObject('notifications').update(record_id, { 'is_read': true, modified: new Date() })
            }
            let redirectUrl = record.url ? record.url : util.getObjectRecordRelativeUrl(record.related_to.o, record.related_to.ids[0], record.space, {
                rootUrl, appId
            });
            if(req_async){ // || req.get("X-Requested-With") === 'XMLHttpRequest'
                return res.status(200).send({
                    "status": 200,
                    "redirect": redirectUrl
                });
            }else{
                return res.redirect(redirectUrl);
            }
        }
        return res.status(401).send({
            "error": "Validate Request -- Missing X-Auth-Token",
            "success": false
        })
    }
}

Meteor.publish('my_notifications', function(spaceId){
    var collection = Creator.getCollection("notifications");
    if(!this.userId){
        return this.ready()
    }
    if(!spaceId){
        return this.ready()
    }
    if(!collection){
        return this.ready()
    }
    var now = new Date();
    return collection.find({space: spaceId, owner: this.userId, $or:[{
        created: {
            $gte: now
        }
    }, {
        modified: {
            $gte: now
        }
    }]}, {
        fields: {space: 1, owner: 1, name: 1, body: 1, is_read: 1}
    })
});

/**
 * message: {name, body, related_to, related_name, from, space}
 * from: userId
 * to: [userId]
 */
Creator.addNotifications = function(message, from, to){
    let notifications_ids = [];
    if(!_.isArray(to) && _.isString(to)){
        to = [to]
    }

    try {
        notifications_ids = sendNotifications(message, from, to);
    } catch (error) {
        console.error("通知数据插入失败，错误信息：", error);
    }

    try {
        Creator.sendPushs(message, from, to, notifications_ids)
    } catch (error) {
        console.error("推送数据插入失败，错误信息：", error);
    }
}

Creator.sendPushs = function(message, from, to, notifications_ids){
    const appName = 'workflow'
    let now = new Date();
    let data = {
        "createdAt" : now,
        "createdBy" : "<SERVER>",
        "from" : appName,
        "title" : message.name,
        "text" : message.body,
        "payload" : {
            "space" : message.space,
            "host" : Meteor.absoluteUrl().substr(0, Meteor.absoluteUrl().length-1),
        }
    }

    if(message.space && message.related_to && message.related_to.o && message.related_to.ids && message.related_to.ids.length > 0){
        data.payload.related_to = message.related_to
        data.payload.url = "/app/-/"+message.related_to.o+"/view/" + message.related_to.ids[0]+"?X-Space-Id="+message.space
    }

    if(message.badge > -1){
        data.badge = message.badge
    }
    
    _.each(to, function(toUserId, index){
        if(toUserId){
            try {
                data.payload.notifications_id = notifications_ids[index];
                Push.send(Object.assign({}, data, {query: {"userId": toUserId,"appName": appName}}))
            } catch (error) {
                console.error("推送数据插入失败，错误信息：", error);
            }
        }
    })
}

function sendNotifications(message, from, to){
    if (_.isEmpty(to)) {
        return
    }
    let now = new Date();
    const collection = Creator.getCollection("notifications");
    let bulk = collection.rawCollection().initializeUnorderedBulkOp();
    let notifications_ids = []

    let doc = Object.assign({
        created: now,
        modified: now,
        created_by: from,
        modified_by: from
    }, message)

    _.each(to, function(userId){
        let notifications_id = collection._makeNewID();
        bulk.insert(Object.assign({}, doc, {_id: notifications_id, owner: userId}));
        notifications_ids.push(notifications_id)
    })

    bulk.execute().catch(function (error) {
        console.error("通知数据插入失败，错误信息：", error);
    });

    try {
        const broker = objectql.getSteedosSchema().broker;
        broker.emit(`notifications.hasBeenSent`, {
            ids: notifications_ids
        });
    } catch (Exception) {
        
    } 

    return notifications_ids;
}

Creator.removeNotifications = function(doc, assignees, object_name){
    const collection = Creator.getCollection("notifications");
    let bulk = collection.rawCollection().initializeUnorderedBulkOp();
    assignees.forEach(function (assignee) {
        bulk.find({
            "related_to.o": object_name,
            "related_to.ids": doc._id,
            owner: assignee
        }).remove();
    });
    return bulk.execute().catch(function (error) {
        console.error("通知数据删除失败，错误信息：", error);
    });
}