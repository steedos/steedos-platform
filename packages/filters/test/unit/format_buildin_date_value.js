const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const getMonthDays = require('../../utils').getMonthDays;
const getLastMonthFirstDay = require('../../utils').getLastMonthFirstDay;
const getQuarterStartMonth = require('../../utils').getQuarterStartMonth;
const getLastQuarterFirstDay = require('../../utils').getLastQuarterFirstDay;
const getNextQuarterFirstDay = require('../../utils').getNextQuarterFirstDay;
const expect = require('chai').expect;
const moment = require('moment');

var currentMonth, currentYear, endValue, firstDay, label, lastDay, lastMonday, lastMonthFinalDay, lastMonthFirstDay, lastQuarterEndDay, lastQuarterStartDay, lastSunday, last_120_days, last_30_days, last_60_days, last_7_days, last_90_days, millisecond, minusDay, monday, month, nextMonday, nextMonthFinalDay, nextMonthFirstDay, nextQuarterEndDay, nextQuarterStartDay, nextSunday, nextYear, next_120_days, next_30_days, next_60_days, next_7_days, next_90_days, now, previousYear, startValue, strEndDay, strFirstDay, strLastDay, strMonday, strStartDay, strSunday, strToday, strTomorrow, strYestday, sunday, thisQuarterEndDay, thisQuarterStartDay, tomorrow, values, week, year, yestday;
now = new Date();
// 一天的毫秒数
millisecond = 1000 * 60 * 60 * 24;
yestday = new Date(now.getTime() - millisecond);
tomorrow = new Date(now.getTime() + millisecond);
// 一周中的某一天
week = now.getDay();
// 减去的天数
minusDay = week !== 0 ? week - 1 : 6;
monday = new Date(now.getTime() - (minusDay * millisecond));
sunday = new Date(monday.getTime() + (6 * millisecond));
// 上周日
lastSunday = new Date(monday.getTime() - millisecond);
// 上周一
lastMonday = new Date(lastSunday.getTime() - (millisecond * 6));
// 下周一
nextMonday = new Date(sunday.getTime() + millisecond);
// 下周日
nextSunday = new Date(nextMonday.getTime() + (millisecond * 6));
currentYear = now.getFullYear();
previousYear = currentYear - 1;
nextYear = currentYear + 1;
// 当前月份
currentMonth = now.getMonth();
// 计数年、月
year = now.getFullYear();
month = now.getMonth();
// 本月第一天
firstDay = new Date(currentYear, currentMonth, 1);
// 当为12月的时候年份需要加1
// 月份需要更新为0 也就是下一年的第一个月
if (currentMonth === 11) {
    year++;
    month++;
} else {
    month++;
}
nextMonthFirstDay = new Date(year, month, 1);
nextMonthFinalDay = new Date(year, month, getMonthDays(year, month));
lastDay = new Date(nextMonthFirstDay.getTime() - millisecond);
lastMonthFirstDay = getLastMonthFirstDay(currentYear, currentMonth);
lastMonthFinalDay = new Date(firstDay.getTime() - millisecond);
thisQuarterStartDay = new Date(currentYear, getQuarterStartMonth(currentMonth), 1);
thisQuarterEndDay = new Date(currentYear, getQuarterStartMonth(currentMonth) + 2, getMonthDays(currentYear, getQuarterStartMonth(currentMonth) + 2));
lastQuarterStartDay = getLastQuarterFirstDay(currentYear, currentMonth);
lastQuarterEndDay = new Date(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2, getMonthDays(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2));
nextQuarterStartDay = getNextQuarterFirstDay(currentYear, currentMonth);
nextQuarterEndDay = new Date(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2, getMonthDays(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2));
last_7_days = new Date(now.getTime() - (6 * millisecond));
last_30_days = new Date(now.getTime() - (29 * millisecond));
last_60_days = new Date(now.getTime() - (59 * millisecond));
last_90_days = new Date(now.getTime() - (89 * millisecond));
last_120_days = new Date(now.getTime() - (119 * millisecond));
next_7_days = new Date(now.getTime() + (6 * millisecond));
next_30_days = new Date(now.getTime() + (29 * millisecond));
next_60_days = new Date(now.getTime() + (59 * millisecond));
next_90_days = new Date(now.getTime() + (89 * millisecond));
next_120_days = new Date(now.getTime() + (119 * millisecond));

describe('advanced format between buildin date value filter to odata query', () => {
    it('between last_year', async () => {
        let filters = [
            ["created", "between", "last_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq(`((created ge ${currentYear - 1}-01-01T08:00:00Z) and (created le ${currentYear}-01-01T07:59:59Z))`);
    });
    it('between this_year', async () => {
        let filters = [
            ["created", "between", "this_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq(`((created ge ${currentYear}-01-01T08:00:00Z) and (created le ${currentYear + 1}-01-01T07:59:59Z))`);
    });
    it('between next_year', async () => {
        let filters = [
            ["created", "between", "next_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq(`((created ge ${currentYear + 1}-01-01T08:00:00Z) and (created le ${currentYear + 2}-01-01T07:59:59Z))`);
    });
    it('between last_quarter', async () => {
        let filters = [
            ["created", "between", "last_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between this_quarter', async () => {
        let filters = [
            ["created", "between", "this_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_quarter', async () => {
        let filters = [
            ["created", "between", "next_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_month', async () => {
        let filters = [
            ["created", "between", "last_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
        strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between this_month', async () => {
        let filters = [
            ["created", "between", "this_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(firstDay).format("YYYY-MM-DD");
        strLastDay = moment(lastDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_month', async () => {
        let filters = [
            ["created", "between", "next_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
        strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
        startValue = new Date(strFirstDay + "T00:00:00Z");
        endValue = new Date(strLastDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_week', async () => {
        let filters = [
            ["created", "between", "last_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strMonday = moment(lastMonday).format("YYYY-MM-DD");
        strSunday = moment(lastSunday).format("YYYY-MM-DD");
        startValue = new Date(strMonday + "T00:00:00Z");
        endValue = new Date(strSunday + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between this_week', async () => {
        let filters = [
            ["created", "between", "this_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strMonday = moment(monday).format("YYYY-MM-DD");
        strSunday = moment(sunday).format("YYYY-MM-DD");
        startValue = new Date(strMonday + "T00:00:00Z");
        endValue = new Date(strSunday + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_week', async () => {
        let filters = [
            ["created", "between", "next_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strMonday = moment(nextMonday).format("YYYY-MM-DD");
        strSunday = moment(nextSunday).format("YYYY-MM-DD");
        startValue = new Date(strMonday + "T00:00:00Z");
        endValue = new Date(strSunday + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between yestday', async () => {
        let filters = [
            ["created", "between", "yestday"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strYestday = moment(yestday).format("YYYY-MM-DD");
        startValue = new Date(strYestday + "T00:00:00Z");
        endValue = new Date(strYestday + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between today', async () => {
        let filters = [
            ["created", "between", "today"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strToday = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strToday + "T00:00:00Z");
        endValue = new Date(strToday + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between tomorrow', async () => {
        let filters = [
            ["created", "between", "tomorrow"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
        startValue = new Date(strTomorrow + "T00:00:00Z");
        endValue = new Date(strTomorrow + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_7_days', async () => {
        let filters = [
            ["created", "between", "last_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_7_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_30_days', async () => {
        let filters = [
            ["created", "between", "last_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_30_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_60_days', async () => {
        let filters = [
            ["created", "between", "last_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_60_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_90_days', async () => {
        let filters = [
            ["created", "between", "last_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_90_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between last_120_days', async () => {
        let filters = [
            ["created", "between", "last_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_120_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_7_days', async () => {
        let filters = [
            ["created", "between", "next_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_7_days).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_30_days', async () => {
        let filters = [
            ["created", "between", "next_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_30_days).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_60_days', async () => {
        let filters = [
            ["created", "between", "next_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_60_days).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_90_days', async () => {
        let filters = [
            ["created", "between", "next_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_90_days).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
    it('between next_120_days', async () => {
        let filters = [
            ["created", "between", "next_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_120_days).format("YYYY-MM-DD");
        startValue = new Date(strStartDay + "T00:00:00Z");
        endValue = new Date(strEndDay + "T23:59:59Z");
        expect(result).to.be.eq(`((created ge ${moment(startValue).format("YYYY-MM-DDThh:mm:ss")}Z) and (created le ${moment(endValue).format("YYYY-MM-DDThh:mm:ss")}Z))`);
    });
});
