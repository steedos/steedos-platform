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
const utcOffset = moment().utcOffset() / 60;

describe('advanced format between buildin date value filter to odata query', () => {
    it('between last_year', async () => {
        let filters = [
            ["created", "between", "last_year"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        let start = moment.utc(new Date(`${currentYear - 1}-01-01 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${currentYear - 1}-12-31 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${currentYear - 1}-01-01T00:00:00Z) and (created le ${currentYear - 1}-12-31T23:59:59Z))`);
    });
    it('between this_year', async () => {
        let filters = [
            ["created", "between", "this_year"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        let start = moment.utc(new Date(`${currentYear}-01-01 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${currentYear}-12-31 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${currentYear}-01-01T00:00:00Z) and (created le ${currentYear}-12-31T23:59:59Z))`);
    });
    it('between next_year', async () => {
        let filters = [
            ["created", "between", "next_year"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        let start = moment.utc(new Date(`${currentYear + 1}-01-01 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${currentYear + 1}-12-31 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${currentYear + 1}-01-01T00:00:00Z) and (created le ${currentYear + 1}-12-31T23:59:59Z))`);
    });
    it('between last_quarter', async () => {
        let filters = [
            ["created", "between", "last_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between this_quarter', async () => {
        let filters = [
            ["created", "between", "this_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between next_quarter', async () => {
        let filters = [
            ["created", "between", "next_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
        strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between last_month', async () => {
        let filters = [
            ["created", "between", "last_month"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
        strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between this_month', async () => {
        let filters = [
            ["created", "between", "this_month"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(firstDay).format("YYYY-MM-DD");
        strLastDay = moment(lastDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between next_month', async () => {
        let filters = [
            ["created", "between", "next_month"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
        strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strFirstDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strLastDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strFirstDay}T00:00:00Z) and (created le ${strLastDay}T23:59:59Z))`);
    });
    it('between last_week', async () => {
        let filters = [
            ["created", "between", "last_week"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strMonday = moment(lastMonday).format("YYYY-MM-DD");
        strSunday = moment(lastSunday).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strMonday} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strSunday} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strMonday}T00:00:00Z) and (created le ${strSunday}T23:59:59Z))`);
    });
    it('between this_week', async () => {
        let filters = [
            ["created", "between", "this_week"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strMonday = moment(monday).format("YYYY-MM-DD");
        strSunday = moment(sunday).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strMonday} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strSunday} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strMonday}T00:00:00Z) and (created le ${strSunday}T23:59:59Z))`);
    });
    it('between next_week', async () => {
        let filters = [
            ["created", "between", "next_week"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strMonday = moment(nextMonday).format("YYYY-MM-DD");
        strSunday = moment(nextSunday).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strMonday} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strSunday} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strMonday}T00:00:00Z) and (created le ${strSunday}T23:59:59Z))`);
    });
    it('between yestday', async () => {
        let filters = [
            ["created", "between", "yestday"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strYestday = moment(yestday).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strYestday} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strYestday} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strYestday}T00:00:00Z) and (created le ${strYestday}T23:59:59Z))`);
    });
    it('between today', async () => {
        let filters = [
            ["created", "between", "today"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strToday = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strToday} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strToday} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strToday}T00:00:00Z) and (created le ${strToday}T23:59:59Z))`);
    });
    it('between tomorrow', async () => {
        let filters = [
            ["created", "between", "tomorrow"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strTomorrow} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strTomorrow} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strTomorrow}T00:00:00Z) and (created le ${strTomorrow}T23:59:59Z))`);
    });
    it('between last_7_days', async () => {
        let filters = [
            ["created", "between", "last_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_7_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between last_30_days', async () => {
        let filters = [
            ["created", "between", "last_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_30_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between last_60_days', async () => {
        let filters = [
            ["created", "between", "last_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_60_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between last_90_days', async () => {
        let filters = [
            ["created", "between", "last_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_90_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between last_120_days', async () => {
        let filters = [
            ["created", "between", "last_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(last_120_days).format("YYYY-MM-DD");
        strEndDay = moment(now).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between next_7_days', async () => {
        let filters = [
            ["created", "between", "next_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_7_days).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between next_30_days', async () => {
        let filters = [
            ["created", "between", "next_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_30_days).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between next_60_days', async () => {
        let filters = [
            ["created", "between", "next_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_60_days).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between next_90_days', async () => {
        let filters = [
            ["created", "between", "next_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_90_days).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
    it('between next_120_days', async () => {
        let filters = [
            ["created", "between", "next_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters, utcOffset);
        console.log("odata filters query result:", result);
        strStartDay = moment(now).format("YYYY-MM-DD");
        strEndDay = moment(next_120_days).format("YYYY-MM-DD");
        let start = moment.utc(new Date(`${strStartDay} 00:00:00`)).format("YYYY-MM-DDTHH:mm:ss");
        let end = moment.utc(new Date(`${strEndDay} 23:59:59`)).format("YYYY-MM-DDTHH:mm:ss");
        expect(result).to.be.eq(`((created ge ${start}Z) and (created le ${end}Z))`);
        // expect(result).to.be.eq(`((created ge ${strStartDay}T00:00:00Z) and (created le ${strEndDay}T23:59:59Z))`);
    });
});
