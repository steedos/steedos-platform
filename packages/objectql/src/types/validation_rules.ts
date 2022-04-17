/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-17 12:03:58
 * @Description: 
 */

import { computeFormula } from '../formula';
import { SteedosTriggerContextConfig } from "./trigger";
import { SteedosUserSession, getObject } from ".";

export async function runValidationRules(method: string, context: SteedosTriggerContextConfig, objectName: string, userSession: SteedosUserSession) {
    if ((method === 'insert' || method === 'update') && userSession) {
        let spaceId = userSession.spaceId;
        let userId = userSession.userId + '';
        let doc = context.doc;
        let validationRules = await getObject('object_validation_rules').find({ filters: [['space', '=', spaceId], ['object_name', '=', objectName], ['active', '=', true]] });
        for (const vr of validationRules) {
            let result;
            try {
                result = await computeFormula(vr.error_condition_formula, objectName, doc, userId, spaceId);
            } catch (error) {
                throw new Error(`公式错误，请检查错误条件公式。${error.message.replace(/\:/g, '：')}`);
            }
            if (result) {
                throw new Error(vr.error_message);
            }
        }
    }
}