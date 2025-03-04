'use strict';
// @ts-check

const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const { randomInt } = require("crypto");
const { JSONStringify } = require("@steedos/objectql");

router.get('/api/object_workflows/workflow_field/options', auth.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const lng = userSession.language || 'zh-CN';
        let flowId, fields, form_fields, form, output, instance_fields;
        let values = req.query;
        form_fields = [];

        if(values.instance_fields){
          instance_fields = [{
            value: "instance.name",
            label: t("object_workflows_field_field_map_$_workflow_field_instance_name",{},lng)
          }, {
            value: "instance.submitter_name",
            label: t("object_workflows_field_field_map_$_workflow_field_submitter_name",{},lng)
          }, {
            value: "instance.applicant_name",
            label: t("object_workflows_field_field_map_$_workflow_field_applicant_name",{},lng)
          }, {
            value: "instance.applicant_company",
            label: t("object_workflows_field_field_map_$_workflow_field_applicant_company",{},lng)
          }, {
            value: "instance.applicant_organization",
            label: t("object_workflows_field_field_map_$_workflow_field_applicant_organization",{},lng)
          }, {
            value: "instance.applicant_organization_name",
            label: t("object_workflows_field_field_map_$_workflow_field_applicant_organization_name",{},lng)
          }, {
            value: "instance.applicant_organization_fullname",
            label: t("object_workflows_field_field_map_$_workflow_field_applicant_organization_fullname",{},lng)
          }, {
            value: "instance.state",
            label: t("object_workflows_field_field_map_$_workflow_field_state",{},lng)
          }, {
            value: "instance.current_step_name",
            label: t("object_workflows_field_field_map_$_workflow_field_current_step_name",{},lng)
          }, {
            value: "instance.flow_name",
            label: t("object_workflows_field_field_map_$_workflow_field_flow_name",{},lng)
          }, {
            value: "instance.category_name",
            label: t("object_workflows_field_field_map_$_workflow_field_category_name",{},lng)
          }, {
            value: "instance.submit_date",
            label: t("object_workflows_field_field_map_$_workflow_field_submit_date",{},lng)
          }, {
            value: "instance.finish_date",
            label: t("object_workflows_field_field_map_$_workflow_field_finish_date",{},lng)
          }, {
            value: "instance.final_decision",
            label: t("object_workflows_field_field_map_$_workflow_field_final_decision",{},lng)
          }];
        }
     
        // 根据flow_id 查询数据
        if (values != null ? values.flow_id : void 0) {
            flowId = _.isObject(values.flow_id) ? values.flow_id._id : values.flow_id;
            const flow = await objectql.getObject("flows").findOne(flowId, {fields:['form']});          
            if (flow && flow.form) 
                form = await objectql.getObject("forms").findOne(flow.form, {fields:['current']});
        }

        // 将数据压入数组
        let res_form = form; 
        if (res_form != null ? res_form.current : void 0) {
            fields = (res_form != null ? res_form.current.fields : void 0) || [];
            fields.forEach(function (f) {
              if (f.type === 'section') {
                if (f.fields) {
                    f.fields.forEach(function (ff) {
                        form_fields.push({
                        'label': ff.name  || ff.code,
                        'value': ff.code
                        });
                    });
                }
              } else if (f.type === 'table') {
                if (f.fields) {
                  f.fields.forEach(function (ff) {
                    form_fields.push({
                      'label': (f.name || f.code) + "=>" + (ff.name || ff.code),
                      'value': f.code + '.' + ff.code
                    });
                  });
                }
              } else {
                form_fields.push({
                  'label': f.name || f.code,
                  'value': f.code
                });
              }
            });
        }
        
        if(instance_fields){
          form_fields = _.union(instance_fields, form_fields);
        }

        // 根据用户关键字进行过滤
        output = [];
        if( values.term ) {
          form_fields.forEach((item) => {
            if(item.label.toLowerCase().indexOf(values.term.toLowerCase()) !== -1)
              output.push(item); 
          })
        } else {
          output = form_fields;
        }
        res.status(200).send(output);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }

});
exports.default = router;