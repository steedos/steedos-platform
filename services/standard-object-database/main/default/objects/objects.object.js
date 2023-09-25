const { getObject, getObjectConfig } = require('@steedos/objectql');
var objectql = require('@steedos/objectql');
var yaml = require('js-yaml');
const _ = require('underscore');
var objectCore = require('./objects.core.js');
var objectTree = require('./objects.tree.js');
const internalBaseObjects = ['base', 'core'];
const relationalDatabases = ['sqlserver','postgres','oracle','mysql','sqlite'];
function isCodeObjects(name){
    if(_.include(internalBaseObjects, name)){
        return true;
    }
    let objMap = objectql.getSteedosSchema().getObjectMap(name);
    if(objMap && !objMap._id){
        return true;
    }
    return false;
}

function isRepeatedName(doc) {
    // let datasourceName = objectCore.getDataSourceName(doc);
    if(isCodeObjects(doc.name)){
        return true;
    }
    
    var other;
    other = Creator.getCollection("objects").find({
        _id: {
            $ne: doc._id
        },
        // space: doc.space,
        name: doc.name
    }, {
        fields: {
            _id: 1,
            is_deleted: 1
        }
    });
    if (other.count() > 0) {
        const otherObjects = other.fetch();
        if(_.find(otherObjects, function(item){
            return item.is_deleted
        })){
            throw new Error('已存在同名对象,请在「已删除」视图中查看')
        }else{
            return true;
        }
    }
    return false;
};

function checkName(name,spaceId){
    if(objectql.hasObjectSuffix(name, spaceId, true)){
        name = name.replace(objectql.getObjectSuffix(spaceId, true), '')
    }
    var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
    if(!reg.test(name)){
        throw new Error("API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
    }
    if(name.length > 50){
        throw new Error("名称长度不能大于50个字符");
    }
    return true
}

function initObjectPermission(userId, doc){
    let lng = Steedos.locale(userId, true)
    let spaceId =  doc.space;
    let psetsAdminId = null;
    let psetsAdminLabel = null;
    let psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'});
    if(!psetsAdmin){
        psetsAdminLabel = TAPi18n.__(`permission_set_admin`, {}, lng)
        psetsAdminId = Creator.getCollection("permission_set").insert({space: spaceId, name: 'admin', type: 'profile', label: TAPi18n.__(`permission_set_admin`, {}, lng)});
    }else{
        psetsAdminLabel = psetsAdmin.label
        psetsAdminId = psetsAdmin._id
    }
    let psetsUserId = null;
    let psetsUserLabel = null;
    let psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'});
    if(!psetsUser){
        psetsUserLabel = TAPi18n.__(`permission_set_user`, {}, lng)
        psetsUserId = Creator.getCollection("permission_set").insert({space: spaceId, name: 'user', type: 'profile', label: TAPi18n.__(`permission_set_user`, {}, lng)});
    }else{
        psetsUserLabel = psetsUser.label
        psetsUserId = psetsUser._id;
    }

    Creator.getCollection("permission_objects").insert(Object.assign({}, Creator.getObject("base").permission_set.user, {
        name: doc.label + '.' + psetsUserLabel,
        permission_set_id : psetsUserId,
        object_name : doc.name,
        space: doc.space
    }));

    Creator.getCollection("permission_objects").insert(Object.assign({}, Creator.getObject("base").permission_set.admin, {
        name: doc.label + '.' + psetsAdminLabel,
        permission_set_id : psetsAdminId,
        object_name : doc.name,
        space: doc.space
    }));
}

function getObjectName(datasource, objectName, spaceId, oldObjectName){
    if(datasource && datasource != 'default'){
        return objectName;
      }else{
          if(objectql.hasObjectSuffix(objectName, spaceId)){
            return objectName;
          }else{
            return objectql._makeNewObjectName(objectName, spaceId, oldObjectName);
          }
      }
}

function isRelationalDatabase(object){
    var datasource = objectCore.getDataSource(object);
    if(datasource){
        return _.include(relationalDatabases, datasource.driver)
    }
}

function canEnable(object){
    if(isRelationalDatabase(object)){
        if(!object.fields || !_.isObject(object.fields)){
            return false
        }else{
            var hasPrimary = false;
            _.each(object.fields, function(field){
                if(field.primary){
                    hasPrimary = true;
                }
            })
            // console.log('hasPrimary', hasPrimary);
            return hasPrimary
        }
    }
    return true;
}

// Creator.Objects.objects.actions = {
//     show_object: {
//         label: "Preview",
//         visible: true,
//         on: "record",
//         todo: function (object_name, record_id, item_element) {
//             var record = this.record || Creator.getObjectById(record_id);
//             if(!record){
//                 return toastr.error("未找到记录");
//             }

//             if(record.is_enable === false){
//                 return toastr.warning("请先启动对象");
//             }

//             if(record.datasource && record.datasource != 'default'){
//                 var datasource = Creator.odata.get('datasources', record.datasource, 'is_enable');
//                 if(!datasource){
//                     return toastr.error("未找到数据源");
//                 }
//                 if(!datasource.is_enable){
//                     return toastr.warning("请先启动数据源");
//                 }
//             }

//             var allViews = Creator.odata.query('object_listviews', {$select: '_id', $filter: `(((contains(tolower(object_name),'${record.name}'))) and ((contains(tolower(name),'all'))))`}, true);

//             if(allViews && allViews.length > 0){
//                 Steedos.openWindow(Creator.getRelativeUrl("/app/-/" + record.name + "/grid/" + allViews[0]._id))
//             }else{
//                 Steedos.openWindow(Creator.getRelativeUrl("/app/-/" + record.name + "/grid/all"))
//             }
//         }
//     },
//     copy_odata: {
//         label: "Copy OData URL",
//         visible: true,
//         on: "record",
//         todo: function (object_name, record_id, item_element) {
//             var clipboard, o_name, path, record;
//             record = this.record || Creator.getObjectById(record_id);
//             //enable_api 属性未开放
//             if ((record != null ? record.enable_api : void 0) || true) {
//                 o_name = record != null ? record.name : void 0;
//                 path = SteedosOData.getODataPath(Session.get("spaceId"), o_name);
//                 item_element.attr('data-clipboard-text', path);
//                 if (!item_element.attr('data-clipboard-new')) {
//                     clipboard = new Clipboard(item_element[0]);
//                     item_element.attr('data-clipboard-new', true);
//                     clipboard.on('success', function (e) {
//                         return toastr.success('复制成功');
//                     });
//                     clipboard.on('error', function (e) {
//                         toastr.error('复制失败');
//                         return console.error("e");
//                     });
//                     if (item_element[0].tagName === 'LI' || item_element.hasClass('view-action')) {
//                         return item_element.trigger("click");
//                     }
//                 }
//             } else {
//                 return toastr.error('复制失败: 未启用API');
//             }
//         }
//     }
// }

function allowChangeObject(){
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return false
    }else{
        return true;
    }
}

function onChangeObjectName(oldName, newDoc){
    //修改字段
    Creator.getCollection("object_fields").update({space: newDoc.space, object: oldName}, {$set: {object: newDoc.name}}, {
        multi: true
    });
    //修改视图
    Creator.getCollection("object_listviews").direct.update({space: newDoc.space, object_name: oldName}, {$set: {object_name: newDoc.name}}, {
        multi: true
    });
    //修改权限
    Creator.getCollection("permission_objects").direct.update({space: newDoc.space, object_name: oldName}, {$set: {object_name: newDoc.name}}, {
        multi: true
    });
    //修改action
    Creator.getCollection("object_actions").direct.update({space: newDoc.space, object: oldName}, {$set: {object: newDoc.name}}, {
        multi: true
    });
    //修改trigger
    Creator.getCollection("object_triggers").direct.update({space: newDoc.space, object: oldName}, {$set: {object: newDoc.name}}, {
        multi: true
    });
    //字段表中的reference_to
    Creator.getCollection("object_fields").update({space: newDoc.space, reference_to: oldName}, {$set: {reference_to: newDoc.name}}, {
        multi: true
    });

    // TODO 确认是否已处理所有相关子表
}

function beforeRemoveObject(doc){
    const objectName = doc.name;
    const obj = getObject(objectName);
    if(obj && obj.details && obj.details.length){
        throw new Meteor.Error(500, `不能删除该对象，因为在已知的主表子表关系中它是以下对象的主对象：${obj.details}`);
    }
}

function beforeRestoreObject(doc){
    let fields = Creator.getCollection("object_fields").find({
        object: doc.name,
        space: doc.space,
        type: "master_detail"
    }, {
        fields: {
            reference_to: 1
        }
    }).fetch();
    _.each(fields, (field)=>{
        if(field.reference_to && _.isString(field.reference_to)){
            let exist = false;
            try{
                exist = !!getObject(field.reference_to);
            }
            catch(ex){
                exist = false;
            }
            if(!exist){
                throw new Meteor.Error(500, `不能还原该对象，因为在已知的主表子表关系中以下主对象未还原：${field.reference_to}`);
            }
        }
    });
}

let objectTriggers = {
    "before.insert.server.objects": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            if(!allowChangeObject()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
            }
            checkName(doc.name, doc.space);
            doc.name = getObjectName(doc.datasource, doc.name, doc.space);
            if (isRepeatedName(doc)) {
                throw new Meteor.Error(500, "对象名称不能重复");
            }
            doc.fields_serial_number = 100;
            // if(isRelationalDatabase(doc)){
            //     doc.is_enable = false;
            // }

            doc.custom = true;
        }
    },
    "after.insert.server.objects": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            //新增object时，默认新建一个name字段
            Creator.getCollection("object_fields").insert({
                object: doc.name,
                owner: userId,
                _name: "name",
                label: "名称",
                space: doc.space,
                type: "text",
                required: true,
                index: true,
                searchable: true,
                filterable: true
            });
            // Creator.getCollection("object_fields").insert({
            //     object: doc.name,
            //     owner: userId,
            //     _name: "owner",
            //     label: "所有者",
            //     space: doc.space,
            //     type: "lookup",
            //     reference_to: "users",
            //     sortable: true,
            //     index: true,
            //     defaultValue: "{userId}",
            //     omit: true,
            //     hidden: true
            // });
            Creator.getCollection("object_listviews").insert({
                name: "all",
                label: "所有",
                space: doc.space,
                owner: userId,
                object_name: doc.name,
                shared: true,
                filter_scope: "space",
                columns: [{field: 'name'}]
            });
            Creator.getCollection("object_listviews").insert({
                name: "recent",
                label: "最近查看",
                space: doc.space,
                owner: userId,
                object_name: doc.name,
                shared: true,
                filter_scope: "space",
                columns:  [{field: 'name'}]
            });
            
            initObjectPermission(userId, doc);
        }
    },
    "before.update.server.objects": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            if(!allowChangeObject()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
            }
            modifier.$set = modifier.$set || {}

            if(!doc.is_deleted && modifier.$set.is_deleted){
                beforeRemoveObject(doc);
            }
            else if(doc.is_deleted && !modifier.$set.is_deleted){
                beforeRestoreObject(doc);
            }
            if(modifier.$set.is_enable){
                let fields = doc.fields;
                if (!fields) {
                    fields = Creator.getCollection("object_fields").find({space: doc.space, object: doc.name}).fetch();
                }
                if(!canEnable({fields: fields, datasource: modifier.$set.datasource || doc.datasource})){
                   //  throw new Meteor.Error(500, "不能启用对象，请先配置主键字段");
                }
            }

            if ((modifier.$set.name && doc.name !== modifier.$set.name) || modifier.$set.datasource && doc.datasource !== modifier.$set.datasource) {
                checkName(modifier.$set.name || doc.name);
                modifier.$set.name = getObjectName(modifier.$set.datasource || doc.datasource, modifier.$set.name || doc.name, doc.space, doc.name);
                if (isRepeatedName({_id: doc._id, name: modifier.$set.name || doc.name, datasource: modifier.$set.datasource || doc.datasource})) {
                    throw new Meteor.Error(500, "对象名称不能重复");
                }
            }
            if (modifier.$set) {
                modifier.$set.custom = true;
            }
            if (modifier.$unset && modifier.$unset.custom) {
                delete modifier.$unset.custom;
            }
        }
    },
    "after.update.server.objects": {
        on: "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var set = modifier.$set || {}
            if((set.name || set.datasource) && this.previous.name != doc.name){
                onChangeObjectName(this.previous.name, doc);
            }
        }
    },
    "before.remove.server.objects": {
        on: "server",
        when: "before.remove",
        todo: function (userId, doc) {
            if(!allowChangeObject()){
                throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
            }
            beforeRemoveObject(doc);
            // var documents, object_collections;
            // if (doc.app_unique_id && doc.app_version) {
            //     return;
            // }
            // object_collections = Creator.getCollection(doc.name, doc.space);
            // documents = object_collections.find({}, {
            //     fields: {
            //         _id: 1
            //     }
            // });
            // if (documents.count() > 0) {
            //     throw new Meteor.Error(500, `对象(${doc.name})中已经有记录，请先删除记录后， 再删除此对象`);
            // }
        }
    },
    "after.remove.server.objects": {
        on: "server",
        when: "after.remove",
        todo: function (userId, doc) {

            if(!objectql.hasObjectSuffix(doc.name, doc.space) && !doc.datasource){
                console.warn('warn: Not remove. Invalid custom object -> ', doc.name);
                return;
            }        

            //删除object 后，自动删除fields、actions、triggers、permission_objects
            Creator.getCollection("object_fields").direct.remove({
                object: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_listviews").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_actions").direct.remove({
                object: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_layouts").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_triggers").direct.remove({
                object: doc.name,
                space: doc.space
            });

            Creator.getCollection("permission_objects").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("permission_fields").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_workflows").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("object_validation_rules").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("restriction_rules").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("share_rules").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            if(Creator.getCollection("process")){
                Creator.getCollection("process").direct.remove({
                    object_name: doc.name,
                    space: doc.space
                });
            }

            Creator.getCollection("pages").direct.remove({
                object_name: doc.name,
                space: doc.space
            });

            Creator.getCollection("tabs").direct.remove({
                object: doc.name,
                space: doc.space
            });
        }
    },
    // "after.update.server.dynamic_load": {
    //     on: "server",
    //     when: "after.update",
    //     todo: function (userId, doc, fieldNames, modifier, options) {
    //         loadObject(doc);
    //     }
    // }

}
_.each(Creator.Objects.objects.triggers, function(v, k){
    if(k.endsWith('_afterInsert')){
        objectTriggers[k] = v
    }
})

Creator.Objects.objects.triggers = Object.assign(Creator.Objects.objects.triggers || {}, objectTriggers);

// Creator.Objects['objects'].methods = {
//     export_yml: async function (req, res) {
//         return Fiber(function () {
//             let { _id } = req.params
//             let obj =  Creator.getCollection("objects").findOne({_id: _id})
//             let dataStr = yaml.safeDump(obj);
//             let fileName = obj.name;
//             res.setHeader('Content-type', 'application/x-msdownload');
//             res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(fileName)+'.object.yml');
//             res.end(dataStr);
//         }).run();
        
//     }
// }