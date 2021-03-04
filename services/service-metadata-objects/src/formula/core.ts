
import { extract } from '@steedos/formula';
import { getObjectFieldFormulaConfigs } from './field_formula';
import { isFieldFormulaConfigQuotingObjectAndFields } from './util';
import { SteedosFieldFormulaTypeConfig } from './type';
/**
 * 根据公式内容，取出其中{}中的变量
 * @param formula 
 */
export const pickFormulaVars = (formula: string): Array<string> => {
    return extract(formula);
}


/**
 * 某个对象上的公式字段是否引用了某个对象和字段
 * @param formulaObjectName 公式字段在所在对象名称
 * @param formulaFieldName 公式字段名称
 * @param object_name 是否引用了该对象
 * @param field_name 是否引用了该字段
 */
export const isFormulaFieldQuotingObjectAndFields = async (formulaObjectName: string, formulaFieldName: string, objectName: string, fieldNames?: Array<string>): Promise<boolean> => {
    const configs: Array<SteedosFieldFormulaTypeConfig> = await getObjectFieldFormulaConfigs(formulaObjectName, formulaFieldName);
    if (configs && configs.length) {
        return isFieldFormulaConfigQuotingObjectAndFields(configs[0], objectName, fieldNames);
    }
    else {
        // 没找到公式字段配置说明传入的参数不是公式字段
        return false;
    }
}