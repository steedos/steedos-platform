var _ = require("underscore");
var objectql = require('@steedos/objectql');
var clone = require('clone');

function canRemoveNameFileld(doc){
  var object = Creator.getCollection("objects").findOne({name: doc.object}, {fields: {datasource: 1}});
  if(object.datasource && object.datasource != 'default'){
    return true;
  }
  return false;
}

function getFieldName(objectName, fieldName){
  var object = Creator.getCollection("objects").findOne({name: objectName}, {fields: {datasource: 1}})
  if(object.datasource && object.datasource != 'default'){
    return fieldName;
  }else{
    if(fieldName != 'name' && fieldName != 'owner'){
      return `${fieldName}__c`;
    }else{
      return fieldName
    }
  }
}

function _syncToObject(doc, isInsert) {
  var fields, object_fields, table_fields;
  object_fields = Creator.getCollection("object_fields").find({
    space: doc.space,
    object: doc.object
  }, {
    fields: {
      created: 0,
      modified: 0,
      owner: 0,
      created_by: 0,
      modified_by: 0
    },
    sort: {
      sort_no: 1
    }
  }).fetch();
  fields = {};
  table_fields = {};
  _.forEach(object_fields, function (f) {
    var cf_arr, child_fields;
    if (/^[a-zA-Z_]\w*(\.\$\.\w+){1}[a-zA-Z0-9]*$/.test(f.name)) {
      cf_arr = f.name.split(".$.");
      child_fields = {};
      child_fields[cf_arr[1]] = f;
      if (!_.size(table_fields[cf_arr[0]])) {
        table_fields[cf_arr[0]] = {};
      }
      return _.extend(table_fields[cf_arr[0]], child_fields);
    } else {
      return fields[f.name] = f;
    }
  });
  _.each(table_fields, function (f, k) {
    k = getFieldName(doc.object, k);
    if (fields[k].type === "grid") {
      if (!_.size(fields[k].fields)) {
        fields[k].fields = {};
      }
      return _.extend(fields[k].fields, f);
    }
  });

  let objectSet = {
    fields: fields
  }

  if(isInsert){
    const objectRecord = Creator.getCollection("objects").findOne({
      space: doc.space,
      name: doc.object
    })
    if(objectRecord){
      let fields_serial_number = null;
      if(!objectRecord.fields_serial_number || objectRecord.fields_serial_number < 100){
        fields_serial_number = 100 + _.keys(fields).length * 10
      }else{
        fields_serial_number = objectRecord.fields_serial_number + 10
      }

      objectSet.fields_serial_number = fields_serial_number;
    }
  }


  return Creator.getCollection("objects").update({
    space: doc.space,
    name: doc.object
  }, {
    $set: objectSet
  });
};

function isRepeatedName(doc, name) {
  var other;
  other = Creator.getCollection("object_fields").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    name: name || doc.name
  }, {
    fields: {
      _id: 1
    }
  });
  if (other.count() > 0) {
    return true;
  }
  return false;
};
//每个对象只能有一个master_detail
function hasMultipleMasterDetailTypeFiled(doc) {
  var other;
  other = Creator.getCollection("object_fields").find({
    object: doc.object,
    space: doc.space,
    _id: {
      $ne: doc._id
    },
    type: "master_detail"
  }, {
    fields: {
      _id: 1
    }
  });
  if (other.count() > 0) {
    return true;
  }
  return false;
};

function onChangeName(oldName, newDoc){
  var newName = newDoc.name
  Creator.getCollection("object_listviews").direct.find({space: newDoc.space, object_name: newDoc.object}, {fields: {_id:1, columns: 1}}).forEach(function(view){
    if(_.isArray(view.columns)){
      var columns = [];
      _.each(view.columns, function(column){
        if(_.isString(column)){
          if(oldName === column){
            columns.push(newName)
          }else{
            columns.push(column)
          }
        }else if(_.has(column, 'field')){
          if(oldName === column.field){
            columns.push(Object.assign({}, column, {field: newName}))
          }else{
            columns.push(column)
          }
        }else{
          columns.push(column)
        }
      });
      Creator.getCollection("object_listviews").update({_id: view._id}, {$set: {columns: columns}});
    }
  })
}

//只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符 TODO 支持表格
function checkName(name){
  var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$'); //支持表格类型的验证表达式(待优化.$.限制只能出现一次): new RegExp('^[a-z]([a-z0-9]|_(?!_))*(\\.\\$\\.\\w+)*[a-z0-9]$')
  //TODO 撤销注释
  if(!reg.test(name)){
    throw new Error("名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
  }
  if(name.length > 20){
    throw new Error("名称长度不能大于20个字符");
  }
  return true
}

function allowChangeObject(){
  var config = objectql.getSteedosConfig();
  if(config.tenant && config.tenant.saas){
      return false
  }else{
      return true;
  }
}

function checkNameField(nameField){
  if(["text", "autonumber"].indexOf(nameField.type) < 0){
    throw new Error("只有文本或自动编号类型的字段可以被设置为名称字段");
  }
}

function getFieldDefaultProps(field){
  let prosp = {}
  switch (field.type) {
    case 'autonumber':
      if(!field.formula || !field.formula.trim()){
        prosp.formula = '{0000}';
      }
      break;
    default:
      break;
  }
  return prosp;
}

//TODO 清理不匹配的属性
function handleFieldProps(field){

}

const checkFormulaInfiniteLoop = function(_doc){
  if(_doc.type === "formula"){
    doc = clone(_doc)
    delete doc._id
    let objectConfig = Creator.getCollection("objects").findOne({
      space: doc.space,
      name: doc.object
    });
    delete objectConfig._id;
    try {
      objectql.addObjectFieldFormulaConfig(doc, objectConfig);
    } catch (error) {
      if(error.message.startsWith('Infinite Loop')){
        throw new Error('字段公式配置异常，禁止循环引用对象字段');
      }else{
        throw error;
      }
    }
  }
}

var triggers = {
  "after.insert.server.object_fields": {
    on: "server",
    when: "after.insert",
    todo: function (userId, doc) {
      _syncToObject(doc, true);
    }
  },
  "after.update.server.object_fields": {
    on: "server",
    when: "after.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      _syncToObject(doc);
      var set = modifier.$set || {}
      if(set._name && this.previous.name != doc.name){
        onChangeName(this.previous.name, doc);
      }
    }
  },
  "after.remove.server.object_fields": {
    on: "server",
    when: "after.remove",
    todo: function (userId, doc) {
      return _syncToObject(doc);
    }
  },
  "before.update.server.object_fields": {
    on: "server",
    when: "before.update",
    todo: function (userId, doc, fieldNames, modifier, options) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      modifier.$set = modifier.$set || {}
      if(_.has(modifier.$set, "name")){
        throw new Error("不能修改对象的name属性");
      }

      let fname = modifier.$set.name || doc.name
      let ftype = modifier.$set.type || doc.type
      let fisName = doc.is_name

      if(_.has(modifier.$set, "is_name")){
        fisName = modifier.$set.is_name
      }

      if(fname === 'name' || fisName){
        checkNameField({type: ftype})
      }

      // if(_.has(modifier.$set, "object") && modifier.$set.object != doc.object){
      //   throw new Error("不能修改所属对象");
      // }

      if (doc.name === 'name' && _.has(modifier.$set, '_name') && doc.name !== modifier.$set._name) {
        throw new Meteor.Error(500, "不能修改此纪录的name属性");
      }

      if(_.has(modifier.$set, "_name")){
        checkName(modifier.$set._name)
        modifier.$set.name = getFieldName(doc.object, modifier.$set._name);
      }

      var _reference_to, object, object_documents, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;

      if(_.has(modifier.$set, 'name') &&  isRepeatedName(doc, modifier.$set.name)){
        throw new Meteor.Error(doc._name, "字段名不能重复");
      }

      if(_.has(modifier.$set, 'type') && modifier.$set.type === 'master_detail' && hasMultipleMasterDetailTypeFiled(doc)){
        throw new Meteor.Error(doc.name, "每个对象只能有一个[主表/子表]类型字段");
      }

      if (modifier != null ? (ref2 = modifier.$set) != null ? ref2.reference_to : void 0 : void 0) {
        if (modifier.$set.reference_to.length === 1) {
          _reference_to = modifier.$set.reference_to[0];
        } else {
          _reference_to = modifier.$set.reference_to;
        }
      }
      if ((modifier != null ? (ref3 = modifier.$set) != null ? ref3.index : void 0 : void 0) && ((modifier != null ? (ref4 = modifier.$set) != null ? ref4.type : void 0 : void 0) === 'textarea' || (modifier != null ? (ref5 = modifier.$set) != null ? ref5.type : void 0 : void 0) === 'html')) {
        throw new Meteor.Error(500, "多行文本不支持建立索引");
      }
      object = Creator.getCollection("objects").findOne({
        _id: doc.object
      }, {
        fields: {
          name: 1,
          label: 1
        }
      });
      if (object) {
        object_documents = Creator.getCollection(object.name).find();
        if ((modifier != null ? (ref6 = modifier.$set) != null ? ref6.reference_to : void 0 : void 0) && doc.reference_to !== _reference_to && object_documents.count() > 0) {
          throw new Meteor.Error(500, `对象${object.label}中已经有记录，不能修改reference_to字段`);
        }
        if ((modifier != null ? (ref7 = modifier.$unset) != null ? ref7.reference_to : void 0 : void 0) && doc.reference_to !== _reference_to && object_documents.count() > 0) {
          throw new Meteor.Error(500, `对象${object.label}中已经有记录，不能修改reference_to字段`);
        }
      }

      if(!_.isEmpty(modifier.$set)){
        let defProps = getFieldDefaultProps(Object.assign(clone(doc), modifier.$set));
        Object.assign(modifier.$set, defProps);
      }
      checkFormulaInfiniteLoop(modifier.$set);
    }
  },
  //					if modifier?.$set?.reference_to
  //						if modifier.$set.reference_to.length == 1
  //							modifier.$set.reference_to = modifier.$set.reference_to[0]
  "before.insert.server.object_fields": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      checkName(doc._name);
      if(doc._name === 'name' || doc._name === 'owner'){
        doc.name = doc._name;
      }else{
        doc.name = getFieldName(doc.object,doc._name);
      }

      if(doc.name === 'name' || doc.is_name){
        checkNameField({type: doc.type})
      }

      if (isRepeatedName(doc)) {
        throw new Meteor.Error(doc.name, "字段名不能重复");
      }

      if(doc.type === 'master_detail' && hasMultipleMasterDetailTypeFiled(doc)){
        throw new Meteor.Error(doc.name, "每个对象只能有一个[主表/子表]类型字段");
      }

      let defProps = getFieldDefaultProps(doc);
      Object.assign(doc, defProps);

      if ((doc != null ? doc.index : void 0) && ((doc != null ? doc.type : void 0) === 'textarea' || (doc != null ? doc.type : void 0) === 'html')) {
        throw new Meteor.Error(500, '多行文本不支持建立索引');
      }

      checkFormulaInfiniteLoop(doc);
    }
  },
  "before.remove.server.object_fields": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      if(!allowChangeObject()){
        throw new Meteor.Error(500, "华炎云服务不包含自定义业务对象的功能，请部署私有云版本");
      }
      if (doc.name === "name" && !canRemoveNameFileld(doc)) {
        throw new Meteor.Error(500, "不能删除此纪录");
      }
    }
  }
}

Creator.Objects.object_fields.triggers = Object.assign({}, Creator.Objects.object_fields.triggers, triggers);
