import { loadFile, syncMatchFiles } from "@steedos/metadata-core";
import { registerValidationRules } from '../metadata-register/validationRule';
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @Description: 
 */
const _ = require('underscore');
const clone = require('clone');
const path = require('path')

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};
  
const BASERECORD = {
    is_system: true,
    type: "validation_rule",
    record_permissions: PERMISSIONS
};

export const getAllObjectValidationRules = async function(){
    let result = [];
    const all = await registerValidationRules.getAll(broker);
    for(let item of all){
        result.push(item.metadata)
    }
    return result;
}


export const loadObjectValidationRules = async function (filePath: string, serviceName: string){
    let validationRuleJsons = loadValidationRules(filePath);
    const data = [];
    for (const item of validationRuleJsons) {
        data.push(Object.assign({}, item, clone(BASERECORD), {_id: `${item.object_name}.${item.name}`}))
    }
    if (data.length > 0) {
        await registerValidationRules.mregister(broker, serviceName, data)
    }
}

const loadValidationRules = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.validationRule.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        let names = path.basename(matchedPath).split('.');

        if(!json.name){
            json.name = names[1]
        }
        if(!json.object_name){
            json.object_name =  path.parse(path.dirname(path.dirname(matchedPath))).name
        }
        results.push(json)
    })
    return results
}