/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-02-06 16:57:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-06 16:59:01
 * @Description: 
 */
const { moleculerGql: gql } = require("moleculer-apollo-server");
import { SteedosObjectTypeConfig } from "../../..";

export function generateActionGraphqlProp(actionName: string, objectConfig: SteedosObjectTypeConfig) {
    let gplObj: any = {};
    let objectName = objectConfig.name;
    if (objectName == 'users') {
        return gplObj;
    }
    switch (actionName) {
        case 'graphqlCount':
            gplObj.query = gql`
                type Query {
                    ${objectName}__count(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): Int
                }
            `;
            break;
        case 'graphqlFind':
            gplObj.query = gql`
                type Query {
                    ${objectName}(fields: JSON, filters: JSON, top: Int, skip: Int, sort: String): [${objectName}]
                }
            `;
            break;
        case 'findOne':
            gplObj.query = gql`
                type Query {
                    ${objectName}__${actionName}(id: JSON): ${objectName}
                }
            `;
            break;
        case 'insert':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(doc: JSON): ${objectName}
                }
            `;
            break;
        case 'update':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON, doc: JSON): ${objectName}
                }
            `;
            break;
        case 'delete':
            gplObj.mutation = gql`
                type Mutation {
                    ${objectName}__${actionName}(id: JSON): JSON
                }
            `;
            break;
        default:
            // console.error(`need to handle action: ${actionName}`);
            break;
    }
    // console.log(gplObj);
    return gplObj;
}