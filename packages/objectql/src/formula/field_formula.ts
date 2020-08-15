import { addConfig } from '../types';
import { getConfigs, getConfig } from '../types/config';

export type SteedosFieldFormulaQuoteConfig = {
    object_name: string,
    field_name: string
}

export type SteedosFieldFormulaTypeConfig = {
    _id: string,
    object_name: string,
    field_name: string,
    formula: string,
    quotes: Array<SteedosFieldFormulaQuoteConfig>
}

export const addFieldFormulaConfig = (config: SteedosFieldFormulaTypeConfig) => {
    addConfig('field_formula', config);
}

export const getFieldFormulaConfigs = () => {
    return getConfigs('field_formula')
}

export const getFieldFormulaConfig = (_id: string):SteedosFieldFormulaTypeConfig => {
    return getConfig('field_formula', _id);
}
