/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-15 15:50:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-16 15:38:43
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
    return undefined; // TODO:由于规则严格后导致外部数据源功能不可用，暂时不启用

    const parsedResolveInfoFragment: ResolveTree = <ResolveTree>parseResolveInfo(resolveInfo);
    const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
    );

    if (!_.isEmpty(simplifiedFragment.fields)) {
        return Object.keys(simplifiedFragment.fields);
    }

    return [];

}