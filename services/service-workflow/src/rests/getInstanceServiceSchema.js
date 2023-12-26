/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-22 13:48:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-26 16:12:47
 * @Description:
 * 1 使用instance获取申请单的表单及表单脚本
 * 2 获取表单版本上定义的字段
 * 3 将表单字段转换为amis form schema
 * 将formId和formVersion加到url参数,此接口开启缓存?
 */

const _ = (lodash = require("lodash"));

const getFieldAmis = (field, static, fieldAmis = {}, ctx = {showBorderBottom: true})=>{
  let className = ''
  if(field.is_wide || field.type === 'group'){
    className = 'col-span-2 m-1';
  }else{
    className = 'm-1';
  }
  if(static){
    fieldAmis.className = `${className} ${fieldAmis.className || ''}`;
    if(ctx.showBorderBottom){
      fieldAmis.className = `border-b ${fieldAmis.className || ''}`;
    }
  }
  return fieldAmis;
}

const convertFormFieldsToSteedosFields = (formFields, stepPermissions = {}, ctx)=>{
  const steedosFields = [];

  _.each(formFields, (field) => {
    const static = stepPermissions[field.code] === 'editable' ? false : true;
    if (field.type === "table") {

      steedosFields.push({
        ...field.steedos_field,
        ..._.pickBy(field, (v, k) => {
          return k != "type" && k != "fields" && k != 'steedos_field' && k != 'options';
        }),
        type: "table",
        name: field.code,
        label: field.name,
        // _prefix: `${field.code}.`,
        is_wide: true,
        subFields: _.map(field.fields, (fField) => {
          const fStatic = stepPermissions[fField.code] === 'editable' ? false : true;
          return {
            ...fField.steedos_field,
            ..._.pickBy(fField, (v, k) => {
              return k != "type" && k != "steedos_field" && k != 'options';
            }),
            name: `${field.code}.$.${fField.code}`,
            static: fStatic,
            amis: getFieldAmis(fField, fStatic, fField.amis, ctx),
            description: null
          };
        }),
        static: static,
        amis: getFieldAmis(field, static, field.amis, ctx),
        description: null
      });
    } else {
      steedosFields.push({
        ...field.steedos_field,
        ..._.pickBy(field, (v, k) => {
          return k != "type" && k != "steedos_field" && k != 'options';
        }),
        name: field.code,
        label: field.name,
        static: static,
        amis: getFieldAmis(field, static, field.amis, ctx),
        description: null
      });
    }
  });

  return steedosFields;
}

// 获取基于amis  Property 的打印schema
const getPrintSchema = (instance, steedosFields)=>{
  const items = [];
  _.each(steedosFields, (sField)=>{
    items.push({
      label: sField.label,
      content: {
        type: "steedos-field",
        id: `field:${sField.name}`,
        label: false,
        name: sField.name,
        field: Object.assign({}, sField, {label: false}),
        static: true
      },
      span: sField.is_wide || sField.type === 'table' ? 2 : null
    });
  })

  return {
    "type": "property",
    "column": 2,
    "title": instance.name,
    "items": items
  }
};

// 获取基于amis table view的打印schema
const getPrintSchema2 = (instance, steedosFields)=>{
  const trs = getFormTrs(steedosFields)
  return {
    type: "service",
    data: {
      applicant_name: instance.applicant_name,
      submit_date: instance.submit_date
    },
    body: [
      {
        type: "tpl",
        id: "u:f5bb0ad602a6",
        tpl: `<div class="instance-name" style="padding: 5px 10px">${instance.name}</div>`,
        inline: true,
        wrapperComponent: "",
        style: {
          fontFamily: "",
          fontSize: "20px",
          textAlign: "center",
        },
      },
      {
        "type": "table-view",
        "className": "border-solid border-2 border-black",
        "column": 2,
        "trs": trs
      },
      getApplicantTableView(instance)
    ]
  }
};

const getFormTrs = (steedosFields) => {
  const trsSchema = [];
  const trs = [];
  let tdFields = [];
  _.each(steedosFields, (field, index) => {
    if (field.is_wide) {
      if (tdFields.length != 0) {
        trs.push(tdFields);
      }
      if (field.type == "table") {
        trs.push([Object.assign({}, field, { type: "section" })]);
      }
      tdFields = [];
      tdFields.push(field);
      trs.push(tdFields);
      tdFields = [];
    } else {
      tdFields.push(field);
      if (tdFields.length == 2 || index === steedosFields.length - 1) {
        trs.push(tdFields);
        tdFields = [];
      }
    }
  });
  for (const tdFields of trs) {
    trsSchema.push({
      background: "#F7F7F7",
      tds: getTds(tdFields),
    });
  }
  return trsSchema;
};

const getTdInputTpl = (field, label) => {
  return {
    type: "steedos-field",
    id: `field:${field.name}`,
    label: label,
    name: field.name,
    field: Object.assign({}, field, {label: label}),
    static: true
  }
};

const getTdField = (field, fieldsCount) => {
  return {
    background: field.permission !== "editable" ? "#FFFFFF" : "rgba(255,255,0,.1)",
    colspan: field.type === "table" ? 4 : 3 - (fieldsCount - 1) * 2,
    align: "left",
    className: "td-field",
    width: "32%",
    body: [getTdInputTpl(field)],
    style: {
      marginTop: "0",
      paddingTop: "0",
      paddingRight: "0",
      paddingBottom: "0",
      paddingLeft: "0",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",
      borderLeftColor: "#000000",
      borderTopColor: "#000000",
      borderRightColor: "#000000",
      borderBottomColor: "#000000",
    },
    // "id": "u:9b001b7ff92d"
  };
};

const getTdTitle = (field) => {
  return {
    className: "td-title",
    align: "left",
    width: field.type != "section" ? "16%" : "",
    colspan: field.type == "section" ? 4 : "",
    background: "#FFFFFF",
    body: [
      {
        type: "tpl",
        tpl: `<div>${field.label} ${field.is_required ? '<span class="antd-Form-star">*</span>' : ''}</div>`,
      },
    ],
    // "id": "u:9b001b7ff92d",
    style: {
      borderLeftColor: "#000000",
      borderTopColor: "#000000",
      borderRightColor: "#000000",
      borderBottomColor: "#000000",
    },
  };
};

const getTds = (tdFields) => {
  const tds = [];
  for (const field of tdFields) {
    if (field.type != "table") {
      tds.push(getTdTitle(field));
    }
    if (field.type != "section") {
      tds.push(getTdField(field, tdFields.length));
    }
  }
  return tds;
};

const getApplicantTableView = () => {
  let applicantInput = {
    label: false,
    mode: "horizontal",
    className: "m-none p-none",
    disabled: true,
    type: "tpl",
    tpl: '<div>${applicant_name}</div>',
    id: "u:2016b04355f4",
  }

  return {
    type: "table-view",
    className: "instance-applicant-view",
    trs: [
      {
        background: "#FFFFFF",
        tds: [
          {
            className: "td-title",
            background: "#FFFFFF",
            align: "left",
            body: [
              {
                type: "tpl",
                tpl: "<div>提交人: ${applicant_name}</div>",
                id: "u:ee62634201bf",
              },
            ],
            id: "u:6c24c1bb99c9",
            style: {
              padding: "none",
              border: "none"
            },
          },
          {
            className: "td-title",
            background: "#FFFFFF",
            align: "left",
            body: [
              {
                type: "tpl",
                tpl: "<div>提交日期: ${submit_date|toDate|date:YYYY-MM-DD}</div>",
                id: "u:6d0a7763d527",
              },
            ],
            id: "u:c8b8214ac931",
            style: {
              padding: "none",
              border: "none"
            }
          }
        ],
      },
    ],
    id: "u:047f3669468b",
    style: {
      borderLeftStyle: "none",
      borderTopStyle: "none",
      borderRightStyle: "none",
      borderBottomStyle: "none",
    },
  };
};


// steedos form schema
const getSteedosFormSchema = (steedosFields) => {
  const formFieldsSchema = getSections(steedosFields);
  return {
    type: "form",
    wrapWithPanel: false,
    name: "instanceForm",
    id: "instanceForm",
    body: formFieldsSchema,
    className: 'steedos-amis-form'
  };
};

const getFieldSchemaArray = (formFields) => {
  let fieldSchemaArray = [];
  fieldSchemaArray.length = 0;

  lodash.forEach(formFields, (field) => {
    if (!field.group || field.group == "null" || field.group == "-")
      field.group = "通用";
    const fieldName = field.name;
    let isObjectField = /\w+\.\w+/.test(fieldName);
    if (
      field.type == "grid" ||
      field.type == "object" ||
      field.type == "table"
    ) {
      // field.group = field.label
      field.is_wide = true;
    }

    let forceHidden = false;

    if (!isObjectField) {
      if (!field.hidden && !forceHidden) {
        fieldSchemaArray.push(
          Object.assign({ name: fieldName }, field, {
            permission: { allowEdit: true },
          })
        );
      }
    }
  });
  return fieldSchemaArray;
};

const getSection = (fieldSchemaArray, sectionName, ctx = {}) => {
  const sectionFields = lodash.filter(fieldSchemaArray, { group: sectionName });
  if (
    sectionFields.length ==
    lodash.filter(sectionFields, ["hidden", true]).length
  ) {
    return;
  }

  const fieldSetBody = [];

  for (const perField of sectionFields) {
    fieldSetBody.push({
      type: "steedos-field",
      id: `field:${perField.name}`,
      name: perField.name,
      field: perField,
      static: perField.static
    });
  }

  // fieldSet 已支持显隐控制
  const sectionFieldsVisibleOn = lodash.map(
    lodash.compact(lodash.map(sectionFields, "visibleOn")),
    (visibleOn) => {
      let visible = visibleOn;
      if (visible.indexOf("${") > -1) {
        visible = visible.substring(
          visible.indexOf("{") + 1,
          visible.indexOf("}")
        );
      }
      return visible ? "(" + visible + ")" : visible;
    }
  );

  let section = {
    type: "fieldSet",
    title: sectionName,
    collapsable: true,
    body: fieldSetBody,
  };

  if (ctx.enableTabs) {
    section = {
      title: sectionName,
      body: fieldSetBody,
    };
  }

  if (
    sectionFieldsVisibleOn.length > 0 &&
    fieldSetBody.length === sectionFieldsVisibleOn.length
  ) {
    section.visibleOn = `${sectionFieldsVisibleOn.join(" || ")}`;
  }

  const fieldGroups = ctx.fieldGroups;
  const group =
    fieldGroups &&
    fieldGroups.find(function (groupItem) {
      return groupItem.group_name == sectionName;
    });
  let groupVisibleOn = group && group.visible_on;
  if (groupVisibleOn) {
    if (groupVisibleOn.startsWith("{{")) {
      groupVisibleOn = `${groupVisibleOn
        .substring(2, groupVisibleOn.length - 2)
        .replace(/formData./g, "data.")}`;
    } else {
      groupVisibleOn = `${groupVisibleOn.replace(/formData./g, "data.")}`;
    }
    if (section.visibleOn) {
      section.visibleOn = `${section.visibleOn + " && " + groupVisibleOn}`;
    } else {
      section.visibleOn = groupVisibleOn;
    }
  }
  return section;
};

const getSections = (formFields, ctx = {}) => {
  const fieldSchemaArray = getFieldSchemaArray(formFields);
  const _sections = lodash.groupBy(fieldSchemaArray, "group");
  const sections = [];
  var sectionVisibleOns = [];
  for (const key in _sections) {
    const section = getSection(fieldSchemaArray, key, ctx);
    if (section.body.length > 0) {
      if (section.visibleOn) {
        sectionVisibleOns.push("(" + section.visibleOn + ")");
      } else {
        sectionVisibleOns.push("true");
      }
      sections.push(section);
    }
  }
  /*
  为了实现只有一个分组时隐藏该分组标题，需要分三种情况(分组如果没有visibleon属性就代表一定显示，有visibleon需要进行判断)
  1 当前分组为隐藏时，标题就设置为隐藏
  2 当前分组为显示时，其他分组只要有一个是显示，就显示该分组标题
  3 当前分组为显示时，其他分组都隐藏，就隐藏该分组标题
  */
  sections.forEach((section, index) => {
    var tempSectionVisibleOns = sectionVisibleOns.slice();
    tempSectionVisibleOns.splice(index, 1);
    section.headingClassName = {
      hidden: `!((${tempSectionVisibleOns.join(" || ") || "false"}) && ${sectionVisibleOns[index]
        })`,
    };
  });

  if (ctx.enableTabs) {
    // TODO: 以下sectionHeaderVisibleOn代码逻辑是为实现只有一个选项卡时给选项卡添加sectionHeaderVisibleOn样式类来把选项卡顶部卡头隐藏
    // 但是 amis filter过滤器有两个bug造成此功能不好实现：
    // 1.filter过滤器只支持对象数组，并不支持boolean或字符串数组，见： https://github.com/baidu/amis/issues/7078
    // 2.filter过滤器的返回结果无法进一步获取最终过滤后的数组长度，见：https://github.com/baidu/amis/issues/7077
    // let sectionHeaderVisibleOn = "false";
    // if(sectionVisibleOns.length){
    //   sectionHeaderVisibleOn = "[" + sectionVisibleOns.join(",") + "]" + "|filter:equals:true.length > 1";
    // }
    // console.log("===sectionHeaderVisibleOn===", sectionHeaderVisibleOn);
    // sectionHeaderVisibleOn = "[true]|filter:equals:true.length > 1";
    // sectionHeaderVisibleOn = "false";
    // sectionHeaderVisibleOn = "[1,1,1]|filter:equals:1.length > 1";
    return [
      {
        type: "tabs",
        tabs: sections,
        tabsMode: ctx.tabsMode,
      },
    ];
  }

  return sections;
};

module.exports = {
  rest: {
    method: "GET",
    fullPath: "/api/workflow/instance/:instanceId/getServiceSchema",
  },
  async handler(ctx) {
    const { instanceId, box, stepId, print } = ctx.params;
    const insObj = this.getObject("instances");
    const instance = await insObj.findOne(instanceId);

    const {
      form: formId,
      form_version: formVersionId,
      flow: flowId,
      flow_version: flowVersionId,
      name
    } = instance;

    const formObj = this.getObject("forms");
    const flowObj = this.getObject("flows");

    // TODO 处理版本
    const form = await formObj.findOne(formId, { fields: ["current"] });

    const fields = form.current.fields;

    let stepPermissions = {};

    if((box === 'inbox' || box === 'draft') && stepId){
      //TODO 处理版本
      const flow = await flowObj.findOne(flowId, { fields: ["current"] });
      stepPermissions = _.find(flow.current.steps, (step)=>{
        return step._id == stepId
      })?.permissions
    }

    const isPrint = print === 'true' || print === true
  
    console.log(`stepPermissions`, stepPermissions)

    // 1 将formFields转换为steedosFields
    const steedosFields = convertFormFieldsToSteedosFields(fields, stepPermissions, {showBorderBottom: isPrint != true});


    // 2 使用steedosFields转换为amis form schema

    // 表格模式
    if(isPrint){
      return getPrintSchema2(instance, steedosFields)
    }
    
    // 表单模式
    const schema = getSteedosFormSchema(steedosFields);
    return schema;
  },
};
