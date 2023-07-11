/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 13:09:21
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 13:16:15
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
export class LoadImportFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Import);
    }
}