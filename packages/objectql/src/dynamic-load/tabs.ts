import { getSteedosSchema } from "..";

export const addTabConfig = async (tabConfig: any, serviceName: string = '') => {
    const schema = getSteedosSchema();
    await schema.metadataRegister?.addTab(serviceName, tabConfig);
}

export const removeTab = async (tabApiName) => {
    const schema = getSteedosSchema();
    await schema.metadataRegister?.removeTab(tabApiName);
}