/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-22 13:48:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-23 13:24:16
 * @Description:
 * 1 使用instance获取申请单的表单及表单脚本
 * 2 获取表单版本上定义的字段
 * 3 将表单字段转换为amis form schema
 * 将formId和formVersion加到url参数,此接口开启缓存?
 */

const _ = (lodash = require("lodash"));

const { convertFormFieldsToSteedosFields, getFlowVersion, getFormVersion } = require('../util/index')
const { getSteedosFormSchema } = require('../schema/steedos_form_schema.amis')
const { getPrintSchemaTableStyle } = require('../schema/instance_form_schema.amis');

module.exports = {
  formSchema: {
    cache: true,
    rest: {
      method: "GET",
      fullPath: "/api/workflow/form/:formId/:formVersionId/schema",
    },
    async handler(ctx) {
      const { formId, formVersionId, flowId, flowVersionId, box, stepId } = ctx.params;
  
      const formVersion = await getFormVersion(formId, formVersionId);
  
      const fields = formVersion.fields;
  
      let stepPermissions = {};
  
      if((box === 'inbox' || box === 'draft') && stepId){
        //TODO 处理版本
        const flowVersion = await getFlowVersion(flowId, flowVersionId);
        stepPermissions = _.find(flowVersion.steps, (step)=>{
          return step._id == stepId
        })?.permissions
      }
  
      // 1 将formFields转换为steedosFields
      const steedosFields = convertFormFieldsToSteedosFields(fields, stepPermissions, {showBorderBottom: true});
  
      // 2 使用steedosFields转换为amis form schema
      const schema = getSteedosFormSchema(steedosFields);
      return schema;
    }
  },
  printSchema: {
    cache: true,
    rest: {
      method: "GET",
      fullPath: "/api/workflow/form/:formId/:formVersionId/print/schema",
    },
    async handler(ctx) {
      const { formId, formVersionId } = ctx.params;
  
      const formVersion = await getFormVersion(formId, formVersionId);
  
      const fields = formVersion.fields;
  
      let stepPermissions = {};
    
      const steedosFields = convertFormFieldsToSteedosFields(fields, stepPermissions, {showBorderBottom: false});
  
      // 表格模式
      return getPrintSchemaTableStyle(steedosFields)
    }
  }
};
