/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 11:18:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-22 11:32:28
 * @Description: 
 */

import { MetadataCacherBase } from './base'

export class ActionFieldUpdateCacher extends MetadataCacherBase{
    constructor(){
        super('action_field_updates', true);
    }
}