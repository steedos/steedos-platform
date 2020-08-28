module.exports = {

    name: 'coreObjectWebhooksTrigger',

    listenTo: 'core',

    afterInsert: async function () {

        if (typeof ObjectWebhooksQueue === "undefined") {
            console.warn('not found ObjectWebhooksQueue');
            return;
        }

        let owCollection = this.getObject('object_webhooks');
        if (!owCollection) {
            console.warn('not found collection object_webhooks');
            return;
        }

        let action = 'create';
        let userId = this.userId;
        let doc = this.doc;
        let object_name = this.datasource_name + '.' + this.object_name;
        let obj = this.getObject(object_name);
        let recordId = this.doc[obj.idFieldName];
        let userObj = this.getObject('users');
        let actionUserInfo = await userObj.findOne(userId, {
            fields: ['name']
        });
        let redirectUrl = Creator.getObjectAbsoluteUrl(object_name, recordId, "-");
        let objWebhooks = await owCollection.find({
            filters: `(object_name eq '${object_name}') and (active eq true) and (events eq '${action}')`
        });

        for (let idx = 0; idx < objWebhooks.length; idx++) {
            let oh = objWebhooks[idx];
            var data;
            data = {};
            if (!oh.fields || oh.fields.length === 0) {
                data = doc;
            } else {
                for (let i = 0; i < oh.fields.length; i++) {
                    var objField, refCollection, refFilterFields, refNameFieldKey, refRecord;
                    var fieldName = oh.fields[i];
                    objField = obj.getField(fieldName);
                    if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                        refCollection = this.getObject(objField.reference_to);
                        if (refCollection) {
                            refNameFieldKey = refCollection.NAME_FIELD_KEY;
                            refFilterFields = [];
                            refFilterFields.push(refNameFieldKey);
                            refRecord = await refCollection.findOne(doc[fieldName], {
                                fields: refFilterFields
                            });
                            if (refRecord) {
                                data[fieldName] = refRecord[refNameFieldKey];
                            }
                        }
                    } else {
                        data[fieldName] = doc[fieldName];
                    }
                };
            }

            data._id = recordId;
            var Fiber = require("fibers");
            Fiber(function () {
                ObjectWebhooksQueue.send({
                    data: data,
                    payload_url: oh.payload_url,
                    content_type: oh.content_type,
                    action: action,
                    actionUserInfo: actionUserInfo,
                    objectName: object_name,
                    objectDisplayName: obj.label,
                    nameFieldKey: obj.NAME_FIELD_KEY,
                    redirectUrl: redirectUrl
                });
            }).run();
        }
    },
    afterUpdate: async function () {
        if (typeof ObjectWebhooksQueue === "undefined") {
            console.warn('not found ObjectWebhooksQueue');
            return;
        }

        let owCollection = this.getObject('object_webhooks');
        if (!owCollection) {
            console.warn('not found collection object_webhooks');
            return;
        }

        let action = 'update';
        let userId = this.userId;
        let doc = this.doc;
        let object_name = this.datasource_name + '.' + this.object_name;
        let recordId = this.id;
        let obj = this.getObject(object_name);
        let userObj = this.getObject('users');
        let actionUserInfo = await userObj.findOne(userId, {
            fields: ['name']
        });
        let redirectUrl = Creator.getObjectAbsoluteUrl(object_name, recordId, "-");
        let objWebhooks = await owCollection.find({
            filters: `(object_name eq '${object_name}') and (active eq true) and (events eq '${action}')`
        });

        for (let idx = 0; idx < objWebhooks.length; idx++) {
            let oh = objWebhooks[idx];
            var data;
            data = {};
            if (!oh.fields || oh.fields.length === 0) {
                data = doc;
            } else {
                for (let i = 0; i < oh.fields.length; i++) {
                    var objField, refCollection, refFilterFields, refNameFieldKey, refRecord;
                    var fieldName = oh.fields[i];
                    objField = obj.getField(fieldName);
                    if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                        refCollection = this.getObject(objField.reference_to);
                        if (refCollection) {
                            refNameFieldKey = refCollection.NAME_FIELD_KEY;
                            refFilterFields = [];
                            refFilterFields.push(refNameFieldKey);
                            refRecord = await refCollection.findOne(doc[fieldName], {
                                fields: refFilterFields
                            });
                            if (refRecord) {
                                data[fieldName] = refRecord[refNameFieldKey];
                            }
                        }
                    } else {
                        data[fieldName] = doc[fieldName];
                    }
                };
            }

            data._id = recordId;
            var Fiber = require("fibers");
            Fiber(function () {
                ObjectWebhooksQueue.send({
                    data: data,
                    payload_url: oh.payload_url,
                    content_type: oh.content_type,
                    action: action,
                    actionUserInfo: actionUserInfo,
                    objectName: object_name,
                    objectDisplayName: obj.label,
                    nameFieldKey: obj.NAME_FIELD_KEY,
                    redirectUrl: redirectUrl
                });
            }).run();
        }
    },
    afterDelete: async function () {

        if (typeof ObjectWebhooksQueue === "undefined") {
            console.warn('not found ObjectWebhooksQueue');
            return;
        }

        let owCollection = this.getObject('object_webhooks');
        if (!owCollection) {
            console.warn('not found collection object_webhooks');
            return;
        }

        let action = 'delete';
        let userId = this.userId;
        let doc = this.previousDoc;
        let object_name = this.datasource_name + '.' + this.object_name;
        let recordId = this.id;
        let obj = this.getObject(object_name);
        let userObj = this.getObject('users');
        let actionUserInfo = await userObj.findOne(userId, {
            fields: ['name']
        });
        let redirectUrl = Creator.getObjectAbsoluteUrl(object_name, recordId, "-");
        let objWebhooks = await owCollection.find({
            filters: `(object_name eq '${object_name}') and (active eq true) and (events eq '${action}')`
        });
        for (let idx = 0; idx < objWebhooks.length; idx++) {
            let oh = objWebhooks[idx];
            var data;
            data = {};
            if (!oh.fields || oh.fields.length === 0) {
                data = doc;
            } else {
                for (let i = 0; i < oh.fields.length; i++) {
                    var objField, refCollection, refFilterFields, refNameFieldKey, refRecord;
                    var fieldName = oh.fields[i];
                    objField = obj.getField(fieldName);
                    if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                        refCollection = this.getObject(objField.reference_to);
                        if (refCollection) {
                            refNameFieldKey = refCollection.NAME_FIELD_KEY;
                            refFilterFields = [];
                            refFilterFields.push(refNameFieldKey);
                            refRecord = await refCollection.findOne(doc[fieldName], {
                                fields: refFilterFields
                            });
                            if (refRecord) {
                                data[fieldName] = refRecord[refNameFieldKey];
                            }
                        }
                    } else {
                        data[fieldName] = doc[fieldName];
                    }
                };
            }

            data._id = recordId;
            var Fiber = require("fibers");
            Fiber(function () {
                ObjectWebhooksQueue.send({
                    data: data,
                    payload_url: oh.payload_url,
                    content_type: oh.content_type,
                    action: action,
                    actionUserInfo: actionUserInfo,
                    objectName: object_name,
                    objectDisplayName: obj.label,
                    nameFieldKey: obj.NAME_FIELD_KEY,
                    redirectUrl: redirectUrl
                });
            }).run();
        }
    }
}