
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
        console.log("===runQuotedObjectFieldFormulas====", config);
        await updateQuotedObjectFieldFormulaValue(this.object_name, this.id, config);
        // this.doc[config.field_name] = await computeFieldFormulaValue(this.doc, config);
    }
}

export const fieldFormulaTriggers = {
    beforeUpdate: async function () {
        await runCurrentObjectFieldFormulas.bind(this)();
    },
    beforeInsert: async function () {
        await runCurrentObjectFieldFormulas.bind(this)();
    },
    afterUpdate: async function () {
        await runQuotedObjectFieldFormulas.bind(this)();
    }
}