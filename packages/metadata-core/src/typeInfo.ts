const fs = require('fs');
const path = require("path");
const glob = require('glob');
const _ = require('underscore');

const yaml = require('js-yaml');

const typeDefs: any = {};

export enum SteedosMetadataTypeInfoKeys {
    Object = 'CustomObject',
    Field = 'CustomField',
    Action = 'CustomAction',
    ActionScript = 'CustomActionScript',
    Listview = 'CustomListview',
    Permission = 'CustomPermission',
    ValidationRule = 'CustomValidationRule',
    Application = 'CustomApplication',
    Permissionset = 'CustomPermissionset',
    Profile = 'CustomProfile',
    Report = 'CustomReport',
    Workflow = 'Workflow',
    Layout = 'Layout',
    Client = 'Client',
    Server = 'Server',
    Function = 'Function',
    Router = 'Router',
    Trigger = 'Trigger',
    Translation = 'Translation',
    ObjectTranslation = 'CustomObjectTranslation',
    Dashboard = 'Dashboard',
    Flow = 'Flow',
    Role = 'Role',
    FlowRole = 'FlowRole',
    ApprovalProcess = "ApprovalProcess",
    Query = "Query",
    Chart = "Chart",
    Page = "Page",
    Process = "Process",
    Tab = "Tab",
    RestrictionRule = "RestrictionRule",
    ShareRule = "ShareRule",
    Import = "Import"
}

const loadType = function (filePath){
    let json = {}
    try {
        json = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};

const getTypeInfos = function () {
    if(_.isEmpty(typeDefs)){
        let matchedPaths = glob.sync(path.join(__dirname, '..', 'type_infos', '*.yml'));
        _.each(matchedPaths, function(matchedPath){
            typeDefs[path.basename(matchedPath).split('.')[0]] = loadType(matchedPath);
        })
    }
    return typeDefs;
};

export const getAllowSyncMetadataKeys = function(){
    var res:any = ['Workflow']
    const typeInfos = getTypeInfos()
    
    for(const key in typeInfos){
        const typeInfo = typeInfos[key]
        if(_.has(typeInfo, 'tableName')){
            res.push(key);
        }
    }
    return res.sort();
}

export const getMetadataKeys = function(){
    return _.keys(getTypeInfos())
}

export const getMetadataTypeInfos = function(){
    return getTypeInfos();
}

export const getMetadataTypeInfo = function(metadataName){
    return getTypeInfos()[metadataName];
}

export const getChildMetadataTypeInfos = function(parentMetadataName){
    return _.where( _.values(getTypeInfos()), {parent: parentMetadataName});
}

export const getMetadataTypeInfoByExt = function(fileExt){
    var result = _.find( _.values(getTypeInfos()), function(typeinfo){
        return typeinfo['ext'] == fileExt
    })
    
    return result;
}
export const getMetadataTypeInfoByDirectory = function(fileDirectory){
    var result = _.find( _.values(getTypeInfos()), function(typeinfo){
        return typeinfo['defaultDirectory'] == fileDirectory
    })
    
    return result;
}