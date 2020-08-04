import { computeBusinessHoursPerDay, computeNextBusinessDateStartTime } from './business_hours';
import { getSteedosSchema } from '@steedos/objectql';
import { BusinessHoursPerDay, Holiday, BusinessHours } from './types';
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

export const computeTimeoutDateWithoutHolidays = (start: Date, timeoutHours: number, holidays: Array<Holiday>, businessHours: BusinessHours, utcOffset: number) => {
    const businessHoursPerDay:BusinessHoursPerDay = computeBusinessHoursPerDay(<string>businessHours.start, <string>businessHours.end);
    const startMoment = moment.utc(start);
    const startClosingMoment = moment.utc(start);//当天下班时间点
    console.log("===computeTimeoutDateWithoutHolidays=====startMoment.format()===", startMoment.format());
    console.log("===computeTimeoutDateWithoutHolidays=====startClosingMoment.format()===", startClosingMoment.format());
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.hours===", businessHoursPerDay.endValue.hours);
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.minutes===", businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays=====utcOffset===", utcOffset);
    startClosingMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    startClosingMoment.minutes(businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays===2==startClosingMoment.format()===", startClosingMoment.format());
    let offsetMinutes = startClosingMoment.diff(startMoment, 'minute');
    const timeoutMinutes = timeoutHours * 60;
    console.log("===computeTimeoutDateWithoutHolidays=====timeoutMinutes, offsetMinutes===", timeoutMinutes, offsetMinutes);
    if(timeoutMinutes <= offsetMinutes){
        // 超时时间小于等于当天下班前，则直接返回添加timeoutHours后的时间值
        return moment.utc(start).add(timeoutMinutes, 'm').toDate();
    }
    else{
        // 超时时间大于当天下班前。
        // 一个工作日一个工作日的往上加，直到加至达到timeoutMinutes值
        // let result = moment.utc(start).add(offsetMinutes, 'm').toDate();
        // let nextMoment = moment.utc(result);
        let nextMoment = startClosingMoment;
        for(let i = 0;offsetMinutes < timeoutMinutes;i++){
            let nextBusinessDateStartTime = computeNextBusinessDateStartTime(nextMoment.toDate(), holidays, businessHoursPerDay, <Array<string>>businessHours.working_days, utcOffset);
            if(nextBusinessDateStartTime){
                nextMoment.add(1, 'd');
                offsetMinutes += businessHoursPerDay.computedMinutes;
            }
            else{
                // 请假天数超过365天就可能触发该错误，理论上不可能出现。
                throw new Error("computeTimeoutDateWithoutHolidays:Maximum number of calls, The number of days in holidays may exceed 365.");
            }
        }
        // 最后一天加出来的可能有多，把多余的时间减掉
        if(offsetMinutes > timeoutMinutes){
            nextMoment.subtract(offsetMinutes - timeoutMinutes, 'm');
        }
        return nextMoment.toDate();
    }
}