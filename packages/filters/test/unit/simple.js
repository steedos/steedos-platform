const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const expect = require('chai').expect;
describe('format filters to a simple odata query', () => {
    it('empty array', async () => {
        let filters = [];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("");
    });
    it('eq =', async () => {
        let filters = [
            ["name", "=", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq 'ptr')");
    });
    it('ne <>', async () => {
        let filters = [
            ["name", "<>", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name ne 'ptr')");
    });
    it('gt >', async () => {
        let filters = [
            ["name", ">", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name gt 'ptr')");
    });
    it('ge >=', async () => {
        let filters = [
            ["name", ">=", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name ge 'ptr')");
    });
    it('lt <', async () => {
        let filters = [
            ["name", "<", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name lt 'ptr')");
    });
    it('le <=', async () => {
        let filters = [
            ["name", "<=", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name le 'ptr')");
    });
    it('startswith startswith', async () => {
        let filters = [
            ["name", "startswith", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(startswith(name,'ptr'))");
    });
    it('endswith endswith', async () => {
        let filters = [
            ["name", "endswith", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(endswith(name,'ptr'))");
    });
    it('contains contains', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(contains(name,'ptr'))");
    });
    it('notcontains notcontains', async () => {
        let filters = [
            ["name", "notcontains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(not contains(name,'ptr'))");
    });
    it('mixin above', async () => {
        let filters = [
            [
                ["name", "startswith", "ptr"],
                "or",
                ["title", "endswith", "PTR"]
            ],
            ["count", ">=", 100],
            ["count", "<=", 100],
            ["tag", "<>", "one"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((startswith(name,'ptr')) or (endswith(title,'ptr'))) and (count ge 100) and (count le 100) and (tag ne 'one')");
    });
});
