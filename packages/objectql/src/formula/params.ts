import _ = require('underscore');
import { getObject } from '../types/object';

const enum FormulonDataType {
    Text = 'text',
    Number = 'number',
    Date = 'date',
    Datetime = 'datetime',
    Time = 'time',
    Checkbox = 'checkbox',
    Picklist = 'picklist',
    Multipicklist = 'multipicklist',
    Geolocation = 'geolocation'
}

function getFieldSteedosType(field: any){
    if(_.include(['formula', 'summary'], field.type)){
        return field.formula_data_type
    }
    return field.type
}

function getField(objectName: string, fieldName: string){
    return getObject(objectName).getField(fieldName);
}

function getSubstitutionDataType(objectName: string, fieldName: string){

    const field = getField(objectName, fieldName);

    const steedosType = getFieldSteedosType(field);

    switch (steedosType) {
        case 'text':
            return FormulonDataType.Text;
        case 'textarea':
            return FormulonDataType.Text;
        case 'html':
            return FormulonDataType.Text;
        case 'password':
            return FormulonDataType.Text;
        case 'autonumber':
            return FormulonDataType.Text;
        case 'url':
            return FormulonDataType.Text;
        case 'email':
            return FormulonDataType.Text;
        case 'number':
            return FormulonDataType.Number;
        case 'currency':
            return FormulonDataType.Number;
        case 'date':
            return FormulonDataType.Date;
        case 'datetime':
            return FormulonDataType.Datetime;
        case 'boolean':
            return FormulonDataType.Checkbox;
        case 'select':
            if(field.multiple){
                return FormulonDataType.Multipicklist;
            }else{
                return FormulonDataType.Text;
                // return FormulonDataType.Picklist;
            }
        case 'lookup':
            if(field.multiple){
                return FormulonDataType.Multipicklist;
            }else{
                return FormulonDataType.Picklist;
            }
        case 'master_detail':
            return FormulonDataType.Picklist;
        case 'geolocation':
            return FormulonDataType.Geolocation;
        default:
            break;
    }
}

function getSubstitutionOptions(objectName: string, fieldName: string, dataType: string){
    const field = getField(objectName, fieldName);
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

export function getFieldSubstitution(objectName: string, fieldName: string, value: any){
    let fieldSubstitution: any = {
        type: 'literal',
        value: value
    }
    fieldSubstitution.dataType = getSubstitutionDataType(objectName, fieldName);
    fieldSubstitution.options = getSubstitutionOptions(objectName, fieldName, fieldSubstitution.dataType);
    fieldSubstitution.value  = getSubstitutionValue(fieldSubstitution.dataType, value);
    return fieldSubstitution;
}