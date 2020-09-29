import _ = require('underscore');
import { getObject } from '../types/object';
import { SteedosFormulaBlankValue } from './type';

const enum FormulonDataType {
    Text = 'text',
    Number = 'number',
    Date = 'date',
    Datetime = 'datetime',
    Time = 'time',
    Checkbox = 'checkbox',
    Picklist = 'picklist',
    Multipicklist = 'multipicklist',
    Geolocation = 'geolocation',
    Null = 'null'
}

function getFieldSteedosType(field: any){
    if(_.include(['formula', 'summary'], field.type)){
        return field.data_type
    }
    return field.type
}

function getField(objectName: string, fieldName: string){
    if(fieldName === '_id'){
        return {type: 'text'}
    }
    return getObject(objectName).getField(fieldName);
}

function getSubstitutionDataType(objectName: string, fieldName: string, value: any, blankValue: SteedosFormulaBlankValue){
    const field: any = getField(objectName, fieldName);
    const steedosType = getFieldSteedosType(field);
    let dateType: FormulonDataType;
    switch (steedosType) {
        case 'text':
            dateType = FormulonDataType.Text;
            break;
        case 'textarea':
            dateType = FormulonDataType.Text;
            break;
        case 'html':
            dateType = FormulonDataType.Text;
            break;
        case 'password':
            dateType = FormulonDataType.Text;
            break;
        case 'autonumber':
            dateType = FormulonDataType.Text;
            break;
        case 'url':
            dateType = FormulonDataType.Text;
            break;
        case 'email':
            dateType = FormulonDataType.Text;
            break;
        case 'number':
            dateType = FormulonDataType.Number;
            break;
        case 'currency':
            dateType = FormulonDataType.Number;
            break;
        case 'date':
            dateType = FormulonDataType.Date;
            break;
        case 'datetime':
            dateType = FormulonDataType.Datetime;
            break;
        case 'boolean':
            dateType = FormulonDataType.Checkbox;
            break;
        case 'select':
            if(field.multiple){
                dateType = FormulonDataType.Multipicklist;
            }else{
                dateType = FormulonDataType.Text;
                // dateType = FormulonDataType.Picklist;
            }
            break;
        case 'lookup':
            if(field.multiple){
                dateType = FormulonDataType.Multipicklist;
            }else{
                dateType = FormulonDataType.Picklist;
            }
            break;
        case 'master_detail':
            dateType = FormulonDataType.Picklist;
            break;
        case 'geolocation':
            dateType = FormulonDataType.Geolocation;
            break;
        case 'null':
            dateType = FormulonDataType.Null
            break;
        default:
            break;
    }

    if(dateType == FormulonDataType.Number && (value === null || value === undefined)){
        if(blankValue === SteedosFormulaBlankValue.blanks){
            return FormulonDataType.Null;
        }
    }
    return dateType;
}

function getSubstitutionOptions(objectName: string, fieldName: string, dataType: string){
    const field: any = getField(objectName, fieldName);
    switch (dataType) {
        case 'number':
            if(_.has(field, 'scale')){
                return {scale: field.scale}
            }else{
                return {scale: 2}
            }
        case 'text':
            return {length: Number.MAX_VALUE};
        default:
            return ;
    }
}

function getSubstitutionValue(dataType: string, value: any){
    switch (dataType) {
        case FormulonDataType.Text:
            if(value === null || value === undefined){
                return '';
            }
            break;
        case FormulonDataType.Number:
            if(value === null || value === undefined){
                return 0;
            }
            break;
        default:
            break;
    }
    return value;
}

export function getFieldSubstitution(objectName: string, fieldName: string, value: any, blankValue: SteedosFormulaBlankValue){
    let fieldSubstitution: any = {
        type: 'literal',
        value: value
    }
    fieldSubstitution.dataType = getSubstitutionDataType(objectName, fieldName, value, blankValue);
    fieldSubstitution.options = getSubstitutionOptions(objectName, fieldName, fieldSubstitution.dataType);
    fieldSubstitution.value  = getSubstitutionValue(fieldSubstitution.dataType, value);
    return fieldSubstitution;
}