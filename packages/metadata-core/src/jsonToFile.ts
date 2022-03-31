const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('underscore');


import { getFolderPath, getFileExt, hasChild, getChildMetadataNames, beautifyScript } from './';
import { createIfNotExist } from './folderUtil';
import {SteedosMetadataTypeInfoKeys} from './typeInfo'

export async function jsonToFile(targetPath, steedosPackage){  
    
    for(const propertyName in steedosPackage){ // objects, applications

        var propertyList = steedosPackage[propertyName];

        const parentFolderPath = getFolderPath(propertyName);
        var metadataPath = path.join(targetPath, parentFolderPath); // \objects
        createIfNotExist(metadataPath);

        var metadataFileFolderPath = metadataPath // 
        for(const parentRecordName in propertyList){ // agreement, accounts

            var parentRecord = propertyList[parentRecordName];
            
            //CustomObject需要先处理其中的CustomField等属性
            if(hasChild(propertyName)){
                
                var parentPath = path.join(metadataPath, parentRecordName); // \objects\accounts
                metadataFileFolderPath = path.join(metadataPath, parentRecordName); // \objects\accounts
                createIfNotExist(parentPath);
    
                const childMetadataNames = getChildMetadataNames(propertyName);
    
                for(const childMetadataName of childMetadataNames){
    
                    var childMetadata = parentRecord[childMetadataName];
                    if(!childMetadata){
                        continue;
                    }
                    const childFolderPath = getFolderPath(childMetadataName);
                    const childPath = path.join(parentPath, childFolderPath); // \objects\accounts\fields
                    createIfNotExist(childPath);
                    
                    for(const childRecordName in childMetadata){
                        await recordToFile(childPath, childMetadata[childRecordName], childRecordName, childMetadataName); // accounts\fields
                    }
                    delete parentRecord[childMetadataName];
                }
            }

            await recordToFile(metadataFileFolderPath, parentRecord, parentRecordName, propertyName); //accounts.object.yml
        }

    }
    
}

async function recordToFile(folderPath, record, recordName, metadataName){  
    const fileExt = getFileExt(metadataName)
    let fileName =  recordName +'.'+ fileExt;

    delete record._id;
    if(record._fake){
        return;
    }
    let fileContent;
    if(metadataName == SteedosMetadataTypeInfoKeys.Flow){
        fileName += '.json';
        fileContent = JSON.stringify(record);
    } 
    else if(metadataName === SteedosMetadataTypeInfoKeys.Process) {
        const schema = record.schema;
        delete record.schema;
        fileContent = yaml.dump(record);

        // process.yml
        var filePath = path.join(folderPath, fileName + '.yml');
        fs.writeFileSync(filePath, fileContent);

        // process schema
        filePath = path.join(folderPath, `${fileName}.process.${record.engine}.${record.ext || 'bpmn'}`)
        fs.writeFileSync(filePath, JSON.stringify(schema));

        return ;
    }
    else{
        fileName += '.yml';
        fileContent = yaml.dump(record);
    }

    if(metadataName == SteedosMetadataTypeInfoKeys.Action){
        writeButtonFile(folderPath, recordName, fileExt, record);
    }else{
        
        var filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, fileContent);
    }
}

function writeButtonFile(folderPath, recordName, fileExt, record){
    let buttonJsFileName =  recordName +'.'+ fileExt + '.js';
    let buttonFileName =  recordName +'.'+ fileExt + '.yml';

    let actionTodo = record.todo;
    let actionVisible = record.visible;

    let keyVisible = recordName + "Visible";

    let elementFn:string;
    let elementVisibleFn:string;
    if(!actionTodo){
        elementFn = "";

    }else{
        elementFn = recordName +":"+ actionTodo.toString();

    }
    if(_.isString(actionVisible)){
        elementVisibleFn = keyVisible +":"+ actionVisible.toString();
    }else{
        elementVisibleFn = "";
    }

    let buttonScriptContext = '';

    if(elementFn){
        buttonScriptContext = elementFn;
    }
    if(elementVisibleFn){
        if(buttonScriptContext){
            buttonScriptContext = `
                ${buttonScriptContext},
                ${elementVisibleFn}
            `
        }else{
            buttonScriptContext = `
                ${elementVisibleFn}
            `
        }
    }

    let buttonScript = `
        module.exports = {
            ${buttonScriptContext}
        }
    `
    var fileJsPath = path.join(folderPath, buttonJsFileName);
    if(buttonScriptContext){
        fs.writeFileSync(fileJsPath, beautifyScript(buttonScript));
    }
    var filePath = path.join(folderPath, buttonFileName);
    delete record.todo;
    if(!_.isBoolean(actionVisible) && record.visible){
        delete record.visible;
    }
    var ymlData = yaml.dump(record);
    fs.writeFileSync(filePath, ymlData);
}
