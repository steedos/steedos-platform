/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 17:52:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 17:52:35
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadAppFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Application);
    }
}