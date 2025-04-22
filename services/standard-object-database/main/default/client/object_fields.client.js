Steedos.ObjectFieldManager = {};

// Steedos.ObjectFieldManager.__lastDoc = null;

// const baseFieldsName = [{ "name": "object", "required": true }, { "name": "label", "required": true }, {name: '_name', required: true}, { "name": "type", "required": true }, { "name": "defaultValue" }, { "name": "group" }, { "name": "sort_no" }, { "name": "is_name" }, { "name": "required" }, { "name": "is_wide" }, { "name": "readonly" }, { "name": "hidden" }, { "name": "omit" }, { "name": "index" }, { "name": "sortable" }, { "name": "searchable" }, { "name": "filterable" }, {"name":"inlineHelpText"},{"name":"description"}];

// function getFieldsByType(doc, type, dataType) {
//   let fields = [];
//   if(dataType){
//     fields = fields.concat(getFieldsByType(doc, dataType))
//   }
//   switch (type) {
//     case 'textarea':{
//       fields.push({ name: 'rows', required: true });
//       break;
//     }
//     case 'select':{
//       fields.push({ name: 'options', required: true });
//       fields.push({ name: 'options.$', required: true });
//       fields.push({ name: 'options.$.label', required: true });
//       fields.push({ name: 'options.$.value', required: true });
//       fields.push({ name: 'options.$.color', required: false });
//       fields.push({ name: 'options.$.description', required: false });
//       fields.push({ name: 'multiple'});
//       break;
//     }
//     case 'number':{
//       fields.push({ name: 'precision', required: true });
//       fields.push({ name: 'scale', required: true });
//       break;
//     }
//     case 'currency':{
//       fields.push({ name: 'precision', required: true });
//       fields.push({ name: 'scale', required: true });
//       break;
//     }
//     case 'percent':{
//       fields.push({ name: 'precision', required: true });
//       fields.push({ name: 'scale', required: true });
//       break;
//     }
//     case 'lookup': {
//       fields.push({ name: 'reference_to'});
//       fields.push({ name: 'filtersFunction'});
//       fields.push({ name: 'optionsFunction'});
//       fields.push({ name: 'multiple'});
//       break;
//     }
//     case 'master_detail': {
//       fields.push({ name: 'reference_to'});
//       fields.push({ name: 'filtersFunction'});
//       fields.push({ name: 'optionsFunction'});
//       fields.push({ name: 'write_requires_master_read'});
//       break;
//     }
//     case 'autonumber': {
//       fields.push({ name: 'formula', required: true });
//       break;
//     }
//     case 'formula': {
//       fields.push({ name: 'formula', required: true });
//       fields.push({ name: 'data_type', required: true });
//       fields.push({ name: 'formula_blank_value', required: true });
//       break;
//     }
//     case 'summary': {
//       fields.push({ name: 'summary_object', required: true });
//       fields.push({ name: 'summary_type', required: true });
//       if(doc.summary_type != 'count'){
//         fields.push({ name: 'summary_field', required: true });
//       }
//       // fields.push({ name: 'data_type', required: true });
//       fields.push({ name: 'precision', required: true });
//       fields.push({ name: 'scale', required: true });
//       fields.push({ name: 'summary_filters' });
//       fields.push({ name: 'summary_filters.$' });
//       fields.push({ name: 'summary_filters.$.field' });
//       fields.push({ name: 'summary_filters.$.operation' });
//       fields.push({ name: 'summary_filters.$.value' });
//       break;
//     }
//     case 'image': {
//       // fields.push({ name: 'multiple'}); image多选时，单个字段编辑窗口样式异常,暂时不支持
//       break;
//     }
//     case 'url': {
//       fields.push({ name: 'show_as_qr'});
//       break;
//     }
//     default:
//       break;
//   }
//   return fields;
// }
// Meteor.startup(function(){
//   $('body').on('hidden.bs.modal', '#afModal', function(){
//     Steedos.ObjectFieldManager.__lastDoc = null;
//   });
// });

// Steedos.ObjectFieldManager.changeSchema = function (doc, schema, when) {
//   var __lastDoc = Steedos.ObjectFieldManager.__lastDoc;
//   var noChange = doc.type && __lastDoc && __lastDoc._id == doc._id && __lastDoc.type == doc.type && __lastDoc.data_type == doc.data_type;
//   if(noChange && doc.type == "summary" && __lastDoc.summary_type != doc.summary_type){
//     // 当字段类型为汇总时，汇总类型如果有变更，有可能“要聚合的字段”属性不一定必填，所以这里强制重新计算Schema
//     noChange = false;
//   }
//   if(noChange){
//     return false;
//   }else{
//     Steedos.ObjectFieldManager.__lastDoc = doc;
//   }

//   var clone = require('clone');
//   var fields = clone(Creator.getObject("object_fields").fields);
//   var showFields = baseFieldsName.concat(getFieldsByType(doc, doc.type, doc.data_type));
//   if(when === 'view'){
//     showFields.push({ "name": "name" })
//   }else if(when === 'edit' && false){
//     showFields.push({name: '_name', required: true})
//   }
//   var objectName = doc.object;
//   if(_.isObject(objectName)){
//     objectName = objectName.name
//   }
//   var _object = Creator.getObject(objectName); 
//   if(!_object){
//     var _objects = Steedos.authRequest(`/api/v4/objects`, { type: 'get', async: false, data: { $filter: "name eq '"+objectName+"'" } });
//     _object = _objects && _objects.value && _objects.value.length > 0 ? _objects.value[0] : null;
//   }
//   // 外部数据源对象必须启用后，才可正常显示对象字段属性
//   if(_object && (_object.database_name || _object.datasource)){
//     showFields.push({"name":"column_name"})
//     showFields.push({"name":"primary"})
//     showFields.push({"name":"generated"})
//   }
//   _.map(fields, function(field, fname){
//     var showField = _.find(showFields, function(item){
//       return item && item.name === fname;
//     })
//     if(showField){
//       Object.assign(field, showField)
//     }else{
//       Object.assign(field, {omit: true, hidden: true})
//     }
//   })

//   var objectSchema = Creator.getObjectSchema({fields: fields});
//   Object.assign(schema, new SimpleSchema(objectSchema)) 
// }

Steedos.ObjectFieldManager.getSummaryFiltersOperation = function(field_type) {
  var operations, optionals;
  optionals = {
    equal: {
      label: t("creator_filter_operation_equal"),
      value: "="
    },
    unequal: {
      label: t("creator_filter_operation_unequal"),
      value: "<>"
    },
    less_than: {
      label: t("creator_filter_operation_less_than"),
      value: "<"
    },
    greater_than: {
      label: t("creator_filter_operation_greater_than"),
      value: ">"
    },
    less_or_equal: {
      label: t("creator_filter_operation_less_or_equal"),
      value: "<="
    },
    greater_or_equal: {
      label: t("creator_filter_operation_greater_or_equal"),
      value: ">="
    },
    contains: {
      label: t("creator_filter_operation_contains"),
      value: "contains"
    },
    not_contain: {
      label: t("creator_filter_operation_does_not_contain"),
      value: "notcontains"
    },
    starts_with: {
      label: t("creator_filter_operation_starts_with"),
      value: "startswith"
    }
  };
  if (field_type === void 0) {
    return _.values(optionals);
  }
  operations = [];
  if (field_type === "text" || field_type === "textarea" || field_type === "html" || field_type === "code") {
    operations.push(optionals.equal, optionals.unequal, optionals.contains, optionals.not_contain, optionals.starts_with);
  } else if (field_type === "lookup" || field_type === "master_detail" || field_type === "select") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (["currency", "number", "percent", "date", "datetime"].indexOf(field_type) > -1){
    operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal);
  } else if (field_type === "boolean") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "checkbox") {
    operations.push(optionals.equal, optionals.unequal);
  } else if (field_type === "[text]") {
    operations.push(optionals.equal, optionals.unequal);
  } else {
    operations.push(optionals.equal, optionals.unequal);
  }
  return operations;
};

(function () {
  try {
    var styleCss = $(`<style>
      .defaultValue_field.steedos-defaultValue-flex-grow div:first-child {
        /*有steedos-defaultValue-flex-grow样式类时才加上flex-grow，是为了排除掉html字段类型，因为html类型字段不可以配置flex-grow属性(配置为0或unset也不行)，否则html字段类型的顶部toolbar高度样式异常*/
        flex-grow: 1;
      }
      
      .defaultValue_field .defaultValue_field_formula {
        /* margin: 4px; */
      }
      
      .defaultValue_field .defaultValue_field_formula .antd-Form-label {
        visibility: visible;
      }
      
      .defaultValue_field .defaultValue_field_formula_visible {
        flex-grow: 1;
      }
      
      .defaultValue_field .defaultValue_field_formula_visible .antd-Form-label .antd-TplField {
        visibility: visible;
      }
      
      .defaultValue_field .defaultValue_field_hidden {
        display: none;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden {
        flex-grow: 0;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden > .antd-Form-label {
        display: none;
      }
      .defaultValue_field .defaultValue_field_formula_hidden > .antd-Form-value .antd-FormulaPicker .antd-InputBox {
        display: none;
      }
      
      .defaultValue_field .defaultValue_field_formula_hidden {
        margin-left: 0.5rem;
      }
      
      .defaultValue_field.steedos-defaultValue-html-edit .defaultValue_field_formula_hidden {
        margin-left: 7rem;
      }

      @media (max-width: 767px) {
        .defaultValue_field.steedos-defaultValue-html-edit .defaultValue_field_formula_hidden {
          margin-left: 0rem;
        }
      }
      </style>`);
    $("head").append(styleCss);
  } catch (error) {
    console.log(error);
  }
})();