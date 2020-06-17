const generatHtml = (doc)=>{
    const fields = doc.fields;
    const object = Creator.getObject(doc.object_name);
    if(!object){
        throw new Error("web_forms_error_object_name_not_found");
    }
    const objectFields = object.fields;
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
                    fieldsCode.push(`<label for="${tempField.name}">${tempField.label}</label><textarea name="${tempField.name}"></textarea><br>\r\n`);
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

<form action=${formUrl} method="POST">
    <input type=hidden name="steedos_form_id" value="${doc._id}">
    <input type=hidden name="retURL" value="http://www.steedos.com/">

    <!--  ----------------------------------------------------------------------  -->
    <!--  注意：这些字段是可选的调试元素。如果希望在调试模式下进行测试，请取消这些行的留言。    -->
    <!--  <input type="hidden" name="debug" value=1>                              -->
    <!--  <input type="hidden" name="debugEmail"                                  -->
    <!--  value="zhuangjianguo@steedos.com">                                      -->
    <!--  ----------------------------------------------------------------------  -->

    ${fieldsCode}

    <input type="submit" name="submit">
</form>`;
    return code;
}

module.exports = {
    listenTo: 'web_forms',
    afterInsert: async function () {
        let doc = this.doc;
        const object = this.getObject("web_forms");
        let generatedHtml = generatHtml(doc);
        await object.directUpdate(doc._id, {generated_html:generatedHtml});
    },
    afterUpdate: async function () {
        // 因为afterUpdate中没有this.doc._id，所以把this.id集成过去
        let doc = Object.assign({}, this.doc, {_id: this.id});
        const object = this.getObject("web_forms");
        let generatedHtml = generatHtml(doc);
        await object.directUpdate(doc._id, {generated_html:generatedHtml});
    }
}