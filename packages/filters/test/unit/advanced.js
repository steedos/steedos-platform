const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const expect = require('chai').expect;

describe('advanced arguments for the filter function', () => {
    it('odata protocol version for default value 4', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result1 = formatFiltersToODataQuery(filters);
        let result2 = formatFiltersToODataQuery(filters, 4);
        console.log("odata filters query result1:", result1);
        expect(result1).to.be.eq("(contains(name,'ptr'))");
        expect(result1).to.be.eq(result2);
    });
    it('odata protocol version for 2', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters, 2);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(substringof('ptr',name))");
    });
    it('forceLowerCase for defalut value true', async () => {
        let filters = [
            ["title", "contains", "PTR"]
        ];
        let result1 = formatFiltersToODataQuery(filters, 4);
        let result2 = formatFiltersToODataQuery(filters, 4, true);
        console.log("odata filters query result:", result1);
        expect(result1).to.be.eq("(contains(title,'ptr'))");
        expect(result1).to.be.eq(result2);
    });
    it('forceLowerCase for false', async () => {
        let filters = [
            ["title", "contains", "PTR"]
        ];
        let result = formatFiltersToODataQuery(filters, 4, false);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(contains(title,'PTR'))");
    });
});
