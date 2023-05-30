/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:55:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 11:56:00
 * @Description: 
 */
import { LoadShareRules } from '@steedos/metadata-core';
import { registerShareRules } from '../metadata-register/shareRules';
const loadShareRules = new LoadShareRules();

export const registerPackageShareRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadShareRules.load(packagePath);
    const data = [];
    for (const apiName in metadata) {
        const item = metadata[apiName];
        data.push(Object.assign(item, {
            is_system: true, record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }))
    }
    if (data.length > 0) {
        await registerShareRules.mregister(broker, packageServiceName, data)
    }
}