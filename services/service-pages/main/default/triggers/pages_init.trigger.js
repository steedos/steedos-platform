/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 10:02:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-06 10:50:08
 * @Description: 
 */
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
module.exports = {
    listenTo: 'pages',
    afterInsert: async function(){
        const { id } = this;
        const page = await objectql.getObject('pages').findOne(id)
        const broker = objectql.getSteedosSchema().broker;

        const user = await auth.getSessionByUserId(page.owner, page.space);
        await broker.call(`page.resetDefaultVersion`, {
            pageId: page._id
        }, {
            meta: {
                user: user
            }
        });

        // 默认添加 全组织 全设备授权
        if(page.type != 'app'){
            await objectql.getObject('page_assignments').insert({
                type: "orgDefault",
                page: id,
                desktop: true,
                mobile: true,
                space: page.space,
                owner: page.owner,
                created_by: page.created_by,
                modified_by: page.modified_by,
                company_id: page.company_id,
                company_ids: page.company_ids
            })
        }

        // const actions = broker.registry.getActionList({
        //     onlyLocal: false
        // });
        // if(_.find(actions, (action)=>{
        //     return action.name === `${page.render_engine}.getInitSchema`
        // })){
        //     const schema = await broker.call(`${page.render_engine}.getInitSchema`, {type: page.type, objectApiName: page.object_name})
        //     if(schema){
        //         await objectql.getObject('page_versions').directInsert({
        //             page: id,
        //             is_active: false,
        //             version: 1,
        //             schema: JSON.stringify(schema, null, 4),
        //             space: page.space,
        //             owner: page.owner,
        //             created_by: page.created_by,
        //             modified_by: page.modified_by,
        //             company_id: page.company_id,
        //             company_ids: page.company_ids
        //         })
        //     }
        // }
    }
}