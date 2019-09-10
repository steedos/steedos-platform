const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const expect = require('chai').expect;

describe('format filters to odata query with connector "and" or "or" or "!"', () => {
    it('array default to and', async () => {
        let filters = [
            ["name", "=", "ptr"],
            ["title", "=", "PTR"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq 'ptr') and (title eq 'PTR')");
    });
    it('and', async () => {
        let filters = [
            ["name", "=", "ptr"],
            "and",
            ["title", "=", "PTR"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq 'ptr') and (title eq 'PTR')");
    });
    it('or', async () => {
        let filters = [
            ["name", "=", "ptr"],
            "or",
            ["title", "=", "PTR"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq 'ptr') or (title eq 'PTR')");
    });
    it('!', async () => {
        let filters = [
            "!", 
            ["name", "=", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("not (name eq 'ptr')");
    });
    it('! default and', async () => {
        let filters = [
            "!",
            [
                ["name", "=", "ptr"],
                ["title", "=", "PTR"]
            ]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("not ((name eq 'ptr') and (title eq 'PTR'))");
    });
    it('! and', async () => {
        let filters = [
            "!",
            [
                ["name", "=", "ptr"],
                "and",
                ["title", "=", "PTR"]
            ]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("not ((name eq 'ptr') and (title eq 'PTR'))");
    });
    it('! or', async () => {
        let filters = [
            "!",
            [
                ["name", "=", "ptr"],
                "or",
                ["title", "=", "PTR"]
            ]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("not ((name eq 'ptr') or (title eq 'PTR'))");
    });
    it('null and undefined', async () => {
        let filters = [
            ["name", "=", undefined],
            "or",
            ["title", "=", null]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(name eq null) or (title eq null)");
    });
    it('complex', async () => {
        let filters = [
            [
                ["name", "=", "ptr"],
                [
                    ["tag", "=", "one"],
                    "or",
                    ["tag", "=", "two"]
                ]
            ],
            "or",
            [
                ["count", ">", 100],
                "or",
                ["count", "<", -100]
            ]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("((name eq 'ptr') and ((tag eq 'one') or (tag eq 'two'))) or ((count gt 100) or (count lt -100))");
    });
});
