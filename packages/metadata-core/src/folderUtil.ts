const os = require('os');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

import { hasParent, SteedosMetadataTypeInfoKeys as TypeInfoKeys, getMetadataNameByExt,
    getMetadataNameByDirectory, getFileinfoByFilename} from './'
import { getMetadataTypeInfo } from './typeInfo'

export function mkTempFolder(prefix){
    var tempFolder = path.join(os.tmpdir(), "steedos-dx");

    createIfNotExist(tempFolder);

    var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-dx", prefix));
    return tempDir;
}

export function createIfNotExist(folderPath){

    try{
        fs.statSync(folderPath);
    }catch(e){
        //目录不存在的情况下       
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }  
    }
}
export function mkdirsSync(dirname) {

    if (fs.existsSync(dirname)) {
      return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false;
}

export function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


export function getRetrievePackageInfo(option) {

    var requestYmlBase64;
    if (option.packageYmlDir){
        // 优先级最高
        requestYmlBase64 = fs.readFileSync(option.packageYmlDir, 'base64');
        
    }else if (option.metadata){
        
        requestYmlBase64 = parseCliMetadataToRequest(option.metadata);
    }else{
        var serverDir = option.serverDir

        var baseName = path.basename(serverDir);
                
        var stat = fs.lstatSync(serverDir);
        var is_directory = stat.isDirectory();
    
        if(!is_directory){
            serverDir = path.join(serverDir, '..');
        }
    
        process.chdir(serverDir); 
        serverDir = process.cwd();
        
        var requestJson = {}
    
        if(!is_directory){
            var filePath = path.join(serverDir ,baseName)

            var fileinfo:any = getFileinfoByFilename(baseName);
    
            var itemName = fileinfo.itemName
            var metadataName = fileinfo.metadataName
            if(metadataName === TypeInfoKeys.ActionScript){
                const relatedFilePath = path.join(path.parse(filePath).dir, `${itemName}.button.yml`);
                if(fs.existsSync(relatedFilePath)){
                    baseName = path.basename(relatedFilePath);
                    fileinfo = getFileinfoByFilename(baseName);
                    itemName = fileinfo.itemName
                    metadataName = fileinfo.metadataName
                }else{
                    throw new Error(`not find ${relatedFilePath}`);
                }
            }
            var manifestName = itemName;
            if(hasParent(metadataName) == true){
                var parentName = path.parse(path.dirname(path.dirname(filePath))).name
                manifestName = parentName + '.' + itemName;
            }else if(fileinfo.parentName){
                manifestName = fileinfo.parentName + '.' + itemName;
            }
    
            if(fileinfo.suffix){
                manifestName += fileinfo.suffix
            }
            
            requestJson[metadataName] = [manifestName]
    
        }else{
            
            var folderName = path.basename(serverDir);
            var metadataName = getMetadataNameByDirectory(folderName);
            
            if(metadataName){
                if(hasParent(metadataName) == true){

                    var objName = path.parse(path.dirname(serverDir)).name
                    requestJson[metadataName] = [objName + '.*']
    
                }else{
                    
                    requestJson[metadataName] = ['*']
                }
            }else{
                
                var testFolderName = path.parse(path.dirname(serverDir)).name
                var testMetadataName = getMetadataNameByDirectory(testFolderName);
                if(testMetadataName){
                    requestJson[testMetadataName] = [folderName]

                }else{
                    requestJson[TypeInfoKeys.Object] = ['*']
                    requestJson[TypeInfoKeys.Application] = ['*']
                    requestJson[TypeInfoKeys.Permissionset] = ['*']
                    requestJson[TypeInfoKeys.Profile] = ['*']
                    requestJson[TypeInfoKeys.Workflow] = ['*']
                    requestJson[TypeInfoKeys.Flow] = ['*']
                    requestJson[TypeInfoKeys.ApprovalProcess] = ['*']
                    requestJson[TypeInfoKeys.Role] = ['*']
                    requestJson[TypeInfoKeys.FlowRole] = ['*']
                    requestJson[TypeInfoKeys.Layout] = ['*']
                    requestJson[TypeInfoKeys.Query] = ['*']
                    requestJson[TypeInfoKeys.Chart] = ['*']
                    requestJson[TypeInfoKeys.Page] = ['*']
                    requestJson[TypeInfoKeys.Tab] = ['*']
                    requestJson[TypeInfoKeys.ShareRule] = ['*']
                    requestJson[TypeInfoKeys.RestrictionRule] = ['*']
                    requestJson[TypeInfoKeys.Import] = ['*']
                    requestJson[TypeInfoKeys.Print] = ['*']
                    requestJson[TypeInfoKeys.FunctionYML] = ['*']
                }
    
            }
    
        }
    
        var ymlContent = yaml.dump(requestJson);
        var ymlBuffer = Buffer.from(ymlContent);
        requestYmlBase64 = ymlBuffer.toString('base64');
    }

    return requestYmlBase64;
}


function parseCliMetadataToRequest(metadata){
    var requestJson = {};
    var dataList = metadata.split(',');
    if(dataList.length == 1){
        dataList = metadata.split(' ');
    }
    var lastType;
    for(var i=0;i <dataList.length; i++){

        var item = dataList[i];
        
        var metadataName;//:之前的东西, 例:CustomObject:*, fileType = CustomObject
        var target;
        if(item.indexOf(':') != -1){
            metadataName = item.substring(0, item.indexOf(':'));
            // metadataName = metadataName.substring(0,1).toLowerCase() + metadataName.substring(1);
            if(!getMetadataTypeInfo(metadataName)){
                throw new Error('unsupported metadata type:' + metadataName);
            }
            lastType = metadataName;
            target = item.substring(item.indexOf(':') + 1)

        }else{
            metadataName = item
            // metadataName = metadataName.substring(0,1).toLowerCase() + metadataName.substring(1);
            if(getMetadataTypeInfo(metadataName)){
                target = '*'
            }else{
                metadataName = lastType
                target = item
            }
                
        }

        if(typeof requestJson[metadataName] == 'undefined'){
            requestJson[metadataName] = [];
        }
        
        if(hasParent(metadataName) && target == '*'){
            metadataName = metadataName.substring(0,1).toUpperCase() + metadataName.substring(1);
            throw new Error(metadataName + ' can not be retrieved like ' + metadataName + ':*, use ' + metadataName + ':ObjectName.* instead');
        }
        requestJson[metadataName].push(target);
    }

    var ymlContent = yaml.dump(requestJson);
    var ymlBuffer = Buffer.from(ymlContent);
    var requestYmlBase64 = ymlBuffer.toString('base64');
    return requestYmlBase64;
}