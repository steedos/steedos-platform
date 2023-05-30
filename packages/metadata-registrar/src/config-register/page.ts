/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:54:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 11:54:38
 * @Description: 
 */
import { LoadPageFile } from '@steedos/metadata-core';
import { registerPage } from '../metadata-register/page';
const loadPageFile = new LoadPageFile();

export const registerPackagePages = async (packagePath: string, packageServiceName: string)=>{
    const pages = loadPageFile.load(packagePath);
    const data = [];
    for (const apiName in pages) {
        const page = pages[apiName];
        data.push(Object.assign(page, {
            is_system: true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))

    }
    if (data.length > 0) {
        await registerPage.mregister(broker, packageServiceName, data)
    }
}