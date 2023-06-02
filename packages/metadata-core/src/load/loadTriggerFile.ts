/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-24 16:40:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-24 16:42:05
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadTriggerFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Trigger);
    }
}