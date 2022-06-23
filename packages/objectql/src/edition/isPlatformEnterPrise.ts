/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-23 18:32:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-23 18:37:26
 * @Description: 判断是否是企业版工作区
 */
import { getSteedosSchema } from "..";

const PLATFORM_ENTERPRISE = 'platform-enterprise'

export async function isPlatformEnterPrise(spaceId: String) {
    const allow = await getSteedosSchema().broker.call(`@steedos/service-package-license.hasProduct`, { key: PLATFORM_ENTERPRISE, spaceId })
    return allow
}