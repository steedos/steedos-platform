const _ = require('underscore');

const getFilters = function (spaceId, doc, id) {
    let filter = [];
    if (doc.name) {
        filter.push(['name', '=', doc.name])
    }
    if (doc.value) {
        if (filter.length > 0) {
            filter.push('or');
        }
        filter.push(['value', '=', doc.value])
    }

    let filter2 = [['space', '=', spaceId], ['picklist', '=', doc.picklist]]
    if (id) {
        filter2.push(['_id', '<>', id])
    }
    return { filters: [filter2, 'and', filter] }
}

const getDefaultCount = async function(getObject, spaceId, picklist, id){
    let filters = [['space', '=', spaceId], ['picklist', '=', picklist], ['default', '=', true]]
    if(id){
        filters.push(['_id', '<>', id])
    }
    return await getObject('picklist_options').count({filters: filters});
}

const validateColorValue = (value)=>{
    if(value){
        const reg = /^(#)?[\da-f]{3}([\da-f]{3})?$/i;
        if(!reg.test(value)){
            throw new Error("picklist_options_error_color_not_valid");
        }
    }
}

module.exports = {

    listenTo: 'picklist_options',

    beforeInsert: async function () {
        var doc = this.doc
        if (doc.name) {
            let count = await this.getObject('picklist_options').count(getFilters(doc.space, doc))
            if (count > 0) {
                throw new Error("选项名称或选项值不能重复");
            }
        }

        if(_.has(doc, 'default') && doc.default){
            let dCount = await getDefaultCount(this.getObject, doc.space, doc.picklist);
            if(dCount > 0){
                throw new Error("默认值只能有一个");
            }
        }
        validateColorValue(doc.color);
    },
    beforeUpdate: async function () {
        var doc = this.doc
        var id = this.id

        let dbDoc = {}

        if (_.has(doc, 'name') || _.has(doc, 'value') || _.has(doc, 'default')) {
            dbDoc = await this.getObject('picklist_options').findOne(id, { fields: { space: 1, picklist: 1 } });
        } 

        if (_.has(doc, 'name') || _.has(doc, 'value')) {
            if (dbDoc) {
                let count = await this.getObject('picklist_options').count(getFilters(dbDoc.space, Object.assign({ picklist: dbDoc.picklist }, doc), id))
                if (count > 0) {
                    throw new Error("选项名称或选项值不能重复");
                }
            }
        }

        if(_.has(doc, 'default') && doc.default){
            let dCount = await getDefaultCount(this.getObject, dbDoc.space, dbDoc.picklist, id);
            if(dCount > 0){
                throw new Error("默认值只能有一个");
            }
        }
        validateColorValue(doc.color);
    }
}