/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 14:50:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 14:50:20
 * @Description: 
 */

import { MetadataRegister } from "../metadata-register";

/***
 * 此文件不再维护，请使用tab.ts
 */
export const addTabConfig = async (tabConfig: any, serviceName: string = '') => {
    await MetadataRegister.addTab(serviceName, tabConfig);
}

export const removeTab = async (tabApiName) => {
    await MetadataRegister.removeTab(tabApiName);
}