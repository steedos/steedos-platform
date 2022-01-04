import { LoadPageFile } from '@steedos/metadata-core';
import { registerPage } from '../metadata-register/page';
import { getSteedosSchema } from '../types'
const loadPageFile = new LoadPageFile();

export const registerPackagePages = async (packagePath: string, packageServiceName: string)=>{
    const pages = loadPageFile.load(packagePath);
    const schema = getSteedosSchema();
    for (const apiName in pages) {
        const page = pages[apiName];
        await registerPage.register(schema.broker, packageServiceName, Object.assign(page, {is_system:true, record_permissions: {
            allowEdit: false,
            allowDelete: false,
            allowRead: true,
        }}))
    }
}