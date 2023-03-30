/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 16:57:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-26 14:37:39
 * @Description: 
 */
const { moleculerGql: gql } = require("moleculer-apollo-server");
import { SteedosObjectTypeConfig } from "@steedos/objectql";

export function generateActionGraphqlProp(actionName: string, objectConfig: SteedosObjectTypeConfig) {
    let gplStr = '';
    let objectName = objectConfig.name;
    if (objectName == 'users') {
        return '';
    }
    switch (actionName) {
        case 'count':
            gplStr = gql`
                type Query {
                    ${objectName}__count(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): Int
                }
            `;
            break;
        case 'find':
            gplStr = gql`
                type Query {
                    ${objectName}(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [${objectName}]
                }
            `;
            break;
        case 'findOne':
            gplStr = gql`
                type Query {
                    ${objectName}__${actionName}(id: JSON): ${objectName}
                }
            `;
            break;
        case 'insert':
            gplStr = gql`
                type Mutation {
                    ${objectName}__${actionName}(doc: JSON): ${objectName}
                }
            `;
            break;
        case 'update':
            gplStr = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON, doc: JSON): ${objectName}
                }
            `;
            break;
        case 'delete':
            gplStr = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON): JSON
                }
            `;
            break;
        default:
            // console.error(`need to handle action: ${actionName}`);
            break;
    }
    return gplStr;
}