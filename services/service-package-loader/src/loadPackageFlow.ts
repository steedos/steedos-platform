import { LoadFlowFile } from '@steedos/metadata-core';
const loadFlowFile = new LoadFlowFile();
const path = require('path');

export const sendPackageFlowToDb = async (broker, packagePath: string, name: string)=>{
    const flows = loadFlowFile.load(path.join(packagePath, '**'));
    for (const apiName in flows) {
        const flow = flows[apiName];
        const flowFilePath = flow.__filename;
        delete flow.__filename;
        try {
            await broker.call('service-package-loader.importFlow', {flow: flow}, {meta: {name: name}})
        } catch (error) {
            console.error(`importFlow error`, flowFilePath, error)
        }
    }
}