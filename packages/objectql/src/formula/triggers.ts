
import { getObjectFieldFormulaConfigs, getObjectQuotedByFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, updateQuotedByObjectFieldFormulaValue } from './core';

// const runFieldFormula = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig) {
//     this.doc[fieldFormulaConfig.field_name] = await computeFieldFormulaValue(this.doc, fieldFormulaConfig)
// }

const runCurrentObjectFieldFormulas = async function () {
    // 该函数在beforeInsert、beforeUpdate（而不是afterInsert,afterUpdate）中运行
    // 因为不能保证最后一定会成功执行insert/update
    // 所以这里不可以写修改其他记录的代码（比如不可以去修改引用了该对象字段的其他字段公式值），只能修改当前this.doc的字段属性值
    const configs = getObjectFieldFormulaConfigs(this.object_name);
    for (const config of configs) {
        this.doc[config.field_name] = await computeFieldFormulaValue(this.doc, config);
    }
}

const runQuotedByObjectFieldFormulas = async function () {
    const configs = getObjectQuotedByFieldFormulaConfigs(this.object_name);
    for (const config of configs) {
        await updateQuotedByObjectFieldFormulaValue(this.object_name, this.id, config);
    }
}

export const fieldFormulaTriggers = {
    beforeInsert: async function () {
        await runCurrentObjectFieldFormulas.bind(this)();
    },
    beforeUpdate: async function () {
        await runCurrentObjectFieldFormulas.bind(this)();
    },
    afterUpdate: async function () {
        await runQuotedByObjectFieldFormulas.bind(this)();
    }
}