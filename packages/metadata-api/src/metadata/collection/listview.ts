import {DbManager} from '../../util/dbManager'
import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = "object_listviews";
const collection_metadata_name = TypeInfoKeys.Listview;

export async function listviewsFromDb(dbManager, listviewList, objects){

  for(var i=0; i<listviewList.length; i++){

    var reqStr = listviewList[i];
    var objectName = reqStr.substring(0, reqStr.indexOf('.'));
    var listviewName = reqStr.substring(reqStr.indexOf('.')+1);

    if(listviewName == '*'){
      var listviews = await getAllListView(dbManager, objectName);

      for(var j=0; j<listviews.length; j++){
        var listview = listviews[j];
        addListViewToObejcts(listview, objects, objectName);
      }
    }else{

      var listview = await getListViewByName(dbManager, listviewName, objectName);
      addListViewToObejcts(listview, objects, objectName);
    }
  }
}

async function addListViewToObejcts(listview, objects, objectName){
  
  var listviewName = getFullName(collection_metadata_name, listview)
  deleteCommonAttribute(listview);
  // delete listview.name;
  delete listview.object_name;
  sortAttribute(listview)

  
  if(typeof objects[objectName] == 'undefined'){
    objects[objectName] = {name: objectName, _fake: true}
  }
    
  var objListViews = objects[objectName][collection_metadata_name];

  if(typeof objListViews == 'undefined'){

    objects[objectName][collection_metadata_name] = {};
    objListViews = objects[objectName][collection_metadata_name];
  }
  
  objListViews[listviewName] = listview;

}

async function getAllListView(dbManager, objectName) {

  var listview = await dbManager.find(collection_name, {object_name: objectName, shared: true});
  return listview;
}

async function getListViewByName(dbManager, listviewName, objectName) {

    var listview = await dbManager.findOne(collection_name, {name: listviewName, object_name: objectName, shared: true});
    return listview;
}

export async function listviewsToDb(dbManager, listviews, objectName){
  for(const listviewName in listviews){
    var listview = listviews[listviewName];
    listview.name = listviewName;
    listview.object_name = objectName;
    if(typeof listview.shared == 'undefined'){
      listview.shared = true
    }
    await saveOrUpdateListView(dbManager, listview);
  }
}

async function saveOrUpdateListView(dbManager, listview) {

  var filter = {name: listview.name, object_name: listview.object_name};
  var dbListView = await dbManager.findOne(collection_name, filter);

  if(dbListView == null){
    return await dbManager.insert(collection_name, listview);
  }else{
    return await dbManager.update(collection_name, filter, listview);
  }
}