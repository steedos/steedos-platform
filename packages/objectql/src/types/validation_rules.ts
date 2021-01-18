
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
                throw new Error('object_validation_rules_wrong_formula');
            }
            if (result) {
                throw new Error(vr.error_message);
            }
        }
    }
}