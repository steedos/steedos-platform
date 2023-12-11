/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 13:09:21
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-10 16:01:34
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
export class LoadPrintFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Print);
    }
}