const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const expect = require('chai').expect;

const now = new Date();
const offset = now.getTimezoneOffset() / 60;

describe("date/datetime's utc format filter to odata query", () => {
    it('utc date object', async () => {
        let filters = [
            ["created", "<=", new Date("2019-05-25T06:44:44.000Z")]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
    it('utc date string', async () => {
        let filters = [
            ["created", "<=", "2019-05-25T06:44:44.000Z"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
    it('utc date object with out millisecond', async () => {
        let filters = [
            ["created", "<=", new Date("2019-05-25T06:44:44Z")]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
    it('utc date string with out millisecond', async () => {
        let filters = [
            ["created", "<=", "2019-05-25T06:44:44Z"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
    it('local date object', async () => {
        let filters = [
            ["created", "<=", new Date(`2019-05-25 ${6 - offset}:44:44`)]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
    it('local date string', async () => {
        let filters = [
            ["created", "<=", `2019-05-25 ${6 - offset}:44:44`]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(created le 2019-05-25T06:44:44Z)");
    });
});
