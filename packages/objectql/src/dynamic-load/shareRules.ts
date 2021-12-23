import { LoadShareRules } from '@steedos/metadata-core';
import { registerRestrictionRules } from '../metadata-register/restrictionRules';
import { getSteedosSchema } from '../types'
const loadShareRules = new LoadShareRules();

export const registerPackageRestrictionRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadShareRules.load(packagePath);
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