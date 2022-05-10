const objectql = require('@steedos/objectql');
const _ = require('underscore');

const send = async function (options) {
	var currentUser = (options.createdBy || '<SERVER>') || null
	var webhook = _.extend({
		createdAt: new Date(),
		createdBy: currentUser
	});

	if (_.isObject(options)) {
		webhook.webhook = _.pick(options, 'data', 'payload_url', 'content_type', 'action', 'actionUserInfo', 'objectName', 'objectDisplayName', 'nameFieldKey', 'redirectUrl');
	}

	webhook.sent = false;
	webhook.sending = 0;
	return await objectql.getObject('object_webhooks_queue').insert(webhook);
};

const objectWebhooksPreSend = async function (userId, doc, object_name, action) {
    var spaceId = doc.space;
    if (spaceId == '{spaceId}') {
        return;
    }
    if (!spaceId) {
        // console.error('not found spaceId');
        return;
    }
    var actionUserInfo, obj, objectWebhooks, redirectUrl;
    try {
        objectWebhooks = objectql.getObject('object_webhooks');
    } catch (error) {
        console.error(error);
    }
    if (!objectWebhooks) {
        console.error('not found collection object_webhooks');
        return;
    }

    obj = objectql.getObject(object_name);
    actionUserInfo = await objectql.getObject('users').findOne(userId, {
        fields: ['name']
    });
    redirectUrl = await obj.getRecordAbsoluteUrl(doc._id, "-");
    const objFields = await obj.getFields();
    const records = await objectWebhooks.find({filters: [['object_name', '=', object_name],['active', '=', true],['events', '=', action],['space', '=',spaceId]]});
    for (const oh of records) {
        var data;
        data = {};
        if (_.isEmpty(oh.fields)) {
            data = doc;
        } else {
            for (const fieldName in oh.fields) {
                var objField, refNameFieldKey, refObj, refRecord;
                objField = objFields[fieldName];
                if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                    refObj = Creator.getObject(objField.reference_to);
                    if (refObj) {
                        refNameFieldKey = await refObj.getNameFieldKey();
                        //TODO 此处未考虑lookup字段的value不是主键的情况
                        refRecord = await refObj.findOne(doc[fieldName], {fields: [refNameFieldKey]});
                        if (refRecord) {
                            return data[fieldName] = refRecord[refNameFieldKey];
                        }
                    }
                } else {
                    return data[fieldName] = doc[fieldName];
                }
            }
        }
        return await send({
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
    }
};

const afterInsertObjectWebHooks = async function () {
    const { doc, userId, object_name } = this;
    const obj = objectql.getObject(object_name);
    const dbDoc = await obj.findOne(doc._id);
    return await objectWebhooksPreSend(userId, dbDoc, object_name, 'create');
}

const afterUpdateObjectWebHooks = async function () {
    const { userId, object_name, id } = this;
    const obj = objectql.getObject(object_name);
    const dbDoc = await obj.findOne(id);
    return await objectWebhooksPreSend(userId, dbDoc, object_name, 'update');
}

const afterDeleteObjectWebHooks = async function () {
    const { previousDoc, userId, object_name } = this;
    return await objectWebhooksPreSend(userId, previousDoc, object_name, 'create');
}

module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        return await afterInsertObjectWebHooks.apply(this, arguments)
    },
    afterUpdate: async function () {
        return await afterUpdateObjectWebHooks.apply(this, arguments)
    },
    afterDelete: async function () {
        return await afterDeleteObjectWebHooks.apply(this, arguments)
    }
}