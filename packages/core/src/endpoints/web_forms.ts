import * as express from 'express';
import { getSteedosSchema } from '@steedos/objectql';
const Fiber = require('fibers');

const addNotifications:any = function (object:any, doc:any, members:any) {
    console.log("===addNotifications====members===", members);
    if (!members || !members.length) {
        return;
    }
    const nameKey = object.NAME_FIELD_KEY;
    const notificationTitle = object.label;
    let notificationBody = doc[nameKey];
    if(!notificationBody){
        notificationBody = "在线表单有一条新记录提交。";
    }
    let notificationDoc = {
        name: notificationTitle,
        body: notificationBody,
        related_to: {
            o: object.name,
            ids: [doc._id]
        },
        related_name: doc[nameKey],
        from: null,
        space: doc.space
    };
    console.log("===addNotifications====notificationDoc===", notificationDoc);
    Fiber(function () {
        Creator.addNotifications(notificationDoc, null, members);
    }).run();
}

export const postObjectWebForm = async (req: express.Request, res: express.Response) => {
    try {
        let urlParams = req.params;
        let key = urlParams.object_name;
        let object = getSteedosSchema().getObject(key);
        if (!object) {
            return res.status(401).send({
                "error": `Validate Request -- Object Name '${key}' Not Fount`,
                "success": false
            })
        }

        let bodyParams = req.body;
        const formId = bodyParams.steedos_form_id;
        const objectWebForms = getSteedosSchema().getObject("web_forms");
        let formDoc = await objectWebForms.findOne(formId, { fields: ["space", "object_name", "record_owner", "notification_users"]});
        if (!formDoc) {
            return res.status(401).send({
                "error": `Validate Request -- The Web Form '${formId}' Not Fount`,
                "success": false
            })
        }
        if (formDoc.object_name !== key) {
            return res.status(401).send({
                "error": `Validate Request -- The Web Form's Object Name is not equal to ${key}`,
                "success": false
            })
        }
        let owner = formDoc.record_owner ? formDoc.record_owner : null;
        let space = formDoc.space ? formDoc.space : null;
        let entityDoc = { ...bodyParams, owner, space };
        let entity = await object.insert(entityDoc);
        if (entity) {
            let body = {};
            body['entity'] = entity;
            body['success'] = true;
            try{
                addNotifications(object, entityDoc, formDoc.notification_users);
                res.status(200).send(body);
            }
            catch (error) {
                return res.status(401).send({
                    "error": `Add notifications failed after post web form: ${error}`,
                    "success": false
                })
            }
        }
    } catch (error) {
        return res.status(401).send({
            "error": `Post Failed: ${error}`,
            "success": false
        })
    }
}