/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-08 15:38:09
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-08 16:22:48
 * @Description: 
 */
"use strict";
const { getObject, getSteedosConfig } = require("@steedos/objectql")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'company',
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        /**
         * @api {post} /service/api/company/updateOrgs 更新组织
         * @apiName updateOrgs
         * @apiGroup company.service.js
         * @apiParam {String} companyId 分部ID
         * @apiSuccess {Number} updatedOrgs   更新的组织数。
         * @apiSuccess {Number} updatedSus   更新成功数。
         */
        updateOrgs: {
            params: {
                companyId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][company]===>', '/service/api/company/updateOrgs', ctx.params)
                return await this.updateOrgs(ctx.params.companyId, ctx.meta.user)
            }
        },
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /**
         * 更新组织
         * @param {*} companyId 
         * @param {*} userSession 
         */
        async updateOrgs(companyId, userSession) {

            let callThis = {
                userSession: userSession
            }

            let company = await getObject("company").findOne(companyId, {
                fields: ["organization", "space"]
            });

            if (!company.organization) {
                throw new Error("该分部的关联组织未设置");
            }

            // 在使用cachedCompanys过程中一定要注意内部程序是否会变更cachedCompanys中的值，
            // 如果会则不能使用cachedCompanys而应该用getObject...find的方式即时更新到最新数据
            const cachedCompanys = await getObject("company").find({
                filters: [["space", "=", company.space]],
                fields: ["_id", "organization"]
            });

            await this.update_all_company_org.call(callThis, company.space, cachedCompanys);

            let updatedOrgs = { count: 0 };
            await this.update_org_company_id.call(callThis, company.organization, companyId, company.space, cachedCompanys, updatedOrgs);

            const sus = await getObject("space_users").find({
                filters: [["organizations_parents", "=", company.organization]],
                fields: ["organizations", "organization", "company_id", "space"]
            });

            // 在使用cachedOrganizations过程中一定要注意内部程序是否会变更cachedOrganizations中的值，
            // 如果会则不能使用cachedOrganizations而应该用getObject...find的方式即时更新到最新数据
            const cachedOrganizations = await getObject("organizations").find({
                filters: [["space", "=", company.space]],
                fields: ["_id", "company_id", "sort_no"]
            });

            for (let su of sus) {
                await this.update_su_company_ids.call(callThis, su._id, su, cachedOrganizations);
            }

            // 分部没有上下层级关系，只能每次都更新所有分部的排序号
            await this.update_all_company_sort_no.call(callThis, cachedCompanys, cachedOrganizations);

            return {
                updatedOrgs: updatedOrgs.count,
                updatedSus: sus.length
            }
        },
        /**
         * 根据当前space_users的organizations/organization值，计算其company_ids及company_id值
         * @param {*} _id 
         * @param {*} su 
         * @param {*} cachedOrganizations 
         * @returns 
         */
        async update_su_company_ids(_id, su, cachedOrganizations) {
            var company_ids, orgs, org;
            if (!su) {
                su = await getObject("space_users").findOne(_id, {
                    fields: ["organizations", "organization", "company_id", "space"]
                });
            }
            if (!su) {
                console.error("db.space_users.update_company_ids,can't find space_users by _id of:", _id);
                return;
            }
            orgs = cachedOrganizations.filter(function (item) {
                return su.organizations.indexOf(item._id) > -1;
            });
            company_ids = _.pluck(orgs, 'company_id');
            // company_ids中的空值就空着，不需要转换成根组织ID值
            company_ids = _.uniq(_.compact(company_ids));

            org = cachedOrganizations.find(function (item) {
                return su.organization === item._id;
            });

            let updateDoc = {
                company_ids: company_ids
            };
            if (org && org.company_id) {
                updateDoc.company_id = org.company_id;
            }
            await getObject("space_users").directUpdate(_id, updateDoc);
        },
        /**
         * 循环执行当前组织及其子组织children的company_id值计算
         * @param {*} _id 
         * @param {*} company_id 
         * @param {*} space_id 
         * @param {*} cachedCompanys 
         * @param {*} updated 
         * @returns 
         */
        async update_org_company_id(_id, company_id, space_id, cachedCompanys, updated = { count: 0 }) {
            const org = await getObject("organizations").findOne(_id, {
                fields: ["children", "is_company"]
            });

            if (!org) {
                return;
            }

            if (org.is_company) {
                const orgCompany = cachedCompanys.find(function (company) {
                    return company.organization === _id;
                });
                if (orgCompany) {
                    company_id = orgCompany._id;
                }
            }
            await getObject("organizations").directUpdate(_id, {
                company_id: company_id
            });
            updated.count += 1;

            const children = org.children;
            if (children && children.length) {
                for (let child of children) {
                    await this.update_org_company_id.call(this, child, company_id, space_id, cachedCompanys, updated);
                }
            }
        },
        /**
         * 执行更新组织前先把所有company的直属关联组织is_company及is_company设置对，
         * 即把直属关联组织is_company设置为true，company_id设置为关联分部_id
         * 只需要处理organization值不等于其_id值的company记录，这些记录不是新建出来的，而是其他方式同步过来的数据
         * @param {*} space_id 
         * @param {*} cachedCompanys 
         */
        async update_all_company_org(space_id, cachedCompanys) {
            if (!cachedCompanys) {
                cachedCompanys = await getObject("company").find({
                    filters: [["space", "=", space_id]],
                    fields: ["organization"]
                });
            }

            for (let company of cachedCompanys) {
                if (company.organization) {
                    await getObject("organizations").directUpdate(company.organization, {
                        is_company: true,
                        company_id: company._id
                    });
                }
            }

            let orgs = await getObject("organizations").find({
                filters: [["space", "=", space_id], ["is_company", "=", true]],
                fields: ["company_id", "is_company"]
            });
            // 清除未被company引用的organizations记录的is_company值为false
            for (let org of orgs) {
                const orgCompany = cachedCompanys.find(function (company) {
                    return company.organization === org._id;
                });
                if (!orgCompany) {
                    await getObject("organizations").directUpdate(org._id, {
                        is_company: false
                    });
                }
            }
        },
        /**
         * 
         * @param {*} cachedCompanys 
         * @param {*} cachedOrganizations 
         */
        async update_all_company_sort_no(cachedCompanys, cachedOrganizations) {
            let org = null;
            for (let company of cachedCompanys) {
                if (company.organization) {
                    org = cachedOrganizations.find(function (item) {
                        return company.organization === item._id;
                    });
                    if (org && _.isNumber(org.sort_no)) {
                        await getObject("company").directUpdate(company._id, {
                            sort_no: org.sort_no
                        });
                    }
                }
            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][company]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
