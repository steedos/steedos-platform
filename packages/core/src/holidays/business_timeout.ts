import { computeNextBusinessDate, computeIsBusinessDate, getBusinessHoursPerDay } from './business_hours';
import { getSteedosSchema } from '@steedos/objectql';
import { BusinessHoursPerDay, Holiday, BusinessHours, BusinessHoursCheckedType } from './types';
const moment = require('moment');

/**
 * 计算在某个工作区下的节假日、工作时间数据基础上，以某个时间点开始，超时几个小时后，超时时间点是什么时候
 * @param start 
 * @param timeoutHours 超时时间，支持小数
 * @param spaceId 工作区ID
 * @param digitsForHours 小时单位支持几位小数，默认2位
 */
export const getTimeoutDateWithoutHolidays = async (start: Date, timeoutHours: number, spaceId: string, digitsForHours: number = 2) => {
    const defultBusinessHoursOptions: any = { filters: [["space", "=", spaceId], ["is_default", "=", true]], fields: ["name", "start", "end", "lunch_start", "lunch_end", "working_days"] };
    const objectBusinessHours = getSteedosSchema().getObject("business_hours");
    const defultBusinessHoursRecords = await objectBusinessHours.find(defultBusinessHoursOptions);
    const defultBusinessHoursRecord = defultBusinessHoursRecords && defultBusinessHoursRecords[0];
    const holidaysOptions: any = { filters: [["space", "=", spaceId]], fields: ["name", "type", "date", "adjusted_to"] };
    const objectHolidays = getSteedosSchema().getObject("holidays");
    const holidaysRecords = await objectHolidays.find(holidaysOptions);
    return computeTimeoutDateWithoutHolidays(start, timeoutHours, holidaysRecords, defultBusinessHoursRecord, 8, digitsForHours)
}

/**
 * 计算以某个时间点开始，超时几个小时后，超时时间点是什么时候
 * @param start 开始时间
 * @param timeoutHours 超时时间，支持小数
 * @param holidays 节假日
 * @param businessHours 工作时间
 * @param utcOffset 时间偏差
 * @param digitsForHours 小时单位支持几位小数，默认2位
 */
export const computeTimeoutDateWithoutHolidays = (start: Date, timeoutHours: number, holidays: Array<Holiday>, businessHours: BusinessHours, utcOffset: number, digitsForHours: number = 2) => {
    if(timeoutHours <= 0){
        return start;
    }
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const startBhct:BusinessHoursCheckedType = computeIsBusinessDate(start, holidays, businessHours, utcOffset, digitsForHours);
    let offsetMinutes: number = 0;
    let startMoment = moment.utc(start);
    let startClosingMoment = moment.utc(start);//用于记录start对应的当前班的工作结束时间，比如上午班结束时间或当天下班时间
    if(startBhct <= 0) {
        // 如果开始时间不是工作时间
        if(startBhct === BusinessHoursCheckedType.offLunch) {
            // 如果开始时间不是工作时间，且正好是工作日的午休时间
            // 设置为当天下午班的开始工作时间，即午休结束时间
            startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
            startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
            start = startMoment.toDate();
        }
        else if(startBhct === BusinessHoursCheckedType.offAm) {
            // 如果开始时间是工作日，下班时间，非午休，早上0点到上午上班时间
            // 设置为当前工作日的开始时间
            startMoment.hours(businessHoursPerDay.startValue.hours - utcOffset);
            startMoment.minutes(businessHoursPerDay.startValue.minutes);
            start = startMoment.toDate();
            startClosingMoment = moment.utc(start);
            // 设置为当前工作日上午班的结束工作时间，即午休开始时间
            startClosingMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
            startClosingMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
            offsetMinutes = startClosingMoment.diff(startMoment, 'minute');
            // 设置为当前工作日下午班的开始时间，即午休结束时间
            startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
            startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
            start = startMoment.toDate();
        }
        else {
            // 如果开始时间是工作日，下班时间，非午休，下午下班时间到第二天早上0点，或非工作日，即节假日、周未等
            // 设置为下一个工作日的开始时间
            let nextBusinessDate = computeNextBusinessDate(start, holidays, businessHours, utcOffset, digitsForHours);
            start = nextBusinessDate.start;
            startMoment = moment.utc(start);
            startClosingMoment = moment.utc(start);
            // 设置为下一个工作日上午班的结束工作时间，即午休开始时间
            startClosingMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
            startClosingMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
            offsetMinutes = startClosingMoment.diff(startMoment, 'minute');
            // 设置为下一个工作日下午班的开始时间，即午休结束时间
            startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
            startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
            start = startMoment.toDate();
        }
    }
    else{
        // 如果开始时间是工作时间
        if(startBhct === BusinessHoursCheckedType.onAm){
            // 如果开始时间是上午班
            // 设置为当天上午班的结束工作时间，即午休开始时间
            startClosingMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
            startClosingMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
            offsetMinutes = startClosingMoment.diff(startMoment, 'minute');
            // 设置为当天下午班的开始时间，即午休结束时间
            startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
            startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
            start = startMoment.toDate();
        }
        else{
            // 如果开始时间是下午班
            startMoment = moment.utc(start);
        }
    }
    console.log("===computeTimeoutDateWithoutHolidays=====startMoment.format()===", startMoment.format());
    console.log("===computeTimeoutDateWithoutHolidays=====startClosingMoment.format()===", startClosingMoment.format());
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.hours===", businessHoursPerDay.endValue.hours);
    console.log("===computeTimeoutDateWithoutHolidays=====businessHoursPerDay.endValue.minutes===", businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays=====utcOffset===", utcOffset);
    startClosingMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    startClosingMoment.minutes(businessHoursPerDay.endValue.minutes);
    console.log("===computeTimeoutDateWithoutHolidays===2==startClosingMoment.format()===", startClosingMoment.format());
    offsetMinutes += startClosingMoment.diff(startMoment, 'minute');
    const timeoutMinutes = timeoutHours * 60;
    console.log("===computeTimeoutDateWithoutHolidays=====timeoutMinutes, offsetMinutes===", timeoutMinutes, offsetMinutes);
    if(timeoutMinutes <= offsetMinutes){
        // 超时时间小于等于当天下班前，则直接返回startClosingMoment倒退offsetMinutes中多加了部分的时间值
        let subMinutes = offsetMinutes - timeoutMinutes;
        if(subMinutes > 0){
            if(subMinutes >= businessHoursPerDay.computedPmMinutes){
                // 如果倒退的时间长度超过下午班的时长，即跨午休倒退，则需要多倒退午休时长值
                subMinutes += businessHoursPerDay.computedLunchMinutes;
            }
            startClosingMoment.subtract(subMinutes, 'm');
        }
        return startClosingMoment.toDate();
    }
    else{
        // 超时时间大于当天下班前。
        // 一个工作日一个工作日的往上加，直到加至达到timeoutMinutes值
        let nextMoment = startClosingMoment;
        for(let i = 0;offsetMinutes < timeoutMinutes;i++){
            let nextBusinessDate = computeNextBusinessDate(nextMoment.toDate(), holidays, businessHours, utcOffset, digitsForHours);
            // console.log("===nextBusinessDateStartTime===", (<any>nextBusinessDateStartTime).format());
            if(nextBusinessDate){
                // 把nextMoment设置为nextBusinessDate当天的工作日下班时间
                nextMoment = moment.utc(nextBusinessDate.end);
                offsetMinutes += businessHoursPerDay.computedMinutes;
            }
            else{
                // 请假天数超过365天就可能触发该错误，理论上不可能出现。
                throw new Error("computeTimeoutDateWithoutHolidays:Maximum number of calls, The number of days in holidays may exceed 365.");
            }
        }
        // 最后一天加出来的可能有多，把多余的时间减掉
        if(offsetMinutes > timeoutMinutes){
            // 超时时间小于等于当天下班前，则直接返回nextMoment倒退offsetMinutes中多加了部分的时间值
            let subMinutes = offsetMinutes - timeoutMinutes;
            if(subMinutes >= businessHoursPerDay.computedPmMinutes){
                // 如果倒退的时间长度超过下午班的时长，即跨午休倒退，则需要多倒退午休时长值
                subMinutes += businessHoursPerDay.computedLunchMinutes;
            }
            nextMoment.subtract(subMinutes, 'm');
            return nextMoment.toDate();
        }
        return nextMoment.toDate();
    }
}