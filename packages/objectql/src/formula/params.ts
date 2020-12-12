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
        case 'percent':
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
            // 当值为空且配置为按空值处理时按NULL类型来处理空值
            // 因为Number类型在公式引擎包中当值为空时始终ISBLANK及BLANKVALUE始终被判断为非空值
            // 目前ISBLANK只支持字符串参数，只能用ISBLANK(TEXT(Amount))这种写法代替，但是这种写法又始终被判定为false，因为公式TEXT(null)运行结果为"NULL"
            // 所以对于数值类型，即不能用ISBLANK(TEXT(Amount))也不能用ISBLANK(Amount)，
            // 而应该用Amount > 0，当Amount为空时，即使设置formula_blank_value为"blanks"，其返回值也是false
            // 实在要判断空值，可以用TEXT(Amount) == "NULL"来判断，而不可以用ISBLANK(TEXT(Amount))或ISBLANK(Amount)
            return FormulonDataType.Null;
        }
    }
    return dateType;
}

function getSubstitutionOptions(objectName: string, fieldName: string, dataType: string){
    const field: any = getField(objectName, fieldName);
    const steedosType = getFieldSteedosType(field);
    switch (dataType) {
        case 'number':
            let scale = 0;
            if(_.has(field, 'scale')){
                scale = field.scale;
            }else{
                // 数值类型默认按2位小数来计算
                scale = 2;
            }
            if(steedosType === "percent"){
                // 百分比类型参数，scale配置的是百分比的小数位数，计算时需要额外增加2位小数，比如scale配置为1时，像20.2%这样的数值计算时应该按0.202是三位小数参与计算。
                scale += 2;
            }
            return { scale };
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