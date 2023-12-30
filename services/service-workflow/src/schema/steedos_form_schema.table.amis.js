const _ = (lodash = require("lodash"));


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
        field: Object.assign({}, field, { label: label }),
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
                tpl: `<div class='steedos-field-${field.type}'>${field.label}${field.is_required ? '<span class="antd-Form-star">*</span>' : ''}</div>`,
            },
        ],
        // "id": "u:9b001b7ff92d",
        style: {
            borderLeftColor: "#000000",
            borderTopColor: "#000000",
            borderRightColor: "#000000",
            borderBottomColor: "#000000",
            padding: "4px"
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

const getFormSchemaTableStyle = (steedosFields)=>{
    const trs = getFormTrs(steedosFields)
    return {
        "type": "table-view",
        "className": "border-solid border-2 border-black",
        "column": 2,
        "trs": trs
    }
}

module.exports = {
    getFormSchemaTableStyle
}