import { computeTimeoutDateWithoutHolidays } from "../../src/holidays";
import { expect } from 'chai';
const moment = require('moment');

const utcOffset = 8;

describe('Test timeout value', () => {
    let holidays:any = [{
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
    }];
    let businessHours = {
        name: 'A',
        start: '9:00',
        end: '18:00',
        working_days: [ '1', '2', '3', '4', '5' ] 
    };
    it('should return true', async () => {
        //北京时间15开始，2小时后超时，超时时间为北京时间17点
        const start = moment.utc("2020-09-01T07:00:00.000Z");
        let result:any = computeTimeoutDateWithoutHolidays(start.toDate(), 2, holidays, businessHours, utcOffset);
        console.log("===result===", result);
        // console.log("==result===", moment("2020-09-01 15:00:00.000").hours());
        // console.log("==result===", moment("2020-09-01T15:00:00.000Z").hours());
        expect(result.getTime()).to.be.eq(moment.utc("2020-09-01T09:00:00.000Z").toDate().getTime());
    });
});