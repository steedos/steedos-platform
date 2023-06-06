import { LoadTabFile } from '@steedos/metadata-core';
import { registerTab } from '../metadata-register/tab';
const loadTabFile = new LoadTabFile();

export const registerPackageTabs = async (packagePath: string, packageServiceName: string)=>{
    const tabs = loadTabFile.load(packagePath);
    for (const apiName in tabs) {
        const tab = tabs[apiName];
        await registerTab.register(broker, packageServiceName, Object.assign(tab, {is_system:true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
}