import { computeTimeoutDateWithoutHolidays, Holiday, BusinessHours, computeBusinessHoursValue } from "../../src/holidays";
import { expect } from 'chai';
const moment = require('moment');

const holidays:Array<Holiday> = [{
    name: '国庆节第一天',
    type: 'public',
    date: new Date("2020-10-01T00:00:00.000Z")
},
{
    name: '国庆节第二天',
    type: 'public',
    date: new Date("2020-10-02T00:00:00.000Z")
},
{
    name: '国庆节第三天',
    type: 'public',
    date: new Date("2020-10-03T00:00:00.000Z")
},
{
    name: '国庆节第四天',
    type: 'public',
    date: new Date("2020-10-04T00:00:00.000Z")
},
{
    name: '国庆节第五天',
    type: 'public',
    date: new Date("2020-10-05T00:00:00.000Z")
},
{
    name: '国庆节第六天',
    type: 'public',
    date: new Date("2020-10-06T00:00:00.000Z")
},
{
    name: '国庆节第七天',
    type: 'public',
    date: new Date("2020-10-07T00:00:00.000Z")
},
{
    name: '国庆节第8天',
    type: 'public',
    date: new Date("2020-10-08T00:00:00.000Z")
},
{
    name: '国庆节后周六正常补班',
    type: 'adjusted_working_day',
    date: new Date("2020-10-10T00:00:00.000Z"),
    adjusted_to: '4'
},
{
    name: '国庆节后额外周五调休',
    type: 'adjusted_holiday',
    date: new Date("2020-10-09T00:00:00.000Z")
},
{
    name: '国庆节后额外周日调班',
    type: 'adjusted_working_day',
    date: new Date("2020-10-11T00:00:00.000Z"),
    adjusted_to: '5'
},
{
    name: '8月12号周3公开休息日',
    type: 'public',
    date: new Date("2020-08-12T00:00:00.000Z"),
    adjusted_to: '3'
},
{
    name: '8月13号周4公开休息日',
    type: 'public',
    date: new Date("2020-08-13T00:00:00.000Z"),
    adjusted_to: '4'
}];

const businessHours:BusinessHours = {
    name: 'A',
    start: '9:00',
    end: '18:00',
    lunch_start: '12:00',
    lunch_end: '13:00',
    utc_offset: 8,
    working_days: [ '1', '2', '3', '4', '5' ]
};

describe('Test timeout value', () => {
    it('no holidays, no weekend and timeout date is before the first day end time', async () => {
        // 超时时间小于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号15时开始，2小时后超时，超时时间为当天北京时间17点。
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T09:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T09:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(2);
    });
    it('no holidays, no weekend and timeout date is equal to the first day end time', async () => {
        // 超时时间等于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号15时开始，3小时后超时，超时时间为当天北京时间18点。
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T10:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T10:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3);
    });
    it('no holidays, no weekend and timeout date is before the first day end time but the start time is before the am business start time', async () => {
        // 超时时间小于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号7时开始，2.5小时后超时，超时时间为当天北京时间11点30分。
        const start = moment.utc("2020-08-31T23:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2.5, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T03:30:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T03:30:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(2.5);
    });
    it('no holidays, no weekend and timeout date is before the first day end time but the start time is between the lunch time', async () => {
        // 超时时间小于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号12时点半开始，2.2小时后超时，超时时间为当天北京时间15点12分。
        const start = moment.utc("2020-09-01T04:30:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2.2, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T07:12:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T07:12:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(2.2);
    });
    it('no holidays, no weekend and timeout date is before the first day end time but the start time is equal to the lunch start time', async () => {
        // 超时时间小于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号12时点开始，2.2小时后超时，超时时间为当天北京时间15点12分。
        const start = moment.utc("2020-09-01T04:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2.2, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T07:12:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T07:12:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(2.2);
    });
    it('no holidays, no weekend and timeout date is before the first day end time but the start time is equal to the lunch end time', async () => {
        // 超时时间小于当天下班时间，则直接返回添加超时时间后的时间值。
        // 北京时间9月1号13时点开始，2.2小时后超时，超时时间为当天北京时间15点12分。
        const start = moment.utc("2020-09-01T05:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2.2, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T07:12:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-01T07:12:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(2.2);
    });
    it('no holidays, no weekend and timeout date is at the next day', async () => {
        // 超时时间大于当天下班时间，没有周未和假期，则返回添加跳过下班时间后的超时时间值。
        // 北京时间9月1号15时20分开始，3小时后超时，超时时间为第二天北京时间9点20分。
        const start = moment.utc("2020-09-01T07:20:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-02T01:20:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-02T01:20:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3);
    });
    it('no holidays, no weekend and timeout date is at the next day again', async () => {
        // 超时时间大于当天下班时间，没有周未和假期，则返回添加跳过下班时间后的超时时间值。
        // 北京时间9月1号15时开始，3.5小时后超时，超时时间为第二天北京时间9点30分。
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3.5, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-02T01:30:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-02T01:30:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3.5);
    });
    it('no holidays, no weekend and timeout date is at the next day2', async () => {
        // 超时时间大于当天下班时间，没有周未和假期，则返回添加跳过下班时间后的超时时间值。
        // 北京时间9月1号15时开始，7小时后超时，超时时间为第二天北京时间14点。
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 7, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-02T06:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-02T06:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(7);
    });
    it('no holidays, no weekend and timeout date is at the next next day', async () => {
        // 超时时间大于当天下班时间，没有周未和假期，则返回添加跳过下班时间后的超时时间值。
        // 北京时间9月1号15时开始，17小时后超时，超时时间为第三天北京时间16点。
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 17, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-03T08:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-03T08:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(17);
    });
    it('no holidays, timeout date is just at the rest time of one day ago before the weekend day, it will adjust timeout date to next Monday', async () => {
        // 超时时间大于当天下班时间，没有假期，且超时时间正好为周五下班后的非工作时间，则返回添加跳过下班时间及周末后的超时时间值，即返回下周一某个上班时间点。
        // 北京时间9月1号10时开始，36小时后超时，超时时间为本周六，会调整到下周一北京时间15点。
        const start = moment.utc("2020-09-01T02:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 36, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-07T07:00:00.000Z").toDate().getTime());
        // let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-07T02:00:00.000Z").toDate(), holidays, businessHours);
        // expect(result2.computedHours).to.be.eq(36);
    });
    it('no holidays, timeout date is just at the weekend day, it will adjust timeout date to next Monday too', async () => {
        // 超时时间大于当天下班时间，没有假期，且超时时间正好为周末，则返回添加跳过下班时间及周末后的超时时间值。
        // 北京时间9月1号10时开始，40.2小时后超时，超时时间为本周日，会调整到下周二北京时间10点12分。
        const start = moment.utc("2020-09-01T02:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 40.2, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-08T02:12:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-08T02:12:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(40.2);
    });
    it('no holidays, exists weekend and timeout date is at wednesday of next week', async () => {
        // 超时时间大于当天下班时间，有周未但是没有假期，则返回添加跳过下班时间及周末后的超时时间值。
        // 北京时间9月1号15时50分开始，55.5小时后超时，超时时间为下周3北京时间17点20分。
        const start = moment.utc("2020-09-01T07:50:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 55.5, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-10T07:20:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-10T07:20:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(55.5);
    });
    it('exists holidays and weekend, start date is before them, then timeout date will at the date after them', async () => {
        // 超时时间大于当天下班时间，有周未也有假期，开始时间在节假日前，则返回添加跳过下班时间、周末和假期时间后的超时时间值。
        // 北京时间9月30号15时50分开始，3小时后超时，超时时间为下周日北京时间9点50分。
        const start = moment.utc("2020-09-30T07:50:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-10-10T01:50:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-10-10T01:50:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3);
    });
    it('exists holidays and weekend, start date between them, then timeout date will at the date after them too', async () => {
        // 超时时间大于当天下班时间，有周未也有假期，开始时间在节假日中，则返回添加跳过下班时间、周末和假期时间后的超时时间值。
        // 北京时间10月6号15时50分开始，3小时后超时，超时时间为下周日北京时间12点00分。
        const start = moment.utc("2020-10-06T07:50:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-10-10T04:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-10-10T04:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3);
    });
    it('exists holidays and weekend, start date between them, then timeout date will at the date after them again', async () => {
        // 超时时间大于当天下班时间，有周未也有假期，开始时间在调休日中，则返回添加跳过下班时间、周末和假期时间后的超时时间值。
        // 北京时间10月9号15时50分开始，3小时后超时，超时时间为下周日北京时间12点00分。
        const start = moment.utc("2020-10-09T07:50:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 3, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-10-10T04:00:00.000Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-10-10T04:00:00.000Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(3);
    });
    it("exists holidays and no weekend, start value's seconds or milliseconds is not zero", async () => {
        const start = moment.utc("2020-08-10T08:16:25.167Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 16, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-08-14T08:16:25.167Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-08-14T08:16:25.167Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(16);
    });
    it("exists holidays and weekend, start value's seconds or milliseconds is not zero.", async () => {
        const start = moment.utc("2020-08-10T08:16:25.167Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 168, holidays, businessHours);
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-10T08:16:25.167Z").toDate().getTime());
        let result2 = computeBusinessHoursValue(start.toDate(), moment.utc("2020-09-10T08:16:25.167Z").toDate(), holidays, businessHours);
        expect(result2.computedHours).to.be.eq(168);
    });
});