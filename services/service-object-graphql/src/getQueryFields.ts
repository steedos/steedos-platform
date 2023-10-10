/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-15 15:50:29
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-10 17:12:11
 * @Description: 根据query的请求体解析出查询的字段
 */
import { GraphQLResolveInfo } from 'graphql';
import {
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    ResolveTree,
} from 'graphql-parse-resolve-info';

import _ = require('lodash');

import { DISPLAY_PREFIX, EXPAND_SUFFIX, RELATED_PREFIX, UI_PREFIX, PERMISSIONS_PREFIX } from './consts'

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
            const field = fields[key];
            const name = field.name
            // 如果field.name以__expand结尾，则将field.name去掉__expand后，作为查询的字段名
            if (name.endsWith(EXPAND_SUFFIX)) {
                fieldsName.push(name.slice(0, -EXPAND_SUFFIX.length));
                continue
            }
            // 如果field.name值为_display，则跳过
            if (name === DISPLAY_PREFIX) {
                continue
            }
            // 如果field.name以_related开头，则跳过
            if (name.startsWith(RELATED_PREFIX)) {
                continue
            }

            if (name.startsWith(UI_PREFIX)) {
                continue
            }

            if (name.startsWith(PERMISSIONS_PREFIX)) {
                continue
            }
            fieldsName.push(name)
        }
    }
    // console.log(fieldsName);
    return fieldsName;

}