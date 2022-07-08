/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-23 09:53:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-08 16:32:18
 * @Description: 
 */
export function getCreatedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${created_by._id}'>${created_by.name}</a> ${_display.created}</div>"
}

export function getModifiedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${modified_by._id}'>${modified_by.name}</a> ${_display.modified}</div>"
}

export function getDateTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}


export function getDateTimeTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

//TODO 处理name字段
export function getRefObjectNameFieldName(field){
    // const refObject = objectql.getObject(field.reference_to);
    // return refObject.NAME_FIELD_KEY;
    return 'name';
}

export function getSelectTpl(field){
    return `<div>\${_display.${field.name}}</div>`
}

export function getNameTpl(field, ctx){
    return `<a href="/app/${ctx.appId}/${ctx.tabId}/view/\${${ctx.idFieldName}}">\${${field.name}}</a>`
}

export function getLookupTpl(field){
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

export function getSwitchTpl(field){
    return `<% if (data.${field.name}) { %>
    <span class="slds-icon_container slds-icon-utility-check slds-current-color" title="<%=data._display.${field.name}%>">
        <span class="slds-assistive-text"><%=data._display.${field.name}%></span>
    </span>
    <% } %>`
}

export function getPasswordTpl(field){
    return `<% if (data.${field.name}) { %>
        <span>······</span>
        <% } %>`
}


export function getFieldTpl (field, options){
    if(field.is_name || field.name === options.labelFieldName){
        return getNameTpl(field, options)
    }
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