import { reduce, map, isEmpty, isString } from 'underscore';
import { formatFiltersToODataQuery } from "./format";

// 把"a.b.c"这种字符fieldName转换为{"a":{"b":{"c":{}}}}这种json
let expandFieldName = (initial, fieldName) => {
    reduce(fieldName.split("."),function(m, k){
        if(!m[k]){
            m[k] = {};
        }
        return m[k]
    }, initial);
    return initial;
}


// 把["a.b.c","x.y","x.z","m"]这种字符fieldName转换为{"a":{"b":{"c":{}}},"x":{"y":{},"z":{}},"m":{}}这种json对象格式
let expandFieldNames = (fieldNames) => {
    let initial = {};
    fieldNames.forEach((n) => {
        expandFieldName(initial, n)
    });
    return initial;
}

let generateIndents = (count) =>{
    return Array(count).fill("    ").join("");
}

/** 
把{"a":{"b":{"c":{}}}}这种json转换为字符格式：
{
    a {
        b {
            c
        }
    }
}
*/ 
let reduceGraphqlFieldsQuery = (fields, indentsCount) => {
    if(!indentsCount){
        indentsCount = 0;
    }
    let itemQuery;
    return ` {
${
    map(fields, (fieldValue, fieldKey) => {
        itemQuery = generateIndents(indentsCount) + generateIndents(1) + fieldKey;
        if(isEmpty(fieldValue)){
            itemQuery += "\n"
        }
        else{
            indentsCount += 1;
            itemQuery += reduceGraphqlFieldsQuery(fieldValue, indentsCount);
            indentsCount -= 1;
        }
        return itemQuery;
    }).join("")
}${generateIndents(indentsCount)}}
`;
}

let formatFieldsToGraphqlQuery = (fields) => {
    if(isString(fields)){
        fields = fields.split(",");
    }
    let expandedFields = expandFieldNames(fields);
    return reduceGraphqlFieldsQuery(expandedFields, 3);
}

/**
 * 
 * 
 * 把filters和fields转换为如下格式的graphql请求串
  query {
    contracts(filters:[
      [
        "create_date",
        "between",
        "this_year"
      ]
  ]) {
      name
      amount
      contract_type {
        name
      }
    }
  }
 * @param {*} filters ,请求的过滤条件
 * @param {*} fields ,请求的字段，支持["a.b.c","m","n"]或"a.b.c,m,n"这种语法
 */
let formatFiltersToGraphqlQuery = (objectName, filters, fields, userContext, odataProtocolVersion, forceLowerCase) => {
    if(!isString(filters)){
        filters = formatFiltersToODataQuery(filters, userContext, odataProtocolVersion, forceLowerCase);
    }
    let filtersWrap  = filters ? `(filters:"${filters}")` : "";
    let graphqlFields = formatFieldsToGraphqlQuery(fields);
    let graphqlQuery = `
        query {
            ${objectName}${filtersWrap}${graphqlFields}
        }
    `;
    return graphqlQuery;
};

const _formatFiltersToGraphqlQuery = formatFiltersToGraphqlQuery;
export { _formatFiltersToGraphqlQuery as formatFiltersToGraphqlQuery };
