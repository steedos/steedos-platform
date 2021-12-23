import { LoadRestrictionRules } from '@steedos/metadata-core';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
import { getSteedosSchema } from '../types'
const loadRestrictionRules = new LoadRestrictionRules();

export const registerPackageRestrictionRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadRestrictionRules.load(packagePath);
    const schema = getSteedosSchema();
    for (const apiName in metadata) {
        const item = metadata[apiName];
        await registerRestrictionRules.register(schema.broker, packageServiceName, Object.assign(item, {
            is_system: true, record_permissions: {
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        }))
    }
}