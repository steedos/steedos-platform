const objectql = require('@steedos/objectql')

Creator.Objects['notifications'].methods = {
    markReadAll: async function (req, res) {
        let userSession = req.user;
        let error;
        let updatedCount = await objectql.getObject("notifications").updateMany([
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
    return collection.find({space: spaceId, owner: this.userId, created: {
        $gte: now
    }}, {
        fields: {space: 1, owner: 1, name: 1, body: 1, is_read: 1}
    })
})


const express = require('express');
const Auth = require('@steedos/auth');
const Core = require('@steedos/core');
const Objectql = require('@steedos/objectql');
const auth = Auth.auth;
const getSteedosSchema = Objectql.getSteedosSchema;
const addRouterConfig = Objectql.addRouterConfig;
const util = Core.Util;

const read = async (req, res) => {
    let id = req.params.id;
    let userSession = await auth(req, res);
    if (userSession.userId) {
        let record = await getSteedosSchema().getObject("notifications").findOne(id, { fields: ['owner', 'is_read', 'related_to', 'space', 'url'] });
        if(!record){
            // 跳转到通知记录界面会显示为404效果
            let redirectUrl = util.getObjectRecordUrl("notifications", id);
            return res.redirect(redirectUrl);
        }
        if(!record.related_to && !record.url){
            return res.status(401).send({
                "error": "Validate Request -- Missing related_to or url",
                "success": false
            });
        }
        if(!record.is_read && record.owner === userSession.userId){
            // 没有权限时，只是不修改is_read值，但是允许跳转到相关记录查看
            await getSteedosSchema().getObject('notifications').update(id, { 'is_read': true })
        }
        let redirectUrl = record.url ? record.url : util.getObjectRecordUrl(record.related_to.o, record.related_to.ids[0], record.space);
        return res.redirect(redirectUrl);
    }
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "success": false
    })
}

const coreExpress = express.Router();
coreExpress.get('/api/v4/notifications/:id/read', read);

const prefix = "/";
addRouterConfig(prefix, coreExpress);

