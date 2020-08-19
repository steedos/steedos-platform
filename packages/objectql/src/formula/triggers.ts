
import { getObjectFieldFormulaConfigs, getObjectQuotedFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, updateQuotedObjectFieldFormulaValue } from './core';

// const runFieldFormula = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig) {
//     this.doc[fieldFormulaConfig.field_name] = await computeFieldFormulaValue(this.doc, fieldFormulaConfig)
// }

const runCurrentObjectFieldFormulas = async function () {
    const configs = getObjectFieldFormulaConfigs(this.object_name);
    for (const config of configs) {
        this.doc[config.field_name] = await computeFieldFormulaValue(this.doc, config);
    }
}

const runQuotedObjectFieldFormulas = async function () {
    const configs = getObjectQuotedFieldFormulaConfigs(this.object_name);
    for (const config of configs) {
        await updateQuotedObjectFieldFormulaValue(this.object_name, this.id, config);
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
        await runQuotedObjectFieldFormulas.bind(this)();
    }
}