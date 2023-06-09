/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 11:36:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-06-08 14:44:12
 * @Description: 
 */
import { registerPackageQueries } from "./query";
import { registerPackageCharts } from "./chart";
import { registerPackagePages } from "./page";
import { registerPackageTabs } from "./tab";
import { registerPackageShareRules } from "./shareRules";
import { registerPackageRestrictionRules } from "./restrictionRules";
import { addTranslationsFiles } from "./translations";
import { addObjectTranslationsFiles } from "./object_translations";
import { registerPackageApps } from "./app";
import { addObjectConfigFiles, addObjectDataFiles, addRouterFiles, addServerScriptFiles } from "./core";
import { addConfigFiles } from "../config";
import { loadPackageClientScripts } from "./client_script";
import { canLoadMetadata, CanLoadedMetadataType } from "../utils";

export { loadStandardMetadata } from './core'

export const registerMetadataConfigs = async (filePath, datasourceApiName, serviceName) => {
    //TODO 仅主服务需要?
    if(canLoadMetadata(CanLoadedMetadataType.Router)){
        addRouterFiles(filePath);
    }
    if(canLoadMetadata(CanLoadedMetadataType.Object)){
        await addObjectConfigFiles(filePath, datasourceApiName, serviceName);
    }
    if(canLoadMetadata(CanLoadedMetadataType.App)){
        await registerPackageApps(filePath, serviceName);
    }
    
    await registerPackageQueries(filePath, serviceName);
    await registerPackageCharts(filePath, serviceName);
    await registerPackagePages(filePath, serviceName);
    await registerPackageTabs(filePath, serviceName);
    await registerPackageShareRules(filePath, serviceName);
    await registerPackageRestrictionRules(filePath, serviceName);
    //TODO 仅主服务需要?
    if(canLoadMetadata(CanLoadedMetadataType.ClientJS)){
        loadPackageClientScripts(serviceName, filePath);
    }
    if(canLoadMetadata(CanLoadedMetadataType.ObjectJS)){
        addServerScriptFiles(filePath);
    }
    if(canLoadMetadata(CanLoadedMetadataType.Translation)){
        await addTranslationsFiles(filePath);
    }
    if(canLoadMetadata(CanLoadedMetadataType.ObjectTranslation)){
        await addObjectTranslationsFiles(filePath);
    }
    //TODO 已下仅主服务需要?
    addConfigFiles('report', filePath);
    addConfigFiles('flow', filePath);
    addConfigFiles('form', filePath);
    addConfigFiles('dashboard', filePath);
    addObjectDataFiles(filePath);
}