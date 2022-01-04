import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = 'object_actions';
const collection_metadata_name = TypeInfoKeys.Action;

export async function actionsFromDb(dbManager, actionList, objects){
    for(var i=0; i<actionList.length; i++){
        
      var reqStr = actionList[i];
      var objectName = reqStr.substring(0, reqStr.indexOf('.'));
      var actionName = reqStr.substring(reqStr.indexOf('.')+1);

      if(actionName.endsWith('.js')){
        continue;
      }
      
      if(actionName == '*'){
        var actions = await getAllAction(dbManager, objectName);
  
        for(var j=0; j<actions.length; j++){
          var action = actions[j];
          addActionToObejcts(action, objects, objectName);
        }
      }else{
  
        var action = await getActionByName(dbManager, actionName, objectName);
        addActionToObejcts(action, objects, objectName);
      }
        
    }

}

async function addActionToObejcts(action, objects, objectName){
  var actionName = getFullName(collection_metadata_name, action);
  deleteCommonAttribute(action);
  delete action.object;
  sortAttribute(action)
  if(typeof objects[objectName] == 'undefined'){
    objects[objectName] = {name: objectName, _fake: true}
  }

  var objActions = objects[objectName][collection_metadata_name];

  if(typeof objActions == 'undefined'){
    objects[objectName][collection_metadata_name] = {};
    objActions = objects[objectName][collection_metadata_name];
  }

  objActions[actionName] = action;

}

async function getAllAction(dbManager, objectName) {
  var action = await dbManager.find(collection_name, { object: objectName});
  return action;
}

async function getActionByName(dbManager, actionName, objectName) {

  var action = await dbManager.findOne(collection_name, {name: actionName, object: objectName});
  return action;
}


export async function actionsToDb(dbManager, actions, objectName){
  for(const actionName in actions){
    var action = actions[actionName];
    action.name = actionName;
    action.object = objectName;
    if(typeof action.is_enable == 'undefined'){
      action.is_enable = true
    }
    await saveOrUpdateAction(dbManager, action);
  }
}

async function saveOrUpdateAction(dbManager, action) {

  var filter = {name: action.name, object: action.object};
  var dbAction = await dbManager.findOne(collection_name, filter);

  if(dbAction == null){
      return await dbManager.insert(collection_name, action);
  }else{
      return await dbManager.update(collection_name, filter, action);
  }
}