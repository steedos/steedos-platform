const objectql = require('@steedos/objectql');
import { Util } from '@steedos/core';
const Fiber = require('fibers');
declare var Creator;
declare var TAPi18n;

export const sendNotifications = async (instanceHistory, from, to)=>{
    if(!to){
        return;
    }
    var instance = await objectql.getObject("process_instance").findOne(instanceHistory.process_instance);
    var fromUser =  await objectql.getObject("users").findOne(to);
    var relatedDoc = await objectql.getObject(instance.target_object.o).findOne(instance.target_object.ids[0]);
    let relatedDocName = relatedDoc.name; //TODO
    const lng = Util.getUserLocale(fromUser);
    var notificationTitle = TAPi18n.__('process_notification_submit_title', {submitter: fromUser.name, recordName: relatedDocName}, lng);
    var notificationDoc = {
        name: notificationTitle,
        body: relatedDocName,
        related_to: {
            o: "process_instance_history",
            ids: [instanceHistory._id]
        },
        related_name: relatedDocName,
        from: null,
        space: instanceHistory.space
    };

    Fiber(function () {
        Creator.addNotifications(notificationDoc, null, [to]);
    }).run();
}