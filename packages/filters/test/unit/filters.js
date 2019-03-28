const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const expect = require('chai').expect;
describe('format filters to odata query', () => {
    it('format filters to odata query', async () => {
        let filters = [["name", "=", "ptr"], ["title", "=", "PTR"]];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq 'ptr') and (title eq 'PTR')");
    });
});
