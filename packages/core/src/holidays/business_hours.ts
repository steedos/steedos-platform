import { StringTimeValue, BusinessHoursPerDay, Holiday, BusinessHours, BusinessHoursValue, NextBusinessDate } from './types';
const moment = require('moment');

/**
 * 把09:33这种字符串解析出来对应的时间值
 * @param str 
 * @param digitsForHours 
 * return StringTimeValue{
 *  hours: number,小时部分值
 *  minutes: number,分钟部分值
 *  valueToHours: number,小时和分钟相加得到的数值，按小时为单位，用于计算多个字符串代表的时间差值
 *  valueToMinutes: number,小时和分钟相加得到的数值，按分钟为单位，用于计算多个字符串代表的时间差值
 * }
 */
export const getStringTimeValue = (str: string, digitsForHours: number = 2): StringTimeValue => {
    str = str.trim();
    if(!/^\d{1,2}:\d{1,2}$/.test(str)){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }
    const splits = str.split(":");
    const h = parseInt(splits[0]);
    const m = parseInt(splits[1]);
    if(h > 24 || m > 60){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }
    else if(h === 24 && m > 0){
        throw new Error("getStringTimeValue:Time format error, please enter HH:MM this format of 24 hours time character.");
    }

    let valueToHours: number, valueToMinutes:number;
    valueToMinutes = h * 60 + m;
    valueToHours = Number((valueToMinutes / 60).toFixed(digitsForHours));
    return { hours: h, minutes: m, valueToHours, valueToMinutes};
}

/**
 * 计算09:00-18:00这种开始时间结束时间代表的每天工作时间长度
 * @param start 
 * @param end 
 * @param digitsForHours 
 * return BusinessHoursPerDay{
 *  computedHours: 每天工作时间长度，小时为单位
 *  computedMinutes: 每天工作时间长度，小时为单位
 *  startValue: 开始时间返回的getStringTimeValue函数得到的对应解析值
 *  endValue: 结束时间返回的getStringTimeValue函数得到的对应解析值
 * }
 */
export const computeBusinessHoursPerDay = (start:string, end: string, digitsForHours: number = 2): BusinessHoursPerDay => {
    let startValue:StringTimeValue = getStringTimeValue(start, digitsForHours);
    let endValue:StringTimeValue = getStringTimeValue(end, digitsForHours);
    if(startValue && endValue){
        let computedMinutes: number = <number>endValue.valueToMinutes - <number>startValue.valueToMinutes;
        if(computedMinutes <= 0){
            throw new Error("computeBusinessHoursPerDay:The end time value must be later than the start time.");
        }
        else{
            let computedHours: number = <number>endValue.valueToHours - <number>startValue.valueToHours;
            computedHours = Number(computedHours.toFixed(digitsForHours));
            return {
                computedHours: computedHours,
                computedMinutes: computedMinutes,
                startValue,
                endValue,
            };
        }
    }
    else{
        throw new Error("computeBusinessHoursPerDay:start or end is not valid.");
    }
}

/**
 * 根据businessHours取其对应的每天工作时间长度，并把值缓存到其computedPerDay属性中
 * @param businessHours 
 * return BusinessHoursPerDay{
 *  computedHours: 每天工作时间长度，小时为单位
 *  computedMinutes: 每天工作时间长度，小时为单位
 *  startValue: 开始时间返回的getStringTimeValue函数得到的对应解析值
 *  endValue: 结束时间返回的getStringTimeValue函数得到的对应解析值
 * }
 */
export const getBusinessHoursPerDay = (businessHours: BusinessHours, digitsForHours: number = 2): BusinessHoursPerDay => {
    if(businessHours.computedPerDay){
        return businessHours.computedPerDay;
    }
    let computedPerDay = computeBusinessHoursPerDay(businessHours.start, businessHours.end, digitsForHours);
    businessHours.computedPerDay = computedPerDay;
    return computedPerDay;
}

/**
 * 计算某个时间点是不是工作时间，包括节假日及非工作时间都要排除
 * @param date 要计算的日期时间
 * @param holidays 节假日
 * @param businessHours 工作时间，其start为上班时间，end为下班时间
 * @param utcOffset 时区偏差
 * return boolean 返回date是不是工作时间
 */
export const computeIsBusinessDate = (date: Date, holidays: Array<Holiday>, businessHours: BusinessHours, utcOffset: number, digitsForHours: number = 2): boolean => {
    if(computeIsBusinessDay(date, holidays, businessHours.working_days)){
        return computeIsInBusinessHours(date, businessHours, utcOffset, digitsForHours);
    }
    else{
        return false;
    }
}

/**
 * 计算某个时间点是不是工作时间，只计算传入的时间值是否在工作时间start、end范围内，不判断周末和假期
 * @param date 要计算的日期时间
 * @param businessHours 工作时间，其start为上班时间，end为下班时间
 * @param utcOffset 时区偏差
 * return boolean 返回date是不是工作时间
 */
export const computeIsInBusinessHours = (date: Date, businessHours: BusinessHours, utcOffset: number, digitsForHours: number = 2): boolean => {
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const startMoment = moment.utc(date);
    // 设置为对应的当天工作日开始时间点
    startMoment.hours(businessHoursPerDay.startValue.hours - utcOffset);
    startMoment.minutes(businessHoursPerDay.startValue.minutes);
    const endMoment = moment.utc(date);
    // 设置为对应的当天工作日结束时间点
    endMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    endMoment.minutes(businessHoursPerDay.endValue.minutes);
    const startTimeValue = startMoment.toDate().getTime();
    const endTimeValue = endMoment.toDate().getTime();
    const dateTimeValue = date.getTime();
    if(dateTimeValue <= endTimeValue && dateTimeValue >= startTimeValue){
        return true;
    }
    else{
        return false;
    }
}

/**
 * 计算某个日期是不是工作日，不判断当前时间点是不是正常工作日的非工作时间
 * @param date 要计算的日期
 * @param holidays 节假日
 * @param workingDays 工作日，周几工作，即businessHours中的working_days属性，[ '1', '2', '3', '4', '5' ] 表示周1到周5工作，周六'6'周日'0'休息
 * return boolean 返回date是不是工作日
 */
export const computeIsBusinessDay = (date: Date, holidays: Array<Holiday>, workingDays: Array<string>): boolean => {
    const value = moment.utc(date);
    // holidays中存入的肯定是utc0点0分，所以这里把date设置为0点0分即可
    value.hours(0);
    value.minutes(0);
    const holiday = holidays.find((item)=>{
        return item.date && (<any>item.date).getTime() === value.toDate().getTime();
    });
    if(holiday){
        switch(holiday.type){
            case "adjusted_working_day":
                return true;
            case "adjusted_holiday":
                return false;
            case "public":
                return false;
        }
    }
    else{
        return workingDays.indexOf(value.day().toString()) > -1;
    }
}

/**
 * 根据来源时间计算下一个工作日的开始时间
 * @param source 来源时间
 * @param holidays 节假日
 * @param businessHoursPerDay 工作时间，根据businessHours调用computeBusinessHoursPerDay函数计算得到的每天工作时间
 * @param workingDays 工作日，周几工作，即businessHours中的working_days属性，[ '1', '2', '3', '4', '5' ] 表示周1到周5工作，周六'6'周日'0'休息
 * @param utcOffset 时区偏差
 * return Date 返回下一个工作工的开始时间点
 */
export const computeNextBusinessDate = (source: Date, holidays: Array<Holiday>, businessHours: BusinessHours, utcOffset: number, digitsForHours: number = 2): NextBusinessDate => {
    const businessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const workingDays = businessHours.working_days;
    const sourceMoment = moment.utc(source);
    // 设置为start对应的当天工作日开始时间点
    sourceMoment.hours(businessHoursPerDay.startValue.hours - utcOffset);
    sourceMoment.minutes(businessHoursPerDay.startValue.minutes);
    let startMoment = null;
    const maxCount = 365;//防止死循环
    for(let i = 0;i < maxCount; i++){
        sourceMoment.add(1, 'd');
        if(computeIsBusinessDay(sourceMoment.toDate(), holidays, workingDays)){
            startMoment = sourceMoment;
            break;
        }
    }
    if(startMoment){
        let start = startMoment.toDate();
        // 设置为start对应的当天的结束时间
        startMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
        startMoment.minutes(businessHoursPerDay.endValue.minutes);
        let end = startMoment.toDate();
        return { start, end };
    }
    else{
        return null;
    }
}

/**
 * 根据开始时间结束时间计算工作时间时长
 * @param start 
 * @param end 
 * @param holidays 
 * @param businessHours 
 * @param utcOffset 
 * @param digitsForHours 
 * return BusinessHoursValue{
    computedHours: number;//计算得到的工作时间长度，小时为单位
    computedMinutes: number;//计算得到的工作时间长度，分钟为单位
 * }
 */
export const computeBusinessHoursValue = (start: Date, end: Date, holidays: Array<Holiday>, businessHours: BusinessHours, utcOffset: number, digitsForHours: number = 2):BusinessHoursValue => {
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const isStartBusinessDate = computeIsBusinessDate(start, holidays, businessHours, utcOffset, digitsForHours);
    if(!isStartBusinessDate){
        // 如果开始时间不是工作时间，则设置为下一个工作日的开始时间
        let nextBusinessDate = computeNextBusinessDate(start, holidays, businessHours, utcOffset, digitsForHours);
        start = nextBusinessDate.start;
    }
    const startMoment = moment.utc(start);
    let endMoment = moment.utc(end);
    const startClosingMoment = moment.utc(start);//当天下班时间点
    startClosingMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    startClosingMoment.minutes(businessHoursPerDay.endValue.minutes);
    let computedMinutes: number;
    let computedHours: number;
    let endTimeValue = end.getTime();
    if(endTimeValue <= startClosingMoment.toDate().getTime()){
        // 结束时间小于等于当天下班时间，则直接返回开始结束时间差值
        computedMinutes = endMoment.diff(startMoment, 'minute');
    }
    else{
        // 结束时间大于当天下班时间
        // 一个工作日一个工作日的往上加，直到加至达到大于等于结束时间
        let startOffsetMinutes: number = startClosingMoment.diff(startMoment, 'minute');
        computedMinutes = startOffsetMinutes;//先把当天下班前的时间记上
        // let result = moment.utc(start).add(startOffsetMinutes, 'm').toDate();
        // let nextMoment = moment.utc(result);
        let nextMoment = startClosingMoment;
        for(let i = 0;nextMoment.toDate().getTime() < endTimeValue;i++){
            let nextBusinessDate = computeNextBusinessDate(nextMoment.toDate(), holidays, businessHours, utcOffset, digitsForHours);
            if(nextBusinessDate){
                // 把nextMoment设置为nextBusinessDate当天的工作日下班时间
                nextMoment = moment.utc(nextBusinessDate.end);
                computedMinutes += businessHoursPerDay.computedMinutes;
            }
            else{
                // 请假天数超过365天就可能触发该错误，理论上不可能出现。
                throw new Error("computeTimeoutDateWithoutHolidays:Maximum number of calls, The number of days in holidays may exceed 365.");
            }
        }
        // 最后一天加出来的可能有多，把多余的时间减掉
        if(nextMoment.toDate().getTime() > endTimeValue){
            const isEndBusinessDate = computeIsBusinessDate(end, holidays, businessHours, utcOffset, digitsForHours);
            if(!isEndBusinessDate){
                // 如果结束时间不是工作时间，则设置为下一个工作日的开始时间，然后才能相减取差值
                let nextBusinessDate = computeNextBusinessDate(end, holidays, businessHours, utcOffset, digitsForHours);
                end = nextBusinessDate.start;
                endMoment = moment.utc(end);
            }
            computedMinutes -= nextMoment.diff(endMoment, 'minute');
        }
    }
    computedHours = Number((computedMinutes / 60).toFixed(digitsForHours));
    return { computedMinutes, computedHours };
}