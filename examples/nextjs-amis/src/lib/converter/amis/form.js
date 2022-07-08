/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-07 11:02:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 16:59:39
 * @Description: 
 */
import { getSections } from '@/lib/converter/amis/fields/sections';

export async function getFormBody(permissionFields, objectConfig){
    return await getSections(permissionFields, objectConfig);
}