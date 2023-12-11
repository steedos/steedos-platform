import { 
    loadFile, 
    SteedosMetadataTypeInfoKeys as TypeInfoKeys, 
    getChilds, 
    hasParent, 
    LoadChartFile, 
    LoadPageFile, 
    LoadQueryFile, 
    LoadTabFile, 
    LoadShareRules, 
    LoadRestrictionRules, 
    LoadProcessFile, 
    LoadTriggerFile, 
    LoadImportFile,
    LoadQuestionFile,
    LoadDashboardFile,
    LoadPrintFile,
} from '@steedos/metadata-core';
import { checkNameEquals } from '../../util/check_name_equals'

const path = require('path');
const glob = require('glob');
const _ = require('underscore');
const compressing = require("compressing");

const loadChartFile = new LoadChartFile();
const loadPageFile = new LoadPageFile();
const loadQueryFile = new LoadQueryFile();
const loadTabFile = new LoadTabFile();
const loadShareRules = new LoadShareRules();
const loadRestrictionRules = new LoadRestrictionRules();
const loadProcessFile = new LoadProcessFile();
const loadTriggersFile = new LoadTriggerFile();
const loadImportFile = new LoadImportFile();
const loadQuestionFile = new LoadQuestionFile();
const loadDashboardFile = new LoadDashboardFile();
const loadPrintFile = new LoadPrintFile();

//扫描Permissionsets并输出为json
async function loadPermissionsets(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "permissionsets", "*.permissionset.yml"));
    let permissionsets = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let permissionsetName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.permissionset'));
        let permissionset = {};
        try {
            if(json){  

                checkNameEquals(json, permissionsetName, matchedPath, TypeInfoKeys.Permissionset);

                let permissionsetKeys = _.keys(json);
                for(let m in permissionsetKeys){
                    let key = permissionsetKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    permissionset[key] = json[key];
                }
                permissionsets[permissionsetName] = json;    
     
            }
        } catch (error) {
            console.error('loadPermissionsets error', matchedPath, error);
            throw error
        }
    }
    return permissionsets;

}

//扫描Profiles并输出为json
async function loadProfiles(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "profiles", "*.profile.yml"));
    let profiles = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let profileName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.profile'));
        let profile = {};
        try {
            if(json){  
                
                checkNameEquals(json, profileName, matchedPath, TypeInfoKeys.Profile);

                let profileKeys = _.keys(json);
                for(let m in profileKeys){
                    let key = profileKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    profile[key] = json[key];
                }
                profiles[profileName] = json;  
            }
        } catch (error) {
            console.error('loadProfiles error', matchedPath, error);
            throw error
        }
    }
    return profiles;

}

//扫描reports并输出为json
async function loadReports(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "reports", "*.report.yml"));
    let reports = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];

        let json = loadFile(matchedPath);
        let reportName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.report'));
        let report = {};
        try {
            if(json){  
                
                checkNameEquals(json, reportName, matchedPath, TypeInfoKeys.Report);

                let reportKeys = _.keys(json);
                for(let m in reportKeys){
                    let key = reportKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    report[key] = json[key];
                }
                reports[reportName] = json; 
            }
        } catch (error) {
            console.error('loadReports error', matchedPath, error);
            throw error
        }
    }
    return reports;

}

//扫描application并输出为json
async function loadApplications(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "applications", "*.app.yml"));
    let applications = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];

        let json = loadFile(matchedPath);
        let applicationName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.app'));
        let application = {};
        try {
            if(json){  
                
                checkNameEquals(json, applicationName, matchedPath, TypeInfoKeys.Application);

                let applicationKeys = _.keys(json);
                for(let m in applicationKeys){
                    let key = applicationKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    application[key] = json[key];
                }
                applications[applicationName] = json;   
            }
        } catch (error) {
            console.error('loadApplications error', matchedPath, error);
            throw error
        }
    }
    return applications;

}
//扫描Layout并输出为json
async function loadLayouts(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "layouts", "*.layout.yml"));
    let layouts = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let layoutName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.layout'));
        let layout = {};
        try {
            if(json){  
                
                checkNameEquals(json, layoutName, matchedPath, TypeInfoKeys.Layout);

                let layoutKeys = _.keys(json);
                for(let m in layoutKeys){
                    let key = layoutKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    layout[key] = json[key];
                }
                layouts[layoutName] = json;    
            }
        } catch (error) {
            console.error('loadLayouts error', matchedPath, error);
            throw error
        }
    }
    return layouts;

}

//扫描workflows并输出为json
async function loadWorkflows(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "workflows", "*.workflow.yml"));
    let workflows = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let workflowName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.workflow'));
        let workflow = {};
        try {
            if(json){  
                
                // checkNameEquals(json, workflowName, matchedPath, TypeInfoKeys.Workflow);

                let workflowKeys = _.keys(json);
                for(let m in workflowKeys){
                    let key = workflowKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    workflow[key] = json[key];
                }
                workflows[workflowName] = json;    
            }
        } catch (error) {
            console.error('loadWorkflows error', matchedPath, error);
            throw error
        }
    }
    return workflows;

}
//扫描flows并输出为json
async function loadFlows(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "flows", "*.flow.json"));
    let flows = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let formName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.flow'));
        let form = {};
        try {
            if(json){  
                
                checkNameEquals(json, formName, matchedPath, TypeInfoKeys.Flow);

                let flowKeys = _.keys(json);
                for(let m in flowKeys){
                    let key = flowKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    form[key] = json[key];
                }
                flows[formName] = json;    
            }
        } catch (error) {
            console.error('loadFlows error', matchedPath, error);
            throw error
        }
    }
    return flows;
}
//扫描approvalProcesses并输出为json
async function loadApprovalProcesses(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "approvalProcesses", "*.approvalProcess.yml"));
    let approvalProcesses = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let approvalProcessName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.approvalProcess'));
        let approvalProcess = {};
        try {
            if(json){  
                
                checkNameEquals(json, approvalProcessName, matchedPath, TypeInfoKeys.ApprovalProcess);

                let approvalProcessKeys = _.keys(json);
                for(let m in approvalProcessKeys){
                    let key = approvalProcessKeys[m];
                    approvalProcess[key] = json[key];
                }
                approvalProcesses[approvalProcessName] = json;    
            }
        } catch (error) {
            console.error('loadApprovalProcesses error', matchedPath, error);
            throw error
        }
    }
    return approvalProcesses;

}
//扫描roles并输出为json
async function loadRoles(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "roles", "*.role.yml"));
    let roles = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let roleName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.role'));
        let role = {};
        try {
            if(json){  
                
                checkNameEquals(json, roleName, matchedPath, TypeInfoKeys.Role);

                let roleKeys = _.keys(json);
                for(let m in roleKeys){
                    let key = roleKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    role[key] = json[key];
                }
                roles[roleName] = json;    
            }
        } catch (error) {
            console.error('loadRoles error', matchedPath, error);
            throw error
        }
    }
    return roles;

}
//扫描roles并输出为json
async function loadFlowRoles(filePath){
    let matchedPaths = glob.sync(path.join(filePath, "flowRoles", "*.flowRole.yml"));
    let flowRoles = {};
    for (let k=0; k<matchedPaths.length; k++) {
        let matchedPath = matchedPaths[k];
        let json = loadFile(matchedPath);
        let flowRoleName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.flowRole'));
        let role = {};
        try {
            if(json){  
                
                checkNameEquals(json, flowRoleName, matchedPath, TypeInfoKeys.FlowRole);

                let flowRoleKeys = _.keys(json);
                for(let m in flowRoleKeys){
                    let key = flowRoleKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    role[key] = json[key];
                }
                flowRoles[flowRoleName] = json;    
            }
        } catch (error) {
            console.error('loadflowRoles error', matchedPath, error);
            throw error
        }
    }
    return flowRoles;

}

//扫描所有对象并输出为json
async function loadObjects(filePath, objectName){
    let matchedPaths = glob.sync(path.join(filePath, "objects", objectName, objectName + ".object.yml"));
    let object = {};
    let newObjectsPath = '';
    
    if(matchedPaths.length === 1){
        let matchedPath = matchedPaths[0];

        if(typeof matchedPath !== 'function'){
            let json = loadFile(matchedPath);

            checkNameEquals(json, objectName, matchedPath, TypeInfoKeys.Object);

            object = json;
            newObjectsPath = matchedPath.substring(0,matchedPath.lastIndexOf('/'));

        }
    }else{
        newObjectsPath = path.join(filePath, "objects", objectName);
    }
    //fields
    let fieldsFilePath = path.join(newObjectsPath, "fields");
    let fields = await loadObjectFields(fieldsFilePath);
    object[TypeInfoKeys.Field] = fields;

    //listviews
    let listviewsFilePath = path.join(newObjectsPath, "listviews");
    let listviews = await loadObjectListViews(listviewsFilePath);
    object[TypeInfoKeys.Listview] = listviews;

    //permissions
    let permissionsFilePath = path.join(newObjectsPath, "permissions" );
    let permissions = await loadObjectPermissions(permissionsFilePath);
    object[TypeInfoKeys.Permission] = permissions;
    
    //buttons
    let buttonsFilePath = path.join(newObjectsPath, "buttons");
    let buttons = await loadObjectButtons(buttonsFilePath);
    object[TypeInfoKeys.Action] = buttons;

    //validationRules
    let validationRulesFilePath = path.join(newObjectsPath, "validationRules");
    let validationRules = await loadObjectValidationRules(validationRulesFilePath);
    object[TypeInfoKeys.ValidationRule] = validationRules;
    return object;
}

//扫描所有对象的fields并输出为json
async function loadObjectFields(filePath){
    let fields = {};
    let matchedPaths = glob.sync( path.join(filePath, "*.field.yml"));

    for(let k=0; k < matchedPaths.length; k++){
        let matchedPath = matchedPaths[k];
        let field = {};
        let json = loadFile(matchedPath);
        let fieldName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.field'));

        try {
            if(json){

                checkNameEquals(json, fieldName, matchedPath, TypeInfoKeys.Field);

                let field_ower = {};
                let newField = {};
                if(fieldName === 'owner'){
                    field_ower['label'] = 'Owner';
                    field_ower['type'] = 'lookup';
                    field_ower['reference_to'] = 'users';
                    field_ower['sortable'] = true;
                    field_ower['index'] = true;
                    field_ower['defaultValue'] = '{userId}';
                    field_ower['omit'] = true;
                    field_ower['hidden'] = true;
                    newField = Object.assign({}, field_ower, json, {type: 'lookup', reference_to: 'users'});
                }else{
                    newField = json;
                }
                let fieldKeys = _.keys(newField);
                for(let m in fieldKeys){
                    let key = fieldKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = newField[key];
                    if(typeof val === 'function' ){
                        newField[key] = val.toString().replace('function anonymous', 'function');
                    }
                    
                    field[key] = newField[key];
                }
            }
        } catch (error) {
            console.error('loadObjectFields error', matchedPath, error);
            throw error
        }

        fields[fieldName]=field;
        
    }
    return fields;
}

//扫描所有对象的ListViews并输出为json
async function loadObjectListViews(filePath){
    let listviews = {};
    let matchedPaths = glob.sync(path.join(filePath, "*.listview.yml"));

    for(let k=0; k < matchedPaths.length; k++){
        let matchedPath = matchedPaths[k];
        let listview = {};
        let listviewName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.listview'));
        
        let json = loadFile(matchedPath);
        if(json){   

            checkNameEquals(json, listviewName, matchedPath, TypeInfoKeys.Listview);

            let listviewKeys = _.keys(json);
            for(let k in listviewKeys){
                let key = listviewKeys[k];
                if(typeof key === 'function'){
                    continue;
                }
                let val = json[key];
                if(typeof val === 'function' ){
                    json[key] = val.toString();
                }
                listview[key] = json[key];
            }

            listviews[listviewName] = listview;
        }
    }
    return listviews;
}

//扫描所有对象的permissions并输出为json
async function loadObjectPermissions(filePath){
    let permissions = {};
    let matchedPaths = glob.sync(path.join(filePath, "*.permission.yml"));

    for(let k=0; k < matchedPaths.length; k++){
        let matchedPath = matchedPaths[k];
        let permission = {};

        let json = loadFile(matchedPath);

        let permissionName = matchedPath.substring(matchedPath.lastIndexOf('/') +1, matchedPath.indexOf('.permission'));
        try {
            if(json){

                checkNameEquals(json, permissionName, matchedPath, TypeInfoKeys.Permission);

                let permissionKeys = _.keys(json);
                for(let m in permissionKeys){
                    let key = permissionKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    permission[key] = json[key];
                }
            }
        } catch (error) {
            throw error
            console.error('loadObjectPermissions error', matchedPath, error);
        }

        permissions[permissionName] = permission;
    }
    return permissions;
}

//扫描所有对象的validationRules
async function loadObjectValidationRules(filePath){
    let validationRules = {};
    let matchedPaths = glob.sync(path.join(filePath, "*.validationRule.yml"));

    for(let k=0; k < matchedPaths.length; k++){
        let matchedPath = matchedPaths[k];
        let validationRule = {};

        let json = loadFile(matchedPath);

        let validationRuleName = matchedPath.substring(matchedPath.lastIndexOf('/') +1, matchedPath.indexOf('.validationRule'));
        try {
            if(json){

                checkNameEquals(json, validationRuleName, matchedPath, TypeInfoKeys.ValidationRule);

                let validationRuleKeys = _.keys(json);
                for(let m in validationRuleKeys){
                    let key = validationRuleKeys[m];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    validationRule[key] = json[key];
                }
            }
        } catch (error) {
            console.error('loadObjectValidationRules error', matchedPath, error);
        }

        validationRules[validationRuleName] = validationRule;
    }
    return validationRules;
}

//扫描所有对象的buttons并输出为json
async function loadObjectButtons(filePath){
    let buttons = {};
    let matchedPaths = glob.sync(path.join(filePath, "*.button.yml"));
    for(let k=0; k < matchedPaths.length; k++){
        let matchedPath = matchedPaths[k];
        let button = {};
        let json = loadFile(matchedPath);
        let buttonName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.button'));
        try {
            if(json){

                checkNameEquals(json, buttonName, matchedPath, TypeInfoKeys.Action);

                let buttonKeys = _.keys(json);
                for(let l in buttonKeys){
                    let key = buttonKeys[l];
                    if(typeof key === 'function'){
                        continue;
                    }
                    let val = json[key];
                    if(typeof val === 'function' ){
                        json[key] = val.toString();
                    }
                    button[key] = json[key];
                }
            }
        } catch (error) {
            console.error('loadObjectButtons error', matchedPath, error);
        }

        let btnJsPath = path.join(filePath,buttonName + ".button.js");
        let matchedJsPath = glob.sync(btnJsPath);
        if(matchedJsPath.length>0){
            let jsContent = loadFile(matchedJsPath[0]);
            if(jsContent){
                let buttonScript = jsContent[buttonName] || "";
                let buttonVisible = jsContent[buttonName+'Visible'] || "";
                button['todo'] = buttonScript.toString();
                button['visible'] = buttonVisible.toString() || button['visible'] || false;
            }  
        }
        buttons[buttonName] = button;
    }
    return buttons;
}

async function loadPackageYml(filePath:string){
    let json = loadFile(path.join(filePath, "package.yml"));
    return json;
}

export async function loadFileToJson(packagePath:string, packageYml?){

    try {
        let datefilePath = path.join(packagePath,'deploy.zip');
        await compressing.zip.uncompress(datefilePath, packagePath);
    } catch (error) {
        
    }
    if(!packageYml){
        packageYml = await loadPackageYml(packagePath);
    }
    packagePath = path.join(packagePath, 'main', 'default')

    let objects = {};
    let layouts = {};
    let applications = {}; 
    let permissionsets = {};
    let profiles = {};
    let reports = {};
    let workflows = {};
    let flows = {};
    let approvalProcesses = {};
    let roles = {};
    let flowRoles = {};
    let charts = {};
    let queries = {};
    let pages = {};
    let tabs = {};
    let shareRules = {};
    let restrictionRules = {};
    let processes = {};
    let triggers = {};
    let imports = {};
    let questions = {};
    let dashboards = {};
    let prints = {};
    let mark:boolean = false;

    for(const metadataname in packageYml){
        
        if(hasParent(metadataname)){
            continue;
        }

        let values = packageYml[metadataname];// 传来的对象列表名称
        if(metadataname === TypeInfoKeys.Object){
            if(values === '*'){
                let matchedPaths = glob.sync(path.join(packagePath, "objects", "*", "*.object.yml"));
                values = [];
                _.each(matchedPaths, function(matchedPath){
                    let objectApiName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf('.object'))
                    values.push(objectApiName)
                })
            }
            for(let k in values){
                let objectName = values[k];
                if(typeof objectName === 'function'){
                    continue;
                }

                let object = await loadObjects(packagePath, objectName);
                objects[objectName] = object;
            }
            
            mark = true;
        }else if(metadataname === TypeInfoKeys.Layout){
            layouts = await loadLayouts(packagePath);
            mark = true;

        }else if(metadataname === TypeInfoKeys.Application){

            applications = await loadApplications(packagePath);
            mark = true;

        }else if(metadataname === TypeInfoKeys.Permissionset){

            permissionsets = await loadPermissionsets(packagePath);
            mark = true;

        }else if(metadataname === TypeInfoKeys.Profile){

            profiles = await loadProfiles(packagePath);
            mark = true;

        }else if(metadataname === TypeInfoKeys.Report){

            reports = await loadReports(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Workflow){
            
            workflows = await loadWorkflows(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Flow){
            
            flows = await loadFlows(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.ApprovalProcess){
            
            approvalProcesses = await loadApprovalProcesses(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Role){
            
            roles = await loadRoles(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.FlowRole){
            
            flowRoles = await loadFlowRoles(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Layout){
            
            layouts = await loadLayouts(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Chart){
            
            charts = loadChartFile.load(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Query){
            
            queries = loadQueryFile.load(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Page){
            
            pages = loadPageFile.load(packagePath);
            mark = true;
        }else if(metadataname === TypeInfoKeys.Tab){
            tabs = loadTabFile.load(packagePath);
            mark = true;
        } else if (metadataname === TypeInfoKeys.ShareRule) {
            shareRules = loadShareRules.load(packagePath);
            mark = true;
        } else if (metadataname === TypeInfoKeys.RestrictionRule) {
            restrictionRules = loadRestrictionRules.load(packagePath);
            mark = true;
        } else if (metadataname === TypeInfoKeys.Process) {
            processes = loadProcessFile.load(packagePath);
            mark = true;
        }else if (metadataname === TypeInfoKeys.Trigger) {
            triggers = loadTriggersFile.load(packagePath);
            mark = true;
        }else if (metadataname === TypeInfoKeys.Import) {
            imports = loadImportFile.load(packagePath);
            mark = true;
        }else if (metadataname === TypeInfoKeys.Question) {
            questions = loadQuestionFile.load(packagePath);
            mark = true;
        }else if (metadataname === TypeInfoKeys.Dashboard) {
            dashboards = loadDashboardFile.load(packagePath);
            mark = true;
        }else if (metadataname === TypeInfoKeys.Print) {
            dashboards = loadPrintFile.load(packagePath);
            mark = true;
        }

    }
    if(!mark){
        const childs = getChilds(TypeInfoKeys.Object);
        for(let metadataname in packageYml){
            let  objectNames= packageYml[metadataname];
            if(childs.indexOf(metadataname) == -1){
                continue;
            }
            let objectName = objectNames[0].substring(0, objectNames[0].indexOf('.'));

            let object = await loadObjects(packagePath, objectName);
            objects[objectName] = object;
            
        }
    }
    let steedosPackage = {};
    steedosPackage[TypeInfoKeys.Object] = objects;
    steedosPackage[TypeInfoKeys.Application] = applications;
    steedosPackage[TypeInfoKeys.Layout] = layouts;
    steedosPackage[TypeInfoKeys.Permissionset] = permissionsets;
    steedosPackage[TypeInfoKeys.Profile] = profiles;
    steedosPackage[TypeInfoKeys.Report] = reports;
    steedosPackage[TypeInfoKeys.Workflow] = workflows;
    steedosPackage[TypeInfoKeys.Flow] = flows;
    steedosPackage[TypeInfoKeys.ApprovalProcess] = approvalProcesses;
    steedosPackage[TypeInfoKeys.Role] = roles;
    steedosPackage[TypeInfoKeys.FlowRole] = flowRoles;
    steedosPackage[TypeInfoKeys.Query] = queries;
    steedosPackage[TypeInfoKeys.Chart] = charts;
    steedosPackage[TypeInfoKeys.Page] = pages;
    steedosPackage[TypeInfoKeys.Tab] = tabs;
    steedosPackage[TypeInfoKeys.ShareRule] = shareRules;
    steedosPackage[TypeInfoKeys.RestrictionRule] = restrictionRules;
    steedosPackage[TypeInfoKeys.Process] = processes;
    steedosPackage[TypeInfoKeys.Trigger] = triggers;
    steedosPackage[TypeInfoKeys.Import] = imports;
    steedosPackage[TypeInfoKeys.Question] = questions;
    steedosPackage[TypeInfoKeys.Dashboard] = dashboards;
    steedosPackage[TypeInfoKeys.Print] = prints;

    //用于测试查看本地生成的steedosPackage结构和属性是否完整
    // let targetFolderName = './data';
    // try{
    //     fs.statSync(targetFolderName);
    // }catch(e){
    //     //目录不存在的情况下       
    //     if(e.code == "ENOENT"){
    //         fs.mkdirSync(targetFolderName);
    //     }  
    // }
    // fs.writeFileSync(path.join(targetFolderName,'steedosPackage.json'), JSON.stringify(steedosPackage));
    return steedosPackage;
}

