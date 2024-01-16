/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-29 18:15:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-30 09:14:32
 * @Description: 
 */

const { getFormSchemaTableStyle } = require('./steedos_form_schema.table.amis');

const _ = (lodash = require("lodash"));

// 获取基于amis  Property 的打印schema. 此方案对于子表字段显示不友好, Property始终有一个td显示label,导致子表不能占满行.
const getPrintSchema = (instance, steedosFields) => {
    const items = [];
    _.each(steedosFields, (sField) => {
        items.push({
            label: sField.label,
            content: {
                type: "steedos-field",
                id: `field:${sField.name}`,
                label: false,
                name: sField.name,
                field: Object.assign({}, sField, { label: false }),
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
const getPrintSchemaTableStyle = (steedosFields) => {
    return {
        type: "service",
        body: [
            {
                type: "tpl",
                id: "u:f5bb0ad602a6",
                tpl: `<div class="instance-name" style="padding: 5px 10px">\${instance.name}</div>`,
                inline: true,
                wrapperComponent: "",
                style: {
                    fontFamily: "",
                    fontSize: "20px",
                    textAlign: "center",
                    fontBold: "700"
                },
            },
            getFormSchemaTableStyle(steedosFields),
            getApplicantTableView()
        ]
    }
};

const getApplicantTableView = () => {
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
                                tpl: "<div>提交人: ${instance.applicant_name}</div>",
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
                                tpl: "<div>提交日期: ${instance.submit_date|toDate|date:YYYY-MM-DD}</div>",
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

module.exports = {
    getPrintSchemaTableStyle
}