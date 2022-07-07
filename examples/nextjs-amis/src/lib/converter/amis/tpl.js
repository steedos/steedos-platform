/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 11:06:20
 * @Description: 
 */
function getCreatedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${created_by._id}'>${created_by.name}</a> ${_display.created}</div>"
}

function getModifiedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${modified_by._id}'>${modified_by.name}</a> ${_display.modified}</div>"
}

function getDateTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}


function getDateTimeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

//TODO 处理name字段
function getRefObjectNameFieldName(field){
    // const refObject = objectql.getObject(field.reference_to);
    // return refObject.NAME_FIELD_KEY;
    return 'name';
}

function getSelectTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

function getLookupTpl(field){
    if(!field.reference_to){
        return getSelectTpl(field)
    }
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if(field.multiple){
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="/app/-/${field.reference_to}/view/<%=item._id%>"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `
    }else{
        return `<a href="/app/-/${field.reference_to}/view/\${${field.name}._id}">\${${field.name}.${NAME_FIELD_KEY}}</a>`
    }
    
}

function getSwitchTpl(field){
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=data._display.${field.name}%>">
        <div class="steedos-icon-wrap"><span><svg aria-hidden="true" class="slds-icon_x-small slds-icon slds-icon-text-default" viewBox="0 0 52 52" name="check"><path d="M19.1 42.5L2.6 25.9c-.6-.6-.6-1.6 0-2.2l2.2-2.2c.6-.6 1.6-.6 2.2 0L19.4 34c.4.4 1.1.4 1.5 0L45.2 9.5c.6-.6 1.6-.6 2.2 0l2.2 2.2c.6.6.6 1.6 0 2.2L21.3 42.5c-.6.7-1.6.7-2.2 0z"></path></svg></span></div>
        <span class="slds-assistive-text"><%=data._display.${field.name}%></span>
    </span>
    <% } %>`
}

function getPasswordTpl(field){
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`
}

//TODO
exports.getPasswordTpl = getPasswordTpl;
exports.getSwitchTpl = getSwitchTpl;
exports.getSelectTpl = getSelectTpl;
exports.getDateTpl = getDateTpl;
exports.getDateTimeTpl = getDateTimeTpl;
exports.getLookupTpl = getLookupTpl
exports.getCreatedInfoTpl = getCreatedInfoTpl
exports.getModifiedInfoTpl = getModifiedInfoTpl

exports.getFieldTpl = function(field){
    switch (field.type) {
        case 'password':
            return getPasswordTpl(field);
        case 'boolean':
            return getSwitchTpl(field);
        case 'select':
            return getSelectTpl(field);
        case 'date':
            return getDateTpl(field);
        case 'datetime':
            return getDateTimeTpl(field);
        case 'lookup':
            return getLookupTpl(field);
        case 'master_detail':
            return getLookupTpl(field);
        default:
            break;
    }
};