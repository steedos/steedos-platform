const objectql = require("@steedos/objectql");
if (!db.flows) {
    const core = require('@steedos/core');
    db.flows = core.newCollection('flows');
}

if (Meteor.isServer) {
    db.flows.copy = function (userId, spaceId, flowId, options, enabled) {
        var company_id, flow, form, newFlowName, newName, ref;
        var templateSpaceId = Creator.getTemplateSpaceId();
        if(templateSpaceId === 'template' && options.from === 'template'){
            let getData = function () {
                return objectql.getObject("flows").findOne(flowId, {}, Object.assign({roles: ['admin']}, {spaceId: templateSpaceId}));
            }
            var data =  objectql.wrapAsync(getData, {});
            return steedosImport.workflow(userId, spaceId, data, enabled, company_id);
        }else{
            var flowQuery = {
                _id: flowId
            }
            if(templateSpaceId){
                flowQuery["$or"] = [{space:templateSpaceId}, {space:spaceId}]
            }else{
                flowQuery.space = spaceId
            }
            flow = db.flows.findOne(flowQuery, {
                fields: {
                    _id: 1,
                    name: 1,
                    form: 1
                }
            });
            if (!flow) {
                throw new Meteor.Error(`[flow.copy]未找到flow, space: ${spaceId}, flowId: ${flowId}`);
            }
            newFlowName = options != null ? options.name : void 0;
            company_id = options != null ? options.company_id : void 0;
            if (newFlowName) {
                newName = newFlowName;
            } else {
                newName = "复制:" + flow.name;
            }
            form = steedosExport.form(flow.form, flow._id, true, company_id);
            if (_.isEmpty(form)) {
                throw new Meteor.Error(`[flow.copy]未找到form, formId: ${flow.form}`);
            }
            form.name = newName;
            if ((ref = form.flows) != null) {
                ref.forEach(function (f) {
                    delete f.api_name
                    return f.name = newName;
                });
            }
            delete form.api_name

            return steedosImport.workflow(userId, spaceId, form, enabled, company_id);
        }
    };
}

if (Meteor.isServer) {
    db.flows.allow({
        insert: function (userId, event) {
            return false;
        },
        update: function (userId, event) {
            if (!Steedos.isSpaceAdmin(event.space, userId)) {
                return false;
            } else {
                return true;
            }
        },
        remove: function (userId, event) {
            return false;
        }
    });
    db.flows.before.insert(function (userId, doc) {
        if(userId){
            doc.created_by = userId;
            doc.created = new Date();
            if (doc.current) {
                doc.current.created_by = userId;
                doc.current.created = new Date();
                doc.current.modified_by = userId;
                return doc.current.modified = new Date();
            }
        }
    });
    db.flows.before.update(function (userId, doc, fieldNames, modifier, options) {
        if(modifier.$set.api_name){
            checkName(modifier.$set.api_name)
            let count = db.flows.find({_id: {$ne: doc._id}, api_name: modifier.$set.api_name, space: doc.space}).count()
            if(count > 0){
                throw new Error('Api Name不能重复')
            }
        }
    });
    db.flows.after.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        if (!modifier.$set.current) {
            if (_.keys(modifier.$set).toString() !== 'auto_remind' && _.keys(modifier.$set).toString() !== 'upload_after_being_distributed') { // 为了启用自动催办的时候流程在列表位置不变
                modifier.$set['current.modified_by'] = userId;
                modifier.$set['current.modified'] = new Date();
            }
        }
        // if (!Steedos.isLegalVersion(doc.space, "workflow.professional")) {
        //     throw new Meteor.Error(400, "space_paid_info_title");
        // }
        if (doc.category !== this.previous.category) {
            if (doc.category) {
                db.forms.update(doc.form, {
                    $set: {
                        category: doc.category
                    }
                });
            } else {
                db.forms.update(doc.form, {
                    $unset: {
                        category: 1
                    }
                });
            }
        }
        if (doc.company_id !== this.previous.company_id) {
            if (doc.company_id) {
                return db.forms.update(doc.form, {
                    $set: {
                        company_id: doc.company_id
                    }
                });
            } else {
                return db.forms.update(doc.form, {
                    $unset: {
                        company_id: 1
                    }
                });
            }
        }
    });
}

db.flows.helpers({
    modified_by_name: function () {
        var ref2, spaceUser;
        spaceUser = db.space_users.findOne({
            user: (ref2 = this.current) != null ? ref2.modified_by : void 0
        }, {
                fields: {
                    name: 1
                }
            });
        return spaceUser != null ? spaceUser.name : void 0;
    },
    category_name: function () {
        var category, form;
        form = db.forms.findOne({
            _id: this.form,
            space: this.space
        });
        if (form && form.category) {
            category = db.categories.findOne({
                _id: form.category
            });
            return category != null ? category.name : void 0;
        }
    }
});

new Tabular.Table({
    name: "Flows",
    collection: db.flows,
    pub: "flows_tabular",
    columns: [
        {
            data: "name",
            orderable: false
        },
        {
            data: "category_name()",
            width: "150px",
            orderable: false
        },
        {
            data: "current.modified",
            width: "150px",
            render: function (val,
                type,
                doc) {
                var ref2;
                return moment((ref2 = doc.current) != null ? ref2.modified : void 0).format('YYYY-MM-DD HH:mm');
            }
        },
        {
            data: "modified_by_name()",
            width: "150px",
            orderable: false
        },
        {
            //			title: ()->
            //				"""
            //					<span class="filter-span">#{t('flows_state')}</span>
            //					<div class="tabular-filter col-state">
            //						<div class="btn-group">
            //						  <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            //							<span class="ion ion-funnel"></span></a>
            //						  <ul class="dropdown-menu">
            //							<li><a href="#">
            //									<label>
            //										<input type="checkbox" name='filter_state' value='enabled' data-col='col-state'>启用
            //									</label>
            //								</a>
            //							</li>
            //							<li><a href="#">
            //									<label>
            //										<input type="checkbox" name='filter_state' value='disabled' data-col='col-state'>停用
            //									</label>
            //								</a>
            //							</li>
            //						  </ul>
            //						</div>
            //					</div>
            //				"""
            //			,
            data: "state",
            width: "150px",
            orderable: false,
            render: function (val,
                type,
                doc) {
                var checked;
                checked = "";
                if (doc.state === 'enabled') {
                    checked = "checked";
                }
                return `<div class="flow-list-switch">\n	<label for="switch_${doc._id}" class="weui-switch-cp">\n		<input id="switch_${doc._id}" data-id="${doc._id}" class="weui-switch-cp__input flow-switch-input" type="checkbox" ${checked}>\n		<div class="weui-switch-cp__box"></div>\n	</label>\n</div>`;
            }
        },
        {
            data: "auto_remind",
            width: "150px",
            orderable: false,
            render: function (val,
                type,
                doc) {
                var checked;
                checked = "";
                if (doc.auto_remind === true) {
                    checked = "checked";
                }
                return `<div class="flow-list-switch">\n	<label for="switch_auto_remind_${doc._id}" class="weui-switch-cp">\n		<input id="switch_auto_remind_${doc._id}" data-id="${doc._id}" class="weui-switch-cp__input flow-switch-input-enable-auto-remind" type="checkbox" ${checked}>\n		<div class="weui-switch-cp__box"></div>\n	</label>\n</div>`;
            }
        },
        {
            data: "upload_after_being_distributed",
            width: "150px",
            orderable: false,
            render: function (val,
                type,
                doc) {
                var checked;
                checked = "";
                if (doc.upload_after_being_distributed === true) {
                    checked = "checked";
                }
                return `<div class="flow-list-switch">\n	<label for="switch_upload_after_being_distributed_${doc._id}" class="weui-switch-cp">\n		<input id="switch_upload_after_being_distributed_${doc._id}" data-id="${doc._id}" class="weui-switch-cp__input flow-switch-input-upload-after-being-distributed" type="checkbox" ${checked}>\n		<div class="weui-switch-cp__box"></div>\n	</label>\n</div>`;
            }
        },
        {
            data: "",
            title: "",
            orderable: false,
            width: '1px',
            render: function (val,
                type,
                doc) {
                return `<div class="flow-edit">\n	<div class="btn-group">\n	  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\n		<span class="ion ion-android-more-vertical"></span>\n	  </button>\n	  <ul class="dropdown-menu dropdown-menu-right" role="menu">\n		<li><a href="#" id="editFlow" data-id="${doc._id}">${t("Edit")}</a></li>\n		<li class="divider"></li>\n		<li><a href="#" id="designFlow" data-id="${doc._id}">${t("workflow_design_flow")}</a></li>\n		<li class="divider"></li>\n		<li><a href="#" id="editFlow_template" data-id="${doc._id}">${t('flow_list_title_set_template')}</a></li>\n		<li><a href="#" id="editFlow_events" data-id="${doc._id}">${t('flow_list_title_set_script')}</a></li>\n		<li><a href="#" id="editFlow_fieldsMap" data-id="${doc._id}">${t('flow_list_title_set_fieldsMap')}</a></li>\n		<li><a href="#" id="editFlow_distribute" data-id="${doc._id}">${t('flow_list_title_set_distribute')}</a></li>\n	  </ul>\n	</div>\n</div>`;
            }
        }
    ],
    order: [[2, "desc"]],
    dom: "tp",
    extraFields: ["form", "print_template", "instance_template", "events", "field_map", "space", "description", "current", "state", "distribute_optional_users", "distribute_to_self", "distribute_end_notification"],
    lengthChange: false,
    pageLength: 10,
    info: false,
    searching: true,
    autoWidth: false
});

new Tabular.Table({
    name: "ImportOrExportFlows",
    collection: db.flows,
    columns: [
        {
            data: "name",
            title: "name"
        },
        {
            //		{data: "state", title: "state"},
            data: "",
            title: "",
            orderable: false,
            width: '1px',
            render: function (val,
                type,
                doc) {
                return '<a target="_blank" class="btn btn-xs btn-default" id="exportFlow" href="/api/workflow/export/form?form=' + doc.form + '">' + t("flows_btn_export_title") + '</a>';
            }
        }
    ],
    dom: "tp",
    extraFields: ["form", "print_template", "instance_template", "events", "field_map", "space", "current"],
    lengthChange: false,
    pageLength: 10,
    info: false,
    searching: true,
    autoWidth: false
});

//只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符 TODO 支持表格
function checkName(name){
  var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$'); //支持表格类型的验证表达式(待优化.$.限制只能出现一次): new RegExp('^[a-z]([a-z0-9]|_(?!_))*(\\.\\$\\.\\w+)*[a-z0-9]$')
  //TODO 撤销注释
  if(!reg.test(name)){
    throw new Error("名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
  }
  if(name.length > 50){
    throw new Error("名称长度不能大于50个字符");
  }
  return true
}
