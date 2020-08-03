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
    const startMoment = moment.utc(start);
    const start2 = moment.utc(start);
    console.log("===computeTimeoutDateWithoutHolidays=====startMoment.format()===", startMoment.format());
    console.log("===computeTimeoutDateWithoutHolidays=====start2.format()===", start2.format());
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.hours===", businessHoursPerDay.endValue.hours);
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.minutes===", businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays=====utcOffset===", utcOffset);
    start2.hours(businessHoursPerDay.endValue.hours - utcOffset);
    start2.minutes(businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays===2==start2.format()===", start2.format());
    let offsetMinutes = start2.diff(startMoment, 'minute');
    let timeoutMinutes = timeoutHours * 60;
    console.log("===computeTimeoutDateWithoutHolidays=====timeoutMinutes, offsetMinutes===", timeoutMinutes, offsetMinutes);
    if(timeoutMinutes <= offsetMinutes){
        // 超时时间小于等于当天下班前，则直接返回添加timeoutHours后的时间值
        return moment.utc(start).add(timeoutMinutes, 'm').toDate();
    }
    else{
        // 超时时间大于当天下班前。
        // 没有周未和假期，则返回添加跳过下班时间后的超时时间值。
        // let result = moment.utc(start).add(offsetMinutes, 'm').toDate();
    }
    // TODO:计算其他情况
    
    return 3;
}