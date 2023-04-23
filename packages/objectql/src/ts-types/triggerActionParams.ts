/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-28 17:09:19
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-21 11:17:05
 * @Description: 
 */
import { JsonMap } from "@salesforce/ts-types";
import { SteedosIDType, SteedosQueryOptions } from "..";

export type TriggerActionParams = {
    isInsert?: boolean,
    isUpdate?: boolean,
    isDelete?: boolean,
    isFind?: boolean,
    isBefore?: boolean,
    isAfter?: boolean,
    isFindOne?: boolean,
    isCount?: boolean,
    id?: SteedosIDType,          // 记录的唯一标识
    doc?: JsonMap,               // 需要新增/修改的记录内容
    previousDoc?: JsonMap,       // 修改/删除前的记录, 仅afterUpdate, afterDelete时存在此属性
    size?: number,
    userId: SteedosIDType,       // 当前用户唯一标识
    spaceId?: SteedosIDType,     // 当前工作区
    objectName?: string          // 当前对象名称
    query?: SteedosQueryOptions, // 查询数据相关参数, 仅beforeFind时存在此属性
    data?: JsonMap               // 仅afterFind，afterCount时存在此属性
}

