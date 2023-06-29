
import { LoadTabFile } from '@steedos/metadata-core';
import { registerTab } from '../metadata-register/tab';
import { registerPermissionTabs } from '../metadata-register/permissionTabs';
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
    for (const apiName in tabs) {
        const tab = tabs[apiName];
        if (tab.permissions) {
            for (const pt of tab.permissions) {
                pt.tab = apiName;
            }
            // 注册permission_tabs
            await registerPermissionTabs.mregister(broker, packageServiceName, tab.permissions)
            
        }
    }
}