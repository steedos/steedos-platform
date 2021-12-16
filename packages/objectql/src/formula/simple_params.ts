import { SteedosFormulaBlankValue } from './type';
import { FormulonDataType } from './params';

const VALUE_TYPES_NOT_SUPPORTED = ["function"];

function getSubstitutionDataType(value: any){
    const valueType = typeof value;
    let dateType: FormulonDataType;
    if(VALUE_TYPES_NOT_SUPPORTED.indexOf(dateType) > -1){
        throw new Error(`runFormula:Catch an error the param type "${valueType}" is not supported while eval formula with the params value: "${value}"`);
    }
    switch (valueType) {
        case 'string':
            dateType = FormulonDataType.Text;
            break;
        case 'number':
            dateType = FormulonDataType.Number;
            break;
        case 'boolean':
            dateType = FormulonDataType.Checkbox;
            break;
        case 'object':
            if(value === null){
                dateType = FormulonDataType.Null;
            }
            else if (value instanceof Date){
                dateType = FormulonDataType.Datetime;
            }
            else{
                throw new Error(`runFormula:Catch an error the param type "${valueType}" is not supported while eval formula with the params value: "${value}"`);
            }
            break;
        case 'undefined':
            dateType = FormulonDataType.Null;
            break;
        default:
            break;
    }
    return dateType;
}

function getSubstitutionOptions(dataType: string, value: any){
    switch (dataType) {
        case FormulonDataType.Number:
            let scale = 0;
            let str = value.toString();
            let dotStr = str.toString().split(".")[1];
            let dotCount = dotStr && dotStr.length;
            if(dotCount > 0){
                scale = dotCount;
            }
            return { scale };
        case FormulonDataType.Text:
            return {length: Number.MAX_VALUE};
        default:
            return ;
    }
}

function getSubstitutionValue(dataType: string, value: any, blankValue: SteedosFormulaBlankValue){
    switch (dataType) {
        case FormulonDataType.Text:
            if(value === null || value === undefined){
                return '';
            }
            break;
        case FormulonDataType.Number:
            if(value === null || value === undefined){
                if(blankValue === SteedosFormulaBlankValue.blanks){
                    return null;
                }
                else{
                    return 0;
                }
            }
            break;
        default:
            break;
    }
    return value;
}

export function getSimpleParamSubstitution(value: any, blankValue: SteedosFormulaBlankValue){
    let fieldSubstitution: any = {
        type: 'literal',
        value: value
    }
    fieldSubstitution.dataType = getSubstitutionDataType(value);
    fieldSubstitution.options = getSubstitutionOptions(fieldSubstitution.dataType, value);
    fieldSubstitution.value  = getSubstitutionValue(fieldSubstitution.dataType, value, blankValue);
    return fieldSubstitution;
}