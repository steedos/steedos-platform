const moment = require('moment');
const _ = require('underscore');
declare var t: any;

/**
 * 
 * @param field {type,name,dataType,options,multiple}
 * @param value 
 * @param userSession 
 */
export function getFieldLabel(field, value, userSession) {
    let utcOffset = userSession.utcOffset;
    let locale = userSession.locale;
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
        _.forEach(field.options, function (o) {
            map[o.value] = o.label;
        })
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