/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-08 15:16:53
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-04-14 11:32:59
 * @Description: 
 */
"use strict";
// @ts-check
const { getObject } = require('@steedos/objectql');
const _ = require("underscore");

async function checkRepeatCompany(orgId, spaceId) {
    const companyObj = getObject('company');
    var repeatCompany = (await companyObj.find({
        filters: [
            ['space', '=', spaceId],
            ['organization', '=', orgId]
        ], fields: ['_id']
    }))[0];
    if (repeatCompany) {
        /* 要判断选中的关联组织是否已经被其他分部关联了，如果有就提示不能修改，而且不用处理其is_company、company_id值逻辑 */
        throw new Error("company_error_already_associated");
    }
}

module.exports = {
    listenTo: 'company',

    beforeInsert: async function () {
        const { doc } = this
        if (doc.organization) {
            await checkRepeatCompany(doc.organization, doc.space);
        }
        else {
            /* 允许不设置关联组织值， after.insert触发器中会自动新建关联组织*/
        }
    },

    beforeUpdate: async function () {
        const { doc: modifierSet, id } = this
        const companyObj = getObject('company');
        const doc = await companyObj.findOne(id)
        if (modifierSet.organization !== doc.organization) {
            if (modifierSet.organization) {
                await checkRepeatCompany(modifierSet.organization, doc.space);
            }
            else {
                /* 允许清除关联组织值，而且不用处理其is_company、company_id值逻辑 */
            }
        }
    },

    beforeDelete: async function () {
        const { id } = this
        const companyObj = getObject('company');
        const doc = await companyObj.findOne(id, {
            fields: ['organization']
        })
        if (doc.organization) {
            // 不再提示有关联组织，而是直接先清空分部的关联组织属性，触发其afterUpdate，
            // 更新分部关联组织为空值后，相关级联操作规则由afterUpdate决定，这里不做其它组织操作
            await companyObj.update(id, {
                organization: null
            });
        }
    },

    afterInsert: async function () {
        const { doc } = this
        const orgObj = getObject('organizations');
        const companyObj = getObject('company');

        if (doc.organization) {
            /* 设置了关联组织值，则更新相关属性*/
            await orgObj.directUpdate(doc.organization, {
                company_id: doc._id,
                is_company: true
            });
            await companyObj.directUpdate(doc._id, {
                company_id: doc._id
            });
        }
        else {
            /* 允许未设置关联组织值，自动新建关联组织*/
            // 自动在根节点新建一个组织，对应上关系
            const rootOrg = (await orgObj.find({
                filters: [
                    ['space', '=', doc.space],
                    ['parent', '=', null]
                ],
                fields: ['_id']
            }))[0]

            // 自动新建根组织下对应的组织关联到新分部，就算存在同名组织，也要新建，同名的老组织用户应该手动删除
            // 组织的其他属性，比如fullname，parents等在organizations.before.insert，organizations.after.insert处理
            // 因为没办法保证company与organizations表的关联记录_id值一定相同，所以不再把它们_id值设置为相同值
            var orgId = await orgObj.insert({
                name: doc.name,
                parent: rootOrg._id,
                space: doc.space,
                company_id: doc._id,
                is_company: true,
                sort_no: 100
            });
            await companyObj.directUpdate(doc._id, {
                organization: orgId,
                company_id: doc._id
            });
        }
    },

    afterUpdate: async function () {
        const { previousDoc, id } = this
        const companyObj = getObject('company');
        const orgObj = getObject('organizations');
        const doc = await companyObj.findOne(id, {
            fields: ['organization']
        });
        if (previousDoc.organization !== doc.organization) {
            if (doc.organization) {
                /* 设置了关联组织值，则更新相关属性*/
                await orgObj.directUpdate(doc.organization, {
                    company_id: doc._id,
                    is_company: true
                });
                await companyObj.directUpdate(doc._id, {
                    company_id: doc._id
                });
            }
            else {
                /* 允许清除关联组织值，组织相关属性is_company、company_id值的修正需要手动执行“更新组织”操作 */
            }
        }
    },

    afterDelete: async function () {

    },

}