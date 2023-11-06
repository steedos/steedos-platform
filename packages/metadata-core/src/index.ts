const path = require("path");
const fs = require("fs");
const os = require("os");
import * as _  from 'underscore';
import * as fsLib from 'graceful-fs';
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, 
    getMetadataTypeInfo, getChildMetadataTypeInfos, getMetadataTypeInfoByExt,
    getMetadataTypeInfoByDirectory, getMetadataTypeInfos, getAllowSyncMetadataKeys } from './typeInfo'

import { getDefaultPackagePath } from './packages/index'
import { getAllPackages, getProjectWorkPath, getServicesPackages } from './project/index'

export { SteedosMetadataTypeInfoKeys, getMetadataKeys, getMetadataTypeInfo, getAllowSyncMetadataKeys } from './typeInfo'
export * from './metadata'
export * from './loadFile'
export { jsonToFile } from './jsonToFile'
export { mkTempFolder, createIfNotExist, mkdirsSync, deleteFolderRecursive, getRetrievePackageInfo } from './folderUtil'
export { compressFiles, decompressAndDeploy, getPackageYml } from './compressUtil'
export * from './packages'

export * from './auth/index'
export * from './project/index'
export * from './output'
export * from './util/function';
export * from './load';
export * from './util/match_files';

const DEFAULT_PACKAGE_PATH_OLD = 'steedos-app';
// const DEFAULT_PACKAGE_PATH = '.';

//TODO 待完善
//record是数据库里的记录
export function getFullName(metadataName, record) {
    if(!record){
        console.log(metadataName);
    }
    switch (metadataName) {
        case TypeInfoKeys.Application:
            return record.code;
        case TypeInfoKeys.Flow:
        case TypeInfoKeys.FlowRole:
        case TypeInfoKeys.Role:
            return record.api_name;
        case TypeInfoKeys.Permission:
            return record.permission_set_id;
        case TypeInfoKeys.Layout:
            return `${record.object_name}.${record.name}`;
        default:
            return record.name;
    }
}

export function getMetadataNameByExt(fileExt) {
    const metadataTypeInfo = getMetadataTypeInfoByExt(fileExt);
    return metadataTypeInfo.metadataName;
}

export function getFileinfoByFilename(filename) {
    
    var fileInfo = {}
    var metadataName;
    var itemName;
    var suffix;
    var parentName;
    var unsupportedFile;
    var unPackageYmlFile = false;

    if(filename.endsWith('.object.js')){
        metadataName = TypeInfoKeys.Server;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.client.js')){
        metadataName = TypeInfoKeys.Client;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.function.js')){
        metadataName = TypeInfoKeys.Function;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.router.js')){
        metadataName = TypeInfoKeys.Router;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.trigger.yml')){
        metadataName = TypeInfoKeys.Trigger;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.object.yml')){
        metadataName = TypeInfoKeys.Object;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.process.yml')){
        metadataName = TypeInfoKeys.Process;
        itemName = _.first(filename.split('.'));
    }else if(filename.endsWith('.field.yml')){
        metadataName = TypeInfoKeys.Field;
        itemName = filename.replace('.field.yml', "");

    }else if(filename.endsWith('.button.yml')){
        metadataName = TypeInfoKeys.Action;
        itemName = filename.replace('.button.yml', "");
        
    }
    else if(filename.endsWith('.button.js')){
        metadataName = TypeInfoKeys.ActionScript;
        itemName = filename.replace('.button.js', "");
        // suffix = '.script'
    }
    else if(filename.endsWith('.listview.yml')){
        metadataName = TypeInfoKeys.Listview;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.permission.yml')){
        metadataName = TypeInfoKeys.Permission;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.validationRule.yml')){
        metadataName = TypeInfoKeys.ValidationRule;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.app.yml')){
        metadataName = TypeInfoKeys.Application;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.permissionset.yml')){
        metadataName = TypeInfoKeys.Permissionset;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.profile.yml')){
        metadataName = TypeInfoKeys.Profile;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.report.yml')){
        metadataName = TypeInfoKeys.Report;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.layout.yml')){
        metadataName = TypeInfoKeys.Layout;

        var parts = filename.split('.');

        parentName = _.first(parts);
        itemName = _.last(_.first(parts, 2));

    }else if(filename.endsWith('.objectTranslation.yml')){
        metadataName = TypeInfoKeys.ObjectTranslation;

        var parts = filename.split('.');//project__c.en.objectTranslation.yml
        parentName = _.first(parts);
        itemName = _.first(parts, 2).join('.');
        unPackageYmlFile = true;

    }else if(filename.endsWith('.translation.yml')){
        metadataName = TypeInfoKeys.Translation;

        var parts = filename.split('.');//en.translation.yml
        itemName = _.first(parts);
        unPackageYmlFile = true;
    
    }
    // else if(filename.endsWith('.dashboard.yml')){
    //     metadataName = TypeInfoKeys.Dashboard;

    //     var parts = filename.split('.');
    //     itemName = _.first(parts);
    //     unPackageYmlFile = true;
    
    // }
    else if(filename.endsWith('.workflow.yml')){
        metadataName = TypeInfoKeys.Workflow;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.flow.json')){
        metadataName = TypeInfoKeys.Flow;
        itemName = _.first(filename.split('.'));
        
    }else if(filename.endsWith('.approvalProcess.yml')){
        metadataName = TypeInfoKeys.ApprovalProcess;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.role.yml')){
        metadataName = TypeInfoKeys.Role;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.flowRole.yml')){
        metadataName = TypeInfoKeys.FlowRole;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.query.yml')){
        metadataName = TypeInfoKeys.Query;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.page.yml')){
        metadataName = TypeInfoKeys.Page;
        itemName = _.first(filename.split('.'));

    }
    // 使用正则表达式校验{yyy}.page.{xxx}.json
    else if(filename.match(/^[a-zA-Z0-9_-]+\.page\.[a-zA-Z0-9_-]+\.json$/)){
        metadataName = TypeInfoKeys.Page;
        itemName = _.first(filename.split('.'));
    }else if(filename.endsWith('.process.yml')){
        metadataName = TypeInfoKeys.Process;
        itemName = _.first(filename.split('.'));
    }
    // 使用正则表达式校验 {xxx}.process.{yyy}.{zzz}
    else if(filename.match(/^[a-zA-Z0-9_-]+\.process\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/)){
        metadataName = TypeInfoKeys.Process;
        itemName = _.first(filename.split('.'));
    }
    else if(filename.endsWith('.chart.yml')){
        metadataName = TypeInfoKeys.Chart;
        itemName = _.first(filename.split('.'));
    }else if(filename.endsWith('.tab.yml')){
        metadataName = TypeInfoKeys.Tab;
        itemName = _.first(filename.split('.'));
    } else if (filename.endsWith('.shareRule.yml')) {
        metadataName = TypeInfoKeys.ShareRule;
        itemName = _.first(filename.split('.'));
    } else if (filename.endsWith('.restrictionRule.yml')) {
        metadataName = TypeInfoKeys.RestrictionRule;
        itemName = _.first(filename.split('.'));
    }else if(filename.endsWith('.import.yml')){
        metadataName = TypeInfoKeys.Import;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.dashboard.yml')){
        metadataName = TypeInfoKeys.Dashboard;
        itemName = _.first(filename.split('.'));

    }else if(filename.endsWith('.question.yml')){
        metadataName = TypeInfoKeys.Question;
        itemName = _.first(filename.split('.'));

    }else{
        unsupportedFile = filename;
        //throw new Error('unsupported filename:'+ filename);
    }
    fileInfo['metadataName'] = metadataName;
    fileInfo['parentName'] = parentName;
    fileInfo['itemName'] = itemName;
    fileInfo['suffix'] = suffix;
    fileInfo['unsupportedFile'] = unsupportedFile;
    fileInfo['unPackgeYmlFile'] = unPackageYmlFile;
    return fileInfo;
}

export function getMetadataNameByDirectory(fileExt) {
    const metadataTypeInfo = getMetadataTypeInfoByDirectory(fileExt);
    if(metadataTypeInfo){
        return metadataTypeInfo.metadataName;
    }
    return undefined;
}

export function getChildMetadataNames(metadataName) {
    const childMetadataTypeInfos = getChildMetadataTypeInfos(metadataName);
    return _.pluck(childMetadataTypeInfos, 'metadataName');
}

export function hasChild(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    
    return metadataTypeInfo.childMetadataNames?.length > 0;
}

export function getChilds(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    
    return metadataTypeInfo.childMetadataNames;
}

export function getFunctionFields(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    
    return metadataTypeInfo.functionFields;
}

export function getParentMetadataName(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    return metadataTypeInfo.parent;
}

export function hasParent(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    return (typeof metadataTypeInfo !== 'undefined' && typeof metadataTypeInfo.parent != 'undefined');
}

export function getParentFolder(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    if (hasParent(metadataName)) {
        const parentMetadataTypeInfo = getMetadataTypeInfo(metadataTypeInfo.parent);
        return parentMetadataTypeInfo.defaultDirectory;
    } else {
        return metadataTypeInfo.defaultDirectory;
    }
}

export function getFolderPath(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    return metadataTypeInfo.defaultDirectory;
}

export function getFileExt(metadataName) {
    const metadataTypeInfo = getMetadataTypeInfo(metadataName);
    return metadataTypeInfo.ext
}

export function getPackagePath(dir?: string) {
    const defaultPackagePath = getDefaultPackagePath(dir);

    return defaultPackagePath ? defaultPackagePath : DEFAULT_PACKAGE_PATH_OLD

    // if(defaultPackagePath){
    //     return defaultPackagePath;
    // }

    // const projectDir = getProjectWorkPath();

    // if(fs.existsSync(path.join(projectDir, 'package.service.js'))){
    //     return DEFAULT_PACKAGE_PATH;
    // }else{
    //     return DEFAULT_PACKAGE_PATH_OLD;
    // }
}

export function getPackageDirectoryPaths(workspace){
    let packageDirs = [getPackagePath(workspace)];
    let packages = getAllPackages(workspace);
    let services = getServicesPackages(workspace);
    return packageDirs.concat(packages).concat(services)
}

export function getPackagePaths(packagePath?: string) {
    if (!packagePath) {
        packagePath = getPackagePath();
    }
    return path.join(packagePath, 'main', 'default')
}

export function getOrganizationNamespace(spaceId: string){
    return '';
}
/**
 * @param spaceId 
 */
export function getMetadataTypeObjects(spaceId: string) {
    //TODO 从云端获取namespace
    const metadataObjects: any = [];
    const typeInfos = getMetadataTypeInfos();
    console.log(`typeInfos`, typeInfos)
    const allowSyncMetadataKeys = getAllowSyncMetadataKeys();
    console.log(`allowSyncMetadataKeys`, allowSyncMetadataKeys)
    _.each(typeInfos, function (info, metadataName) {
        if (!_.has(info, 'parent') && _.include(allowSyncMetadataKeys, metadataName)) {
            metadataObjects.push({
                "directoryName": info.defaultDirectory,
                "inFolder": false,
                "metaFile": false,
                "suffix": info.ext,
                "metadataName": metadataName
            })
        }
    })
    return {
        metadataObjects: metadataObjects,
        organizationNamespace: getOrganizationNamespace(spaceId),
        partialSaveAllowed: true,
        testRequired: false
    }
}