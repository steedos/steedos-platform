/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 17:47:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 12:22:02
 * @Description: 
 */
import { getConfigsFormFiles } from '../config';
import { registerApp } from '../metadata-register/app';

export const registerPackageApps = async (packagePath: string, packageServiceName: string)=>{
    const apps = getConfigsFormFiles('app', packagePath);
    for (const apiName in apps) {
        const appConfig = apps[apiName];
        await registerApp(broker, packageServiceName, Object.assign(appConfig, {
            is_system: true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
}