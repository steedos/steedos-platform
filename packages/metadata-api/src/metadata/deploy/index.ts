import { DbManager } from '../../util/dbManager'
import { jsonToDb } from './jsonToDb';
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core'
import { loadFileToJson } from './fileToJson';

export const deployMetadata = async (packagePath, userSession, packageYml?) => {
    var dbManager = new DbManager(userSession);
    try {
        let SteedosPackage = await loadFileToJson(packagePath, packageYml);

        var isEmptyPackage = true;
        for (const metadataName in SteedosPackage) {
            const metadata = SteedosPackage[metadataName];
            for (const key in metadata) {
                if (metadata[key]) {
                    isEmptyPackage = false;
                    break;
                }
            }
        }
        if (isEmptyPackage) {
            throw new Error('data not found in package');
        }

        //todo 限制要挪到jsonToDb里
        const masterDetailLimit = 2;
        for (const metadataName in SteedosPackage) {
            if (metadataName == TypeInfoKeys.Object) {
                const objects = SteedosPackage[metadataName];
                for (const objectName in objects) {
                    const object = objects[objectName];
                    const fields = object[TypeInfoKeys.Field];
                    let masterDetailCount = 0;
                    for (const FieldName in fields) {
                        const field = fields[FieldName];
                        if (field['type'] == 'master_detail') {
                            if (++masterDetailCount > masterDetailLimit) {
                                throw new Error('Field type [master_detail] over limit in Object: ' + objectName + ", max:" + masterDetailLimit);
                            }
                        }
                    }
                }
            }
        }

        await dbManager.connect();
        var session = await dbManager.startSession();
        await jsonToDb(SteedosPackage, dbManager, session);
    } finally {
        await dbManager.endSession();
        await dbManager.close();
    }
}