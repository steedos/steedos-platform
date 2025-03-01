/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-12 19:08:48
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-04-25 11:22:11
 * @Description: 加载*.trigger.js文件注册为新版action trigger
 */
import * as _ from "underscore";
import * as path from "path";
// import { JSONStringify, getMD5 } from "@steedos/metadata-core";
import { loadObjectTriggers } from "@steedos/metadata-registrar";



// const TRIGGERKEYS = ['beforeFind', 'beforeInsert', 'beforeUpdate', 'beforeDelete', 'afterFind', 'afterInsert', 'afterUpdate', 'afterDelete', 'afterFindOne', 'afterCount']

// function getObject(objectName: string) {
//     try {
//         const objectql = require('@steedos/objectql');
//         return objectql.getObject(objectName);
//     } catch (error) {
//         return null
//     }
// }

export async function load(broker: any, packagePath: string, packageServiceName: string) {
    // let actions = {};
    // let serviceName = `~triggers-${packageServiceName}`;
    let filePath = path.join(packagePath, "**");
    let objTriggers = loadObjectTriggers(filePath, packageServiceName);
    if (_.isEmpty(objTriggers)) {
        return;
    }
    /** objTriggers格式
    [
        {
            beforeInsert: [AsyncFunction: beforeInsert],
            beforeUpdate: [AsyncFunction: beforeUpdate],
            beforeDelete: [AsyncFunction: beforeDelete],
            afterInsert: [AsyncFunction: afterInsert],
            afterUpdate: [AsyncFunction: afterUpdate],
            afterDelete: [AsyncFunction: afterDelete],
            metadataServiceName: '~packages-my-steedos-package',
            listenTo: 'company'
        }
    ]
     */
    for (const trigger of objTriggers) {
        // 转换为action trigger
        /** action trigger 格式
        spaceUsersBeforeUpdate: {
            trigger: { 
                listenTo: 'space_users', 
                when: ['beforeInsert', 'beforeUpdate']
            },
            async handler(ctx) {
                this.broker.logger.debug('spaceUsersBeforeUpdate', ctx)
            }   
        }
         */
        // const actionTriggerName = getMD5(JSONStringify(trigger));
        // actions[actionTriggerName] = generateActionTrigger(trigger)
    
        broker.emit('trigger.loaded', {
            objectName: trigger['listenTo']
        })
    }

    // let serviceConfig = {
    //     name: serviceName,
    //     actions: actions
    // };
    // let service = broker.createService(serviceConfig);
    // if (!broker.started) {
    //     await broker._restartService(service)
    // }

}

// 生成action trigger
// function generateActionTrigger(trigger) {
//     const when = [];
//     for (const key in trigger) {
//         if (Object.hasOwnProperty.call(trigger, key)) {
//             if (_.contains(TRIGGERKEYS, key)) {
//                 when.push(key);
//             }
//         }
//     }
//     const actionTrigger = {
//         trigger: {
//             listenTo: trigger.listenTo,
//             when: when
//         },
//         async handler(ctx) {
//             // 调用trigger.js的处理函数
//             const {
//                 isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, isFindOne, isCount,
//                 id, doc, previousDoc,
//                 // size, 
//                 userId, spaceId, objectName, query, data }: any = ctx.params;

//             const context: any = {
//                 id,
//                 userId,
//                 spaceId,
//                 doc,
//                 previousDoc,
//                 query,
//                 data,
//                 objectName
//             }

//             let when = ''
//             if (isBefore) {
//                 if (isFind) {
//                     when = 'beforeFind'
//                 } else if (isInsert) {
//                     when = 'beforeInsert'
//                 } else if (isUpdate) {
//                     when = 'beforeUpdate'
//                 } else if (isDelete) {
//                     when = 'beforeDelete'
//                 }
//             }
//             else if (isAfter) {
//                 if (isFind) {
//                     when = 'afterFind'
//                 } else if (isInsert) {
//                     when = 'afterInsert'
//                 } else if (isUpdate) {
//                     when = 'afterUpdate'
//                 } else if (isDelete) {
//                     when = 'afterDelete'
//                 } else if (isFindOne) {
//                     when = 'afterFindOne'
//                 } else if (isCount) {
//                     when = 'afterCount'
//                 }
//             }

//             if (when) {
//                 const object = getObject(objectName);
//                 if(!object){
//                     return ;
//                 }
//                 await object.runTriggers(when, context);
//                 return context;
//             }
//         }
//     };
//     return actionTrigger;
// }