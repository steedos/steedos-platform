const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const expect = require('chai').expect;
const moment = require('moment');

describe("date/datetime now format filter to odata query", () => {
    it('le now', async () => {
        let filters = [
            ["created", "<=", '{now}']
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let nowStr = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let reg = new RegExp(`(created le ${nowStr})`);
        expect(result).to.be.matches(reg);
    });
    it('ge now', async () => {
        let filters = [
            ["created", ">=", '{now}']
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let nowStr = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let reg = new RegExp(`(created ge ${nowStr})`);
        expect(result).to.be.matches(reg);
    });
    it('lt now', async () => {
        let filters = [
            ["created", "<", '{now}']
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let nowStr = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let reg = new RegExp(`(created lt ${nowStr})`);
        expect(result).to.be.matches(reg);
    });
    it('gt now', async () => {
        let filters = [
            ["created", ">", '{now}']
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let nowStr = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let reg = new RegExp(`(created gt ${nowStr})`);
        expect(result).to.be.matches(reg);
    });
    it('eq now', async () => {
        let filters = [
            ["created", "=", '{now}']
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let nowStr = moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss");
        let reg = new RegExp(`(created eq ${nowStr})`);
        expect(result).to.be.matches(reg);
    });
});
