import { computeNextBusinessDate, computeIsBusinessDate, getBusinessHoursPerDay } from './business_hours';
import { getSteedosSchema, getSteedosConfig } from '@steedos/objectql';
import { BusinessHoursPerDay, Holiday, BusinessHours, BusinessHoursCheckedType } from './types';
const moment = require('moment');
import _ = require('lodash');
import { addConfig, getConfig, getConfigs, removeConfig } from '@steedos/metadata-registrar';

/**
 * 从数据库中取出指定工作区内的节假日数据，支持缓存
 * @param spaceId 
 * @param years 要获取哪几年的数据 
 */
export const getHolidays = async (spaceId: string, years: Array<number>) => {
    let configs = getConfigs("holidays");
    let tempYearConfig: any;
    const holidaysFields = ["name", "type", "date", "adjusted_to", "space"];
    for (const year of years) {
        tempYearConfig = getConfig("holidays", `${spaceId}-${year}`);
        if(!tempYearConfig){
            tempYearConfig = { _id: `${spaceId}-${year}`, 'space': spaceId, year: year };
            const yearStartDate = moment.utc(`${year}-01-01T00:00:00Z`).toDate();
            const yearEndDate = moment.utc(`${year}-12-31T23:59:59Z`).toDate();
            const holidaysOptions: any = { filters: [["space", "=", spaceId], ["date", "between", [yearStartDate, yearEndDate]]], fields: holidaysFields };
            const objectHolidays = getSteedosSchema().getObject("holidays");
            const holidaysRecords = await objectHolidays.find(holidaysOptions);
            if(holidaysRecords && holidaysRecords.length){
                tempYearConfig.values = holidaysRecords;
            }
            else{
                tempYearConfig.values = [];
            }
            addConfig("holidays", tempYearConfig);
        }
    }
    configs = getConfigs("holidays").filter((config: any)=>{
        return config.space === spaceId && years.indexOf(config.year) > -1;
    });
    return _.flatten(configs.map((config: any)=>{return config.values}));
}

/**
 * 更新指定工作区指定年份的节假日缓存数据
 * @param spaceId 
 * @param year 要更新哪年的数据
 */
export const updateHolidaysCache = async (spaceId: string, year: number) => {
    let tempYearConfig = getConfig("holidays", `${spaceId}-${year}`);
        if(tempYearConfig){
        // 只有该年数据在缓存中已经存在才说明有用到，否则没必要加入缓存
        const holidaysFields = ["name", "type", "date", "adjusted_to", "space"];
        const yearStartDate = moment.utc(`${year}-01-01T00:00:00Z`).toDate();
        const yearEndDate = moment.utc(`${year}-12-31T23:59:59Z`).toDate();
        const holidaysOptions: any = { filters: [["space", "=", spaceId], ["date", "between", [yearStartDate, yearEndDate]]], fields: holidaysFields };
        const objectHolidays = getSteedosSchema().getObject("holidays");
        const holidaysRecords = await objectHolidays.find(holidaysOptions);
        if(holidaysRecords && holidaysRecords.length){
            tempYearConfig.values = holidaysRecords;
        }
        else{
            tempYearConfig.values = [];
        }
        addConfig("holidays", tempYearConfig);
    }
}

/**
 * 清除指定工作区节假日缓存数据，在节假日数据导入的时候应该有用
 * @param spaceId 
 * @param years 要清除哪几年的数据 
 */
export const clearHolidaysCache = async (spaceId: string, years: Array<number>) => {
    for (const year of years) {
        removeConfig("holidays", `${spaceId}-${year}`);
    }
}

/**
 * 从数据库中取出指定工作区内的默认工作时间数据，支持缓存
 * @param spaceId 
 */
export const getDefaultBusinessHours = async (spaceId: string) => {
    let configs = getConfigs("business_hours");
    if(configs && configs.length){
        configs = _.filter(configs, { 'space': spaceId });
        if(configs.length){
            return configs;
        }
    }
    const defultBusinessHoursOptions: any = { filters: [["space", "=", spaceId], ["is_default", "=", true]], fields: ["name", "start", "end", "lunch_start", "lunch_end", "utc_offset", "working_days", "space"] };
    const objectBusinessHours = getSteedosSchema().getObject("business_hours");
    const defultBusinessHoursRecords = await objectBusinessHours.find(defultBusinessHoursOptions);
    if(defultBusinessHoursRecords && defultBusinessHoursRecords.length){
        defultBusinessHoursRecords.forEach((record: any)=>{
            addConfig("business_hours", record);
        });
    }
    return defultBusinessHoursRecords;
}

/**
 * 计算在某个工作区下的节假日、工作时间数据基础上，以某个时间点开始，超时几个小时后，超时时间点是什么时候
 * @param start 
 * @param timeoutHours 超时时间，支持小数
 * @param spaceId 工作区ID
 * @param digitsForHours 小时单位支持几位小数，默认2位
 */
export const getTimeoutDateWithoutHolidays = async (start: Date, timeoutHours: number, spaceId: string, digitsForHours: number = 2) => {
    const config = getSteedosConfig();
    if(!config.enable_holidays){
        return moment(start).add(timeoutHours, 'h').toDate();
    }
    const defultBusinessHoursRecords = await getDefaultBusinessHours(spaceId);
    const defultBusinessHoursRecord = defultBusinessHoursRecords && defultBusinessHoursRecords[0];// 只会有一条工作时间数据
    if(!defultBusinessHoursRecord){
        // 未配置工作时间，是直接按未开启enable_holidays处理
        return moment(start).add(timeoutHours, 'h').toDate();
    }
    const startUTCYear = start.getUTCFullYear();
    const holidaysRecords:any = await getHolidays(spaceId, [startUTCYear, startUTCYear + 1]);
    return computeTimeoutDateWithoutHolidays(start, timeoutHours, holidaysRecords, defultBusinessHoursRecord, digitsForHours)
}

/**
 * 计算以某个时间点开始，超时几个小时后，超时时间点是什么时候
 * @param start 开始时间
 * @param timeoutHours 超时时间，支持小数
 * @param holidays 节假日
 * @param businessHours 工作时间
 * @param digitsForHours 小时单位支持几位小数，默认2位
 */
export const computeTimeoutDateWithoutHolidays = (start: Date, timeoutHours: number, holidays: Array<Holiday>, businessHours: BusinessHours, digitsForHours: number = 2) => {
    if(timeoutHours <= 0){
        return start;
    }
    const utcOffset = businessHours.utc_offset;
    const businessHoursPerDay:BusinessHoursPerDay = getBusinessHoursPerDay(businessHours, digitsForHours);
    const startBhct:BusinessHoursCheckedType = computeIsBusinessDate(start, holidays, businessHours, digitsForHours);
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
            let nextBusinessDate = computeNextBusinessDate(start, holidays, businessHours, digitsForHours);
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
    startClosingMoment.hours(businessHoursPerDay.endValue.hours - utcOffset);
    startClosingMoment.minutes(businessHoursPerDay.endValue.minutes);
    offsetMinutes += startClosingMoment.diff(startMoment, 'minute');
    const timeoutMinutes = timeoutHours * 60;
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
            let nextBusinessDate = computeNextBusinessDate(nextMoment.toDate(), holidays, businessHours, digitsForHours);
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