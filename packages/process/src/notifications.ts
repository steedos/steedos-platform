const objectql = require('@steedos/objectql');
import { getUserLocale } from '@steedos/objectql';
// const Fiber = require('fibers');
declare var Fiber;
declare var Creator;
declare var TAPi18n;

export const sendNotifications = async (from: string, to: string, {instanceHistory = null, instance = null, status})=>{
    if(!to){
        return;
    }
    if(!instance){
        instance = await objectql.getObject("process_instance").findOne(instanceHistory.process_instance);
    }
    var fromUser =  await objectql.getObject("users").findOne(from);
    const targetObjectName = instance.target_object.o;
    const targetObject = objectql.getObject(targetObjectName);
    var relatedDoc = await targetObject.findOne(instance.target_object.ids[0]);
    let relatedDocName = relatedDoc.name; //TODO
    const lng = getUserLocale(fromUser);
    var notificationTitle = TAPi18n.__(`process_notification_${status}_title`, {submitter: fromUser.name, recordName: relatedDocName}, lng);
    var notificationBody = targetObject.label;
    let linkToObjectName, linkToId;
    if(["approved", "rejected"].indexOf(status) > -1){
        linkToObjectName = targetObjectName;
        linkToId = relatedDoc._id;
    }
    else{
        linkToObjectName = "process_instance_history";
        linkToId = instanceHistory._id
    }
    var notificationDoc = {
        name: notificationTitle,
        body: notificationBody,
        related_to: {
            o: linkToObjectName,
            ids: [linkToId]
        },
        related_name: relatedDocName,
        from: from,
        space: instance.space
    };

    Fiber(function () {
        Creator.addNotifications(notificationDoc, null, [to]);
    }).run();
}