import { LoadTabFile } from '@steedos/metadata-core';
import { registerTab } from '../metadata-register/tab';
import { getSteedosSchema } from '../types'
const loadTabFile = new LoadTabFile();

export const registerPackageTabs = async (packagePath: string, packageServiceName: string)=>{
    const tabs = loadTabFile.load(packagePath);
    const schema = getSteedosSchema();
    for (const apiName in tabs) {
        const tab = tabs[apiName];
        await registerTab.register(schema.broker, packageServiceName, Object.assign(tab, {is_system:true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
}