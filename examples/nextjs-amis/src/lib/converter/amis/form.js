/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 10:56:28
 * @Description: 
 */
import { getSections } from '@/lib/converter/amis/fields/sections';

export function getFormBody(permissionFields, objectConfig){
    return getSections(permissionFields, objectConfig);
}