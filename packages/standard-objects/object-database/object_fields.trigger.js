const InternalData = require('../core/internalData');
var _ = require("underscore");
const objectql = require('@steedos/objectql');
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

    const ownerField = _.find(obj.fields, (n) => { return n.name === "owner"; });
    if (!ownerField.omit) {
        throw new Meteor.Error(doc.name, "您无法创建此类字段，因为该对象上“所有者”字段未勾选“新建、编辑时隐藏”属性。");
    }
}

module.exports = {
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let fields = await InternalData.getObjectFields(filters.object, this.userId);
            if(fields){
                this.data.values = this.data.values.concat(fields)
            }
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let fields = await InternalData.getObjectFields(filters.object, this.userId);
            if(fields){
                this.data.values = this.data.values.concat(fields)
            }
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        if(filters.object){
            let fields = await InternalData.getObjectFields(filters.object, this.userId);
            if(fields){
                this.data.values = this.data.values + fields.length
            }
        }
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
        await checkMasterDetailTypeField(doc);
        await checkOwnerField(doc);
    },
    beforeUpdate: async function () {
        let { doc, object_name, id} = this;
        validateDoc(doc);
        const dbDoc = await objectql.getObject(object_name).findOne(id)
        let oldReferenceTo = dbDoc.type === "master_detail" && dbDoc.reference_to;
        await checkMasterDetailTypeField(doc, oldReferenceTo);
        await checkOwnerField(doc);
    }
}