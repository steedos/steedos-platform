/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:56:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 11:56:29
 * @Description: 
 */
import { LoadRestrictionRules } from '@steedos/metadata-core';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
const loadRestrictionRules = new LoadRestrictionRules();

export const registerPackageRestrictionRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadRestrictionRules.load(packagePath);
    const data = [];
    for (const apiName in metadata) {
        const item = metadata[apiName];
        data.push(Object.assign(item, {
            is_system: true, record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }));
    }
    if (data.length > 0) {
        await registerRestrictionRules.mregister(broker, packageServiceName, data)
    }
}