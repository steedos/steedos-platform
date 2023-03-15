'use strict';
// @ts-check

const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const { randomInt } = require("crypto");

router.get('/api/object_workflows/workflow_field/options', core.requireAuthentication, async function (req, res) {
    try {
      
        let flowId, fields, form_fields, form, output;
        let values = req.query;
        form_fields = [];
        
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
                      'label': (f.name || f.code) + (ff.name || ff.code),
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
        
        // 根据用户关键字进行过滤
        output = [];
        if( values.term ) {
          form_fields.forEach((item, index) => {
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