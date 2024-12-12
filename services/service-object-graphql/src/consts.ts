/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-20 19:02:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-12-12 16:10:21
 * @Description: 
 */

export const BASIC_TYPE_MAPPING = {
    'text': 'String',
    'textarea': 'String',
    'html': 'String',
    'url': 'String',
    'email': 'String',
    'date': 'Date',
    'datetime': 'Date',
    'time': 'Date',
    'number': 'Float',
    'currency': 'Float',
    'boolean': 'Boolean'
};
export const EXPAND_SUFFIX = '__expand';
export const DISPLAY_PREFIX = '_display';
export const UI_PREFIX = '_ui';
export const RELATED_PREFIX = '_related';
export const GRAPHQL_ACTION_PREFIX = 'graphql_';
export const PERMISSIONS_PREFIX = '_permissions';
export const OBJECT_FIELD_TYPE = '__object';
export const GRID_FIELD_TYPE = '__grid';
export const QUERY_DOCS_TOP = 10000;