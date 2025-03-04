const { getSteedosSchema } = require('@steedos/objectql');
const { translationObject } = require('@steedos/i18n');
const { getUserLocale } = require('@steedos/core').Util;
const clone = require("clone");

const generatHtml = (doc)=>{
    if(!doc._id || !doc.object_name || !doc.fields || !doc.return_url){
        return;
    }
    const fields = doc.fields;
    let object = getSteedosSchema().getObject(doc.object_name);
    if(!object){
        throw new Error("web_forms_error_object_name_not_found");
    }
    const webForm = Creator.getCollection("web_forms").findOne(doc._id, {fields: {owner: 1}});
    const owner = Creator.getCollection("users").findOne(webForm.owner, {fields: {locale: 1}});
    const lng = getUserLocale(owner);
    let _object = clone(object.toConfig());
    translationObject(lng, doc.object_name, _object);
    const objectFields = _object.fields;
    let formUrl = `/api/v4/${doc.object_name}/web_forms`;
    formUrl = Steedos.absoluteUrl(formUrl);
    let fieldsCode = [];
    let tempField;
    fields.forEach((item)=>{
        tempField = objectFields[item];
        if(tempField){
            switch(tempField.type){
                case "text":
                    fieldsCode.push(`<label for="${tempField.name}">${tempField.label}</label><input id="${tempField.name}" name="${tempField.name}" type="text" /><br>\r\n`);
                    break;
                case "textarea":
                    fieldsCode.push(`<label for="${tempField.name}">${tempField.label}</label><textarea id="${tempField.name}" name="${tempField.name}"></textarea><br>\r\n`);
                    break;
                case "select":
                    if(tempField.options && tempField.options.length){
                        let selectInput,selectOptions = [];
                        if(tempField.multiple){
                            // 多选时input控件的name要带[]后缀，以强制转为数组提交
                            if(tempField.options && tempField.options.length){
                                selectOptions = tempField.options.map((item)=>{
                                return `        <span>
            <input id="${item.value}" name="${tempField.name}[]" type="checkbox" value="${item.value}">
            <label for="${item.value}">
                <span>${item.label}</span>
            </label>
        </span>`;
                                });
                            }
                            selectInput = `\r\n    <div>\r\n${selectOptions.join("\r\n")}\r\n    </div>`;
                        }
                        else{
                            if(tempField.options && tempField.options.length){
                                selectOptions = tempField.options.map((item)=>{
                                    return `<option value="${item.value}">${item.label}</option>`
                                });
                            }
                            selectOptions.unshift( `<option value="">${t("web_forms_select_option_none", {}, lng)}</option>`);
                            selectInput = `<select id="${tempField.name}" name="${tempField.name}">\r\n${selectOptions.join("\r\n")}\r\n</select>`;
                        }
                        fieldsCode.push(`<label for="${tempField.name}">${tempField.label}</label>${selectInput}<br>\r\n`);
                    }
                    break;
                default:
                    fieldsCode.push(`<label for="${tempField.name}">${tempField.label}</label><input id="${tempField.name}" name="${tempField.name}" type="text" /><br>\r\n`);
                    break;
            }
        }
    });
    fieldsCode = fieldsCode.join("\r\n    ");
    let code = `<!--  ----------------------------------------------------------------------  -->
<!--  注意：请将以下 <META> 元素添加到您的网页 <HEAD> 中。如有必要，请修改 charset 参数以指定 HTML 页的字符集。    -->
<!--  ----------------------------------------------------------------------  -->
<META HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">
<!--  ----------------------------------------------------------------------  -->
<!--  注意：请将以下 <FORM> 元素添加到您的网页中。                                  -->
<!--  ----------------------------------------------------------------------  -->
<form action="${formUrl}" method="POST">
    <input type=hidden name="steedos_form_id" value="${doc._id}">
    <input type=hidden name="return_url" value="${doc.return_url}">

    ${fieldsCode}
    <input type="submit" name="submit">
</form>`;
    return code;
}

module.exports = {
    listenTo: 'web_forms',
    afterInsert: async function () {
        let doc = this.doc;
        let generatedHtml = generatHtml(doc);
        if(generatedHtml){
            const object = this.getObject("web_forms");
            await object.directUpdate(doc._id, {generated_html:generatedHtml});
        }
    },
    afterUpdate: async function () {
        // 因为afterUpdate中没有this.doc._id，所以把previousDoc集成过去，编辑单个字段时也需要从previousDoc中集成其他字段
        let doc = Object.assign({}, this.previousDoc, this.doc);
        let generatedHtml = generatHtml(doc);
        if(generatedHtml){
            const object = this.getObject("web_forms");
            await object.directUpdate(doc._id, {generated_html:generatedHtml});
        }
    }
}