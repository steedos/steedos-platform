const objectql = require('@steedos/objectql');
const _ = require('lodash');

const getCalendarListViews = function (object_name) {
    if (object_name.startsWith('cfs.')) {
        return;
    }
    const object = objectql.getObject(object_name);
    const objectConfig = object.toConfig();
    const objectListViews = objectConfig.list_views;
    return _.filter(objectListViews, (listview, key)=>{
        return listview.type === "calendar";
    });
}

const validateStartEndDate = function (start, end) {
    if(start && end){
        const startTime = start.getTime ? start.getTime() : (new Date(start)).getTime();
        const endTime = end.getTime ? end.getTime() : (new Date(end)).getTime();
        if(endTime - startTime < 1000){
            throw new Error("base_error_start_end_date");
        }
    }
}

const validateCalendarListview = function (listview, doc) {
    const {startDateExpr, endDateExpr} = listview.options || {};
    if(startDateExpr && startDateExpr !== endDateExpr){
        validateStartEndDate(doc[startDateExpr], doc[endDateExpr]);
    }
}

const validateCalendarListviews = function (object_name, doc) {
    const calendarListviews = getCalendarListViews(object_name);
    if(calendarListviews && calendarListviews.length){
        calendarListviews.forEach((listview)=>{
            validateCalendarListview(listview, doc);
        });
    }
}

const beforeInsertCalendar = async function () {
    const { doc, object_name} = this;
    validateCalendarListviews(object_name, doc);
}
const beforeUpdateCalendar = async function () {
    const { doc, object_name} = this;
    validateCalendarListviews(object_name, doc);
}

module.exports = {
    listenTo: 'base',
    beforeInsert: async function () {
        return await beforeInsertCalendar.apply(this, arguments)
    },
    beforeUpdate: async function () {
        return await beforeUpdateCalendar.apply(this, arguments)
    }
}