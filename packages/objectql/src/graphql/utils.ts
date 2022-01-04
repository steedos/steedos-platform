const moment = require('moment');
const _ = require('underscore');
const clone = require("clone");
import { translationObject } from '@steedos/i18n';
import { getUserLocale } from "../util/locale";

declare var t: any;


const getTranslatedFieldConfig = (translatedObject: any, name: string) => {
    return translatedObject.fields[name.replace(/__label$/,"")];
}

/**
 * 
 * @param field {type,name,dataType,options,multiple}
 * @param value 
 * @param userSession 
 */
// export function getFieldLabel(field, value, userSession) {
export function getFieldLabel(name: string, value: any, relatedFields: any, object: any, userSession: any) {
    const lng = getUserLocale(userSession);
    let _object = clone(object.toConfig());
    translationObject(lng, _object.name, _object);
    let utcOffset = userSession.utcOffset;
    let locale = userSession.locale;
    // let field = relatedObjects[info.parentType.name].fields[info.name];
    let field = relatedFields[name];
    let type = field.dataType;
    let label = '';
    if (type === 'boolean') {
        if (value === true) {
            label = t('YES', null, locale);
        } else {
            label = t('NO', null, locale);
        }
    } else if (type === 'date' && value) {
        label = moment(value).utcOffset(utcOffset).format("YYYY-MM-DD")
    } else if (type === 'datetime' && value) {
        label = moment(value).utcOffset(utcOffset).format("YYYY-MM-DD H:mm")
    } else if (type === 'select' && value) {
        let map = {};
        let translatedField = getTranslatedFieldConfig(_object, name);
        let translatedFieldOptions = translatedField && translatedField.options;
        _.forEach(translatedFieldOptions, function (o) {
            map[o.value] = o.label;
        });
        if (field.multiple) {
            let labels = [];
            _.forEach(value, function (v) {
                labels.push(map[v]);
            })
            label = labels.join(',');
        } else {
            label = map[value];
        }
    } else if (type === 'percent' && _.isNumber(value)) {
        label = `${value * 100}%`
    }
    return label;
}