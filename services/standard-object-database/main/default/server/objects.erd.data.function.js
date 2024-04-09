/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-07-30 09:20:04
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-29 11:32:40
 * @Description: 
 */
const InternalData = require('@steedos/standard-objects').internalData;
const clone = require('clone');
const steedosI18n = require("@steedos/i18n");
const objectql = require("@steedos/objectql");
const _ = require('underscore');
const auth = require("@steedos/auth");
const getLng = async function(userId){
    const userSession = await auth.getSessionByUserId(userId);
    return userSession.language;
}

function getOriginalObjectFields(objectName){
    return objectql.getOriginalObjectConfig(objectName).fields || {}
}

async function getObjectFields(objectName, userId){
    let object = await InternalData.getObject(objectName, userId);
    if(object){
        let fields = [];
        let originalFieldsName = ['created_by', 'modified_by'].concat(_.keys(getOriginalObjectFields(objectName))); //'created', 'modified', 'owner'
        _.each(object.fields, function(field){
            if(_.include(originalFieldsName, field.name)){
                if(!field._id ){
                    fields.push(Object.assign({_id: `${objectName}.${field.name}`, _name: field.name, object: objectName}, field))
                }else{
                    fields.push(Object.assign({_name: field.name, object: objectName}, field))
                }
                
            }
        })
        return fields
    }
}

async function getObjects(userId){
    let objects = {};
    let lng = await getLng(userId)
    let allObjectConfigs = await objectql.getSteedosSchema().getAllObject();
    for (const objectConfig of allObjectConfigs) {
        var _obj = clone(objectConfig.metadata);
        var k = _obj.name;
        if(!_obj.hidden &&  !_.include(InternalData.hiddenObjects, k)){
            if(!_obj._id){
                _obj._id = k;
            }
            _obj.name = k;
            // _obj.datasource = name;
            _obj.fields = {};
            let oFields = await getObjectFields(k, userId);
            _.each(oFields, function(_f){
                _obj.fields[_f.name] = _f;
            });
            delete _obj.actions
            delete _obj.triggers
            delete _obj.list_views
            delete _obj.permission_set
            if(_obj.enable_inline_edit !== false){
                // 默认值配置为true
                _obj.enable_inline_edit = true;
            }
            objects[_obj.name] = _obj
        }
    }
    steedosI18n.translationObjects(lng, objects)
    return _.values(objects);
}

module.exports = {
    listenTo: 'objects',
    erd: async function(req, res){
        const params = req.params;
        const userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const objects = await getObjects(userId);
        res.status(200).send({ value: objects });
    }
  }