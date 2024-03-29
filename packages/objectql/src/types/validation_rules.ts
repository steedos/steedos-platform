/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:57
 * @Description: 
 */

import { computeFormula } from '../formula';
import { SteedosTriggerContextConfig } from "./trigger";
import { SteedosUserSession, getObject } from ".";
import { getMetadata } from "../index";

export async function runValidationRules(method: string, context: SteedosTriggerContextConfig, objectName: string, userSession: SteedosUserSession) {
    if ((method === 'insert' || method === 'update') && userSession) {
        let doc = context.doc;
        let validationRules = await getMetadata('object_validation_rules').find([['object_name', '=', objectName], ['active', '=', true]], userSession.spaceId);
        for (const vr of validationRules) {
            let result;
            try {
                result = await computeFormula(vr.error_condition_formula, objectName, doc, userSession);
            } catch (error) {
                throw new Error(`公式错误，请检查错误条件公式。${error.message.replace(/\:/g, '：')}`);
            }
            if (result) {
                throw new Error(vr.error_message);
            }
        }
    }
}