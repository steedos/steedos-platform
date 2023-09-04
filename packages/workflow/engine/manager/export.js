var _getFlowByForm;

global.steedosExport = {};

_getFlowByForm = function (form, flowId, is_copy, company_id) {
    var fields, flows, query;
    query = {
        form: form
    };
    if (flowId) {
        query._id = flowId;
    }
    fields = {
        history: 0
    };
    flows = db.flows.find(query, fields).fetch();
    flows.forEach(function (flow) {
        var ref;
        flow.historys = [];
        flow.object_workflows = Creator.getCollection("object_workflows").find({
            flow_id: flow._id
        }, {
            fields: {
                name: 1,
                object_name: 1,
                flow_id: 1,
                field_map: 1,
                field_map_back: 1,
                field_map_script: 1,
                field_map_back_script: 1,
                sync_attachment: 1,
                lock_record_after_approval: 1
            }
        }).fetch();
        if (!is_copy || (!company_id && flow.company_id) || (company_id && !flow.company_id) || (company_id !== flow.company_id)) {
            return (ref = flow.current.steps) != null ? ref.forEach(function (step) {
                var hrRoles, hr_roles_api_name, hr_roles_name, roles, roles_api_name, roles_name;
                roles_name = [];
                roles_api_name = [];
                if (!_.isEmpty(step.approver_roles)) {
                    roles = db.flow_roles.find({
                        _id: {
                            $in: step.approver_roles
                        }
                    }, {
                        fields: {
                            name: 1,
                            api_name: 1
                        }
                    }).fetch();
                    roles_name = _.pluck(roles, 'name');
                    roles_api_name = _.pluck(roles, 'api_name');
                }
                step.approver_roles_name = roles_name;
                step.approver_roles_api_name = roles_api_name;
                hr_roles_name = [];
                hr_roles_api_name = [];
                if (!_.isEmpty(step.approver_hr_roles)) {
                    hrRoles = db.roles.find({
                        _id: {
                            $in: step.approver_hr_roles
                        }
                    }, {
                        fields: {
                            name: 1,
                            api_name: 1
                        }
                    }).fetch();
                    hr_roles_name = _.pluck(hrRoles, 'name');
                    hr_roles_api_name = _.pluck(hrRoles, 'api_name');
                }
                step.approver_hr_roles_name = hr_roles_name;
                return step.approver_hr_roles_api_name = hr_roles_api_name;
            }) : void 0;
        }
    });
    //				step.approver_users = []

    //				step.approver_orgs = []

    //		if !is_copy || (!company_id && flow.company_id) || (company_id && !flow.company_id) || (company_id != flow.company_id)
    //			delete flow.perms
    return flows;
};

steedosExport.form = function (formId, flowId, is_copy, company_id) {
    // console.log('[export.js]>>>>>>>>>>>>>>>', 'steedosExport.form')
    var _getFieldNumberRule, _getNumberRuleName, c_fields, category, fields, form, instance_number_rules;
    form = db.forms.findOne({
        _id: formId
    }, {
        fields: {
            historys: 0
        }
    });
    if (!form) {
        return {};
    }
    form.historys = [];
    if (form != null ? form.category : void 0) {
        category = db.categories.findOne({
            _id: form.category
        }, {
            fields: {
                name: 1
            }
        });
        if (category != null ? category.name : void 0) {
            form.category_name = category.name;
        }
    }
    _getNumberRuleName = function (str) {
        if (_.isString(str) && (str != null ? str.indexOf("auto_number(") : void 0) > -1) {
            str = str.replace("auto_number(", "").replace(")", "").replace("\"", "").replace("\"", "").replace("\'", "").replace("\'", "");
            return str;
        }
    };
    instance_number_rules = new Array();
    if (form.current) {
        fields = new Array();
        c_fields = form.current.fields;
        if (c_fields != null) {
            c_fields.forEach(function (f) {
                var ref;
                if (f.type === 'table') {
                    return console.log('ignore table field');
                } else if (f.type === 'section') {
                    return f != null ? (ref = f.fields) != null ? ref.forEach(function (f1) {
                        return fields.push(f1);
                    }) : void 0 : void 0;
                } else {
                    return fields.push(f);
                }
            });
        }
        _getFieldNumberRule = function (spaceId, instance_number_rules, str) {
            var number_rule, number_rule_name;
            number_rule_name = _getNumberRuleName(str);
            if (number_rule_name) {
                number_rule = db.instance_number_rules.findOne({
                    space: spaceId,
                    name: number_rule_name
                }, {
                    fields: {
                        _id: 1,
                        name: 1,
                        year: 1,
                        first_number: 1,
                        rules: 1
                    }
                });
                if (!number_rule) {
                    throw new Error('not find instance number rule, name is ' + number_rule_name);
                }
                number_rule.number = 0;
                if (!instance_number_rules.findPropertyByPK("_id", number_rule._id)) {
                    delete number_rule._id;
                    instance_number_rules.push(number_rule);
                }
            }
            return instance_number_rules;
        };
        fields.forEach(function (f) {
            _getFieldNumberRule(form.space, instance_number_rules, f.default_value);
            return _getFieldNumberRule(form.space, instance_number_rules, f.formula);
        });
    }
    form.instance_number_rules = instance_number_rules;
    form.flows = _getFlowByForm(formId, flowId, is_copy, company_id);
    return form;
};
