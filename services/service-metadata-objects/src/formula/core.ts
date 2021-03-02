
import { extract } from '@steedos/formula';

/**
 * 根据公式内容，取出其中{}中的变量
 * @param formula 
 */
export const pickFormulaVars = (formula: string): Array<string> => {
    return extract(formula);
}
