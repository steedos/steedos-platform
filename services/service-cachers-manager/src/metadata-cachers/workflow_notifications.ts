/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 11:18:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-22 11:32:30
 * @Description: 
 */



import { MetadataCacherBase } from './base'

export class WorkflowNotificationCacher extends MetadataCacherBase{
    constructor(){
        super('workflow_notifications', true);
    }
}