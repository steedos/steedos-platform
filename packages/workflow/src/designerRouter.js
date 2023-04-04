"use strict";
// @ts-check
const express = require('express');
const steedosAuth = require('@steedos/auth');
const objectql = require("@steedos/objectql");
const _ = require('underscore');
const bodyParser = require('body-parser');
const Fiber = require('fibers');
const designerManager = require('./designerManager');

const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();

const steedosSchema = objectql.getSteedosSchema();

const jsonParser = bodyParser.json({
    type: 'text/plain',
    limit: '16mb'
});
router.use(jsonParser);

router.use('/am', function auth(req, res, next) {
    let methodOverride = req.query['methodOverride'];
    if (methodOverride) {
        req.method = methodOverride;
    }

    steedosAuth.auth(req, res).then(function (result) {
        if (result && result.userId) {
            req.user = result;
            next();
        } else {
            res.status(401).send({
                status: 'error',
                message: 'You must be logged in to do this.'
            });
        }
    })
})

// startup
router.get('/am/designer/startup', async function (req, res) {
    try {
        let userId = req.user.userId;
        let queryParams = req.query;
        let companyId = queryParams["companyId"];
        let isCompanyAdmin = false;
        let spaceIds = [];
        let spaces = [];
        let spaceObj = steedosSchema.getObject('spaces');
        let orgObj = steedosSchema.getObject('organizations');
        if (companyId) {
            let company = await steedosSchema.getObject('company').findOne(companyId, { fields: ['organization'] })
            if (company && company.organization) {
                let org = await orgObj.findOne(company.organization, {
                    fields: ['space']
                });
                if (await spaceObj.count({
                    filters: `(space eq '${org.space}') and (admins eq '${userId}')`
                }) == 0) {
                    spaceIds = [org.space];
                    spaces = [await spaceObj.findOne(org.space)];
                    isCompanyAdmin = true;
                }
            }
        }
        if (!isCompanyAdmin) {
            spaces = await spaceObj.find({
                filters: `(admins eq '${userId}')`
            });
            spaceIds = _.pluck(spaces, '_id');
        }

        let changeSet = await designerManager.getByAdminSpaceIds(spaceIds, companyId, isCompanyAdmin)
        // changeSet['Clouds'] = clouds
        // changeSet['Modules'] = modules
        changeSet['Spaces'] = spaces
        changeSet['sync_token'] = new Date().getTime() / 1000
        res.send(changeSet)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// 表单
router.post('/am/forms', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let formCollection = Creator.getCollection('forms');
        let flowCollection = Creator.getCollection('flows');
        let spaceUserCollection = Creator.getCollection('space_users');
        let organizationCollection = Creator.getCollection('organizations');
        let now = new Date();
        let insertedForms = [];
        let insertedFlows = [];
        for (let i = 0; i < data['Forms'].length; i++) {
            let form = data['Forms'][i];
            let objectName = form["object_name"];
			let useAmis = form["enable_amisform"]
            const instance_table_fields = form['instance_table_fields'] || []
            const instanceFields = await designerManager.getBusinessFields(objectName)
            const formFields = await designerManager.transformObjectFieldsToFormFields(instanceFields);
            const tables = await designerManager.transformObjectDetailFieldsToFormTableFields(instance_table_fields)
            // 执行者的身份校验
            await designerManager.checkSpaceUserBeforeUpdate(form['space'], userId, req.user.roles)

            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {

                        let currentSpaceUser = spaceUserCollection.findOne({
                            space: form['space'],
                            user: userId
                        });
                        let companyId = currentSpaceUser.company_id;
                        let newForm = {
                            _id: form["id"],
                            name: form["name"],
                            state: "disabled",
                            is_deleted: false,
                            is_valid: form["is_valid"],
                            space: form["space"],
                            description: form["description"],
                            help_text: form["help_text"],
                            app: form["app"],
                            created: now,
                            created_by: userId,
                            modified: now,
                            modified_by: userId,
                            error_message: form["error_message"],
                            category: form["category"],
                            instance_style: 'table'
                        };
                        if (companyId) {
                            newForm.company_id = companyId;
                        }
                        let current = {
                            _id: form["current"]["id"],
                            form: newForm._id,
                            _rev: 1,
                            created: now,
                            created_by: userId,
                            modified: now,
                            modified_by: userId,
                            fields: form["current"]["fields"]
                        };
                        if (objectName) {
                            current.fields = Object.values(formFields).concat(tables);
                        }
                        newForm.current = current;
                        newForm.historys = [];
                        formCollection.insert(newForm);
                        insertedForms.push(formCollection.findOne(newForm._id));
                        // 新建流程
                        let flow = {
                            _id: flowCollection._makeNewID(),
                            space: form["space"],
                            form: form["id"],
                            name_formula: "",
                            code_formula: "",
                            is_valid: true,
                            flowtype: "new",
                            state: "disabled",
                            description: "",
                            help_text: "",
                            error_message: "",
                            current_no: 0,
                            is_deleted: false,
                            created: now,
                            created_by: userId,
                            modified: now,
                            modified_by: userId,
                            name: form["name"],
                            app: form["app"],
                            category: form["category"],
							enable_amisform: useAmis
                        }
                        if (companyId) {
                            flow.company_id = companyId;
                        }
                        if (objectName) {
                            flow.object_name = objectName;
                            flow.instance_fields = instanceFields
                            flow.instance_table_fields = instance_table_fields
                        }
                        let flowPerms = {
                            _id: flowCollection._makeNewID()
                        }
                        if (companyId) {
                            let company = Creator.getCollection('company').findOne(companyId);
                            flowPerms.orgs_can_add = [company.organization];
                        } else {
                            let rootOrg = organizationCollection.findOne({
                                space: form['space'],
                                parent: null,
                                is_company: true
                            })
                            flowPerms.orgs_can_add = [rootOrg._id];
                        }
                        flow.perms = flowPerms;
                        let flow_current = {
                            _id: flowCollection._makeNewID(),
                            steps: designerManager.makeSteps(userId, newForm.current.fields),
                            _rev: 1,
                            flow: flow._id,
                            form_version: form["current"]["id"],
                            created: now,
                            created_by: userId,
                            modified: now,
                            modified_by: userId,
                        }
                        flow.current = flow_current;
                        flowCollection.insert(flow);
                        insertedFlows.push(flowCollection.findOne(flow._id));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }
        res.send({
            "ChangeSet": {
                "inserts": {
                    "Flows": insertedFlows,
                    "Forms": insertedForms,
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/am/forms', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let updatedForms = [];
        let updatedFlows = [];
        for (let i = 0; i < data['Forms'].length; i++) {
            let form = data['Forms'][i];
            // 执行者的身份校验
            await designerManager.checkSpaceUserBeforeUpdate(form['space'], userId, req.user.roles)
            // 更新表单
            await designerManager.updateForm(form["id"], form, updatedForms, updatedFlows, userId)
        }
        res.send({
            "ChangeSet": {
                "updates": {
                    "Forms": updatedForms,
                    "Flows": updatedFlows
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/am/forms', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let formCollection = Creator.getCollection('forms');
        let flowCollection = Creator.getCollection('flows');
        let recordCollection = Creator.getCollection('records');
        let instanceCollection = Creator.getCollection('instances');
        let deletedForms = [];
        let deletedFlows = [];
        let deletedRecords = [];
        let deletedInstances = [];
        let now = new Date();
        for (let i = 0; i < data['Forms'].length; i++) {
            let form = data['Forms'][i];
            let f = await new Promise(function (resolve, reject) {
                Fiber(function () {
                    resolve(formCollection.findOne(form["id"]))
                }).run()
            });
            // 执行者的身份校验
            await designerManager.checkSpaceUserBeforeUpdate(f.space, userId, req.user.roles)
            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {

                        let spaceId = f.space;
                        let companyId = f.company_id;

                        if (!db.deleted_flows) {
                            db.deleted_flows = new Meteor.Collection('deleted_flows');
                        }
                        if (!db.deleted_records) {
                            db.deleted_records = new Meteor.Collection('deleted_records');
                        }
                        if (!db.deleted_instances) {
                            db.deleted_instances = new Meteor.Collection('deleted_instances');
                        }
                        if (!db.deleted_forms) {
                            db.deleted_forms = new Meteor.Collection('deleted_forms');
                        }
                        // 删除表单对应流程
                        flowCollection.find({
                            space: spaceId,
                            form: form["id"]
                        }).forEach(function (flow_fd) {
                            let deleted_flow = Object.assign({}, flow_fd);
                            deleted_flow['deleted'] = now;
                            deleted_flow['deleted_by'] = userId;
                            db.deleted_flows.insert(deleted_flow);
                            deletedFlows.push(deleted_flow);
                            flowCollection.direct.remove(flow_fd["_id"])
                        })

                        // 删除表单对应Record(记录)
                        if (recordCollection) {
                            recordCollection.find({
                                space: spaceId,
                                form: form["id"]
                            }).forEach(function (record_fd) {
                                let deleted_record = Object.assign({}, record_fd);
                                deleted_record['deleted'] = now;
                                deleted_record['deleted_by'] = userId;
                                db.deleted_records.insert(deleted_record);
                                deletedRecords.push(deleted_record);
                                recordCollection.direct.remove(record_fd["_id"])
                            })
                        }

                        // 删除表单对应申请单
                        instanceCollection.find({
                            space: spaceId,
                            form: form["id"]
                        }).forEach(function (instance_fd) {
                            let deleted_instance = Object.assign({}, instance_fd);
                            deleted_instance['deleted'] = now;
                            deleted_instance['deleted_by'] = userId;
                            db.deleted_instances.insert(deleted_instance);
                            deletedInstances.push(deleted_instance);
                            instanceCollection.direct.remove(instance_fd["_id"])
                        })

                        // 删除表单
                        let deleted_form = Object.assign({}, f);
                        deleted_form['deleted'] = now;
                        deleted_form['deleted_by'] = userId;
                        db.deleted_forms.insert(deleted_form);
                        deletedForms.push(deleted_form);
                        formCollection.direct.remove(form["id"])

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }

        res.send({
            "ChangeSet": {
                "deletes": {
                    "Forms": deletedForms,
                    "Flows": deletedFlows,
                    "Records": deletedRecords,
                    "Instances": deletedInstances
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message)
    }
})

// 流程
router.put('/am/flows', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let updatedFlows = [];
        for (let i = 0; i < data['Flows'].length; i++) {
            let flowCome = data['Flows'][i];
            let spaceId = flowCome["space"];
            let formId = flowCome["form"];
            let flowId = flowCome["id"];
            let now = new Date();

            await designerManager.checkBeforeFlow(spaceId, formId);

            let flow = await designerManager.getFlow(flowId);
            await designerManager.getSpaceUser(userId, spaceId);
            await designerManager.isSpaceAdmin(spaceId, userId, req.user.roles);

            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {

                        if (flowCome['state'] !== 'enabled' && flowCome['state'] !== 'disabled') {
                            throw new Error('流程状态值无效');
                        }

                        // 某步骤被删除后，删除同流程的“指定历史步骤”属性中被引用的步骤id（仅限于流程的最新版)
                        let clientStepIds = []
                        _.each(flowCome['current']['steps'], function (step) {
                            clientStepIds.push(step['id']);
                        })

                        _.each(flowCome['current']['steps'], function (step) {
                            if (step['approver_step']) {
                                if (!clientStepIds.includes(step['approver_step'])) {
                                    step['approver_step'] = '';
                                }
                            }
                        })

                        // 流程升级
                        // 由于前台后台posx posy timeout_hours字段类型不一致会导致流程升级 所以在这里统一转为后台Float类型 便于比较
                        _.each(flowCome['current']['steps'], function (st) {
                            st['posx'] = parseFloat(st['posx']);
                            st['posy'] = parseFloat(st['posy']);
                            if (st['timeout_hours']) {
                                st['timeout_hours'] = parseFloat(st['timeout_hours']);
                            }
                        })

                        // 由于前台传的是id而非_id，故比较时将id转为_id
                        _.each(flowCome['current']['steps'], function (step) {
                            step['_id'] = step['id'];
                            delete step['id'];
                            if (step['lines']) {
                                _.each(step['lines'], function (line) {
                                    line['_id'] = line['id'];
                                    delete line['id'];
                                })
                            }
                        })
                        let stepsStr = JSON.stringify(flow['current']['steps']);
                        let flowComeStepsStr = JSON.stringify(flowCome['current']['steps']);
                        let pass = false;
                        let updateObj = {
                            $set: {}
                        };
                        let flowCollection = Creator.getCollection('flows');
                        let formCollection = Creator.getCollection('forms');

                        let insCount = Creator.getCollection('instances').find({
                            space: spaceId,
                            flow: flowId,
                            flow_version: flow.current._id
                        }).count();
                        if (insCount > 0) {
                            pass = true;
                        }

                        if (pass === true && flow.current.start_date && stepsStr === flowComeStepsStr) {
                            updateObj.$push = {
                                'historys': flow.current
                            };
                            let current = {
                                '_id': flowCollection._makeNewID(),
                                'modified': now,
                                'modified_by': userId,
                                'created': now,
                                'created_by': userId,
                                'steps': flowCome['current']['steps'],
                                'form_version': flow.current.form_version,
                                '_rev': flow.current._rev,
                                'flow': flowId,
                            };
                            if (flow.state === 'enabled') {
                                current['start_date'] = now;
                            }

                            updateObj.$set.current = current;

                        } else {
                            updateObj.$set = {
                                'current.modified': now,
                                'current.modified_by': userId,
                                'current.steps': flowCome["current"]["steps"]
                            }
                        }

                        updateObj.$set.name = flowCome['name'];
                        updateObj.$set.name_formula = '';
                        updateObj.$set.code_formula = '';
                        updateObj.$set.is_valid = flowCome['is_valid'];
                        updateObj.$set.flowtype = flowCome['flowtype'];
                        updateObj.$set.help_text = flowCome['help_text'];
                        updateObj.$set.decription = flowCome['descriptions'];
                        updateObj.$set.error_message = flowCome['error_message'];
                        updateObj.$set.modified = now;
                        updateObj.$set.modified_by = userId;

                        if (flowCome['perms']) {
                            flowCome['perms']['_id'] = flowCome['perms']['id'];
                            delete flowCome['perms']['id'];
                            updateObj.$set.perms = flowCome['perms'];
                        }

                        // flow对象上添加categoryId
                        let form = formCollection.findOne(flow.form, {
                            fields: {
                                category: 1
                            }
                        });
                        updateObj.$set.category = form['category'];

                        flowCollection.update(flowId, updateObj);

                        updatedFlows.push(flowCollection.findOne(flowId));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }

        res.send({
            "ChangeSet": {
                "updates": {
                    "Flows": updatedFlows
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/am/flows/state', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let formCollection = Creator.getCollection('forms');
        let flowCollection = Creator.getCollection('flows');
        let spaceCollection = Creator.getCollection('spaces');
        let updatedForms = [];
        let updatedFlows = [];
        for (let i = 0; i < data['Flows'].length; i++) {
            let flowCome = data['Flows'][i];
            let spaceId = flowCome["space"];
            let formId = flowCome["form"];
            let flowId = flowCome["id"];
            let now = new Date();
            let flowUpdateObj = {
                $set: {}
            };
            let formUpdateObj = {
                $set: {}
            };

            await designerManager.checkBeforeFlow(spaceId, formId);

            let flow = await designerManager.getFlow(flowId);
            let form = await designerManager.getForm(formId);
            await designerManager.getSpaceUser(userId, spaceId);
            await designerManager.isSpaceAdmin(spaceId, userId, req.user.roles);

            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {
                        let state = flowCome['state'];
                        if (state !== 'enabled' && state !== 'disabled') {
                            throw new Error('流程状态值无效');
                        }

                        // 启用流程
                        if (state === 'enabled') {
                            /* 等待规则清楚后开放
                            // 根据工作区版本控制流程启用数量: 免费版/基础版10个，专业版50个，企业版不限数量
                            let space = spaceCollection.findOne(spaceId);
                            let enabledCount = flowCollection.find({ space: spaceId, state: 'enabled' }).count();
                            if (space.is_paid) {
                                let modules = space.modules;
                                if (!modules.includes('workflow.enterprise')) {
                                    if (modules.includes('workflow.professional')) {
                                        if (enabledCount >= 50) {
                                            throw new Error('专业版只能启用不超过50个流程');
                                        }
                                    } else if (modules.includes('workflow.standard')) {
                                        throw new Error('基础版只能启用不超过10个流程');
                                    }
                                }
                            } else {
                                if (enabledCount >= 10) {
                                    throw new Error('免费版只能启用不超过10个流程');
                                }
                            }
                            */

                            // 流程启用前，校验其“指定历史步骤”属性中被引用的步骤是否存在且能被找到（仅限于流程的最新版）
                            let checkStepIds = [];
                            _.each(flow.current.steps, function (step) {
                                checkStepIds.push(step._id);
                            })

                            _.each(flow.current.steps, function (step) {
                                if (step.deal_type === 'specifyStepUser' || step.deal_type === 'specifyStepRole') {
                                    if (!step.approver_step || !checkStepIds.includes(step.approver_step)) {
                                        throw new Error('流程中的指定步骤不存在');
                                    }
                                }
                            })

                            // 如果 流程对应表单 是停用的 则启用
                            if (form.state === 'disabled') {
                                let formUpdateObj = {
                                    $set: {
                                        'state': 'enabled',
                                        'current.start_date': now,
                                        'current.modified': now,
                                        'current.modified_by': userId
                                    }
                                }
                                formCollection.update(formId, formUpdateObj);
                                updatedForms.push(formCollection.findOne(formId));
                            }

                            if (!flow.is_valid) {
                                throw new Error('流程不合法');
                            }
                            if (!['new', 'modify', 'delete'].includes(flow.flowtype)) {
                                throw new Error('FlowType值必须是new、modify、delete其中之一');
                            }
                            if (!flow.current.steps) {
                                throw new Error('流程的步骤不能为空');
                            }

                            flowUpdateObj.$set['state'] = 'enabled';
                            flowUpdateObj.$set['current.modified'] = now;
                            flowUpdateObj.$set['current.start_date'] = now;
                            flowUpdateObj.$set['current.modified_by'] = userId;

                            // 校验步骤中的字段控制设定对象在表单中都存在
                            let formCurrentFields = form.current.fields;
                            let formCurrentFieldsCode = [];
                            _.each(formCurrentFields, function (field) {
                                formCurrentFieldsCode.push(field.code);
                            })
                            let currentSteps = [];
                            _.each(flow.current.steps, function (step) {
                                let fieldsModifiable = [];
                                _.each(step.fields_modifiable, function (fieldCode) {
                                    if (formCurrentFieldsCode.includes(fieldCode)) {
                                        fieldsModifiable.push(fieldCode);
                                    }
                                })
                                step.fields_modifiable = fieldsModifiable;
                                currentSteps.push(step);
                            })
                            flowUpdateObj.$set['current.steps'] = currentSteps;
                        } else { // 禁用流程
                            flowUpdateObj.$set['state'] = 'disabled';
                            flowUpdateObj.$set['current.modified'] = now;
                            flowUpdateObj.$set['current.finish_date'] = flow.current.modified;
                            flowUpdateObj.$set['current.modified_by'] = userId;
                        }
                        flowUpdateObj.$set['modified'] = now;
                        flowUpdateObj.$set['modified_by'] = userId;

                        flowCollection.update(flowId, flowUpdateObj);
                        updatedFlows.push(flowCollection.findOne(flowId));

                        // 判断表单所有流程是否已经全部停用 如果已全部停用 则修改表单状态为停用
                        if (state === 'disabled') {
                            let isAllDisabled = true;
                            flowCollection.find({
                                space: spaceId,
                                form: formId
                            }, {
                                fields: {
                                    state: 1
                                }
                            }).forEach(function (flow) {
                                if (flow.state === 'enabled') {
                                    isAllDisabled = false;
                                }
                            })
                            if (isAllDisabled === true) {
                                formUpdateObj.$set['state'] = 'disabled';
                                formUpdateObj.$set['current.finish_date'] = now;
                                formUpdateObj.$set['current.modified'] = now;
                                formCollection.update(formId, formUpdateObj);
                                updatedForms.push(formCollection.findOne(formId));
                            }
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }
        res.send({
            "ChangeSet": {
                "updates": {
                    "Forms": updatedForms,
                    "Flows": updatedFlows
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// 分类
router.post('/am/categories', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let cates = [];
        let catCollection = Creator.getCollection('categories');
        let now = new Date();
        for (let i = 0; i < data['Categories'].length; i++) {
            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {
                        let c = data['Categories'][i];
                        let cat = {
                            _id: catCollection._makeNewID(),
                            name: c['name'],
                            space: c['space'],
                            created: now,
                            created_by: userId,
                            modified: now,
                            modified_by: userId
                        }
                        catCollection.insert(cat);
                        cates.push(catCollection.findOne(cat._id));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }
        res.send({
            "ChangeSet": {
                "inserts": {
                    "Categories": cates
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/am/categories', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let cates = [];
        let catCollection = Creator.getCollection('categories');
        let now = new Date();
        for (let i = 0; i < data['Categories'].length; i++) {
            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {
                        let c = data['Categories'][i];
                        let _id = c['id'];
                        let setObj = {
                            name: c['name'],
                            modified: now,
                            modified_by: userId
                        }
                        catCollection.update(_id, {
                            $set: setObj
                        });
                        cates.push(catCollection.findOne(_id));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }

                }).run()
            })
        }
        res.send({
            "ChangeSet": {
                "updates": {
                    "Categories": cates
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/am/categories', async function (req, res) {
    try {
        let userId = req.user.userId;
        let data = req.body;
        let cates = [];
        let catCollection = Creator.getCollection('categories');
        let formCollection = Creator.getCollection('forms');
        let now = new Date();
        for (let i = 0; i < data['Categories'].length; i++) {
            await new Promise(function (resolve, reject) {
                Fiber(function () {
                    try {

                        // 校验分类是否在使用中
                        let c = data['Categories'][i];
                        let _id = c['id'];
                        let cat = catCollection.findOne(_id);
                        let formCount = formCollection.find({
                            space: cat.space,
                            category: _id
                        }).count();
                        if (formCount > 0) {
                            resolve();
                            return
                        }
                        catCollection.direct.remove(_id);
                        let deleted_cat = Object.assign({}, cat);
                        deleted_cat['delete'] = now;
                        deleted_cat['deleted_by'] = userId;
                        if (!db.deleted_categories) {
                            db.deleted_categories = new Meteor.Collection('deleted_categories');
                        }

                        db.deleted_categories.insert(deleted_cat);
                        cates.push(deleted_cat);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).run()
            })
        }
        res.send({
            "ChangeSet": {
                "deletes": {
                    "Categories": cates
                }
            }
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

/**
 * 从对象选择字段后，表单生成对应字段
 * 根据字段名，有则更新无则新增
 * 不包括表格字段
 * body {
 *  fields 对象字段数组
 *  formId 表单ID
 * }
 */
router.post('/am/forms/addFieldFromObject', async function (req, res) {
    try {
        const { fields, formId } = req.body;
        const formObj = objectql.getObject('forms');
        const owObj = objectql.getObject('object_workflows');
        const flowObj = objectql.getObject('flows');
        const formFieldsMap = await designerManager.transformObjectFieldsToFormFields(fields);
        const formDoc = await formObj.findOne(formId);
        let updatedForms = [];
        let updatedFlows = [];
        let userId = req.user.userId;

        // 遍历表单字段，根据字段名，有则更新无则新增
        const oldFormFields = formDoc.current.fields || [];
        const len = oldFormFields.length;
        let oldFormFieldsMap = {};
        for (let index = 0; index < len; index++) {
            const f = oldFormFields[index];
            oldFormFieldsMap[f.code] = f;
        }
        const newFormFieldsMap = {
            ...oldFormFieldsMap,
            ...formFieldsMap
        }
        formDoc.current.fields = Object.values(newFormFieldsMap);

        // 更新表单
        await designerManager.updateForm(formDoc._id, formDoc, updatedForms, updatedFlows, userId);

        // 更新对象流程映射
        const flowDoc = (await flowObj.find({ filters: [['form', '=', formId]] }))[0];
        const objectName = flowDoc.object_name;
        const flowId = flowDoc._id;
        const owDoc = (await owObj.find({ filters: [['object_name', '=', objectName], ['flow_id', '=', flowId]] }))[0];
        if (owDoc) {
            let oldFieldCodes = Object.keys(oldFormFieldsMap);
            let fieldCodes = Object.keys(formFieldsMap);
            let newFieldCodes = _.difference(fieldCodes, oldFieldCodes);
            let fieldMapBack = owDoc.field_map_back || [];
            for (const code of newFieldCodes) {
                fieldMapBack.push({
                    object_field: code,
                    workflow_field: code
                });
            }
            await owObj.directUpdate(owDoc._id, {
                field_map_back: fieldMapBack
            });
        }


        res.status(200).send({ success: true, message: 'router is ok' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

/**
 * 从对象选择子表后，表单生成对应表格字段
 * 根据字段名，有则更新无则新增
 * 只包括表格字段
 * body {
 *  tables 表格数组
 *      [{
 *        name 对象名
 *        label 对象显示名
 *        fields 对象字段数组
 *      }]
 *  formId 表单ID
 * }
 */
router.post('/am/forms/addTableFromObject', async function (req, res) {
    try {
        const { tables, formId } = req.body;
        const formObj = objectql.getObject('forms');
        const owObj = objectql.getObject('object_workflows');
        const flowObj = objectql.getObject('flows');
        const formDoc = await formObj.findOne(formId);
        let updatedForms = [];
        let updatedFlows = [];
        let userId = req.user.userId;

        // 遍历表单字段，根据字段名，有则更新无则新增
        const oldFormFields = formDoc.current.fields || [];
        const newTableFieldCodes = [];
        for (const table of tables) {
            const tName = table.name;
            const tLabel = table.label;
            let oldTableFieldExists = false;
            const formFieldsMap = await designerManager.transformObjectFieldsToFormFields(table.fields, `${tName}_`);
            const formFields = Object.values(formFieldsMap);
            const len = oldFormFields.length;
            for (let idx = 0; idx < len; idx++) {
                const f = oldFormFields[idx];
                if (f.code == tName && f.type == 'table') {
                    oldTableFieldExists = true;
                    // 找到则更新
                    const oldTableFields = f.fields;
                    const oLen = oldTableFields.length;
                    let oldTableFieldsMap = {};
                    for (let index = 0; index < oLen; index++) {
                        const f = oldTableFields[index];
                        oldTableFieldsMap[f.code] = f;
                    }
                    const newFormTableFieldsMap = {
                        ...oldTableFieldsMap,
                        ...formFieldsMap
                    }
                    f.fields = Object.values(newFormTableFieldsMap);
                    // 找到新增的字段，记入对象流程映射
                    let oldFieldCodes = Object.keys(oldTableFieldsMap);
                    let fieldCodes = Object.keys(formFieldsMap);
                    let newFieldCodes = _.difference(fieldCodes, oldFieldCodes);
                    for (const code of newFieldCodes) {
                        const f = formFieldsMap[code];
                        newTableFieldCodes.push({
                            objCode: `${tName}.${f.code.split(tName + '_')[1]}`,
                            workflowCode: `${tName}.${f.code}`,
                        }); // 子表字段映射的字段名格式，记入对象流程映射
                    }
                }
            }
            if (!oldTableFieldExists) {
                // 未找到则新增
                oldFormFields.push({
                    "type": "table",
                    "name": tLabel,
                    "code": tName,
                    "is_wide": true,
                    "is_required": false,
                    "fields": formFields,
                    "_id": await formObj._makeNewID()
                });
                for (const f of formFields) {
                    newTableFieldCodes.push({
                        objCode: `${tName}.${f.code.split(tName + '_')[1]}`,
                        workflowCode: `${tName}.${f.code}`,
                    }); // 子表字段映射的字段名格式，记入对象流程映射
                }
            }
        }

        // 更新表单
        if (!_.isEmpty(oldFormFields)) {
            formDoc.current.fields = oldFormFields;
            await designerManager.updateForm(formDoc._id, formDoc, updatedForms, updatedFlows, userId);
        }

        // 更新对象流程映射
        const flowDoc = (await flowObj.find({ filters: [['form', '=', formId]] }))[0];
        const objectName = flowDoc.object_name;
        const flowId = flowDoc._id;
        const owDoc = (await owObj.find({ filters: [['object_name', '=', objectName], ['flow_id', '=', flowId]] }))[0];
        if (owDoc) {
            let fieldMapBack = owDoc.field_map_back || [];
            console.log('newTableFieldCodes: ', newTableFieldCodes);
            for (const code of newTableFieldCodes) {
                fieldMapBack.push({
                    object_field: code.objCode,
                    workflow_field: code.workflowCode
                });
            }
            await owObj.directUpdate(owDoc._id, {
                field_map_back: fieldMapBack
            });
        }

        res.status(200).send({ success: true, message: 'router is ok' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
})

/**
 * 获取对象的子表信息
 * body {
 *  objectName 对象名
 * }
 */
router.post('/am/forms/getDetails', async function (req, res) {
    try {
        const { objectName } = req.body;
        if (!objectName) {
            throw new Error('缺少参数: objectName。');
        }
        const obj = objectql.getObject(objectName);
        const details = await obj.getDetails();
        res.status(200).send({ success: true, details });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
})

/**
 * 获取对象的子表信息
 * body {
 *  objectName 对象名
 * }
 */
router.post('/am/forms/getDetailsInfo', async function (req, res) {
    try {
        const { objectName } = req.body;
        if (!objectName) {
            throw new Error('缺少参数: objectName。');
        }
        const obj = objectql.getObject(objectName);
        const detailsInfo = await obj.getDetailsInfo();
        res.status(200).send({ success: true, detailsInfo });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message })
    }
})

/**
 * 从对象选择字段后，表单生成对应字段
 * 根据字段名，有则更新无则新增
 * 不包括表格字段
 * body {
 *  instance_fields 对象字段数组
 *      [{
 *          field_name 字段名
 *          is_required 是否必填
 *      }]
 *  instance_table_fields 对象子表数组
 *      [{
 *          detail_field_fullname 子表名称 格式： 子表名.子表中主子表字段名
 *          label 显示标题
 *          field_names 子表字段名数组
 *      }]
 *  object_name 对象名
 *  formId 表单ID
 * }
 */
router.post('/am/forms/addFieldsFromObject', async function (req, res) {
    try {
        const { instance_fields = [], instance_table_fields = [], object_name, formId } = req.body;
        const formObj = objectql.getObject('forms');
        const owObj = objectql.getObject('object_workflows');
        const flowObj = objectql.getObject('flows');
        const formDoc = await formObj.findOne(formId);
        const obj = objectql.getObject(object_name);
        const objConfig = await obj.toConfig();

        let updatedForms = [];
        let updatedFlows = [];
        let userId = req.user.userId;
        let fields = designerManager.transformObjectFields(instance_fields, objConfig.fields);
        const formFieldsMap = await designerManager.transformObjectFieldsToFormFields(fields);
        const fFields = Object.values(formFieldsMap);

        const tables = await designerManager.transformObjectDetailFieldsToFormTableFields(instance_table_fields)

        formDoc.current.fields = fFields.concat(tables);
        await designerManager.updateForm(formDoc._id, formDoc, updatedForms, updatedFlows, userId);
        // 重新设置流程开始节点的字段编辑权限为可编辑
        await designerManager.updateStartStepPermission(updatedFlows[0], updatedForms[0].current.fields);

        // 更新对象流程映射
        const flowDoc = (await flowObj.find({ filters: [['form', '=', formId]] }))[0];
        const objectName = flowDoc.object_name;
        const flowId = flowDoc._id;
        const owDoc = (await owObj.find({ filters: [['object_name', '=', objectName], ['flow_id', '=', flowId]] }))[0];
        if (owDoc) {
            let fieldMap = []
            for (const f of fFields) {
                fieldMap.push({
                    object_field: f.code,
                    workflow_field: f.code
                });
            }
            for (const t of tables) {
                for (const f of t.fields) {
                    const ofCode = `${t.code}.${f.code.split(t.code + '_')[1]}`;
                    const wfCode = `${t.code}.${f.code}`;
                    fieldMap.push({
                        object_field: ofCode,
                        workflow_field: wfCode
                    });
                }
            }
            await owObj.directUpdate(owDoc._id, {
                field_map_back: fieldMap,
                field_map: fieldMap
            });
            await flowObj.directUpdate(flowId, {
                instance_fields, instance_table_fields
            })
        }


        res.status(200).send({ success: true, message: 'router is ok' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})



exports.designerRouter = router;
