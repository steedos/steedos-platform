/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-28 17:09:19
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-04-04 10:35:11
 * @Description: 
 */
import { JsonMap } from "@salesforce/ts-types";
import { SteedosIDType, SteedosQueryOptions } from "..";

export type TriggerActionParams = {
    isInsert?: boolean,
    isUpdate?: boolean,
    isDelete?: boolean,
    isBefore?: boolean,
    isAfter?: boolean,
    isUndelete?: boolean,
    when?: "before.find" | "before.aggregate" | "before.insert" | "before.update" | "before.delete" | "after.find" | "after.aggregate" | "after.count" | "after.findOne" | "after.insert" | "after.update" | "after.delete" | "after.undelete",
    size?: number,
    id?: SteedosIDType,          // 记录的唯一标识
    userId: SteedosIDType,       // 当前用户唯一标识
    spaceId?: SteedosIDType,     // 当前工作区
    doc?: JsonMap,               // 需要新增/修改的记录内容
    previousDoc?: JsonMap,       // 修改/删除前的记录, 仅afterUpdate, afterDelete时存在此属性
    query?: SteedosQueryOptions, // 查询数据相关参数, 仅beforeFind时存在此属性
    data?: JsonMap               // 仅afterFind，afterCount时存在此属性
    objectName?: string          // 当前对象名称
}

