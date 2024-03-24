/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-16 14:57:50
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-24 09:54:39
 * @Description: 执行出站消息
 */

import { getObject, getMetadata } from '../index';

import { WorkflowOutboundMessage } from './types/workflow_outbound_message';

import _ = require('underscore');

import fetch from 'node-fetch';

const jwt = require('jsonwebtoken');


/**
 * 
 * @param ids workflow_outbound_messages_actions'id
 * @param recordId object record id
 * @param userSession 
 */
export async function runWorkflowOutboundMessageActions(ids: Array<string>, recordId: any, userSession: any) {
    if (_.isEmpty(ids) || _.isEmpty(recordId)) {
        return;
    }
    let filters = [['name', 'in', ids], 'or', ['_id', 'in', ids]];
    let docs = await getMetadata(`workflow_outbound_messages`).find(filters, userSession.spaceId);
    // await getObject("workflow_outbound_messages").find({ filters: filters })
    for (const doc of docs) {
        await runWorkflowOutboundMessageAction(doc, recordId, userSession);
    }
    return;
}

/**
 * 
 * @param workflowOutboundMessage
 * @param recordId 
 * @param userSession 
 */
export async function runWorkflowOutboundMessageAction(workflowOutboundMessage: WorkflowOutboundMessage, recordId: any, userSession: any) {
    if (_.isEmpty(workflowOutboundMessage) || _.isEmpty(recordId)) {
        return;
    }
    const {
        object_name,
        endpoint_url,
        // user_to_send_as,
        object_fields_to_send,
        app
    } = workflowOutboundMessage;

    const record = await getObject(object_name).findOne(recordId, { fields: object_fields_to_send });

    let secret = ''
    if (app) {
        const appDoc = (await getObject('apps').find({ filters: [ ['code', '=', app] ]}))[0]
        if (appDoc && appDoc.secret) { // 如果配置了api密钥则生成jwt给接收方验证
            secret = appDoc.secret
        }
    }
    
    let payload = {
        'object_name': object_name,
        'doc': record,
    }

    if (secret) {
        // 生成jwt
        const options = { expiresIn: 60 * 60 }
        payload = jwt.sign(payload, secret, options);
    }

    await fetch(endpoint_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: payload
        })
    })


}