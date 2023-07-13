const InternalData = require('@steedos/standard-objects').internalData;
const _ = require('underscore');
const objectql = require('@steedos/objectql');
const objectTree = require('../objects/objects.tree.js');

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        for (const doc of this.data.values) {
            doc.fields =  Object.assign({}, doc.fields, await InternalData.getDefaultSysFields(doc.name, userId)) ;
        }
        // this.data.values = this.data.values.concat(await InternalData.findObjects(userId, this.query.filters));

        this.data.values = this.data.values.concat(await InternalData.getObjects(userId));

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        
        _.each(this.data.values, function(value){
            if(value){
                delete value.actions;
                delete value.fields;
                delete value.list_views;
                delete value.permission_set;
                delete value.triggers;
            }
        })
    },
    afterAggregate: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        for (const doc of this.data.values) {
            doc.fields =  Object.assign({}, doc.fields, await InternalData.getDefaultSysFields(doc.name, userId)) ;
        }
        // this.data.values = this.data.values.concat(await InternalData.findObjects(userId, this.query.filters));

        this.data.values = this.data.values.concat(await InternalData.getObjects(userId));

        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        
        _.each(this.data.values, function(value){
            if(value){
                delete value.actions;
                delete value.fields;
                delete value.list_views;
                delete value.permission_set;
                delete value.triggers;
            }
        })
    },
    afterCount: async function(){
        let userId = this.userId
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(await InternalData.getObjects(userId), this.query, spaceId);
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            this.data.values = await InternalData.getObject(this.id, this.userId);
        }
        if(this.data.values){
            delete this.data.values.actions;
            delete this.data.values.fields;
            delete this.data.values.list_views;
            delete this.data.values.permission_set;
            delete this.data.values.triggers;
        }
    },
    afterInsert: async function(){
        const object = this.doc;
        const { spaceId , userId } = this;
        if(object.enable_tree){
            await objectTree.insertParentAndChildrenFieldForTreeObject(object)
        }

        const tabLabel = object.label || object.name;
        const tabName = "object_" + object.name.replace(/__c$/, "");
        const now = new Date();
        const tabDoc = {
            label: tabLabel, 
            name: tabName, 
            icon: object.icon,
            type: "object", 
            mobile: true,
            desktop: true,
            object: object.name,
            space: spaceId,
            owner: userId,
            created_by: userId,
            created: now,
            modified_by: userId,
            modified: now,
            company_id: object.companyId,
            company_ids: object.companyIds
        };
        await objectql.getObject('tabs').insert(tabDoc);
        

        // let spaceProfiles = await objectql.getObject('permission_set').find({space: this.spaceId, type: 'profile'});
        // await objectql.getObject('object_layouts').insert({
        //     label: 'default',
        //     object_name: this.doc.name,
        //     actions: _.keys(Creator.getObject('base').actions),
        //     profiles: _.pluck(spaceProfiles, 'name'),
        //     fields: [{
        //         field: 'name',
        //     },{
        //         field: 'created',
        //     },{
        //         field: 'created_by',
        //     },{
        //         field: 'modified',
        //     },{
        //         field: 'modified_by',
        //     }],
        //     space: this.spaceId
        // })
        await sleep(1000 * 2)
    },
    beforeUpdate: async function () {
        const { doc, id, object_name } = this;
        // 如果用户修改了apiname，则校验 数据源必须一致为default数据源；且数据库中不能有新的apiname对应的表
        if (_.has(doc, 'name')) {
            const obj = this.getObject(object_name);
            const latestDoc = await obj.findOne(id);
            const newObjName = doc.name;
            // !!!暂不允许修改name
            if (newObjName &&  (latestDoc.name != newObjName)) {
                throw new Error('禁止修改API 名称。');
            }
            /*
            if (newObjName &&  (latestDoc.name != newObjName) && latestDoc.datasource === 'default') {
                const datasource = objectql.getDataSource(latestDoc.datasource);
                const isExitsRecords = await datasource.isCollectionExitsRecords(newObjName);
                // 如果新表中存在记录则抛错，提示用户
                if (isExitsRecords) {
                    throw new Error(`${newObjName} 在库中已存在记录，不予进行。`);
                }
            }
            */
        }
    },
    afterUpdate: async function () {
        const { doc, previousDoc } = this;
        // 零代码配置 enable_tree: true 时，添加parent、children两个字段
        if(previousDoc.enable_tree !== doc.enable_tree && doc.enable_tree === true){
            // doc中缺少owner,space等字段值，需要从previousDoc中取到一起带过去
            await objectTree.insertParentAndChildrenFieldForTreeObject(Object.assign({}, previousDoc, doc), true)
        }
        /*
        const { doc, previousDoc, id, object_name } = this;
        const obj = this.getObject(object_name);
        const latestDoc = await obj.findOne(id);
        // 对象的apiname修改后调整库中的表名
        if (latestDoc.name && (latestDoc.name != previousDoc.name) && previousDoc.datasource === latestDoc.datasource && latestDoc.datasource === 'default'){
            const newObjName = latestDoc.name;
            const oldObjName = previousDoc.name;
            const datasource = objectql.getDataSource(latestDoc.datasource);
            await datasource.renameCollection(newObjName, oldObjName)
        }
        */

        await sleep(1000 * 2)
    },
    afterDelete: async function(){
        const { previousDoc: object, spaceId } = this;
        const objectTabs = await objectql.getObject('tabs').find({filters: [['type', '=', 'object'], ['object', '=', object.name], ['space', '=', spaceId]]})
        for(const record of objectTabs){
            // console.log(`delete tabs`, record._id, record.name)
            await objectql.getObject('tabs').delete(record._id);
        }
    }
}