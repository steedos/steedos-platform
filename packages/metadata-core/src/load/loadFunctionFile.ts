/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-15 10:13:16
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-15 10:14:12
 * @FilePath: /steedos-platform-2.3/packages/metadata-core/src/load/loadFunctionFile.ts
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";
export class LoadFunctionFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.FunctionYML);
    }
}