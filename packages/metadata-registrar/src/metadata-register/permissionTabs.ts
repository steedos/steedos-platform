/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-06-28 16:43:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-06-28 16:45:23
 * @FilePath: /project-template/Users/sunhaolin/Documents/GitHub/steedos-platform-2.3/packages/metadata-registrar/src/metadata-register/permissionTabs.ts
 * @Description: 
 */
import { RegisterBase } from "./_base";
const SERVICE_NAME = 'permission_tabs';
class RegisterPermissionTabs extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.permission_set}_${config.tab}`
    }
}

export const registerPermissionTabs = new RegisterPermissionTabs();