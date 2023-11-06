/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-07-28 11:10:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-28 11:44:00
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadDashboardFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Dashboard);
    }
}