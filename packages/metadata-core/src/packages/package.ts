import { getMetadataName } from '../metadata'
import { getProjectWorkPath, resolveProjectPathSync } from '../project/index'
const _ = require('underscore');
const yaml = require('js-yaml');
const fs = require('fs')
const path = require('path')
const ini = require('ini')

export type PackageRecord = {
    tableName: string,
    memberName: string,
    parentTableName?: string,
    parentMemberName?: string
}

const getFullName = function(packageRecord: PackageRecord){
    const {memberName, parentMemberName} = packageRecord
    if(parentMemberName){
        return `${parentMemberName}.${memberName}`;
    }else{
        return memberName;
    }
}

const toYMLBase64 = function(json){
    var ymlContent = yaml.dump(json);
    var ymlBuffer = Buffer.from(ymlContent);
    var requestYmlBase64 = ymlBuffer.toString('base64');
    return requestYmlBase64;
}

export function makePackageManifest(records: Array<PackageRecord>){
    const packageData = {};
    _.each(records, function(record: PackageRecord){
        const key = getMetadataName(record.tableName);
        if(key){
            if(!_.has(packageData, key)){
                packageData[key] = [];
            }
            packageData[key].push(getFullName(record));
        }
    })
    return packageData;
}

export function makePackageManifestYMLBase64(records: Array<PackageRecord>){
    const packageData = makePackageManifest(records);
    return toYMLBase64(packageData);
}

export function setDefaultPackagePath(defaultPackagePath, workspace?: string){
    if(path.isAbsolute(defaultPackagePath)){
        defaultPackagePath = path.relative(getProjectWorkPath(workspace), defaultPackagePath);
    }
    var localEnvPath = getLocalEnvPath(workspace)
    var localEnv = {};
    try{
        localEnv = ini.parse(fs.readFileSync(localEnvPath, 'utf-8'))
    }catch(err){
        
    }finally{
        if(!localEnv){
            localEnv = {}
        }
        localEnv['DEFAULT_PACKAGE_PATH'] = defaultPackagePath
    }

    fs.writeFileSync(localEnvPath, ini.stringify(localEnv))
}

export function getDefaultPackagePath(dir?: string): any{
    try{
        var localEnv = getLocalEnv(dir)

        var defaultPackagePath = localEnv['DEFAULT_PACKAGE_PATH'];
        if(path.isAbsolute(defaultPackagePath)){
            defaultPackagePath = path.relative(getProjectWorkPath(dir), defaultPackagePath);
        }
        return defaultPackagePath;
    }catch(err){
        
    }
}

export function saveLocalEnv(localEnv, workspace?: string){
    var localEnvPath = getLocalEnvPath(workspace)
    fs.writeFileSync(localEnvPath, ini.stringify(localEnv));
}

export function getLocalEnv(workspace?: string){
    try{
        require('dotenv-flow').config(
        {
            path: workspace ? workspace : null,
            silent: true
        });
    }catch(err){

    }
    return process.env;
}

export function getLocalEnvFile(workspace?: string){
    var localEnvPath = getLocalEnvPath(workspace)
    var localEnv = {}
    try{
        var fileBuffer = fs.readFileSync(localEnvPath, 'utf-8');
        localEnv = ini.parse(fileBuffer);
    }catch(err){

    }
    return localEnv;
}

const PROFILE_FILENAME = '.env.local'
export function getLocalEnvPath(dir? : string){
    var projectPath = resolveProjectPathSync(dir);
    var profileFilepath = path.join(projectPath, PROFILE_FILENAME);
    return profileFilepath
}