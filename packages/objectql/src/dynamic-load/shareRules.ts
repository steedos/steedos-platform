import { LoadShareRules } from '@steedos/metadata-core';
import { registerShareRules } from '../metadata-register/shareRules';
import { getSteedosSchema } from '../types'
const loadShareRules = new LoadShareRules();

export const registerPackageShareRules = async (packagePath: string, packageServiceName: string) => {
    const metadata = loadShareRules.load(packagePath);
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
        }))
    }
    if (data.length > 0) {
        await registerShareRules.mregister(schema.broker, packageServiceName, data)
    }
}