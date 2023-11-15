const InternalData = require('@steedos/standard-objects').internalData;
var _ = require("underscore");
const odataMongodb = require("@steedos/odata-v4-mongodb");
const clone = require('clone');
var objectCore = require('../objects/objects.core.js');
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const MAX_MASTER_DETAIL_LEAVE = objectql.MAX_MASTER_DETAIL_LEAVE;
const validateOptionValue = (value)=>{
    let color = value && value.split(":")[2];
    if(color){
        const reg = /^(#)?[\da-f]{3}([\da-f]{3})?$/i;
        if(!reg.test(color)){
            throw new Error("object_fields_error_option_color_not_valid");
        }
    }
}

const validateOptionsValue = (value)=>{
    if(value){
        value.split("\n").forEach(function(option) {
            let options;
            if (option.indexOf(",")) {
                options = option.split(",");
                return options.forEach(function(_option) {
                    validateOptionValue(_option);
                });
            } else {
                validateOptionValue(option);
            }
        });
    }
}

const validateOptionColorValue = (value)=>{
    if(value){
        const reg = /^[\da-f]{6}$/i;
        if(!reg.test(value)){
            throw new Error("object_fields_error_option_color_not_valid");
        }
    }
}

const validateOptionsGridValue = (value)=>{
    if(value){
        value.forEach(function(option) {
            if(!option.label){
                throw new Error("object_fields_error_option_label_required");
            }
            if(!option.value){
                throw new Error("object_fields_error_option_value_required");
            }
            validateOptionColorValue(option.color);
        });
    }
}

const validateDoc = (doc)=>{
    validateOptionsGridValue(doc.options);
    // if(doc.type === "autonumber"){
    //     let formula = doc.formula && doc.formula.trim();
    //     if(!formula){
    //         throw new Error("object_fields_error_formula_required");
    //     }
    // }
}



async function checkOwnerField(doc) {
    if (doc.name !== "owner") {
        return;
    }
    if (!doc.omit) {
        const obj = objectql.getObject(doc.object);
        const masters = await obj.getMasters();
        if (masters && masters.length) {
            throw new Meteor.Error(doc.name, "您无法取消勾选“新建、编辑时隐藏”属性，因为当前对象上有主表子表关系字段！");
        }
    }
}

function checkMasterDetailPathsRepeat(doc, masterPaths, detailPaths) {
    // 交叉叠加传入的两个方向的路径判断是否存在同一链条上同名对象可能，同名就直接报错
    _.each(masterPaths, (masterPathItems) => {
        _.each(detailPaths, (detailPathItems) => {
            const repeatName = objectql.getRepeatObjectNameFromPaths([masterPathItems.concat(detailPathItems)]);
            if (repeatName) {
                throw new Meteor.Error(doc.name, "您无法创建此类字段，因为在主表子表关系链条中存在同名对象：" + repeatName);
            }
        });
    });
}

async function checkMasterDetailTypeField(doc, oldReferenceTo) {
    if (!doc || !doc.type || doc.type !== "master_detail") {
        return;
    }
    if (doc.reference_to === doc.object) {
        throw new Meteor.Error(doc.name, "您无法创建一个指向自身的[主表/子表]类型字段！");
    }
    const obj = objectql.getObject(doc.object);
    if (!obj) {
        throw new Meteor.Error(doc.name, `所属对象未加载！`);
    }

    const refObj = objectql.getObject(doc.reference_to);
    if (!refObj) {
        throw new Meteor.Error(doc.name, `引用对象未加载！`);
    }

    let currentMasters = await obj.getMasters();
    let currentDetails = await obj.getDetails();
    if (oldReferenceTo) {
        let index = currentMasters.indexOf(oldReferenceTo);
        if (index >= 0) {
            currentMasters.splice(index, 1);
        }
    }

    if (currentMasters.indexOf(doc.reference_to) > -1) {
        throw new Meteor.Error(doc.name, `该对象上已经存在指向相同“引用对象”的其它主表子表关系，无法创建该字段。`);
    }

    const mastersCount = currentMasters.length;
    const detailsCount = currentDetails.length;
    if (mastersCount > 1) {
        throw new Meteor.Error(doc.name, "您无法创建此类型的字段，因为此对象已有两种主表子表关系。");
    }
    else if (mastersCount > 0) {
        if (detailsCount > 0) {
            throw new Meteor.Error(doc.name, "由于此对象上已经存在主表子表关系，同时是另一个主表子表关系的主对象，无法创建此类字段。");
        }
    }

    const detailPaths = await obj.getDetailPaths();
    const masterPaths = await refObj.getMasterPaths();
    // 当有同名对象时肯定会死循环进而超出最大层级限制，所以优先判断提示同名对象问题
    checkMasterDetailPathsRepeat(doc, masterPaths, detailPaths);

    // 新加主表子表关系后，当前对象作为主表往下最多允许有MAX_MASTER_DETAIL_LEAVE层深度。
    const maxDetailLeave = await obj.getMaxDetailsLeave(detailPaths);
    // console.log("===maxDetailLeave===", maxDetailLeave);
    if (maxDetailLeave > MAX_MASTER_DETAIL_LEAVE - 1) {
        throw new Meteor.Error(doc.name, "您无法创建此类字段，因为这将超出主表子表关系的最大深度。");
    }

    // 新加主表子表关系后，当前对象作为子表往上和往下加起来最多允许有MAX_DETAIL_LEAVE层深度。
    const maxMasterLeave = await refObj.getMaxMastersLeave(masterPaths);
    // console.log("===maxMasterLeave===", maxMasterLeave);
    if (maxMasterLeave + maxDetailLeave > MAX_MASTER_DETAIL_LEAVE - 1) {
        throw new Meteor.Error(doc.name, "您无法创建此类字段，因为这将超出主表子表关系的最大深度。");
    }
    // let fields = await obj.getFields();
    // const ownerField = _.find(fields, (n) => { return n.name === "owner"; });
    // if (!ownerField.omit) {
    //     throw new Meteor.Error(doc.name, "您无法创建此类字段，因为该对象上“所有者”字段未勾选“新建、编辑时隐藏”属性。");
    // }
}

function getFieldName(object, fieldName, spaceId, oldFieldName){
    if(object && object.datasource && object.datasource != 'default'){
      return fieldName;
    }else{
      if(fieldName != 'name' && fieldName != 'owner'){
        return objectql._makeNewFieldName(fieldName, spaceId, oldFieldName);
      }else{
        return fieldName
      }
    }
  }

const checkFormulaInfiniteLoop = async function(_doc, oldFieldName){
    if(_doc.type === "formula"){
      doc = clone(_doc)
      delete doc._id
      const objectConfig = objectql.wrapAsync(async function(){
        return await objectql.getObject(doc.object).toConfig();
      })
    //   objectCore.loadDBObject(objectConfig)
      delete objectConfig._id;
      try {
        if(!doc.name){
            doc.name = getFieldName(objectConfig, doc._name, doc.space, oldFieldName)
        }
        await objectql.verifyObjectFieldFormulaConfig(doc, objectConfig);
      } catch (error) {
        if(error.message.startsWith('Infinite Loop')){
          throw new Error('字段公式配置异常，禁止循环引用对象字段');
        }else{
          throw error;
        }
      }
    }
  }

const initSummaryDoc = async (doc) => {
    if (!doc.summary_object) {
        throw new Error("object_fields_error_summary_object_required");
    }
    let summaryObject = register.getObjectConfig(doc.summary_object);
    let summaryConfig = {
        summary_object: doc.summary_object,
        summary_type: doc.summary_type,
        summary_field: doc.summary_field,
        field_name: doc.name,
        object_name: doc.object
    };
    const dataType = await objectql.getSummaryDataType(summaryConfig, summaryObject);
    if (!dataType) {
        throw new Error("object_fields_error_summary_data_type_not_found");
    }
    doc.data_type = dataType;
    objectql.validateFilters(doc.summary_filters, summaryObject.fields);
}

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters);
        let objectName = filters.object;
        if(!objectName && filters._id && filters._id.indexOf(".") > -1){
            objectName = filters._id.split('.')[0];
        }
        if(objectName){ 
            let fields = await InternalData.getObjectFields(objectName, this.userId, filters.name ? true : false);
            if(fields){
                _.each(fields, (field)=>{
                    this.data.values.push(Object.assign({_id: `${objectName}.${field.name}`}, field))
                })
                // this.data.values = this.data.values.concat(fields)
                this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, this.spaceId);
            }
        }

        const dbSystemField = _.find(this.data.values, (field)=>{return field.is_system && field._id && field._id.indexOf('.') == -1})
        if(dbSystemField){
            const obj = await InternalData.getObject(dbSystemField.object, this.userId)
            if(obj){
                this.data.values = _.map(this.data.values, (item)=>{
                    if(item.is_system){
                        return Object.assign(item, _.find(obj.fields, (field)=>{return field.name === item.name}))
                    }else{
                        return item;
                    }
                })
            }
        }
    },
    beforeFind: async function(){
        const { query } = this;
        if(query.fields && _.isArray(query.fields) && !_.include(query.fields, 'object')){
            query.fields.push('object')
        }
        if(query.fields && _.isArray(query.fields) && !_.include(query.fields, 'name')){
            query.fields.push('name')
        }
        if(query.fields && _.isArray(query.fields) && !_.include(query.fields, 'type')){
            query.fields.push('type')
        }
    },
    beforeAggregate: async function(){
        const { query } = this;
        if(query.fields && _.isArray(query.fields) && !_.include(query.fields, 'object')){
            query.fields.push('object')
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters);
        let objectName = filters.object;
        if(!objectName && filters._id && filters._id.indexOf(".") > -1){
            objectName = filters._id.split('.')[0];
        }
        if(objectName){
            let fields = await InternalData.getObjectFields(objectName, this.userId, true);
            if(fields){
                _.each(fields, (field)=>{
                    this.data.values.push(Object.assign({_id: `${objectName}.${field.name}`}, field))
                })
                // this.data.values = this.data.values.concat(fields)
                this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, this.spaceId);
            }
        }
    },
    afterCount: async function(){
        let result = await objectql.getObject('object_fields').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let objectName = id.substr(0, id.indexOf("."));
            if(objectName){
                let field = await InternalData.getObjectField(objectName, this.userId, id);
                if(field){
                    this.data.values = field;
                }
            }
        }
    },
    beforeInsert: async function () {
        let doc = this.doc;
        validateDoc(doc);
        await checkFormulaInfiniteLoop(doc);
        await checkMasterDetailTypeField(doc);
        await checkOwnerField(doc);
        
        if(doc.type === "summary"){
            await initSummaryDoc(doc);
        }
        if(doc.type === "select" && doc.data_type && doc.data_type != 'text'){
            const options = doc.options;
            _.each(options, (item)=>{
                const value = item.value;
                const numberValue = Number(item.value);
                if( doc.data_type === 'number' && !(_.isNumber(numberValue) && !_.isNaN(numberValue)) ){
                    throw new Meteor.Error(500, "选择项中的选项值类型应该与数据类型值一致, 请输入合法的数值。");
                }
                if( doc.data_type === 'boolean' && ['true','false'].indexOf(value) < 0){
                    throw new Meteor.Error(500, "选择项中的选项值类型应该与数据类型值一致, 请输入 true 或 false。");
                }
            })
        }
    },
    beforeUpdate: async function () {
        let { doc, object_name, id} = this;
        validateDoc(doc);
        // const dbDoc = await objectql.getObject(object_name).findOne(id)
        const dbDoc = objectql.wrapAsync(async function(){
          return await objectql.getObject(object_name).findOne(id)
        })

        if(doc && _.has(doc, 'multiple') && doc.multiple != dbDoc.multiple){
            throw new Error('禁止单选、多选切换')
        }

        let oldReferenceTo = dbDoc.type === "master_detail" && dbDoc.reference_to;
        await checkFormulaInfiniteLoop(doc, dbDoc.name);
        await checkMasterDetailTypeField(doc, oldReferenceTo);
        await checkOwnerField(doc);
        
        if(doc.type === "summary"){
            await initSummaryDoc(doc);
        }
        if(["parent","children"].indexOf(dbDoc._name) > -1){
            let isImportField = false;
            if((doc._name != undefined && doc._name !== dbDoc._name) || 
                (doc.type != undefined && doc.type !== dbDoc.type) || 
                (doc.object != undefined && doc.object !== dbDoc.object) || 
                (doc.reference_to != undefined && doc.reference_to !== dbDoc.reference_to) || 
                (doc.multiple != undefined && !!doc.multiple !== !!dbDoc.multiple) || 
                (doc.omit != undefined && ("children" === dbDoc._name && doc.omit !== true))){
                isImportField = true;
            }
            if(isImportField){
                throw new Meteor.Error(500, "字段parent、children是启用树状结构显示记录的对象的内置字段，不能修改其”所属对象、字段名、字段类型、引用对象、多选、新建/编辑时隐藏”等属性");
            }
        }

        if(doc.type === "select" && doc.data_type && doc.data_type != 'text'){
            const options = doc.options;
            _.each(options, (item)=>{
                const value = item.value;
                const numberValue = Number(item.value);
                if( doc.data_type === 'number' && !(_.isNumber(numberValue) && !_.isNaN(numberValue)) ){
                    throw new Meteor.Error(500, "选择项中的选项值类型应该与数据类型值一致, 请输入合法的数值。");
                }
                console.log('doc==>',doc.data_type , value)
                if( doc.data_type === 'boolean' && ['true','false'].indexOf(value) < 0){
                    throw new Meteor.Error(500, "选择项中的选项值类型应该与数据类型值一致, 请输入 true 或 false。");
                }
            })
        }

        const obj = this.getObject(object_name);
        const latestDoc = await obj.findOne(id);
        // !!!暂不允许修改name
        // if (_.has(doc, '_name')) {
        //     const newFieldName = doc._name;
        //     if (newFieldName &&  (latestDoc._name != newFieldName)) {
        //         throw new Error('禁止修改字段名。');
        //     }
        // }
        // !!!暂不允许修改字段类型
        if (_.has(doc, 'type')) {
            const newFieldType = doc.type;
            if (latestDoc.type && newFieldType &&  (latestDoc.type != newFieldType)) {
                throw new Error('禁止修改字段类型。');
            }
        }
    },
    beforeDelete: async function () {
        const field = await this.getObject(this.object_name).findOne(this.id,{fields:['name','object']});
        const enable_tree = await objectql.getObject(field.object).enable_tree;
        if( ["parent","children"].indexOf(field.name) > -1 && enable_tree ){
            throw new Meteor.Error(500, "启用树状结构显示记录的对象不能删除parent、children字段。");
        }
    },

    afterInsert: async function () {
        const { doc } = this;
        const { type, name, object: objectName } = doc;
        // 如果是地理位置字段，则需立即创建索引，否则mongodb查询地理位置字段时会报错 'unable to find index for $geoNear query' on server'
        if (type === 'location') {
            const defaultAdapter = objectql.getDataSource('default').adapter
            await defaultAdapter.connect();
            const collection = defaultAdapter.collection(objectName);

            try {
                const indexInfo = {
                    key: {
                        [`${name}.wgs84`]: "2dsphere"
                    },
                    name: `c2_${name}_wgs84`,
                    unique: false,
                    sparse: false,
                    background: true
                }
                const key = indexInfo.key;
                try {
                    await collection.createIndex(key, indexInfo)
                } catch (error) {
                    // DO NOTHING
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
}