import { getSteedosSchema } from "..";
/***
 * 此文件不再维护，请使用tab.ts
 */
export const addTabConfig = async (tabConfig: any, serviceName: string = '') => {
    const schema = getSteedosSchema();
    await schema.metadataRegister?.addTab(serviceName, tabConfig);
}

export const removeTab = async (tabApiName) => {
    const schema = getSteedosSchema();
    await schema.metadataRegister?.removeTab(tabApiName);
}