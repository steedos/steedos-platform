// import { addConfig, getConfig, getConfigs } from '../types';
import { Dictionary } from '@salesforce/ts-types';
const _ = require('underscore');
const clone = require('clone');
var util = require('../util');

const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
};

const BASERECORD = {
    is_system: true,
    type: "process_definition",
    record_permissions: PERMISSIONS
};

const BASERECORD_NODE = {
    is_system: true,
    type: "process_node",
    record_permissions: PERMISSIONS
};

const _ApprovalProcesses: Dictionary<any> = {};
// const APPROVAL_PROCESSES_KEY = 'APPROVAL_PROCESSES';

const addApprovalProcess = function(json){
    if(!json.name){
        throw new Error('missing attribute name');
    }

    if(json.process_nodes){
        for(let i=0; i<json.process_nodes.length; i++ ){
            let processNode = json.process_nodes[i];
            if(!processNode.name){
                throw new Error('missing attribute name in process_node');
            }
            json.process_nodes[i] = Object.assign({}, processNode, clone(BASERECORD_NODE), {_id: `${json.name}.${processNode.name}`})
        }
    }
    _ApprovalProcesses[json.name] = Object.assign({}, json, clone(BASERECORD), {_id: json.name});
}
export const getSourceApprovalProcessesKeys = function(){
    return _.pluck(getSourceApprovalProcesses(), 'name');
}

export const getSourceApprovalProcess = function(name){
    return getSourceApprovalProcesses()[name];
}

export const getSourceApprovalProcesses = function(){
    return clone(_ApprovalProcesses);
}

export const getSourceProcessNode = function(processDefinitionName, processNodeName){

    let processDefinition = getSourceApprovalProcess(processDefinitionName);
    let processNodes = processDefinition.process_nodes;

    for(let item of processNodes){ 
        if(item.name === processNodeName){
            return item
        }
    }
}

export const loadSourceApprovalProcesses = function (filePath: string){
    let approvalProcesses = util.loadApprovalProcesses(filePath);
    approvalProcesses.forEach(element => {
        addApprovalProcess(element);
    });
}
