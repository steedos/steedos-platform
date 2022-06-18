/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-15 15:50:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-17 15:19:47
 * @Description: 根据query的请求体解析出查询的字段
 */
import { GraphQLResolveInfo } from 'graphql';
import {
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    ResolveTree,
} from 'graphql-parse-resolve-info';

import _ = require('lodash');

export function getQueryFields(resolveInfo: GraphQLResolveInfo) {
    const fieldsName = []
    const parsedResolveInfoFragment: ResolveTree = <ResolveTree>parseResolveInfo(resolveInfo);
    const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
    );

    const fields = simplifiedFragment.fields;
    if (!_.isEmpty(fields)) {
        for (const key in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, key)) {
                fieldsName.push(fields[key].name)
            }
        }
    }

    return fieldsName;

}