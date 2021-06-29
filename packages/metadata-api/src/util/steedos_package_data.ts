import { DbManager } from './dbManager';
import { dbToJson } from '../metadata/retrieve/dbToJson';
export async function getSteedosPackageData(packageManifest, userSession){
    //todo 事务
    var dbManager = new DbManager(userSession);
    try {
        await dbManager.connect();
        var steedosPackage = {};
        var dbJson = await dbToJson(packageManifest, steedosPackage, dbManager);
        return dbJson;
    } catch (error) {
        throw error;
    }finally{
        await dbManager.close();
    }
}