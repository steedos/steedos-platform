
import { getObjectFieldFormulaConfigs, SteedosFieldFormulaTypeConfig } from './field_formula';
import { computeFieldFormularValue } from './core';

const runFieldFormular = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig) {
    this.doc[fieldFormulaConfig.field_name] = await computeFieldFormularValue(this.doc, fieldFormulaConfig)
}

export const fieldFormulaTriggers = {
    beforeUpdate: async function () {
        const configs = getObjectFieldFormulaConfigs(this.object_name);
        for (const config of configs) {
            await runFieldFormular.bind(this)(config)
        }
    },
    beforeInsert: async function () {
        const configs = getObjectFieldFormulaConfigs(this.object_name);
        for (const config of configs) {
            await runFieldFormular.bind(this)(config)
        }
    }
}