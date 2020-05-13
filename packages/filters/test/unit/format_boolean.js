const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const expect = require('chai').expect;

describe("boolean value format filter to odata query", () => {
    it('eq true', async () => {
        let filters = [
            ["active", "=", true]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let reg = `(active eq true)`;
        expect(result).to.be.eq(reg);
    });
    it('eq false', async () => {
        let filters = [
            ["active", "=", false]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let reg = `((active eq false) or (active eq null))`;
        expect(result).to.be.eq(reg);
    });
    it('ne true', async () => {
        let filters = [
            ["active", "!=", true]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let reg = `(active ne true)`;
        expect(result).to.be.eq(reg);
    });
    it('ne false', async () => {
        let filters = [
            ["active", "!=", false]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        let reg = `(active eq true)`;
        expect(result).to.be.eq(reg);
    });
});
