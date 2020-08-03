import { getStringTimeValue, computeBusinessHoursPerDay } from "../../src/holidays";
import { expect } from 'chai';

describe('getStringTimeValue', () => {
    it('09:00 is 9 Hours and 9*60 Minutes', async () => {
        let result:any = getStringTimeValue("9:00")
        expect(result.valueToHours).to.eq(9);
        expect(result.valueToMinutes).to.eq(9*60);
    });
    it('24:09 is formated error so will catch errors', async () => {
        let result:any;
        try {
            result = getStringTimeValue("24:09");
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('09:099 is formated error so will catch errors', async () => {
        let result:any;
        try {
            result = getStringTimeValue("09:099")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
});

describe('computeBusinessHoursPerDay', () => {
    it('9:00 to 18:00 is 9 Hours', async () => {
        let result = computeBusinessHoursPerDay("9:00", "18:00",)
        expect(result.computedValue).to.be.eq(9);
        expect(result.startValue.hours).to.be.eq(9);
        expect(result.startValue.minutes).to.be.eq(0);
    });
    it('9:30 to 18:00 is 8.5 Hours', async () => {
        let result = computeBusinessHoursPerDay("9:30", "18:00",)
        expect(result.computedValue).to.be.eq(8.5);
        expect(result.startValue.hours).to.be.eq(9);
        expect(result.startValue.minutes).to.be.eq(30);
    });
    it('18:00 to 9:00 is -9 Hours but will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("18:00", "9:00")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('18:00 to 18:00 is zero Hours but will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("18:00", "18:00")
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
    it('24:01 to 25:00 has formated error, will catch errors', async () => {
        let result:any;
        try {
            result = computeBusinessHoursPerDay("24:01", "25:00",)
        }
        catch(ex){
        }
        expect(result).to.eq(undefined);
    });
});