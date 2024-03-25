/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 11:18:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-22 11:21:04
 * @Description: 
 */

import { MetadataCacherBase } from './base'

export class WorkflowOutboundMessageCacher extends MetadataCacherBase{
    constructor(){
        super('workflow_outbound_messages', true);
    }
}