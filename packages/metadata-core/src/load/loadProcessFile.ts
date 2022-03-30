/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:06:13
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 11:07:31
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadProcessFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Process);
    }
}