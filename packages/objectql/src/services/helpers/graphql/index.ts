/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-15 15:49:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-02-06 17:42:45
 * @Description: 
 */

export * from './consts'
export { _getRelatedType, correctName, getLocalService } from "./utils"
export { getQueryFields } from './getQueryFields'
export { generateActionGraphqlProp } from './generateActionGraphqlProp'
export { generateSettingsGraphql } from './generateSettingsGraphql'
export { getGraphqlActions } from './getGraphqlActions'
export { dealWithRelatedFields, getRelatedResolver } from './dealWithRelatedFields'