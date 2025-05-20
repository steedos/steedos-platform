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
  const variables = new Set();

  function traverse(node) {
    if (!node || typeof node !== 'object') return;

    // 处理普通变量（排除作为getter host的情况）
    if (node.type === 'variable' && !isGetterHost(node)) {
      variables.add(node.name);
    }
    // 处理最外层的getter（不处理嵌套的getter host）
    else if (node.type === 'getter' && !isGetterHost(node)) {
      const path = getFullGetterPath(node);
      if (path) variables.add(path);
    }

    // 递归遍历所有子节点
    for (const key in node) {
      if (key !== 'parent' && typeof node[key] === 'object') {
        // 设置父节点引用
        node[key].parent = node;
        traverse(node[key]);
      }
    }
  }

  function isGetterHost(node) {
    return node.parent && node.parent.type === 'getter' && node.parent.host === node;
  }

  function getFullGetterPath(getterNode) {
    const parts = [getterNode.key.name];
    let current = getterNode.host;

    // 向上追溯host
    while (current) {
      if (current.type === 'getter') {
        parts.unshift(current.key.name);
        current = current.host;
      } else if (current.type === 'variable') {
        parts.unshift(current.name);
        return parts.join('.');
      } else {
        break;
      }
    }

    return null;
  }

  traverse(data);
  return Array.from(variables);
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