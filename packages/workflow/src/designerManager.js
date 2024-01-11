"use strict";
// @ts-check
const _ = require('underscore');
const objectql = require("@steedos/objectql");
const steedosSchema = objectql.getSteedosSchema();
const Fiber = require('fibers');

async function getByAdminSpaceIds(spaceIds, companyId, isCompanyAdmin) {
    let filters = _makeInFilters('space', spaceIds);
    let spaceFilters = filters;
    if (isCompanyAdmin && companyId) {
        filters = `(${filters}) and ((company_id eq '${companyId}') or (company_id eq null))`;
    }
    let userIds = [];
    let spaceUsers = [];

    spaceUsers = await steedosSchema.getObject('space_users').find({
        filters: spaceFilters,
        fields: ['name', 'email', 'space', 'organization', 'organizations', 'user', 'user_accepted', 'company_id']
    })
    userIds = _.pluck(spaceUsers, 'user');
    let users = await new Promise(function (resolve, reject) {
        Fiber(function () {
            try {
                let result = Creator.getCollection('users').find({
                    _id: {
                        $in: userIds
                    }
                }, {
                    fields: {
                        'photo': 1,
                        'google_id': 1,
                        'imo_uid': 1,
                        'company': 1,
                        'name': 1,
                        'locale': 1,
                        'steedos_id': 1,
                        'primary_email_verified': 1,
                        'is_paid_user': 1,
                        'mobile': 1,
                        'email': 1,
                        'created': 1,
                        'modified': 1,
                        'created_by': 1,
                        'modified_by': 1,
                        'email_notification': 1,
                        'qq_open_id': 1
                    }
                }).fetch();
                resolve(result);
            } catch (error) {
                reject(error)
            }
        }).run()
    })

    let forms = await steedosSchema.getObject('forms').find({
        filters: filters,
        fields: ['name', 'state', 'is_deleted', 'is_valid', 'space', 'description', 'help_text', 'created', 'created_by', 'error_message', 'current', 'enable_workflow', 'enable_view_others', 'app', 'category', 'is_subform', 'instance_style', 'company_id']
    })
    let flows = await steedosSchema.getObject('flows').find({
        filters: filters,
        fields: ['name', 'name_formula', 'code_formula', 'space', 'description', 'is_valid', 'form', 'flowtype', 'state', 'is_deleted', 'created', 'created_by', 'help_text', 'current_no', 'current', 'perms', 'error_message', 'app', 'distribute_optional_users', 'company_id']
    })
    let roles = await steedosSchema.getObject('flow_roles').find({
        filters: filters
    });
    let organizations = await steedosSchema.getObject('organizations').find({
        filters: spaceFilters
    });
    let positions = await steedosSchema.getObject('flow_positions').find({
        filters: filters
    });
    let categories = await steedosSchema.getObject('categories').find({
        filters: _makeInFilters('space', spaceIds)
    });

    let hrRoles = await steedosSchema.getObject('roles').find({
        filters: filters
    })

    if (_.isArray(roles)) {
        for (let role of roles) {
            if (role && role.company_id) {
                let company = await steedosSchema.getObject('company').findOne(role.company_id, { fields: ['name'] }) //, 'abbreviation'
                if (company && (company.name || company.abbreviation)) {
                    role.name = `${role.name} (${company.abbreviation || company.name})`
                }
            }
        }
    }

    return {
        SpaceUsers: spaceUsers,
        Users: users,
        Forms: forms,
        Flows: flows,
        Organizations: organizations,
        Positions: positions,
        Roles: roles,
        Categories: categories,
        HrRoles: hrRoles
    }
}


async function checkSpaceUserBeforeUpdate(spaceId, userId, roles) {
    let space = await steedosSchema.getObject('spaces').findOne(spaceId);
    if (!space) {
        throw new Error('该工作区不存在或已经被删除');
    }

    if (space.admins.includes(userId)) {
        return true;
    }

    let spaceUser = (await steedosSchema.getObject('space_users').find({
        filters: `(space eq '${spaceId}') and (user eq '${userId}')`
    }))[0];

    if (!spaceUser) {
        throw new Error('该用户不存在于该工作区中');
    }

    if (!roles.includes('workflow_admin')) { // 校验是否是单位管理员
        throw new Error('该用户无操作权限');
    }
};

// 更新表单，包括子表
async function updateForm(formId, form, forms, flows, currentUserId) {
    await new Promise(function (resolve, reject) {
        Fiber(function () {
            try {
                let formCollection = Creator.getCollection('forms');
                let flowCollection = Creator.getCollection('flows');
                let ff = formCollection.findOne(formId);
                let spaceId = ff.space;
                let now = new Date();
                let current = {};
                let formUpdateObj = {};


                let pass = false;
                // 根据APP 判断表单当前版本是否走过申请单 或者 records
                if (ff.app === 'workflow') {
                    let insCount = Creator.getCollection('instances').find({
                        space: spaceId,
                        form: formId,
                        'form_version': form['current']['id']
                    }).count();
                    if (insCount > 0) {
                        pass = true;
                    }
                } else if (ff.app === 'creator') {
                    let recordsCount = Creator.getCollection('records').find({
                        space: spaceId,
                        form: formId,
                        'form_version': form['current']['id']
                    }).count();
                    if (recordsCount > 0) {
                        pass = true;
                    }
                }

                if (pass === true && ff["current"]["start_date"]) { // 升级表单
                    formUpdateObj.$push = {
                        'historys': ff["current"]
                    };
                    current._id = formCollection._makeNewID();
                    current._rev = ff["current"]["_rev"] + 1;
                    current.created = now;
                    current.created_by = currentUserId;
                    if (ff.state === 'enabled') {
                        current.start_date = now;
                    }
                    // 更新流程版本
                    flowCollection.find({
                        form: formId
                    }).forEach(function (flow) {
                        let up = false;
                        if (Creator.getCollection('instances').find({
                            space: spaceId,
                            flow: flow._id,
                            flow_version: flow.current._id
                        }).count()) {
                            up = true;
                        }
                        let flowUpdateObj = {
                            $set: {}
                        };
                        if (up === true && flow.current.start_date) { // 升级流程

                            flowUpdateObj.$push = {
                                'historys': flow.current
                            };
                            let flowCurrent = {
                                '_id': flowCollection._makeNewID(),
                                'created': now,
                                'created_by': currentUserId,
                                'steps': flow.current.steps,
                                '_rev': flow.current._rev + 1,
                                'flow': flow._id,
                                'form_version': current._id,
                                'modified': now,
                                'modified_by': currentUserId
                            };
                            if (flow.state === "enabled") {
                                flowCurrent.start_date = now;
                            }
                            flowUpdateObj.$set['current'] = flowCurrent;
                        } else {
                            flowUpdateObj.$set = {
                                'current.form_version': current._id,
                                'current.modified': now,
                                'current.modified_by': currentUserId
                            }
                        }
                        flowUpdateObj.$set['modified'] = now;
                        flowUpdateObj.$set['modified_by'] = currentUserId;
                        flowCollection.update(flow._id, flowUpdateObj);
                        flows.push(flowCollection.findOne(flow._id));
                    })
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

                formCollection.update(formId, formUpdateObj);
                forms.push(formCollection.findOne(formId));
                resolve();
            } catch (error) {
                reject(error)
            }
        }).run()
    })

}


async function checkBeforeFlow(spaceId, formId) {
    if (await steedosSchema.getObject('spaces').count({
        filters: `(_id eq '${spaceId}')`
    }) === 0) {
        throw new Error('工作区不存在或已经被删除')
    }

    if (await steedosSchema.getObject('forms').count({
        filters: `(_id eq '${formId}')`
    }) === 0) {
        throw new Error('表单不存在')
    }
}

async function getFlow(flowId) {
    let flow = await steedosSchema.getObject('flows').findOne(flowId);
    if (!flow) {
        throw new Error('流程不存在')
    }
    return flow;
}

async function getForm(formId) {
    let form = await steedosSchema.getObject('forms').findOne(formId);
    if (!form) {
        throw new Error('表单不存在')
    }
    return form;
}

async function getSpaceUser(userId, spaceId) {
    let spaceUser = (await steedosSchema.getObject('space_users').find({
        filters: `(space eq '${spaceId}') and (user eq '${userId}')`
    }))[0];
    if (!spaceUser) {
        throw new Error('用户不属于当前工作区')
    }
    if (!spaceUser.user_accepted) {
        throw new Error('用户在当前工作区是停用状态')
    }
    return spaceUser;
}

async function isSpaceAdmin(spaceId, userId, roles) {
    let space = await steedosSchema.getObject('spaces').findOne(spaceId);
    if (!space) {
        throw new Error('未找到工作区');
    }

    if (!space.admins.includes(userId) && !roles.includes('workflow_admin')) {
        throw new Error('用户无操作权限');
    }

}

function makeSteps(userId, fields = []) {
    let flowCollection = Creator.getCollection('flows');
    let user = Creator.getCollection('users').findOne(userId);
    let language = user.locale;
    // 设置当前语言环境
    // R18n.thread_set(R18n.change(language));
    // i18n_obj = R18n.get.t;
    let blank_ayy = [];
    let stepEnd = flowCollection._makeNewID();
    let steps = [];
    let start_step = {};
    start_step._id = flowCollection._makeNewID();
    start_step.approver_orgs = blank_ayy;
    start_step.approver_roles = blank_ayy;
    start_step.approver_users = blank_ayy;
    start_step.fields_modifiable = blank_ayy;
    start_step.name = '开始';
    start_step.step_type = "start";
    start_step.posx = -1;
    start_step.posy = -1;
    let p = {};
    p["__form"] = "editable";
    for (const f of fields) {
        p[f.code] = 'editable'
        if (f.type == 'table') {
            for (const tf of (f.fields || [])) {
                p[tf.code] = 'editable';
            }
        }
    }
    start_step.permissions = p;
    let lines = [];
    let line = {};
    line._id = flowCollection._makeNewID();
    line.name = "";
    line.to_step = stepEnd;
    line.order = 1;
    line.state = "submitted";
    lines.push(line);
    start_step.lines = lines;
    steps.push(start_step);

    let end_step = {};
    end_step._id = stepEnd;
    end_step.approver_orgs = blank_ayy;
    end_step.approver_roles = blank_ayy;
    end_step.approver_users = blank_ayy;
    end_step.fields_modifiable = blank_ayy;
    end_step.lines = blank_ayy;
    end_step.name = '结束';
    end_step.step_type = "end";
    end_step.posx = -1;
    end_step.posy = -1;
    end_step.permissions = {};
    steps.push(end_step);

    return steps;
}


// TODO 由于流程设计器被简化getChangeSet方法是否有必要？
// export function getChangeSet(userId, syncToken, spaceId, companyId) {
//     let syncTokenTime = new Date(syncToken * 1000);
//     let changeSet = { sync_token: new Date().getTime() / 1000 };
//     changeSet['inserts'] = { 'Spaces': [], 'Users': [], 'SpaceUsers': [], 'Organizations': [], 'Roles': [], 'Positions': [], 'Forms': [], 'Flows': [], 'Categories': [] };
//     changeSet['updates'] = { 'Spaces': [], 'Users': [], 'SpaceUsers': [], 'Organizations': [], 'Roles': [], 'Positions': [], 'Forms': [], 'Flows': [], 'Categories': [] };
//     changeSet['deletes'] = { 'Spaces': [], 'Users': [], 'SpaceUsers': [], 'Organizations': [], 'Roles': [], 'Positions': [], 'Forms': [], 'Flows': [], 'Categories': [] };

//     let user = Creator.getCollection('users').findOne(userId);

//     // 首先，同步用户自己发生了变化的数据
//     if (!user) {
//         return { errors: [{ errorCode: 500, errorMessage: '用户不存在或已删除。' }] };
//     } else {
//         // 新增的User和更新的User
//         let userFields = { photo: 1, company: 1, name: 1, locale: 1, steedos_id: 1, primary_email_verified: 1, is_paid_user: 1, mobile: 1, email: 1, created: 1, modified: 1, created_by: 1, modified_by: 1, email_notification: 1, qq_open_id: 1 };
//         let updatedUsers = Creator.getCollection('users').find({ _id: userId, created: { $lte: syncTokenTime }, modified: { $gt: syncTokenTime } }, { fields: userFields }).fetch();
//         changeSet['updates']['users'] = changeSet['updates']['users'].concat(updatedUsers);
//     }
//     // 获取自从上次同步以来新加入、新注销/被删除/新退出的space
//     let resultSpaceIds = getSpaceIdsForQuery(userId, syncTokenTime)
// TODO

// }

// // 获取自从上次同步以来新加入、新注销/被删除/新退出的工作区id
// function getSpaceIdsForQuery(userId, syncTokenTime){
//     // 获得自从上次同步以来新加入的space

//     let insertedSpaceUsers = Creator.getCollection('space_users').find({user: userId, created: {$gt: syncTokenTime}}, {fields:{space:1}});
//     let spaceInsertedIds = _.pluck(insertedSpaceUsers, 'space');
//     // 获得自从上次同步以来新注销/新退出/被删除的space

// }


function _makeInFilters(fieldName, fieldValueArray) {
    let filters = _.map(fieldValueArray, function (v) {
        return `(${fieldName} eq '${v}')`
    }).join(' or ')
    return filters;
}

function _formatFieldsID(fields) {
    _.each(fields, function (f) {
        if (!f._id && f.id) {
            f._id = f.id;
            delete f.id;
            if (f.type == 'section' || f.type == 'table') {
                _formatFieldsID(f.fields);
            }
        }
    });
    return fields;
}

async function transformObjectFieldsToFormFields(objFields, codePrefix) {
    let formFieldsMap = {};
    for (const f of objFields) {
        const formField = await _transformObjectFieldToFormField(f, codePrefix);
        if (formField) {
            formFieldsMap[formField.code] = formField;
        }
    }
    return formFieldsMap;
}

async function _transformObjectFieldToFormField(objField, codePrefix = '') {
    const formObj = objectql.getObject('forms');
    let formField = {
        "name": objField.label,
        "code": `${codePrefix}${objField.name}`,
        "is_wide": objField.is_wide || false,
        "is_list_display": false,
        "is_searchable": objField.sortable || false,
        "is_required": objField.required || false,
        "is_multiselect": objField.multiple || false,
        "default_value": objField.defaultValue,
        "_id": await formObj._makeNewID()
    };
    switch (objField.type) {
        case 'text':
            formField.type = "input";
            break;
        case 'textarea':
            formField.type = "input";
            formField.is_textarea = true;
            break;
        case 'html':
            formField.type = "html";
            break;
        case 'select':
            if (_.isArray(objField.options)) {
                formField.type = objField.multiple ? "multiSelect" : "select";
                formField.options = _.map(objField.options, function (optionItem) {
                    return optionItem.label + ":" + optionItem.value;
                }).join('\n');
            }
            break;
        case 'color':
            formField.type = "input";
            break;
        case 'boolean':
            formField.type = "checkbox";
            break;
        case 'toggle':
            formField.type = "checkbox";
            break;
        case 'date':
            formField.type = "date";
            break;
        case 'datetime':
            formField.type = "dateTime";
            break;
        case 'time':
            formField.type = "input";
            break;
        case 'number':
            formField.type = "number";
            formField.digits = objField.scale;
            break;
        case 'currency':
            formField.type = "number";
            formField.digits = objField.scale;
            break;
        case 'percent':
            formField.type = "number";
            formField.digits = objField.scale;
            formField.is_percent = true;
            break;
        case 'password':
            formField.type = "password";
            break;
        case 'lookup':
        case 'master_detail':
            let refObjName = objField.reference_to;
            const refToField = objField.reference_to_field
            if (_.isString(refObjName)) {
                // 人员需转为选择人员字段、部门需转为选择部门字段
                if ('users' == refObjName || ('space_users' == refObjName && 'user' == refToField)) {
                    formField.type = 'user'
                } else if ('organizations' == refObjName) {
                    formField.type = 'group'
                } else {
                    formField.type = 'lookup';
                    formField.reference_to = objField.reference_to;
                    formField.reference_to_field = objField.reference_to_field;
                    formField.config = JSON.stringify({filters: objField.filters, amis: objField.amis});
                }
            }
            
            break;
        case 'autonumber':
            formField.type = "input";
            break;
        case 'url':
            formField.type = "url";
            break;
        case 'email':
            formField.type = "email";
            break;
        case 'code':
            formField.type = "input";
            formField.is_textarea = true;
            break;
        case 'image':
        case 'file':
            formField.type = objField.type;
            break;
        case 'formula':
        case 'summary':
            switch (objField.data_type) {
                case 'boolean':
                    formField.type = "checkbox";
                    break;
                case 'number':
                case 'currency':
                    formField.type = "number";
                    formField.digits = objField.scale;
                    break;
                case 'percent':
                    formField.type = "number";
                    formField.digits = objField.scale;
                    formField.is_percent = true;
                    break;
                case 'text':
                    formField.type = "input";
                    break;
                case 'date':
                    formField.type = "date";
                    break;
                case 'datetime':
                    formField.type = "dateTime";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    if (formField.type) {
        return formField;
    }
}

/**
 * @param fields
 *      [{
 *          field_name 字段名
 *          is_required 是否必填
 *      }]
 * @param objFieldsMap {} 对象字段
 * @returns []
 */
function transformObjectFields(fields, objFieldsMap) {
    let newFields = [];
    for (const f of fields) {
        let field = objFieldsMap[f.name];
        if (field) {
            newFields.push({
                ...field,
                required: !!f.required
            })
        }
    }
    return newFields;
}

/**
 * @param fieldNames [''] 字段名数组
 * @param objFieldsMap {} 对象字段
 * @returns []
 */
function getObjectFieldsByNames(fieldNames = [], objFieldsMap = {}) {
    let newFields = [];
    for (const fName of fieldNames) {
        let field = objFieldsMap[fName];
        if (field) {
            newFields.push({
                ...field
            })
        }
    }
    return newFields;
}

/**
 * 剔除掉系统字段，base对象的字段？
 * @param {*} objectName 
 */
async function getBusinessFields(objectName) {
    if (!objectName) {
        return []
    }
    let instanceFields = [];
    let objFields = await objectql.getObject(objectName).getFields();
    let baseFields = await objectql.getObject('base').getFields();
    for (const key in objFields) {
        if (Object.hasOwnProperty.call(objFields, key)) {
            let f = objFields[key]
            if (f && !baseFields[key]) {
                instanceFields.push(f)
            }
        }
    }

    return instanceFields
}

/**
 * 更新流程的开始节点字段编辑权限为可编辑
 * @param {Object} flowDoc 流程
 * @param {Array} formFields 表单字段
 */
async function updateStartStepPermission(flowDoc, formFields = []) {
    if (!flowDoc) {
        return;
    }
    const flowObj = objectql.getObject('flows');
    for (const s of flowDoc.current.steps) {
        if (s.step_type == 'start') {
            let perms = { "__form": "editable" };
            for (const f of formFields) {
                perms[f.code] = 'editable';
                if (f.type == 'table') {
                    for (const tf of (f.fields || [])) {
                        perms[tf.code] = 'editable';
                    }
                }
            }
            s.permissions = perms;
            await flowObj.directUpdate(flowDoc._id, { 'current.steps': flowDoc.current.steps })
        }
    }
}

/**
 * 将选择的对象子表类型字段转为表单表格类型字段
 * @param {*} instance_table_fields 
 */
async function transformObjectDetailFieldsToFormTableFields(instance_table_fields) {
    const tables = [];
    const formObj = objectql.getObject('forms');
    for (const tf of instance_table_fields) {
        let detailFieldFullname = tf.detail_field_fullname;
        let detailObjName = detailFieldFullname.split('.')[0];
        const detailObj = objectql.getObject(detailObjName);
        const detailObjConfig = await detailObj.toConfig();
        let tLabel = tf.label || detailObjConfig.label;
        let tableFields = getObjectFieldsByNames(tf.field_names, detailObjConfig.fields);
        const tFieldsMap = await transformObjectFieldsToFormFields(tableFields, `${detailObjName}_`);
        const tFields = Object.values(tFieldsMap);
        tables.push({
            "type": "table",
            "name": tLabel,
            "code": detailObjName,
            "is_wide": true,
            "is_required": false,
            "fields": tFields,
            "_id": await formObj._makeNewID()
        });
    }
    return tables
}

module.exports = {
    getByAdminSpaceIds,
    checkSpaceUserBeforeUpdate,
    updateForm,
    checkBeforeFlow,
    getFlow,
    getForm,
    getSpaceUser,
    isSpaceAdmin,
    makeSteps,
    formatFieldsID: _formatFieldsID,
    transformObjectFieldsToFormFields,
    transformObjectFields,
    getObjectFieldsByNames,
    getBusinessFields,
    updateStartStepPermission,
    transformObjectDetailFieldsToFormTableFields
}