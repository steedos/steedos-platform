/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:37:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 11:45:07
 * @Description: 
 */
import { LoadQueryFile } from '@steedos/metadata-core';
import { registerQuery } from '../metadata-register/query';
const loadQueryFile = new LoadQueryFile();

export const registerPackageQueries = async (packagePath: string, packageServiceName: string)=>{
    const packageQueries = loadQueryFile.load(packagePath);
    const data = [];
    for (const apiName in packageQueries) {
        const query = packageQueries[apiName];
        data.push(Object.assign(query, {
            is_system: true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
    if (data.length > 0) {
        await registerQuery.mregister(broker, packageServiceName, data)
    }
}