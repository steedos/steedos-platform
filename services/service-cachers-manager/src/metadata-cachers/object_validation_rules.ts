/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-22 11:18:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-29 13:34:04
 * @Description: 
 */

import { MetadataCacherBase } from './base'

export class ObjectValidationRulesCacher extends MetadataCacherBase{
    constructor(){
        super('object_validation_rules', true);
    }
}