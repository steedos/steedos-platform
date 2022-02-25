import { LoadQueryFile } from '@steedos/metadata-core';
import { registerQuery } from '../metadata-register/query';
import { getSteedosSchema } from '../types'
const loadQueryFile = new LoadQueryFile();

export const registerPackageQueries = async (packagePath: string, packageServiceName: string)=>{
    const packageQueries = loadQueryFile.load(packagePath);
    const schema = getSteedosSchema();
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
        await registerQuery.mregister(schema.broker, packageServiceName, data)
    }
}