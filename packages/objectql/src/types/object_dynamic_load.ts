import { SteedosActionTypeConfig } from './action'
import _ = require('underscore')
import path = require('path')
import crypto = require('crypto')
import { transformTrigger } from '../util'

function makeTriggerName(trigger){
    var md5 = crypto.createHash('md5');
    return md5.update(trigger.toString()).digest('hex') + _.random(0, 1000000);
}

export class objectDynamicLoad{
    static objectList = [];
    static appList = [];
    static methodList = [];
    static triggerList = [];
    static actionList = [];
    static routerList = [];
    // static reportList = [];

    static getObjects(datasourceName: string){
        return _.filter(this.objectList, (item)=>{
            return item.datasourceName === datasourceName
        })
    }

    static getApps(){
        return this.appList
    }

    static getMethods(objectName: string){
        return _.filter(this.methodList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getTriggers(objectName: string){
        return _.filter(this.triggerList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getActions(objectName: string){
        return _.filter(this.actionList, (item)=>{
            return item.objectName === objectName
        })
    }

    static getRouters(){
        return this.routerList
    }

    // static getReports(){
    //     return this.reportList
    // }
}

export function addObjects(datasourceName: string, filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    objectDynamicLoad.objectList.push({datasourceName, filePath})
}

export function addApps(filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }
    
    objectDynamicLoad.appList.push({filePath})
}

// export function addReports(filePath: string){
//     if(!path.isAbsolute(filePath)){
//         throw new Error(`${filePath} must be an absolute path`);
//     }
    
//     objectDynamicLoad.reportList.push({filePath})
// }

export function addMethod(objectName: string, methodName: string, method: Function){
    objectDynamicLoad.methodList.push({objectName, methodName, method})
}

export function addTrigger(objectName: string, when: string, trigger: Function){
    // switch (when) {
    //     case 'beforeInsert':
    //         when = 'before.insert'
    //         break;
    //     case 'beforeUpdate':
    //         when = 'before.update'
    //         break;
    //     case 'beforeDelete':
    //         when = 'before.delete'
    //         break;
    //     case 'afterInsert':
    //         when = 'after.insert'
    //         break;
    //     case 'afterUpdate':
    //         when = 'after.update'
    //         break;
    //     case 'afterDelete':
    //         when = 'after.delete'
    //         break;
    //     default:
    //         break;
    // }
    let on = 'server';

    let triggerName = `${objectName}_${when}_${on}_${makeTriggerName(trigger)}`;


    trigger = transformTrigger(when, trigger);

    objectDynamicLoad.triggerList.push({objectName, triggerName, trigger: {on, when, todo: trigger}})
}

export function addAction(objectName: string, actionName: string, action: SteedosActionTypeConfig){
    objectDynamicLoad.actionList.push({objectName, actionName, action})
}

export function addRouter(routerPath: string, router: any){
    objectDynamicLoad.routerList.push({routerPath, router})
}