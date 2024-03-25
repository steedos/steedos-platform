/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-08-22 11:49:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-24 09:53:58
 * @Description: 
 */
import { getObject, computeFormula, getSteedosSchema, getMetadata } from '../index';

import { WorkflowNotification } from './types/workflow_notification';

import _ = require('underscore');

declare var Creator: any;

/**
 * 
 * @param ids workflow_notifications'id
 * @param recordId object record id
 * @param userSession 
 */
export async function runWorkflowNotifyActions(ids: Array<string>, recordId: any, userSession: any) {
    if (_.isEmpty(ids) || _.isEmpty(recordId)) {
        return;
    }
    let filters = [['name', 'in', ids], 'or', ['_id', 'in', ids]];
    let notifications = await getMetadata(`workflow_notifications`).find(filters, userSession.spaceId);
    // await getObject("workflow_notifications").find({ filters: filters })
    for (const wn of notifications) {
        await runWorkflowNotifyAction(wn, recordId, userSession);
    }
    return;
}

/**
 * 
 * @param workflowNotification 
 * @param recordId 
 * @param userSession 
 */
export async function runWorkflowNotifyAction(workflowNotification: WorkflowNotification, recordId: any, userSession: any) {
    if (_.isEmpty(workflowNotification) || _.isEmpty(recordId)) {
        return;
    }
    let record = await getObject(workflowNotification.object_name).findOne(recordId, null);
    let objectName = workflowNotification.object_name;
    let assignedUsers = workflowNotification.assigned_users;
    let assignedUserField = workflowNotification.assigned_user_field;
    let userId = record.owner;
    let spaceId = record.space;

    let msgName = await computeFormula(workflowNotification.title, objectName, recordId, userSession);
    let msgBody = await computeFormula(workflowNotification.body, objectName, recordId, userSession);

    let message = {
        name: msgName,
        body: msgBody,
        related_to: {
            o: objectName,
            ids: [record._id]
        },
        related_name: record.name,
        from: userId,
        space: spaceId
    };

    let to = [];

    if (!_.isEmpty(assignedUsers)) {
        to = to.concat(assignedUsers);
    }

    if (!_.isEmpty(assignedUserField)) {
        for (const userField of assignedUserField) {
            if (record[userField]) {
                to.push(record[userField]);
            }
        }
    }

    to = _.uniq(_.flatten(to));

    /**
     * message: {name, body, related_to, related_name, from, space}
     * from: userId
     * to: [userId]
     */
    // Creator.addNotifications(message, userId, to);
    getSteedosSchema().broker.call('notifications.add', {
        message: message,
        from: userId,
        to: to
    })
}