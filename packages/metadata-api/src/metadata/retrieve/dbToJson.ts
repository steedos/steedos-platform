const _ = require('underscore');
const yaml = require('js-yaml');
const fs = require("fs");
const chalk = require("chalk");
var _eval = require('eval')

import {objectsFromDb} from '../collection/object'
import {fieldsFromDb} from '../collection/field'
import {actionsFromDb} from '../collection/action'
import {listviewsFromDb} from '../collection/listview'
import {validationsFromDb} from '../collection/objectValidation'
import {objectPermissionsFromDb} from '../collection/objectPermission'

import {permissionsetsFromDb} from '../collection/permissionset'
import {applicationsFromDb} from '../collection/application'
import {reportsFromDb} from '../collection/report'
import {workflowsFromDb} from '../collection/workflow'
import {flowsFromDb} from '../collection/flow'
import {approvalProcessesFromDb} from '../collection/approvalProcess'
import {rolesFromDb} from '../collection/role'
import {flowRolesFromDb} from '../collection/flowRole'
import {layoutsFromDb} from '../collection/layout'
import { QueryCollection } from '../collection/query';
import { ChartCollection } from '../collection/chart';
import { PageCollection } from '../collection/page';
import { TabCollection } from '../collection/tab';
import { ShareRuleCollection } from '../collection/shareRule'
import { RestrictionRuleCollection } from '../collection/restrictionRule'
import { ProcessCollection } from '../collection/process';
import { TriggerCollection } from '../collection/trigger';

const queryCollection = new QueryCollection();
const chartCollection = new ChartCollection();
const pageCollection = new PageCollection();
const tabCollection = new TabCollection();
const shareRuleCollection = new ShareRuleCollection();
const restrictionRuleCollection = new RestrictionRuleCollection();
const processCollection = new ProcessCollection();
const triggerCollection = new TriggerCollection();

import { hasParent, getParentMetadataName, hasChild, getMetadataTypeInfo, getFunctionFields,
   SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';



export async function dbToJson(reqYml, steedosPackage, dbManager){

  if(!_.has(steedosPackage, TypeInfoKeys.Object)){
    steedosPackage[TypeInfoKeys.Object] = {}
  }

  for(const metadataName in reqYml){

    var container; // 当前metadata的上层容器
    if(hasParent(metadataName)){
      var parentMetadataName = getParentMetadataName(metadataName);
      container = steedosPackage[parentMetadataName]
    }else{
      container = steedosPackage
    }
    
    switch (metadataName) {
      case TypeInfoKeys.Object:
        await objectsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Field:
        await fieldsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Action:
        await actionsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Listview:
        await listviewsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Permission:
        await objectPermissionsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.ValidationRule:
        await validationsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Application:
        await applicationsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Permissionset:
        await permissionsetsFromDb(dbManager, reqYml[metadataName], container, false);
        break;

      case TypeInfoKeys.Process: 
        await processCollection.retrieve(dbManager, reqYml[metadataName], container) ;
        break;

      case TypeInfoKeys.Profile:
        await permissionsetsFromDb(dbManager, reqYml[metadataName], container, true);
        break;

      case TypeInfoKeys.Report:
        await reportsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Workflow:
        await workflowsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Flow:
        await flowsFromDb(dbManager, reqYml[metadataName], container);
        break;
        
      case TypeInfoKeys.ApprovalProcess:
        await approvalProcessesFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Role:
        await rolesFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.FlowRole:
        await flowRolesFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Layout:
        await layoutsFromDb(dbManager, reqYml[metadataName], container);
        break;

      case TypeInfoKeys.Chart:
        await chartCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
  
      case TypeInfoKeys.Query:
        await queryCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      case TypeInfoKeys.Page:
        await pageCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      case TypeInfoKeys.Tab:
        await tabCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      case TypeInfoKeys.ShareRule:
        await shareRuleCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      case TypeInfoKeys.RestrictionRule:
        await restrictionRuleCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      case TypeInfoKeys.Trigger:
        await triggerCollection.retrieve(dbManager, reqYml[metadataName], container);
        break;
      default:
        break;
    }
  }
  
  return steedosPackage;
}

export async function getSteedosPackage(yml, steedosPackage, dbManager){

  const transactionOptions:any = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' }
  };
  var session = await dbManager.startSession();

  try{
    await session.withTransaction(async () => {
      await dbToJson(yml, steedosPackage, dbManager);
    }, transactionOptions);
  }catch(err){
    throw err;
  }finally{
    await dbManager.endSession();
  }
 
  convertSteedosPackage(steedosPackage);

  return steedosPackage;
}

function convertFunctionFields(functionStr){

    var func = _eval(`module.exports = ${functionStr}`, 'fieldFunction');
    return func;
}

function convertSteedosPackage(steedosPackage){
  
  for(const metadataName in steedosPackage){

    var metadataTypeinfo = getMetadataTypeInfo(metadataName);
    if(!metadataTypeinfo){ // parent中除child以外的属性
      continue;
    }

    var metadataRecords = steedosPackage[metadataName];
    var functionFields = getFunctionFields(metadataName);

    for(const metadataRecordName in metadataRecords){
      var metadataRecord = metadataRecords[metadataRecordName]
      if(hasChild(metadataName)){
        convertSteedosPackage(metadataRecord);
      }
      
      if(functionFields){
        for(const fieldName of functionFields){
          if(metadataRecord[fieldName]){
            try{
              metadataRecord[fieldName] = convertFunctionFields(metadataRecord[fieldName]);
            }catch(err){
              throw new Error('Error occurred in converting function field:'+fieldName+' of '+metadataRecordName+','+ err.message);
            }
          }
        }
      }
      
    }

  }
}