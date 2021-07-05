import { loadFile } from "../../util/load_file";
import { Table } from '@steedos/metadata-core';
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('underscore');
var convertFilesJson:any = [];
var remainFilesJson:any = [];
var scanAllFilesJson = [];


//扫描object.js生成 server json
async function loadServer(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.object.js"));
    let results = {};
    for(let i = 0; i < matchedPaths.length; i++){
        let matchedPath = matchedPaths[i];
        let json = fs.readFileSync(matchedPath, 'utf-8');
        let name =path.parse(path.basename(matchedPath)).name;
        results[name] = json.toString();

        convertFilesJson.push(...matchedPaths);
    }
    return results;
} 

//扫描client.js生成 Client json
async function loadClient(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.client.js"));
    let results = {};
    for(let i = 0; i < matchedPaths.length; i++){
        let matchedPath = matchedPaths[i];     
        let json = fs.readFileSync(matchedPath, 'utf-8');
        let name =path.parse(path.basename(matchedPath)).name;
        results[name] = json.toString();
        convertFilesJson.push(...matchedPaths);
    }
    return results;
} 

//扫描app生成 applications json
async function loadApplications(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.app.yml"));
    matchedPaths.push(...glob.sync(path.join(filePath, "*.app.json")));
    let results = {};
    for(let i = 0; i < matchedPaths.length; i++){
        let matchedPath = matchedPaths[i];
        let json = loadFile(matchedPath);
        try {
            if(json){
                let appName = json['_id'];
                // let keys = _.keys(json);  
                // for(let k=0; k<keys.length; k++){
                //     let key = keys[k];
                //     let val = json[key];
                //     if(typeof val === "function"){
                //         json[key] = val.toString();
                //     }
                // }
                results[appName] = json;
            }
        } catch (error) {
            console.error('loadApplication error', matchedPath, error);
        }
        convertFilesJson.push(...matchedPaths);
    }
    return results;
} 

//扫描trigger.js 生成triggers json
async function loadTriggers(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.trigger.js"));
    let triggers = {}
    for(let i = 0; i < matchedPaths.length; i++){
        let matchedPath = matchedPaths[i];
        let json = fs.readFileSync(matchedPath, 'utf-8');
        let name =path.parse(path.basename(matchedPath)).name;
        triggers[name] = json.toString(); 
        convertFilesJson.push(...matchedPaths);
    }
    return triggers;
}

//扫描function.js 生成 functions json
async function loadFunctions(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.function.js"));
    let functions = {}
    for(let i = 0; i < matchedPaths.length; i++){
        let matchedPath = matchedPaths[i];
        let json = fs.readFileSync(matchedPath, 'utf-8');
        let name =path.parse(path.basename(matchedPath)).name;
        functions[name] = json.toString(); 
        convertFilesJson.push(...matchedPaths);
    }
    return functions;
}

//扫描所有对象并输出为json
async function loadObjects(filePath){
    //console.log("filePath===="+filePath);
    let matchedPaths = glob.sync(path.join(filePath, "*.object.yml"));
    matchedPaths.push(...glob.sync(path.join(filePath, "*.object.json")));
    //console.log(matchedPaths);
    let results = {};
    for (const k in matchedPaths) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        try {
            if(json){  
                let objectName = json['name'];
                //console.log("objectName===="+objectName);
                results[objectName] = json;
                
                if(typeof json['fields'] != 'undefined'){
                    let oldFields = json['fields'];

                    let count = 0;
                    let fields = {};
                    for (const f in oldFields) {
                        
                        if (Object.prototype.hasOwnProperty.call(oldFields, f)) {
                            const oldFiled = oldFields[f];
                            let sort_no = 100+10*count;
                            oldFiled.sort_no = sort_no;
                            count += 1;

                            // let keys = _.keys(oldFiled);
                            
                            // for(let k=0; k<keys.length; k++){
                            //     let key = keys[k];
                            //     let val = oldFiled[key];
                            //     if(typeof val === "function"){
                            //         oldFiled[key] = val.toString();
                            //     }
                            // }
                            delete oldFiled.name;
                            fields[f] = oldFiled;
                        }
                    }
                    results[objectName].fields = fields;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                }
                
                if(typeof json['list_views'] != 'undefined'){

                    let oldListViews = json['list_views'];
                    let listviews = {};
                    for (const f in oldListViews) {
                        
                        if (Object.prototype.hasOwnProperty.call(oldListViews, f)) {
                            const oldListView = oldListViews[f];
                            // let keys = _.keys(oldListView);
                            
                            // for(let k=0; k<keys.length; k++){
                            //     let key = keys[k];
                            //     let val = oldListView[key];
                            //     if(typeof val === "function"){
                            //         oldListView[key] = val.toString();
                            //     }
                            // }
                            
                            listviews[f] = oldListView;
                        }
                    }
                    results[objectName].listviews = listviews;

                }

                if(typeof json['permission_set'] != 'undefined'){

                    let oldPermissions = json['permission_set'];
                    let permissions = {};
                    for (const f in oldPermissions) {
                        
                        if (Object.prototype.hasOwnProperty.call(oldPermissions, f)) {
                            const oldPermission = oldPermissions[f];
                            // let keys = _.keys(oldPermission);
                            
                            // for(let k=0; k<keys.length; k++){
                            //     let key = keys[k];
                            //     let val = oldPermission[key];
                            //     if(typeof val === "function"){
                            //         oldPermission[key] = val.toString();
                            //     }
                            // }
                            
                            permissions[f] = oldPermission;
                        }
                    }
                    results[objectName].permissions = permissions;
                }

                if(typeof json['actions'] != 'undefined'){

                    let actions = json['actions'];
                    let buttons = {};
                    let jsPath = path.join(filePath, "**", objectName + ".action.js");
                    let jsPaths = glob.sync(jsPath);
                    //console.log(jsPaths[0]);
                    
                    if(jsPaths.length>0){

                        let jsContent = loadObjectActionJs(jsPaths[0]);
                        convertFilesJson.push(jsPaths[0]);

                        for (let key in actions) {

                            let button = actions[key];
                            
                            let element = _.find(jsContent, function(index:number, name:string){
                                return name === key;
                            })

                            let keyVisible = key + "Visible";
                            let elementVisible = _.find(jsContent, function(index:number, name:string){
                                return name === keyVisible;
                            })

                            let elementFn:string;
                            let elementVisibleFn:string;
                            if(element == undefined){
                                elementFn = "";
                            }else{
                                elementFn = key +":"+ element.toString() + ",\r\n";
                            }
                            if(elementVisible == undefined){
                                elementVisibleFn = "";
                            }else{
                                elementVisibleFn = keyVisible +":"+ elementVisible.toString();
                            }

                            let todoData = "module.exports = { \r\n" + elementFn + elementVisibleFn + "\r\n }";

                            //console.log(element);
                            button.name = key;
                            button.todo = todoData;

                            buttons[key] = button; 
                        }
                        results[objectName].buttons = buttons; 
                   }   
                }

            }
        } catch (error) {
            console.error('loadObjects error', matchedPath, error);
        }
        convertFilesJson.push(...matchedPaths);
    }

    let res = deleteInValidAttrs(results);   
    return res;
}

function deleteInValidAttrs(results){
    for (let i in results) {
        delete results[i].list_views;
        delete results[i].permission_set;
        delete results[i].actions; 
        //console.log(results[i].actions);
    }   
    return results;
}

//扫描所有对象生成permissionsets并输出为json
async function loadPermissionsets(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.object.yml"));
    matchedPaths.push(...glob.sync(path.join(filePath, "*.object.json")));
    let permissionsets = {};
    for (const k in matchedPaths) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        try {
            if(json){  
                let permission_setsOld = json['permission_set'];
                for (const key in permission_setsOld) {
                    if (Object.prototype.hasOwnProperty.call(permission_setsOld, key)) {
                        if(key !== 'admin' 
                            && key !== 'user'
                            && key !== 'supplier'
                            && key !== 'customer' ){
                            let permission_set = {};
                            permission_set['name'] = key;
                            permissionsets[key] = permission_set;
                        }  
                    }
                }
            }
        } catch (error) {
            console.error('loadObjects error', matchedPath, error);
        }
        convertFilesJson.push(...matchedPaths);
    }
    return permissionsets;
}

//扫描所有对象生成profiles并输出为json
async function loadProfiles(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.object.yml"));
    matchedPaths.push(...glob.sync(path.join(filePath, "*.object.json")));
    let profiles = {};
    for (const k in matchedPaths) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        try {
            if(json){  
                let permission_setsOld = json['permission_set'];
                for (const key in permission_setsOld) {
                    if (Object.prototype.hasOwnProperty.call(permission_setsOld, key)) {
                        if(key === 'admin' 
                            || key === 'user'
                            || key === 'supplier'
                            || key === 'customer' ){
                            let profile = {};
                            profile['name'] = key;
                            profiles[key] = profile;
                        }  
                    }
                }
            }
        } catch (error) {
            console.error('loadProfiles error', matchedPath, error);
        }
        convertFilesJson.push(...matchedPaths);
    }
    return profiles;
}

//扫描所有对象生成Layout并输出为json
async function loadLayouts(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "*.object.yml"));
    matchedPaths.push(...glob.sync(path.join(filePath, "*.object.json")));
    let results = {};
    for (const k in matchedPaths) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        try {
            if(json){  
                let objectName = json['name'];
                let fieldsOld = json['fields'];
                let actionsOld = json['actions'];
                let actionKeys = _.keys(actionsOld);
                let fieldKeys = _.keys(fieldsOld);
                let fields = [];
                for (const key in fieldKeys) {
                    let field = {};
                    field['field'] = fieldKeys[key];
                    fields[key] = field;
                }
                
                json['name'] = 'default';
                json['label'] = 'default';
                json['profiles'] = ['admin','user'];
                delete json['actions'];
                json['custom_actions'] = actionKeys;
                json['relatedList'] = {};
                delete json['fields'];
                json['fields'] = fields;

                results[objectName+'.default'] = json;    
            }
        } catch (error) {
            console.error('loadObjects error', matchedPath, error);
        }
        convertFilesJson.push(...matchedPaths);
    }
    let re = await deleteLayoutInValidAttrs(results);
    return re;

}
async function deleteLayoutInValidAttrs(results){

    for (let i in results) {
        delete results[i].list_views;
        delete results[i].permission_set; 
        delete results[i].icon;
        delete results[i].enable_files;
        delete results[i].enable_search;
        delete results[i].enable_events;
        delete results[i].enable_tasks;
        delete results[i].enable_api;
        delete results[i].enable_share;
        delete results[i].enable_audit;
        delete results[i].enable_chatter;   
    }   
    return results;
}

function loadObjectActionJs(filePath){

    let json = loadFile(filePath);
    return json;
}

// function toSteedosPackageJson(obejcts){
    

//     // let targetFolderName = './data';
//     // //console.log(targetFolderName);
//     // try{
//     //     fs.statSync(targetFolderName);
//     // }catch(e){
//     //     //目录不存在的情况下       
//     //     if(e.code == "ENOENT"){
//     //         fs.mkdirSync(targetFolderName);
//     //     }  
//     // }
//     // fs.writeFileSync(targetFolderName + '/steedosPackage.json', JSON.stringify(steedosPackage));
//     return steedosPackage;
// }

export async function loadOldFileToJson(filePath){
    //let filePath = path.join("C:/clonefile","steedos-app/main/default");
    let matchedPaths = glob.sync(path.join(filePath, '**', '*.*'));
    scanAllFilesJson = matchedPaths;
    // let root = '';
    // let appPath = '';
    if(path.basename(filePath) === 'src'){
        filePath = path.join(filePath, "**");
    }

    // if(filePath.indexOf("\\src") > -1){
    //     root = filePath.substring(0, filePath.indexOf("\\src"));
        
    //     appPath = path.join(root, "src");

    // }else{
    //     appPath = filePath; 
    // }
    let functions = await loadFunctions(filePath);
    let triggers = await loadTriggers(filePath);
    let clients = await loadClient(filePath);
    let servers = await loadServer(filePath);
    let obejcts = await loadObjects(filePath);
    //let layouts = await loadLayouts(filePath);
    let permissionsets = await loadPermissionsets(filePath);
    let profiles = await loadProfiles(filePath); 
    let applications = await loadApplications(filePath);
    let steedosPackage:any = {};
    steedosPackage.objects = obejcts;
    //steedosPackage.layouts = layouts; 
    steedosPackage.applications = applications;
    steedosPackage.permissionsets = permissionsets;
    steedosPackage.profiles = profiles;
    steedosPackage.clients = clients;
    steedosPackage.servers = servers;
    steedosPackage.triggers = triggers;
    steedosPackage.functions = functions;
    
    for (const key in scanAllFilesJson) {
        if (Object.prototype.hasOwnProperty.call(scanAllFilesJson, key)) {
            let file = scanAllFilesJson[key];
            let exsit = false;
            for (const c in convertFilesJson) {
                if (Object.prototype.hasOwnProperty.call(convertFilesJson, c)) {
                    let convertFile = convertFilesJson[c];
                    if(file === convertFile){
                        exsit = true;
                    }
                }
            }
            if(!exsit){
                remainFilesJson.push(file);
            }
        }
    }
    let convertFilesData:any = [];
    let remainFilesData:any = [];
    convertFilesJson = _.uniq(convertFilesJson);
    remainFilesJson = _.uniq(remainFilesJson);
    _.each(convertFilesJson, function(filePath){
        let fileTypes =path.basename(filePath).split('.');
        let fileType = _.last(fileTypes, 2).join('.');
        convertFilesData.push({
            type: fileType,
            path: filePath
        });
    })
    _.each(remainFilesJson, function(filePath){
        let fileTypes =path.basename(filePath).split('.');
        let fileType = _.last(fileTypes, 2).join('.');
        remainFilesData.push({
            type: fileType,
            path: filePath
        });
    })
    const cols = [
        { key: 'type', label: 'file Type' },
        { key: 'path', label: 'file Path' }
    ];
    const convertTable = new Table().createTable(_.sortBy(convertFilesData, 'type'), cols, '已转化文件清单');
    const remainTable = new Table().createTable(_.sortBy(remainFilesData, 'type'), cols, '未转化文件清单');
    console.log(convertTable);
    console.log(remainTable);
    return steedosPackage;
}

