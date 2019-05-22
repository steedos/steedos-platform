const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const expect = require('chai').expect;

describe('advanced format between buildin date value filter to odata query', () => {
    it('between last_year', async () => {
        let filters = [
            ["created", "between", "last_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2018-01-01T08:00:00Z) and (created le 2019-01-01T07:59:59Z))");
    });
    it('between this_year', async () => {
        let filters = [
            ["created", "between", "this_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-01-01T08:00:00Z) and (created le 2020-01-01T07:59:59Z))");
    });
    it('between next_year', async () => {
        let filters = [
            ["created", "between", "next_year"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2020-01-01T08:00:00Z) and (created le 2021-01-01T07:59:59Z))");
    });
    it('between last_quarter', async () => {
        let filters = [
            ["created", "between", "last_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-01-01T08:00:00Z) and (created le 2019-04-01T07:59:59Z))");
    });
    it('between this_quarter', async () => {
        let filters = [
            ["created", "between", "this_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-04-01T08:00:00Z) and (created le 2019-07-01T07:59:59Z))");
    });
    it('between next_quarter', async () => {
        let filters = [
            ["created", "between", "next_quarter"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-07-01T08:00:00Z) and (created le 2019-10-01T07:59:59Z))");
    });
    it('between last_month', async () => {
        let filters = [
            ["created", "between", "last_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-04-01T08:00:00Z) and (created le 2019-05-01T07:59:59Z))");
    });
    it('between this_month', async () => {
        let filters = [
            ["created", "between", "this_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-01T08:00:00Z) and (created le 2019-06-01T07:59:59Z))");
    });
    it('between next_month', async () => {
        let filters = [
            ["created", "between", "next_month"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-06-01T08:00:00Z) and (created le 2019-07-01T07:59:59Z))");
    });
    it('between last_week', async () => {
        let filters = [
            ["created", "between", "last_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-13T08:00:00Z) and (created le 2019-05-20T07:59:59Z))");
    });
    it('between this_week', async () => {
        let filters = [
            ["created", "between", "this_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-20T08:00:00Z) and (created le 2019-05-27T07:59:59Z))");
    });
    it('between next_week', async () => {
        let filters = [
            ["created", "between", "next_week"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-27T08:00:00Z) and (created le 2019-06-03T07:59:59Z))");
    });
    it('between yestday', async () => {
        let filters = [
            ["created", "between", "yestday"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-21T08:00:00Z) and (created le 2019-05-22T07:59:59Z))");
    });
    it('between today', async () => {
        let filters = [
            ["created", "between", "today"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between tomorrow', async () => {
        let filters = [
            ["created", "between", "tomorrow"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-23T08:00:00Z) and (created le 2019-05-24T07:59:59Z))");
    });
    it('between last_7_days', async () => {
        let filters = [
            ["created", "between", "last_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-16T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between last_30_days', async () => {
        let filters = [
            ["created", "between", "last_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-04-23T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between last_60_days', async () => {
        let filters = [
            ["created", "between", "last_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-03-24T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between last_90_days', async () => {
        let filters = [
            ["created", "between", "last_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-02-22T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between last_120_days', async () => {
        let filters = [
            ["created", "between", "last_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-01-23T08:00:00Z) and (created le 2019-05-23T07:59:59Z))");
    });
    it('between next_7_days', async () => {
        let filters = [
            ["created", "between", "next_7_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-05-29T07:59:59Z))");
    });
    it('between next_30_days', async () => {
        let filters = [
            ["created", "between", "next_30_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-06-21T07:59:59Z))");
    });
    it('between next_60_days', async () => {
        let filters = [
            ["created", "between", "next_60_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-07-21T07:59:59Z))");
    });
    it('between next_90_days', async () => {
        let filters = [
            ["created", "between", "next_90_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-08-20T07:59:59Z))");
    });
    it('between next_120_days', async () => {
        let filters = [
            ["created", "between", "next_120_days"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((created ge 2019-05-22T08:00:00Z) and (created le 2019-09-19T07:59:59Z))");
    });
});
