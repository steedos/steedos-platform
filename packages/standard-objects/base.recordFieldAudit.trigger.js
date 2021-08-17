const objectql = require('@steedos/objectql');
const _ = require('underscore');
const moment = require('moment');
const getOrderlySetByIds = function(docs, ids, id_key, hit_first) {
    var values;
    if (!id_key) {
      id_key = "_id";
    }
    if (hit_first) {
      values = docs.getProperty(id_key);
      return _.sortBy(docs, function(doc) {
        var _index;
        _index = ids.indexOf(doc[id_key]);
        if (_index > -1) {
          return _index;
        } else {
          return ids.length + _.indexOf(values, doc[id_key]);
        }
      });
    } else {
      return _.sortBy(docs, function(doc) {
        return ids.indexOf(doc[id_key]);
      });
    }
};

const getLookupFieldValue = async function(reference_to, value, space_id) {
    var name_field_key, previous_ids, reference_to_object, values;
    if (_.isArray(reference_to) && _.isObject(value)) {
      reference_to = value.o;
      previous_ids = value.ids;
    }
    if (!_.isArray(previous_ids)) {
      previous_ids = value ? [value] : [];
    }
    reference_to_object = objectql.getObject(reference_to);
    name_field_key = await reference_to_object.getNameFieldKey();
    values = await reference_to_object.find({filters: ['_id', '=', previous_ids], fields: ['_id', name_field_key]});
    values = getOrderlySetByIds(values, previous_ids);
    return (_.pluck(values, name_field_key)).join(',');
  };

const getLookupFieldModifier = async function(field, value, space_id) {
    var reference_to;
    reference_to = field.reference_to;
    if (_.isFunction(reference_to)) {
      reference_to = reference_to();
    }
    if (_.isFunction(field.optionsFunction)) {
      if (_.isString(reference_to)) {
        if (value) {
          return await getLookupFieldValue(reference_to, value, space_id);
        }
      } else {
        return '';
      }
    } else {
      return await getLookupFieldValue(reference_to, value, space_id);
    }
  };

const transformFieldValue = async function(field, value, options) {
    var selected_value, space_id, utcOffset;
    if (_.isNull(value) || _.isUndefined(value)) {
      return;
    }
    utcOffset = options.utcOffset;
    space_id = options.space_id;
    switch (field.type) {
      case 'date':
        return moment.utc(value).format('YYYY-MM-DD');
      case 'datetime':
        return moment(value).utcOffset(utcOffset).format('YYYY-MM-DD HH:mm');
      case 'boolean':
        if (_.isBoolean(value)) {
          if (value) {
            return '是';
          } else {
            return '否';
          }
        }
        break;
      case 'select':
        if (_.isString(value)) {
          value = [value];
        }
        selected_value = _.map(field.options, function(option) {
          if (_.contains(value, option.value)) {
            return option.label;
          }
        });
        return _.compact(selected_value).join(',');
      case 'checkbox':
        if (_.isString(value)) {
          value = [value];
        }
        selected_value = _.map(field.options, function(option) {
          if (_.contains(value, option.value)) {
            return option.label;
          }
        });
        return _.compact(selected_value).join(',');
      case 'lookup':
        return await getLookupFieldModifier(field, value, space_id);
      case 'master_detail':
        return await getLookupFieldModifier(field, value, space_id);
      case 'textarea':
        return '';
      case 'code':
        return '';
      case 'html':
        return '';
      case 'markdown':
        return '';
      case 'grid':
        return '';
      default:
        return value;
    }
  };

  // 新建时, 不记录明细
const insertRecord = async function(userId, object_name, new_doc) {
    var auditRecordsObject, doc, record_id, space_id;
    //	if !userId
    //		return
    auditRecordsObject = objectql.getObject('audit_records');
    space_id = new_doc.space;
    record_id = new_doc._id;
    doc = {
      _id: await auditRecordsObject._makeNewID(),
      space: space_id,
      field_name: "已创建。",
      related_to: {
        o: object_name,
        ids: [record_id]
      }
    };
    return auditRecordsObject.insert(doc);
  };

  // 修改时, 记录字段变更明细
const updateRecord = async function(userId, object_name, new_doc, previous_doc, modifier) {
    /* TODO utcOffset 应该来自数据库,待 #984 处理后 调整

       utcOffset = Creator.getCollection("users").findOne({_id: userId})?.utcOffset

    if !_.isNumber(utcOffset)
    	utcOffset = 8
    */
    var fields, options, record_id, ref, space_id, utcOffset;
    //	if !userId
    //		return
    space_id = new_doc.space;
    record_id = new_doc._id;
    fields = await objectql.getObject(object_name).getFields()
    utcOffset = 8;
    options = {
      utcOffset: utcOffset,
      space_id: space_id
    };
    const keys = _.keys(modifier);
    for(var i = 0; i < keys.length; i++ ){
        const k = keys[i];
        const v = modifier[k];
        var auditRecordsObject, db_new_value, db_previous_value, doc, field, new_value, previous_value;
        field = fields != null ? fields[k] : void 0;
        previous_value = previous_doc[k];
        new_value = v;
        db_previous_value = null;
        db_new_value = null;
        if(!field){
          continue
        }
        switch (field.type) {
            case 'date':
            if ((new_value != null ? new_value.toString() : void 0) !== (previous_value != null ? previous_value.toString() : void 0)) {
                if (new_value) {
                db_new_value = await transformFieldValue(field, new_value, options);
                }
                if (previous_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                }
            }
            break;
            case 'datetime':
            if ((new_value != null ? new_value.toString() : void 0) !== (previous_value != null ? previous_value.toString() : void 0)) {
                if (new_value) {
                db_new_value = await transformFieldValue(field, new_value, options);
                }
                if (previous_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                }
            }
            break;
            case 'textarea':
            if (previous_value !== new_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'code':
            if (previous_value !== new_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'html':
            if (previous_value !== new_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'markdown':
            if (previous_value !== new_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'grid':
            if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'boolean':
            if (previous_value !== new_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'select':
            if ((previous_value != null ? previous_value.toString() : void 0) !== (new_value != null ? new_value.toString() : void 0)) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'checkbox':
            if ((previous_value != null ? previous_value.toString() : void 0) !== (new_value != null ? new_value.toString() : void 0)) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                db_new_value = await transformFieldValue(field, new_value, options);
            }
            break;
            case 'lookup':
            if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
                if (previous_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                }
                if (new_value) {
                db_new_value = await transformFieldValue(field, new_value, options);
                }
            }
            break;
            case 'master_detail':
            if (JSON.stringify(previous_value) !== JSON.stringify(new_value)) {
                if (previous_value) {
                db_previous_value = await transformFieldValue(field, previous_value, options);
                }
                if (new_value) {
                db_new_value = await transformFieldValue(field, new_value, options);
                }
            }
            break;
            default:
            if (new_value !== previous_value) {
                db_previous_value = previous_value;
                db_new_value = new_value;
            }
        }
        if ((db_new_value !== null && db_new_value !== void 0) || (db_previous_value !== null && db_previous_value !== void 0)) {
            auditRecordsObject = objectql.getObject('audit_records');
            try {
              var previous_value = db_previous_value;
              if(_.isObject(previous_value)){
                previous_value = JSON.stringify(db_previous_value)
              }
              
              var new_value = db_new_value;
              if(_.isObject(db_new_value)){
                new_value = JSON.stringify(db_new_value)
              }

              doc = {
              _id: await auditRecordsObject._makeNewID(),
              space: space_id,
              field_name: field.label || field.name,
              previous_value: previous_value,
              new_value: new_value,
              related_to: {
                  o: object_name,
                  ids: [record_id]
              }
              };
              await auditRecordsObject.insert(doc);
            } catch (error) {
              console.error(`error`, error)
            }
        }
    };
  };


const add = function(action, userId, object_name, new_doc, previous_doc, modifier) {
    if (action === 'update') {
      return updateRecord(userId, object_name, new_doc, previous_doc, modifier);
    } else if (action === 'insert') {
      return insertRecord(userId, object_name, new_doc);
    }
  };


module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        const { object_name, doc, userId } = this;
        const obj = objectql.getObject(object_name);
        const isEnableAudit = await obj.isEnableAudit();
        if (isEnableAudit) {
           const dbDoc = await obj.findOne(doc._id);
           await add('insert', userId, this.object_name, dbDoc) 
        }
    },
    afterUpdate: async function () {
        const { doc, previousDoc, userId, object_name, id } = this;
        const obj = objectql.getObject(object_name);
        const isEnableAudit = await obj.isEnableAudit();
        if (isEnableAudit) {
            const dbDoc = await obj.findOne(id);
            return add('update', userId, object_name, dbDoc, previousDoc, doc);
        }
    }
}