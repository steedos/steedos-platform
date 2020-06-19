import * as express from 'express';
const Fiber = require('fibers');
import { getSteedosSchema } from '@steedos/objectql';
import { translationObject } from '@steedos/i18n';
import Util from '../util';
const clone = require("clone");

const addNotifications:any = function (object:any, doc:any, members:any, lng: string) {
    if (!members || !members.length) {
        return;
    }
    const nameKey = object.NAME_FIELD_KEY;
    let _object = clone(object.toConfig());
    translationObject(lng, object.name, _object);
    const notificationTitle = _object.label;
    let notificationBody = doc[nameKey];
    if(!notificationBody){
        notificationBody = TAPi18n.__("web_forms_default_notification_body", {}, lng);
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
        let formDoc = await objectWebForms.findOne(formId, { fields: ["space", "object_name", "record_owner", "notification_users", "owner"]});
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
        let record_owner = formDoc.record_owner ? formDoc.record_owner : null;
        let space = formDoc.space ? formDoc.space : null;
        let entityDoc = { ...bodyParams, record_owner, space };
        let entity = await object.insert(entityDoc);
        if (entity) {
            let body = {};
            body['entity'] = entity;
            body['success'] = true;
            try{
                const owner = await getSteedosSchema().getObject("users").findOne(formDoc.owner, { fields: ["locale"]});
                const lng = Util.getUserLocale(owner);
                addNotifications(object, entityDoc, formDoc.notification_users, lng);
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