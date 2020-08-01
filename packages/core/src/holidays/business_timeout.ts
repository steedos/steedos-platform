import { computeBusinessHoursPerDay } from './business_hours';
import { JsonMap } from '@salesforce/ts-types';
import { getSteedosSchema } from '@steedos/objectql';
const moment = require('moment');

export const getTimeoutDateWithoutHolidays = async (start: Date, timeoutHours: number, spaceId: string) => {
    console.log("computeTimeoutDate===");
    const defultBusinessHoursOptions: any = { filters: [["space", "=", spaceId], ["is_default", "=", true]], fields: ["name", "start", "end", "working_days"] };
    const objectBusinessHours = getSteedosSchema().getObject("business_hours");
    const defultBusinessHoursRecords = await objectBusinessHours.find(defultBusinessHoursOptions);
    const defultBusinessHoursRecord = defultBusinessHoursRecords && defultBusinessHoursRecords[0];
    console.log("computeTimeoutDate===defultBusinessHoursRecord===", defultBusinessHoursRecord);
    const holidaysOptions: any = { filters: [["space", "=", spaceId]], fields: ["name", "type", "date", "adjusted_to"] };
    const objectHolidays = getSteedosSchema().getObject("holidays");
    const holidaysRecords = await objectHolidays.find(holidaysOptions);
    console.log("computeTimeoutDate===defultHolidaysRecords===", holidaysRecords);
    computeTimeoutDateWithoutHolidays(start, timeoutHours, defultBusinessHoursRecord, holidaysRecords, 8)
}

export const computeTimeoutDateWithoutHolidays = (start: Date, timeoutHours: number, holidays: Array<JsonMap>, businessHours: JsonMap, utcOffset: number) => {
    const businessHoursPerDay:any = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
    const start2 = moment.utc(start);
    start2.hours(businessHoursPerDay.endValue.hours + utcOffset);
    start2.hours(businessHoursPerDay.endValue.minutes);
    let offsetMinutes = start2.diff(start, 'minute');
    let timeoutMinutes = timeoutHours * 60;
    if(timeoutMinutes < offsetMinutes){
        // 超时时间小于当天下班前，则直接返回添加timeoutHours后的时间值
        return moment.utc(start).add(timeoutMinutes, 'm').toDate();
    }
    // TODO:计算其他情况
    
    return 3;
}