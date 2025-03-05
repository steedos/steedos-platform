const _ = require('underscore');
const objectql = require('@steedos/objectql');
const objectTree = require('../server/objects.tree.js');
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },
    afterFindOne: async function(){
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
    beforeInsert: async function () {
        let doc = this.doc;
        delete doc.is_customize
    },
    beforeUpdate: async function () {
        const { doc, id, object_name } = this;
        delete doc.is_customize
    },
    afterUpdate: async function () {
        const { doc, previousDoc } = this;
        // 零代码配置 enable_tree: true 时，添加parent、children两个字段
        if(previousDoc.enable_tree !== doc.enable_tree && doc.enable_tree === true){
            // doc中缺少owner,space等字段值，需要从previousDoc中取到一起带过去
            await objectTree.insertParentAndChildrenFieldForTreeObject(Object.assign({}, previousDoc, doc), true)
        }
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