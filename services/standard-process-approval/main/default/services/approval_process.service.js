/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-14 10:26:50
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-05-13 12:14:22
 * @Description: 
 */
const { getObjectProcessDefinition, recordSubmit } = require('@steedos/process')
const objectql = require('@steedos/objectql');
"use strict";
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'approval_process',
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
         * @api {call} submit 提请批准
         * @apiVersion 0.0.0
         * @apiName submit
         * @apiGroup approval_process.service.js
         * @apiBody {String} objectName 对象API Name
         * @apiBody {String} recordId 记录ID
         * @apiBody {String} comment 意见
         * @apiBody {String} approver 批准人ID
         * @apiSuccess {String} state 返回提请批准结果
         * @apiExample {js} 示例:
         *     await broker.call('approval_process.submit', {
         *         objectName: '',
         *         recordId: '',
         *         comment: '',
         *         approver: ''
         *     }, { meta: { user: userSession } })
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "SUCCESS"
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "FAILURE",
         *       "error": ""
         *     }
         */
        submit: {
            params: {
                objectName: { type: 'string' },
                recordId: { type: 'string' },
                comment: { type: 'string', optional: true },
                approver: { type: 'string', optional: true },
            },
            async handler(ctx) {
                try {
                    this.broker.logger.info('[service][approval_process]===>', 'submit', ctx.params.name)
                    const userSession = ctx.meta.user;
                    const params = ctx.params;
                    const objectName = params.objectName;
                    const recordId = params.recordId;
                    const comment = params.comment;
                    const approver = params.approver;

                    const processDefinition = await getObjectProcessDefinition(objectName, recordId, userSession);
                    if (!processDefinition) {
                        throw new Error('process_approval_error_notFindProcessDefinition');
                    }
                    await recordSubmit(processDefinition._id, objectName, recordId, userSession, comment, approver);
                    return { state: 'SUCCESS' };
                } catch (error) {
                    return { state: 'FAILURE', error: error.message };
                }

            }
        },

        /**
         * @api {call} copy 复制
         * @apiVersion 0.0.0
         * @apiName copy
         * @apiGroup approval_process.service.js
         * @apiBody {String} recordId 记录ID
         * @apiSuccess {String} state 返回复制结果
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "SUCCESS",
         *       _id: newPDID
         *     }
         * @apiErrorExample {json} Error-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "state": "FAILURE",
         *       "error": ""
         *     }
         */
        copy: {
            // 访问地址： GET /service/api/approval_process/process_definition/:recordId/copy
            rest: {
                method: "GET",
                path: '/process_definition/:recordId/copy'
            },
            params: {
                recordId: { type: 'string' }
            },
            async handler(ctx) {
                try {
                    this.broker.logger.info('[service][approval_process]===>', 'process_definition/:recordId/copy', ctx.params.name, ctx.params.recordId)
                    const userSession = ctx.meta.user;
                    const params = ctx.params;
                    const recordId = params.recordId;
                    const pdObj = objectql.getObject('process_definition');
                    const pnObj = objectql.getObject('process_node');
                    const nowTime = new Date().getTime();
                    let pd = await pdObj.findOne(recordId, undefined, userSession);
                    delete pd._id;
                    pd.name = `pd_${nowTime}`; // 名称长度不能大于20个字符；名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符
                    pd.active = false; // 批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤
                    let newPD = await pdObj.insert(pd);
                    let newPDID = newPD._id;
                    let pns = await pnObj.find({ filters: ['process_definition', '=', recordId] }, userSession);
                    for (let index = 0; index < pns.length; index++) {
                        let pn = pns[index];
                        delete pn._id;
                        pn.process_definition = newPDID;
                        pn.name = `pn_${nowTime}_${index}`;
                        const now = new Date();
                        pn.created = now;
                        pn.created_by = userSession.userId
                        pn.modified = now;
                        pn.modified_by = userSession.userId
                        await pnObj.directInsert(pn);
                    }
                    return { state: 'SUCCESS', _id: newPDID };
                } catch (error) {
                    return { state: 'FAILURE', error: error.message };
                }
            }
        }
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

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][approval_process]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
