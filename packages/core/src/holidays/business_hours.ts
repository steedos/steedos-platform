import { StringTimeValue, BusinessHoursPerDay, Holiday, BusinessHours, BusinessHoursValue, NextBusinessDate, BusinessHoursCheckedType } from './types';
const moment = require('moment');

/**
 * 把09:33这种字符串解析出来对应的时间值
 * @param str 
 * @param digitsForHours 
 * return StringTimeValue
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
 * return BusinessHoursPerDay
 */
export const computeBusinessHoursPerDay = (start:string, end: string, lunch_start:string, lunch_end: string, digitsForHours: number = 2): BusinessHoursPerDay => {
    let startValue:StringTimeValue = getStringTimeValue(start, digitsForHours);
    let endValue:StringTimeValue = getStringTimeValue(end, digitsForHours);
    let lunchStartValue:StringTimeValue = getStringTimeValue(lunch_start, digitsForHours);
    let lunchEndValue:StringTimeValue = getStringTimeValue(lunch_end, digitsForHours);
    if(startValue && endValue && lunchStartValue && lunchEndValue){
        let computedMinutes: number = <number>endValue.valueToMinutes - <number>startValue.valueToMinutes;
        let computedAmMinutes: number = <number>lunchStartValue.valueToMinutes - <number>startValue.valueToMinutes;
        let computedPmMinutes: number = <number>endValue.valueToMinutes - <number>lunchEndValue.valueToMinutes;
        let computedLunchMinutes: number = <number>lunchEndValue.valueToMinutes - <number>lunchStartValue.valueToMinutes;
        computedMinutes = computedMinutes - computedLunchMinutes; //排除午休时间
        if(computedMinutes <= 0 || computedLunchMinutes <= 0){
            throw new Error("computeBusinessHoursPerDay:The end or lunch_end time value must be later than the start or lunch_start time.");
        }
        else if(lunchStartValue.valueToMinutes <= startValue.valueToMinutes || lunchEndValue.valueToMinutes >= endValue.valueToMinutes){
            throw new Error("computeBusinessHoursPerDay:The lunch time must between the working time.");
        }
        else{
            // let computedHours: number = <number>endValue.valueToHours - <number>startValue.valueToHours;
            let computedHours = Number((computedMinutes / 60).toFixed(digitsForHours));
            let computedAmHours = Number((computedAmMinutes / 60).toFixed(digitsForHours));
            let computedPmHours = Number((computedPmMinutes / 60).toFixed(digitsForHours));
            let computedLunchHours = Number((computedLunchMinutes / 60).toFixed(digitsForHours));
            return {
                computedHours,
                computedMinutes,
                computedAmHours,
                computedAmMinutes,
                computedPmHours,
                computedPmMinutes,
                computedLunchHours,
                computedLunchMinutes,
                startValue,
                endValue,
                lunchStartValue,
                lunchEndValue
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
    let computedPerDay = computeBusinessHoursPerDay(businessHours.start, businessHours.end, businessHours.lunch_start, businessHours.lunch_end, digitsForHours);
    businessHours.computedPerDay = computedPerDay;
    return computedPerDay;
}

/**
 * 计算某个时间点是不是工作时间，包括节假日及非工作时间都要排除
 * @param date 要计算的日期时间
 * @param holidays 节假日
 * @param businessHours 工作时间，其start为上班时间，end为下班时间
 * return BusinessHoursCheckedType 返回date是不是工作时间，返回值大于0表示是工作时间，否则为非工作时间
 */
export const computeIsBusinessDate = (date: Date, holidays: Array<Holiday>, businessHours: BusinessHours, digitsForHours: number = 2): BusinessHoursCheckedType => {
    if(computeIsBusinessDay(date, holidays, businessHours.working_days)){
        return computeIsBusinessHours(date, businessHours, digitsForHours);
    }
    else{
        // 非工作日
        return BusinessHoursCheckedType.offDay
    }
}

/**
 * 计算某个时间点是不是工作时间，只计算传入的时间值是否在工作时间start、end范围内，并且不在午休时间lunch_start、lunch_end范围，只计算时间点，不计算日期是否工作日
 * @param date 要计算的日期时间
 * @param businessHours 工作时间，其start为上班时间，end为下班时间，lunch_start为午休开始时间、lunch_end为午休结束时间
 * return BusinessHoursCheckedType 返回date是不是工作时间，返回值大于0表示是工作时间，否则为非工作时间
 */
export const computeIsBusinessHours = (date: Date, businessHours: BusinessHours, digitsForHours: number = 2): BusinessHoursCheckedType => {
    const utcOffset = businessHours.utc_offset;
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const startMoment = moment.utc(date);
    // 设置为对应的当天工作日开始时间点
    startMoment.hours(businessHoursPerDay.startValue.hours - utcOffset);
    startMoment.minutes(businessHoursPerDay.startValue.minutes);
    const endMoment = moment.utc(date);
    // 设置为对应的当天工作日结束时间点
    endMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    endMoment.minutes(businessHoursPerDay.endValue.minutes);
    const lunchStartMoment = moment.utc(date);
    // 设置为对应的当天午休开始时间点
    lunchStartMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
    lunchStartMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
    const lunchEndMoment = moment.utc(date);
    // 设置为对应的当天午休结束时间点
    lunchEndMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
    lunchEndMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
    const startTimeValue = startMoment.toDate().getTime();
    const endTimeValue = endMoment.toDate().getTime();
    const lunchStartTimeValue = lunchStartMoment.toDate().getTime();
    const lunchEndTimeValue = lunchEndMoment.toDate().getTime();
    const dateTimeValue = date.getTime();
    if(dateTimeValue <= endTimeValue && dateTimeValue >= startTimeValue){
        // 上班时间
        if(dateTimeValue <= lunchStartTimeValue){
            // 上午班
            return BusinessHoursCheckedType.onAm
        }
        else if(dateTimeValue >= lunchEndTimeValue){
            // 下午班
            return BusinessHoursCheckedType.onPm
        }
        else{
            // 午休时间
            return BusinessHoursCheckedType.offLunch
        }
    }
    else{
        // 下班时间
        if(dateTimeValue > endTimeValue){
            // 下班时间，非午休，下午下班时间到第二天早上0点
            return BusinessHoursCheckedType.offPm;
        }
        else{
            // 下班时间，非午休，早上0点到上午上班时间
            return BusinessHoursCheckedType.offAm;
        }
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
    value.seconds(0);
    value.milliseconds(0);
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
 * 根据来源时间所在日期计算下一个工作日的开始时间，直接计算来源日期的下一个工作日是哪天，不判断来源日期本身是否是工作日或工作时间
 * @param source 来源时间
 * @param holidays 节假日
 * @param businessHours 工作时间，其start为上班时间，end为下班时间
 * @param digitsForHours 小时数精确到小数点几位
 * return Date 返回下一个工作工的开始时间点
 */
export const computeNextBusinessDate = (source: Date, holidays: Array<Holiday>, businessHours: BusinessHours, digitsForHours: number = 2): NextBusinessDate => {
    const utcOffset = businessHours.utc_offset;
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
 * @param digitsForHours 
 * return BusinessHoursValue
 */
export const computeBusinessHoursValue = (start: Date, end: Date, holidays: Array<Holiday>, businessHours: BusinessHours, digitsForHours: number = 2):BusinessHoursValue => {
    const utcOffset = businessHours.utc_offset;
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const startBhct = computeIsBusinessDate(start, holidays, businessHours, digitsForHours);
    let startMoment = moment.utc(start);
    let endMoment = moment.utc(end);
    let startClosingMoment = moment.utc(start);//开始时间下班时间点
    let computedMinutes: number = 0;
    let computedHours: number = 0;
    let endTimeValue = end.getTime();
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
            if(endTimeValue > startClosingMoment.toDate().getTime()){
                // 结束时间大于上午班的结束工作时间，即午休开始时间时，要额外处理午休时间
                // 设置为当前工作日下午班的开始工作时间，即午休结束时间
                let tempClosingMoment = moment.utc(start);
                tempClosingMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                tempClosingMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                // 结束时间小于等于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行减法处理下
                if(endTimeValue <= tempClosingMoment.toDate().getTime()){
                    computedMinutes = -endMoment.diff(startClosingMoment, 'minute');//为负数，对后面总数做减法
                }
                else{
                    // 结束时间大于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行加法处理，并且变更开始时间为下午班的开始工作时间
                    computedMinutes = startClosingMoment.diff(startMoment, 'minute');
                    // 设置为当前工作日下午班的开始时间，即午休结束时间
                    startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                    startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                    start = startMoment.toDate();
                }
            }
        }
        else {
            // 如果开始时间是工作日，下班时间，非午休，下午下班时间到第二天早上0点，或非工作日，即节假日、周未等
            // 设置为下一个工作日的开始时间
            let nextBusinessDate = computeNextBusinessDate(start, holidays, businessHours, digitsForHours);
            start = nextBusinessDate.start;
            startMoment = moment.utc(start);
            startClosingMoment = moment.utc(start);
            // 设置为下一个工作日上午班的结束工作时间，即午休开始时间
            startClosingMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
            startClosingMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
            if(endTimeValue > startClosingMoment.toDate().getTime()){
                // 结束时间大于上午班的结束工作时间，即午休开始时间时，要额外处理午休时间
                // 设置为当前工作日下午班的开始工作时间，即午休结束时间
                let tempClosingMoment = moment.utc(start);
                tempClosingMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                tempClosingMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                // 结束时间小于等于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行减法处理下
                if(endTimeValue <= tempClosingMoment.toDate().getTime()){
                    computedMinutes = -endMoment.diff(startClosingMoment, 'minute');//为负数，对后面总数做减法
                }
                else{
                    // 结束时间大于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行加法处理，并且变更开始时间为下午班的开始工作时间
                    computedMinutes = startClosingMoment.diff(startMoment, 'minute');
                    // 设置为当前工作日下午班的开始时间，即午休结束时间
                    startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                    startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                    start = startMoment.toDate();
                }
            }
        }
    }
    else{
        // 如果开始时间是工作时间
        if(startBhct === BusinessHoursCheckedType.onAm){
            // 如果开始时间是上午班
            // 设置为当天上午班的结束工作时间，即午休开始时间
            startClosingMoment.hours(businessHoursPerDay.lunchStartValue.hours - utcOffset);
            startClosingMoment.minutes(businessHoursPerDay.lunchStartValue.minutes);
            if(endTimeValue > startClosingMoment.toDate().getTime()){
                // 结束时间大于上午班的结束工作时间，即午休开始时间时，要额外处理午休时间
                // 设置为当前工作日下午班的开始工作时间，即午休结束时间
                let tempClosingMoment = moment.utc(start);
                tempClosingMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                tempClosingMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                // 结束时间小于等于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行减法处理下
                if(endTimeValue <= tempClosingMoment.toDate().getTime()){
                    computedMinutes = -endMoment.diff(startClosingMoment, 'minute');//为负数，对后面总数做减法
                }
                else{
                    // 结束时间大于下午班的开始工作时间，即午休结束时间时，直接对结果即computedMinutes值进行加法处理，并且变更开始时间为下午班的开始工作时间
                    computedMinutes = startClosingMoment.diff(startMoment, 'minute');
                    // 设置为当前工作日下午班的开始时间，即午休结束时间
                    startMoment.hours(businessHoursPerDay.lunchEndValue.hours - utcOffset);
                    startMoment.minutes(businessHoursPerDay.lunchEndValue.minutes);
                    start = startMoment.toDate();
                }
            }
        }
        else{
            // 如果开始时间是下午班
            startMoment = moment.utc(start);
        }
    }

    startClosingMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    startClosingMoment.minutes(businessHoursPerDay.endValue.minutes);
    if(endTimeValue <= start.getTime()){
        return { computedMinutes: 0, computedHours: 0 };
    }
    if(endTimeValue <= startClosingMoment.toDate().getTime()){
        // 结束时间小于等于当天下班时间，则直接返回开始结束时间差值
        computedMinutes += endMoment.diff(startMoment, 'minute');
    }
    else{
        // 结束时间大于当天下班时间
        // 一个工作日一个工作日的往上加，直到加至达到大于等于结束时间
        computedMinutes += startClosingMoment.diff(startMoment, 'minute');//先把当天下班前的时间记上
        let nextMoment = startClosingMoment;
        for(let i = 0;nextMoment.toDate().getTime() < endTimeValue;i++){
            let nextBusinessDate = computeNextBusinessDate(nextMoment.toDate(), holidays, businessHours, digitsForHours);
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
            const endBhct = computeIsBusinessDate(end, holidays, businessHours, digitsForHours);
            if(endBhct <= 0){
                // 如果endMoment为非工作时间
                if(endBhct === BusinessHoursCheckedType.offLunch){
                    // 如果endMoment为nextMoment当天的午休时间
                    // 正好多余了一个下午班
                    computedMinutes -= businessHoursPerDay.computedPmMinutes;
                }
                else {
                    // 如果endMoment为nextMoment当天的前一天下班时间offPm、nextMoment当天的早班上班前的时间offAm、周末或节假日（即endMoment为nextMoment当天的前一天且为非工作日）offDay
                    // 正好多余了一个工作日
                    computedMinutes -= businessHoursPerDay.computedMinutes;
                }
            }
            else{
                // 如果endMoment为工作时间
                if(endBhct === BusinessHoursCheckedType.onAm){
                    // 如果endMoment为nextMoment当天的上午班时间
                    // 正好多余了其时间差减去午休时间
                    computedMinutes -= nextMoment.diff(endMoment, 'minute');
                    // 正好多减了午休时间，加回来
                    computedMinutes += businessHoursPerDay.computedLunchMinutes;
                }
                else{
                    // 如果endMoment为nextMoment当天的下午班时间，即onPm
                    // 正好多余了其时间差
                    computedMinutes -= nextMoment.diff(endMoment, 'minute');
                }
            }
        }
    }
    computedHours = Number((computedMinutes / 60).toFixed(digitsForHours));
    return { computedMinutes, computedHours };
}