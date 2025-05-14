import { extract } from '@steedos/formula';
import { getObjectFieldFormulaConfigs } from './field_formula';
import { isFieldFormulaConfigQuotingObjectAndFields } from './util';
import { SteedosFieldFormulaTypeConfig } from './type';
import { parse } from "amis-formula"

const isAmisFormula = (formula: string) => {
    // 有${}包裹的表达式就识别为amis公式
    return /\$\{.+\}/.test(formula);
}

// const extractAmisFormulaVariableNames = (node, result = []) => {
//     // 检查当前节点是否有 "type" 属性，并且这个类型是 "variable"
//     if (node.type === 'variable') {
//         result.push(node.name);
//     }

//     // 如果当前节点是对象，递归检查所有子节点
//     for (const key in node) {
//         if (typeof node[key] === 'object' && node[key] !== null) {
//             extractAmisFormulaVariableNames(node[key], result);
//         }
//     }

//     return result;
// }


function extractAmisFormulaVariableNames(data) {
  let variables = [];
  
  // 检查当前节点是否是变量（但不是getter的host）
  if (data.type === 'variable' && 
      (!data._isGetterHost)) {  // 添加标记避免重复收集
    variables.push(data.name);
  }
  // 检查当前节点是否是getter
  else if (data.type === 'getter') {
    // 标记host节点，避免重复收集
    data.host._isGetterHost = true;
    variables.push(`${data.host.name}.${data.key.name}`);
  }
  
  // 递归检查所有子节点
  if (Array.isArray(data)) {
    for (const item of data) {
      if (typeof item === 'object' && item !== null) {
        variables = variables.concat(extractAmisFormulaVariableNames(item));
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        variables = variables.concat(extractAmisFormulaVariableNames(data[key]));
      }
    }
  }
  
  return variables;
}

/**
 * 根据公式内容，取出其中{}中的变量
 * @param formula 
 */
export const pickFormulaVars = (formula: string): Array<string> => {
    if(isAmisFormula(formula)){
        const result = extractAmisFormulaVariableNames(parse(formula));
        return result;
    }
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