import { LoadRestrictionRules } from '@steedos/metadata-core';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
import { getSteedosSchema } from '../types'
const loadRestrictionRules = new LoadRestrictionRules();

export const registerPackageRestrictionRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadRestrictionRules.load(packagePath);
    const schema = getSteedosSchema();
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
        await registerRestrictionRules.mregister(schema.broker, packageServiceName, data)
    }
}