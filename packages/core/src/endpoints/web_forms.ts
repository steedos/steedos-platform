import * as express from 'express';
// const Fiber = require('fibers');
declare var Fiber;
import { getSteedosSchema } from '@steedos/objectql';
import { translationObject } from '@steedos/i18n';
import * as core from "express-serve-static-core";
import Util from '../util';
const clone = require("clone");

const addNotifications:any = async function (object:any, doc:any, members:any, lng: string) {
    if (!members || !members.length) {
        return;
    }
    const nameKey = await object.getNameFieldKey();
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

const isDebug = false;

const callback = (res: any, returnUrl: string, error?: string)=>{
    if(error){
        console.error(error);
    }
    if(returnUrl && !isDebug){
        if(error){
            let pre = returnUrl.indexOf("?") > 0 ? "&" : "?";
            returnUrl += `${pre}error=${error}`;
        }
        res.redirect(returnUrl);
    }
    else{
        let body = {};
        if(error){
            body['success'] = false;
            body['error'] = error;
            res.status(401).send(body);
        }
        else{
            body['success'] = true;
            res.status(200).send(body);
        }
    }
}

export const postObjectWebForm = async (req: core.Request, res: express.Response) => {
    let urlParams = req.params;
    let bodyParams = req.body;
    const formId = bodyParams.steedos_form_id;
    const returnUrl = bodyParams.return_url;
    let key = urlParams.object_name;
    try {
        let object = getSteedosSchema().getObject(key);
        if (!object) {
            return callback(res, returnUrl, `Validate Request -- Object Name '${key}' Not Fount`);
        }

        const objectWebForms = getSteedosSchema().getObject("web_forms");
        let formDoc = await objectWebForms.findOne(formId, { fields: ["space", "object_name", "record_owner", "notification_users", "owner"]});
        if (!formDoc) {
            return callback(res, returnUrl, `Validate Request -- The Web Form '${formId}' Not Fount`);
        }
        if (formDoc.object_name !== key) {
            return callback(res, returnUrl, `Validate Request -- The Web Form's Object Name is not equal to ${key}`);
        }
        let owner = formDoc.record_owner ? formDoc.record_owner : null;
        let space = formDoc.space ? formDoc.space : null;
        let entityDoc = { ...bodyParams, owner, created_by: owner, modified_by: owner, space };
        let entity = await object.insert(entityDoc);
        if (entity) {
            try{
                const owner = await getSteedosSchema().getObject("users").findOne(formDoc.owner, { fields: ["locale"]});
                const lng = Util.getUserLocale(owner);
                await addNotifications(object, entityDoc, formDoc.notification_users, lng);
                return callback(res, returnUrl);
            }
            catch (error) {
                return callback(res, returnUrl, `Add notifications failed after post web form: ${error}`);
            }
        }
        else{
            return callback(res, returnUrl, "No result inserted.");
        }
    } catch (error) {
        return callback(res, returnUrl, `Post Failed: ${error}`);
    }
}