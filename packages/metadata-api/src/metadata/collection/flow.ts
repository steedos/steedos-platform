import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';
import { ObjectId } from "mongodb";

const _ = require('underscore')

const _forms = "forms";
const _flows = "flows";
const _instances = "instances";
const _records = "records";
const _company = "company";
const _organizations = "organizations";
const _space_users = "space_users";
const _categories = "categories";
const _instance_number_rules = "instance_number_rules";
const _flow_roles = "flow_roles";
const _roles = "roles";
const _object_workflows = "object_workflows";
const metadata_name = TypeInfoKeys.Flow;

export async function flowsFromDb(dbManager, flowList, steedosPackage) {

    if (flowList.length == 1 && flowList[0] == '*') {
        var dbFlows = await getAllFlows(dbManager);
        steedosPackage[metadata_name] = dbFlows;
    } else {

        for (var i = 0; i < flowList.length; i++) {

            var flowName = flowList[i];

            var dbFlow = await getFlowByApiName(dbManager, flowName);
            if (!steedosPackage[metadata_name]) {
                steedosPackage[metadata_name] = {}
            }
            steedosPackage[metadata_name][flowName] = dbFlow;
        }
    }

}

async function getAllFlows(dbManager) {

    var res = {};

    var dbFlows = await dbManager.findWithProjection(_flows, { api_name: { $ne: null } }, { form: 1 });
    for (var i = 0; i < dbFlows.length; i++) {
        var dbFlow = dbFlows[i];
        var exportFlow: any = await exportByFlow(dbManager, dbFlow)
        let api_name = exportFlow.flows[0].api_name
        exportFlow.api_name = api_name
        res[api_name] = exportFlow;
    }

    return res;
}

async function getFlowByApiName(dbManager, formName) {
    const filter = {
        api_name: formName
    }
    var dbFlow = await dbManager.findOneWithProjection(_flows, filter, { form: 1 });
    var exportFlow: any = await exportByFlow(dbManager, dbFlow)
    let api_name = exportFlow.flows[0].api_name
    exportFlow.api_name = api_name
    return exportFlow
}

async function exportByFlow(dbManager, flow) {

    return await steedosExportForm(dbManager, flow.form);
}

async function steedosExportForm(dbManager, formId, flowId?, is_copy?, company_id?) {

    let form = await dbManager.findOneWithProjection(_forms, { _id: formId }, { historys: 0 });

    if (!form) {
        return {}
    }


    form.historys = []

    if (form?.category) {
        let category = await dbManager.findOneWithProjection(_categories, { _id: form.category }, { name: 1 });

        if (category?.name) {
            form.category_name = category.name
        }
    }

    let _getNumberRuleName = async (str) => {
        if (_.isString(str) && str?.indexOf("auto_number(") > -1) {
            str = str.replace("auto_number(", "").replace(")", "").replace("\"", "").replace("\"", "").replace("\'", "").replace("\'", "")
            return str
        }
        return;
    }

    let instance_number_rules = new Array()


    if (form.current) {

        let fields = new Array()

        let c_fields = form.current.fields

        if (c_fields) {
            for (let f of c_fields) {
                if (f.type == 'table') {
                    console.log('ignore table field')
                } else if (f.type == 'section') {
                    if (f && f.fields) {
                        for (let f1 of f.fields) {
                            fields.push(f1)
                        }
                    }
                } else {
                    fields.push(f)
                }
            }
        }

        let _getFieldNumberRule = async (spaceId, instance_number_rules, str) => {

            let number_rule_name = await _getNumberRuleName(str)

            if (number_rule_name) {
                let number_rule = await dbManager.findOneWithProjection(_instance_number_rules, { space: spaceId, name: number_rule_name }, { _id: 1, name: 1, year: 1, first_number: 1, rules: 1 })
                if (!number_rule) {
                    throw new Error('not find instance number rule, name is ' + number_rule_name);
                }
                number_rule.number = 0

                if (!_.where(instance_number_rules, { _id: number_rule._id })) {
                    //!instance_number_rules.findPropertyByPK("_id", number_rule._id)

                    delete number_rule._id
                    instance_number_rules.push(number_rule)
                }

            }

            return instance_number_rules
        }


        for (let f of fields) {
            await _getFieldNumberRule(form.space, instance_number_rules, f.default_value)

            await _getFieldNumberRule(form.space, instance_number_rules, f.formula)
        }
    }


    form.instance_number_rules = instance_number_rules

    form.flows = await _getFlowByForm(dbManager, formId, flowId, is_copy, company_id)

    return form

}

async function _getFlowByForm(dbManager, form, flowId?, is_copy?, company_id?) {
    let query: any = { form: form }

    if (flowId) {
        query._id = flowId
    }

    // let fields = {history: 0}

    let flows = await dbManager.findWithProjection(_flows, query, { history: 0 });

    for (let flow of flows) {
        flow.historys = []
        flow.object_workflows = await dbManager.findWithProjection(_object_workflows, { flow_id: flow._id }, { name: 1, object_name: 1, flow_id: 1, field_map: 1, field_map_back: 1, field_map_script: 1, field_map_back_script: 1, sync_attachment: 1, sync_type: 1, sync_direction: 1 });
        if (!is_copy || (!company_id && flow.company_id) || (company_id && !flow.company_id) || (company_id != flow.company_id)) {
            if (flow.current.steps) {

                for (let step of flow.current.steps) {
                    let roles_name = []
                    let roles_api_name = []
                    if (!_.isEmpty(step.approver_roles)) {
                        let roles = await dbManager.findWithProjection(
                          _flow_roles,
                          { _id: { $in: step.approver_roles } },
                          { name: 1, api_name: 1 }
                        );
                        roles_name = _.pluck(roles, 'name');
                        roles_api_name = _.pluck(roles, 'api_name');
                    }

                    step.approver_roles_name = roles_name
                    step.approver_roles_api_name = roles_api_name

                    let hr_roles_name = []
                    let hr_roles_api_name = []
                    if (!_.isEmpty(step.approver_hr_roles)) {
                        let hr_roles = await dbManager.findWithProjection(_roles, { _id: { $in: step.approver_hr_roles } }, { name: 1, api_name: 1 });
                        hr_roles_name = _.pluck(hr_roles, 'name');
                        hr_roles_api_name = _.pluck(hr_roles, 'api_name');
                    }
                    step.approver_hr_roles_name = hr_roles_name
                    step.approver_hr_roles_api_name = hr_roles_api_name
                }
            }
        }
    }
    return flows;
}

export async function flowsToDb(dbManager, forms, enabled = false) {

    for (const formName in forms) {
        var form = forms[formName];
        // delete form.api_name

        let options: any = {}

        const userSession = dbManager.getUserSession()
        let spaceId = userSession.spaceId
        let uid = userSession.userId
        let company_id = userSession.company_id
        let flowApiName = form.api_name
        delete form.api_name;

        if (flowApiName) {
            let flow = await dbManager.findOneWithProjection(_flows, { api_name: flowApiName }, { form: 1 })
            if(flow){
                options.flowId = flow._id
                options.upgrade = true
                if (!flow) {
                   
                } else {
                    options.formId = flow.form
                }
            }
        }

        let new_flowIds = await steedosImportWorkflow(dbManager, uid, spaceId, form, enabled, company_id, options);

    }
}

async function steedosImportWorkflow(dbManager, uid, spaceId, form, enabled, company_id, options) {

    let upgrade = options?.upgrade || false
    let upgradeFormId = options?.formId
    let upgradeFlowId = options?.flowId

    if (_.isEmpty(form)) {
        throw new Error("无效的json data")
    }

    if (company_id) {
        if (await dbManager.find(_company, { _id: company_id }).length == 0) {
            throw new Error("无效的字段: company_id")
        }
    }

    // if (form?.flows) {
    //     for(let flow of form.flows){
    //         if (flow.object_workflows) {
    //             for(let _ow of flow.object_workflows){
    //                 await checkObjectWorkflow(spaceId, _ow.object_name, _ow)
    //             }
    //         }
    //     }
    // }

    let new_form_ids = new Array()

    let new_flow_ids = new Array()

    try {
        if (form?.category_name) {
            let category = await dbManager.findOneWithProjection(_categories, { name: form.category_name }, { _id: 1 })

            if (_.isEmpty(category)) {
                let category_id = new ObjectId().toHexString();
                let new_category: any = {
                    _id: category_id,
                    name: form.category_name,
                    space: spaceId,
                    created: new Date(),
                    created_by: uid,
                    modified: new Date(),
                    modified_by: uid,
                    owner: uid
                }
                if (company_id) {
                    new_category.company_id = company_id
                    new_category.company_ids = [company_id]
                }
                await dbManager.insert(_categories, new_category, false);
                form.category = category_id
            } else {
                form.category = category._id
            }

            delete form.category_name
        }

        if (form?.instance_number_rules) {
            for (let nr of form.instance_number_rules) {
                try {
                    let rules = await dbManager.findOne(_instance_number_rules, { "name": nr.name })

                    if (!rules) {
                        nr.space = spaceId
                        nr._id = new ObjectId().toHexString();
                        nr.created = new Date()
                        nr.created_by = uid
                        nr.modified = new Date()
                        nr.modified_by = uid
                        delete nr.company_id
                        delete nr.company_ids
                        if (company_id) {
                            nr.company_id = company_id
                            nr.company_ids = [company_id]
                        }
                        await dbManager.insert(_instance_number_rules, nr, false);
                    }
                } catch (e) {
                    console.log("steedosImport.workflow", e)
                }
            }
        }

        let form_id = new ObjectId().toHexString();

        let flows = form.flows

        delete form.flows

        form._id = form_id

        form.space = spaceId
        if (enabled) {
            form.state = 'enabled'
            form.is_valid = true //直接启用的表单设置is valid值为true
        } else {
            form.state = 'disabled' //设置状态为 未启用
            form.is_valid = true //设置已验证为 true , 简化用户操作
        }

        form.created = new Date()

        form.created_by = uid

        form.modified = form.created

        form.modified_by = uid

        form.historys = []

        form.current._id = new ObjectId().toHexString();

        form.current._rev = 1 //重置版本号

        form.current.form = form_id

        form.current.created = new Date()

        form.current.created_by = uid

        form.current.modified = new Date()

        form.current.modified_by = uid

        delete form.company_id
        delete form.company_ids
        if (company_id) {
            form.company_id = company_id
            form.company_ids = [company_id]
        }

        form.import = true

        form.owner = uid

        if (upgrade) {
            await upgradeForm(dbManager, upgradeFormId, form, uid, spaceId)
        } else {
            await dbManager.insert(_forms, form, false)
            new_form_ids.push(form_id)
        }

        for (let flow of flows) {

            let flowObjectWorkflows = flow.object_workflows
            delete flow.object_workflows
            let flow_id = new ObjectId().toHexString();

            flow._id = flow_id

            flow.form = form_id

            flow.category = form.category

            if (enabled) {
                flow.state = 'enabled'
                flow.is_valid = true //直接启用的流程设置is valid值为true
            } else {
                flow.state = 'disabled' //设置状态为 未启用
                flow.is_valid = true
            }

            flow.current_no = 0 //重置编号起始为0

            flow.created = new Date()

            flow.created_by = uid

            flow.modified = flow.created

            flow.modified_by = uid

            delete flow.company_id
            delete flow.company_ids

            if (company_id) {
                flow.company_id = company_id
                flow.company_ids = [company_id]
            }
            //跨工作区导入时，重置流程权限perms
            if (flow.perms && flow.space == spaceId) {
                let perms: any = {
                    _id: new ObjectId().toHexString(),
                    users_can_add: [],
                    //orgs_can_add: orgs_can_add,
                    orgs_can_add: [],
                    users_can_monitor: [],
                    orgs_can_monitor: [],
                    users_can_admin: [],
                    orgs_can_admin: []
                }

                let users_can_add = perms.users_can_add
                let orgs_can_add = perms.orgs_can_add

                let users_can_monitor = perms.users_can_monitor
                let orgs_can_monitor = perms.orgs_can_monitor

                let users_can_admin = perms.users_can_admin
                let orgs_can_admin = perms.orgs_can_admin

                if (!_.isEmpty(users_can_add)) {
                    perms.users_can_add = _.pluck(await dbManager.findWithProjection(_space_users, { user: { $in: users_can_add } }, { user: 1 }), 'user');
                }

                if (!_.isEmpty(orgs_can_add)) {
                    perms.orgs_can_add = _.pluck(await dbManager.findWithProjection(_organizations, { _id: { $in: orgs_can_add } }, { _id: 1 }).fetch(), '_id');
                    if (_.isEmpty(perms.orgs_can_add)) {
                        if (company_id) {
                            perms.orgs_can_add = [company_id]
                        } else {
                            perms.orgs_can_add = _.pluck(await dbManager.findWithProjection(_organizations, {
                                // space: spaceId,
                                parent: null
                            }, { _id: 1 }), "_id");
                        }
                    }
                }

                if (!_.isEmpty(users_can_monitor)) {
                    perms.users_can_monitor = _.pluck(await dbManager.findWithProjection(_space_users, { user: { $in: users_can_monitor } }, { user: 1 }), 'user');
                }
                if (!_.isEmpty(orgs_can_monitor)) {
                    perms.orgs_can_monitor = _.pluck(await dbManager.findWithProjection(_organizations, { _id: { $in: orgs_can_monitor } }, { _id: 1 }), '_id');
                }

                if (!_.isEmpty(users_can_admin)) {
                    perms.users_can_monitor = _.pluck(await dbManager.findWithProjection(_space_users, { user: { $in: users_can_admin } }, { user: 1 }), 'user');
                }
                if (!_.isEmpty(orgs_can_admin)) {
                    perms.orgs_can_monitor = _.pluck(await dbManager.findWithProjection(_organizations, { _id: { $in: orgs_can_admin } }, { _id: 1 }), '_id');
                }


            } else if (!flow.perms || flow.space != spaceId) {
                let orgs_can_add: any = []
                if (company_id) {
                    orgs_can_add = [company_id]
                } else {
                    orgs_can_add = _.pluck(await dbManager.findWithProjection(_organizations, {
                        // space: spaceId,
                        parent: null
                    }, { _id: 1 }), "_id");
                }
                //设置提交部门为：全公司
                let perms = {
                    _id: new ObjectId().toHexString(),
                    users_can_add: [],
                    orgs_can_add: orgs_can_add,
                    users_can_monitor: [],
                    orgs_can_monitor: [],
                    users_can_admin: [],
                    orgs_can_admin: [],
                }

                flow.perms = perms
            }

            flow.space = spaceId

            flow.current._id = new ObjectId().toHexString();

            flow.current.flow = flow_id

            flow.current._rev = 1 //重置版本

            flow.current.form_version = form.current._id

            flow.current.created = new Date()

            flow.current.created_by = uid

            flow.current.modified = new Date()

            flow.current.modified_by = uid

            if (flow.current && flow.current.steps) {
                for (let step of flow.current.steps) {

                    if (_.isArray(step.approver_users)) {
                        let _accepted_approve_users: any = [];
                        for (let uid of step.approver_users) {
                            if (await dbManager.findOne(_space_users, { user: uid, user_accepted: true })) {
                                _accepted_approve_users.push(uid);
                            }
                        }
                        step.approver_users = _accepted_approve_users;
                    }

                    if (_.isArray(step.approver_orgs)) {
                        let _accepted_approver_orgs: any = [];
                        for (let oid of step.approver_orgs) {
                            if (await dbManager.findOne(_organizations, { _id: oid })) {
                                _accepted_approver_orgs.push(oid);
                            }
                        }
                        step.approver_orgs = _accepted_approver_orgs;
                    }

                    if (_.isEmpty(step.approver_roles_name)) {
                        delete step.approver_roles_name
                        if (_.isEmpty(step.approver_roles)) {
                            step.approver_roles = []
                        }
                        if (!_.isEmpty(step.approver_hr_roles_name)) {
                            let approver_hr_roles = new Array()
                            let _hr_index = 0;
                            for (let role_name of step.approver_hr_roles_name) {
                                let role_query = { name: role_name }
                                let role = await dbManager.findOneWithProjection(_roles, role_query, { _id: 1 })
                                if (_.isEmpty(role)) {
                                    // let role_id = db.roles._makeNewID()
                                    let role_id = new ObjectId().toHexString();
                                    let apiName = "";
                                    try {
                                        apiName = step.approver_hr_roles_api_name[_hr_index]
                                    } catch (error) {
                                        
                                    }
                                    let role = {
                                        _id: role_id,
                                        name: role_name,
                                        api_name: apiName,
                                        // space: spaceId,
                                        created: new Date(),
                                        created_by: uid,
                                        modified: new Date(),
                                        modified_by: uid,
                                        owner: uid,
                                    }

                                    await dbManager.insert(_roles, role, false)

                                    approver_hr_roles.push(role_id)
                                } else {
                                    approver_hr_roles.push(role._id)
                                }
                                _hr_index ++ ;
                            }

                            step.approver_hr_roles = approver_hr_roles

                            delete step.approver_roles_name
                        }
                    } else {
                        let approve_roles = new Array();
                        let approveRolesByIds = [];
                        if (_.isArray(step.approver_roles) && !_.isEmpty(step.approver_roles)) {
                            approveRolesByIds = await dbManager.findWithProjection(_flow_roles, { _id: { $in: step.approver_roles } }, { _id: 1, name: 1, company_id: 1 })
                        }
                        for (let _index = 0; _index < step.approver_roles_name.length; _index++) {
                            let role_name = step.approver_roles_name[_index];
                            let roleApiName = step.approver_roles_api_name[_index];
                            let approveRoleById = _.find(approveRolesByIds, (_role) => {
                                return _role._id == step.approver_roles[_index]
                            });
                            let flow_role_query: any = { name: role_name }
                            if ((!approveRoleById && company_id) || (approveRoleById?.company_id && company_id)) {
                                flow_role_query.company_id = company_id
                            } else {
                                flow_role_query.company_id = { $exists: false }
                            }
                            let role = await dbManager.findOneWithProjection(_flow_roles, flow_role_query, { _id: 1 })
                            if (_.isEmpty(role)) {
                                // role_id = db.flow_roles._makeNewID()
                                let role_id = new ObjectId().toHexString();
                                let role: any = {
                                    _id: role_id,
                                    name: role_name,
                                    api_name: roleApiName,
                                    // space: spaceId,
                                    created: new Date(),
                                    created_by: uid,
                                    modified: new Date(),
                                    modified_by: uid,
                                    owner: uid
                                }

                                if (company_id) {
                                    role.company_id = company_id
                                    role.company_ids = [company_id]
                                }
                                await dbManager.insert(_flow_roles, role, false)

                                approve_roles.push(role_id)
                            } else {
                                approve_roles.push(role._id)
                            }
                        }
                        step.approver_roles = approve_roles

                        delete step.approver_roles_name
                    }
                }

                flow.import = true

                flow.owner = uid

                if (upgrade) {
                    await upgradeFlow(dbManager, flow, uid, upgradeFlowId)
                    for (let _objectWorkflow of flowObjectWorkflows) {
                        await steedosImportObjectWorkflow(dbManager, spaceId, upgradeFlowId, _objectWorkflow.object_name, _objectWorkflow)
                    }
                } else {
                    // db.flows._check(spaceId);
                    await dbManager.insert(_flows, flow, false)
                    new_flow_ids.push(flow_id)
                    for (let _objectWorkflow of flowObjectWorkflows) {
                        await steedosImportObjectWorkflow(dbManager, spaceId, flow_id, _objectWorkflow.object_name, _objectWorkflow)
                    }
                }
            }

        }
        return new_flow_ids;
    } catch (e) {

        // 已经有事务了
        // _.each(new_form_ids, (id)=>{
        // 	dbManager.delete(_forms, {_id: id})
        // });

        // _.each(new_flow_ids, (id)=>{
        // 	dbManager.delete(_flows, {_id: id})
        // });
        throw e;
    }

}

// async function checkObjectWorkflow(spaceId, objectName, doc) {

//     let _obj;

//     try {
//         _obj = getObject(objectName);
//     } catch (err) {
//         if (!_obj) {
//             throw new Error(`import_flows_error_not_find_object ${objectName}`);
//         }
//     }

//     let _objconfig = _obj.toConfig();
//     if (!_objconfig.enable_workflow) {
//         throw new Error(`import_flows_error_not_allow_enable_workflow ${_objconfig.name}`);
//     }

//     let fileds = _objconfig.fields
//     let allowValues = _.pluck(getObjectLookupFieldOptions(objectName, true, false, true), 'value');
//     // let allowValues = [];
//     let objectField = _.pluck(doc.field_map, "object_field");
//     let diff = _.difference(objectField, allowValues);
//     if (diff.length > 0) {
//         throw new Error(`import_flows_error_not_find_fields ${diff.join(",")}`);
//     }
//     let objectFieldBack = _.pluck(doc.field_map_back, "object_field");
//     let diff1 = _.difference(objectFieldBack, allowValues);
//     if (diff1.length > 0) {
//         throw new Error(`import_flows_error_not_find_fields ${diff1.join(",")}`);
//     }

// }

async function upgradeFlowByForm(dbManager, flow, formVersionId, options) {
    // flowCollection = Creator.getCollection('flows');
    let up = false;
    let now = options.now
    let currentUserId = options.currentUserId
    let spaceId = options.spaceId

    let instances = await dbManager.find(_instances, {
        // space: spaceId,
        'flow': flow._id,
        'flow_version': flow.current._id
    });

    if (instances.length>0) {
        up = true;
    }

    let flowUpdateObj: any = {
        $set: {}
    };

    if (up == true && flow.current.start_date) {

        flowUpdateObj.$push = {
            'historys': flow.current
        };

        let flowCurrent: any = {
            '_id': new ObjectId().toHexString(),
            'created': now,
            'created_by': currentUserId,
            'steps': flow.current.steps,
            '_rev': flow.current._rev + 1,
            'flow': flow._id,
            'form_version': formVersionId,
            'modified': now,
            'modified_by': currentUserId
        };

        if (flow.state == "enabled") {
            flowCurrent.start_date = now;
        }
        flowUpdateObj.$set['current'] = flowCurrent;
    } else {
        flowUpdateObj.$set = {
            'current.form_version': formVersionId,
            'current.modified': now,
            'current.modified_by': currentUserId
        }
    }

    flowUpdateObj.$set['modified'] = now;
    flowUpdateObj.$set['modified_by'] = currentUserId;
    await dbManager.directUpdate(_flows, { _id: flow._id }, flowUpdateObj);

}

async function upgradeForm(dbManager, formId, form, currentUserId, spaceId) {

    // formCollection = Creator.getCollection('forms');
    // flowCollection = Creator.getCollection('flows');
    let ff = await dbManager.findOne(_forms, { _id: formId });

    if (!ff) {
        throw new Error("无效的formId");
    }

    spaceId = ff.space;
    let now = new Date();
    let current: any = {};
    let formUpdateObj: any = {};

    let pass = false;

    // 根据APP 判断表单当前版本是否走过申请单 或者 records
    if (ff.app == 'workflow') {
        let instances = await dbManager.find(_instances, {
            // space: spaceId,
            'form': formId,
            'form_version': ff['current']['_id']
        });

        let insCount = instances.length
        if (insCount > 0) {
            pass = true
        }
    } else if (ff.app == 'creator') {
        let records = await dbManager.find(_records, {
            // space: spaceId,
            'form': formId,
            'form_version': form['current']['_id']
        });
        let recordsCount = records.length
        if (recordsCount > 0) {
            pass = true;
        }
    }
    if (pass == true && ff["current"]["start_date"]) {
        formUpdateObj.$push = {
            'historys': ff["current"]
        };
        // current._id = formCollection._makeNewID();
        current._id = new ObjectId().toHexString();
        current._rev = ff["current"]["_rev"] + 1;
        current.created = now;
        current.created_by = currentUserId;

        if (ff.state == 'enabled') {
            current.start_date = now;
        }
        let flows = await dbManager.find(_flows, { form: formId });
        for (let flow of flows) {
            await upgradeFlowByForm(dbManager, flow, current._id, { now: now, currentUserId: currentUserId, spaceId: spaceId })
        }

    } else {
        current = ff.current;
    }

    current.modified = now;
    current.modified_by = currentUserId;
    current.form = formId;
    current.fields = _formatFieldsID(form["current"]["fields"]);
    current.form_script = form["current"]["form_script"];
    current.name_forumla = form["current"]["name_forumla"];

    formUpdateObj.$set = {
        'current': current,
        'name': form["name"],
        'modified': now,
        'modified_by': currentUserId,
        'is_valid': form["is_valid"],
        'description': form["description"],
        'help_text': form["help_text"],
        'error_message': form["error_message"],
        'category': form["category"],
        'instance_style': form["instance_style"]
    }

    await dbManager.directUpdate(_forms, {_id: formId }, formUpdateObj);
}


function _formatFieldsID(fields) {
    for (let f of fields) {
        if (!f._id && f.id) {
            f._id = f.id;
            delete f.id;
            if (f.type == 'section' || f.type == 'table') {
                _formatFieldsID(f.fields);
            }
        }
    }
    return fields;
}

async function steedosImportObjectWorkflow(dbManager, spaceId, flowId, objectName, doc) {

    delete doc._id
    let oldDoc = await dbManager.findOne(_object_workflows, { flow_id: flowId, object_name: objectName })
    if (oldDoc) {
        await dbManager.directUpdate(_object_workflows, { _id: oldDoc._id }, { $set: Object.assign({}, doc, { flow_id: flowId, object_name: objectName }) })
    } else {
        await dbManager.insert(_object_workflows, Object.assign({}, doc, { flow_id: flowId, object_name: objectName }), true)
    }
}

async function upgradeFlow(dbManager, flowCome, userId, flowId) {

    let now = new Date();
    // flowCollection = Creator.getCollection('flows');
    // formCollection = Creator.getCollection('forms');
    let flow = await dbManager.findOne(_flows, { _id: flowId });
    let spaceId = flow.space

    // 某步骤被删除后，删除同流程的“指定历史步骤”属性中被引用的步骤id（仅限于流程的最新版)
    let clientStepIds: any = []

    _.each(flowCome['current']['steps'], (step) => {
        clientStepIds.push(step['_id']);
    })

    _.each(flowCome['current']['steps'], (step) => {
        if (step['approver_step']) {
            if (!_.contains(clientStepIds, step['approver_step'])) { //clientStepIds.includes(step['approver_step'])
                step['approver_step'] = '';
            }
        }
    })

    // 流程升级
    // 由于前台后台posx posy timeout_hours字段类型不一致会导致流程升级 所以在这里统一转为后台Float类型 便于比较
    _.each(flowCome['current']['steps'], (st) => {
        st['posx'] = parseFloat(st['posx']);
        st['posy'] = parseFloat(st['posy']);
        if (st['timeout_hours']) {
            st['timeout_hours'] = parseFloat(st['timeout_hours']);
        }

    })

    // 由于前台传的是id而非_id，故比较时将id转为_id
    _.each(flowCome['current']['steps'], (step) => {
        if (step['id']) {
            step['_id'] = step['id'];
            delete step['id'];
        }
        if (step['lines']) {
            _.each(step['lines'], (line) => {
                if (line['id']) {
                    line['_id'] = line['id'];
                    delete line['id'];
                }
            })
        }
    })

    let stepsStr = JSON.stringify(flow['current']['steps']);
    let flowComeStepsStr = JSON.stringify(flowCome['current']['steps']);
    let pass = false;
    let updateObj: any = {
        $set: {}
    };

    let instances = await dbManager.find(_instances, {
        // space: spaceId,
        'flow': flowId,
        'flow_version': flow.current._id
    });

    let insCount = instances.length
    if (insCount > 0) {
        pass = true;
    }

    if (pass == true && flow.current.start_date && stepsStr == flowComeStepsStr) {
        updateObj.$push = {
            'historys': flow.current
        };
        let current = {
            // '_id': flowCollection._makeNewID(),
            '_id': new ObjectId().toHexString(),
            'modified': now,
            'modified_by': userId,
            'created': now,
            'created_by': userId,
            'steps': flowCome['current']['steps'],
            'form_version': flow.current.form_version,
            '_rev': flow.current._rev,
            'flow': flowId,
        };

        if (flow.state == 'enabled')
            current['start_date'] = now;

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

    let form = await dbManager.findOneWithProjection(_forms, { _id: flow.form }, {category: 1});
    updateObj.$set.category = form['category'];

    await dbManager.directUpdate(_flows, { _id: flowId }, updateObj);

}

// function getObjectLookupFieldOptions(object_name, is_deep, is_skip_hide, is_related){

// 	let _options:any = []
// 	if (!object_name){
// 		return _options
//     }
// 	let _object = Creator.getObject(object_name)
// 	let fields = _object?.fields
// 	let icon = _object?.icon
// 	_.each (fields, (f, k)=>{
// 		if (is_skip_hide && f.hidden){
// 			return
//         }
// 		if (f.type == "select"){
// 			_options.push ({label: "#{f.label || k}", value: "#{k}", icon: icon})
//         }
// 		else
// 			_options.push ({label: f.label || k, value: k, icon: icon})
//     })
// 	if (is_deep){
// 		_.each (fields, (f, k)=>{
// 			if( is_skip_hide && f.hidden){
// 				return
//             }
// 			if ((f.type == "lookup" || f.type == "master_detail") && f.reference_to && _.isString(f.reference_to)){
// 				// 不支持f.reference_to为function的情况，有需求再说
// 				let r_object = Creator.getObject(f.reference_to)
// 				if (r_object){

//                 }
// 					_.each (r_object.fields, (f2, k2)=>{
// 						_options.push ({label: "#{f.label || k}=>#{f2.label || k2}", value: "#{k}.#{k2}", icon: r_object?.icon})
//                 })
//             }
//         })
//     }
// 	if (is_related){
// 		let relatedObjects = Creator.getRelatedObjects(object_name)
// 		_.each (relatedObjects, (_relatedObject)=>{
// 			let relatedOptions = Creator.getObjectLookupFieldOptions(_relatedObject.object_name, false, false, false)
// 			let relatedObject = Creator.getObject(_relatedObject.object_name)
// 			_.each (relatedOptions, (relatedOption)=>{
// 				if (_relatedObject.foreign_key != relatedOption.value){
// 					_options.push ({label: "#{relatedObject.label || relatedObject.name}=>#{relatedOption.label}", value: "#{relatedObject.name}.#{relatedOption.value}", icon: relatedObject?.icon})
//                 }
//             });
//         });
//     }
// 	return _options
// }