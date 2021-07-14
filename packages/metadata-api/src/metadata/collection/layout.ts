import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import _ from 'underscore';
import { checkNameEquals } from '../../util/check_name_equals';
// import { getAllObject } from './object'

// const objectql = require('@steedos/objectql')

const collection_name = "object_layouts";
// const object_fields = "object_fields";
// const object_actions = "object_actions";
const permission_set = "permission_set";
const metadata_name = TypeInfoKeys.Layout;

// declare var Creator;

export async function layoutsFromDb(dbManager, layoutList, steedosPackage){

    steedosPackage[metadata_name] = {}
    var packageLayouts = steedosPackage[metadata_name]

    if(layoutList.length == 1 && layoutList[0] == '*'){
        var dbLayouts = await getAllLayouts(dbManager);
        for(var i=0; i<dbLayouts.length; i++){
            var dbLayout = dbLayouts[i]
            var dbLayoutName = getFullName(metadata_name, dbLayout)
            packageLayouts[dbLayoutName] = dbLayout
        }
    }else{

        for(var i=0; i<layoutList.length; i++){
    
            var layoutName = layoutList[i];
       
            var dbLayout = await getLayoutByOjectName(dbManager, layoutName);
            var dbLayoutName = getFullName(metadata_name, dbLayout)
            packageLayouts[dbLayoutName] = dbLayout;
        }
    }
}

async function getAllLayouts(dbManager) {

    var layouts = await dbManager.find(collection_name, {});

    for(var i=0; i<layouts.length; i++){
        let layout = layouts[i]
        deteleIdInproperties(layout)
        deleteCommonAttribute(layout);
        sortAttribute(layout);
    }
    return layouts;
}

function deteleIdInproperties(layout){

    deteleIdInproperty(layout.buttons)
    deteleIdInproperty(layout.fields)
    deteleIdInproperty(layout.related_lists)
}

function deteleIdInproperty(list){

    if(!list){
        return
    }
    for(let item of list){
        delete item._id
    }
}

async function getLayoutByOjectName(dbManager, layoutName) {

    let parts = layoutName.split('.');
    var layout = await dbManager.findOne(collection_name, {object_name: parts[0], name: parts[1]});
    deteleIdInproperties(layout)
    deleteCommonAttribute(layout);
    sortAttribute(layout);
    return layout;
}

export async function layoutsToDb(dbManager, layouts){

    for(const layoutName in layouts){
        var layout = layouts[layoutName];
        // await checkComponentsExist(dbManager, layout);
        await saveOrUpdateLayout(dbManager, layout);
    }
}
 
// async function checkComponentsExist(dbManager, layout) {

//     if(!layout.object_name){
//         throw new Error('object_name is required in layout');
//     }
//     const objectCollection = await objectql.getObject(layout.object_name);

//     if(!objectCollection){
//         throw new Error(`can't find object ${layout.object_name}`);
//     }

//     let objectActions = objectCollection.actions;

//     if(layout.buttons){
//         for(let button of layout.buttons){
    
//             if(button.button_name && !objectActions[button.button_name]){
//                 throw new Error(`no CustomAction named ${layout.object_name}.${button.button_name} found`);
//             }
    
//         }
//     }
    
//     let objectFields = objectCollection.fields;

//     if(layout.fields){
//         for(let field of layout.fields){

//             if(field.field_name && !objectFields[field.field_name]){
//                 throw new Error(`no CustomField named ${layout.object_name}.${field.field_name} found`);
//             }

//         }
//     }
//     let layoutFieldNames = _.pluck(layout.fields, 'field_name');
//     for(let objectFieldName in objectFields){
//         const objectField = objectFields[objectFieldName]
//         if(objectField.required && !_.contains(layoutFieldNames, objectFieldName)){
//             throw new Error(`miniLayoutField: ${objectField.name} is not present in the full layout`);
//         }
//     }

//     const sourceProfiles = await objectql.getSourceProfiles();
//     const sourceProfileNames = _.pluck(sourceProfiles, 'name');

//     for(let profileName of layout.profiles){

//         if(_.contains(sourceProfileNames, profileName)){
//             continue;
//         }

//         var dbProfile = await dbManager.findOne(permission_set, {name: profileName, type: 'profile'});
//         if(!dbProfile){
//             throw new Error(`no Profile named ${profileName} found`);
//         }
//     }

//     const objectLayoutCollection = await objectql.getObject('object_layouts');
//     const sortOrderOptions = objectLayoutCollection.fields['related_lists.$.sort_order'].options
//     const sortOrderOptionValues = _.pluck(sortOrderOptions, 'value');
//     for(let related_item of layout.related_lists){
//         if(related_item.sort_order && !_.contains(sortOrderOptionValues, related_item.sort_order)){
//             throw new Error(`invalid sort_order "${related_item.sort_order}", sort_order shoule be selected within ${JSON.stringify(sortOrderOptionValues)}`);
//         }

//     }

// }

async function saveOrUpdateLayout(dbManager, layout) {

    var filter = {name: layout.name, object_name: layout.object_name};
    var dbLayout = await dbManager.findOne(collection_name, filter);

    if(dbLayout == null){
        return await dbManager.insert(collection_name, layout);
    }else{
        return await dbManager.update(collection_name, filter, layout);
    }
}