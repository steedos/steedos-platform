/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 17:47:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 17:53:10
 * @Description: 
 */
import { LoadAppFile } from '@steedos/metadata-core';
import { registerApp } from '../metadata-register/app';
const loadAppFile = new LoadAppFile();

export const registerPackageApps = async (packagePath: string, packageServiceName: string)=>{
    const apps = loadAppFile.load(packagePath);
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