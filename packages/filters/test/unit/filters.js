const formatFiltersToODataQuery = require('../../index').formatFiltersToODataQuery;
const expect = require('chai').expect;
describe('format filters to a simple odata query', () => {
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
        expect(result).to.be.eq("(startswith(tolower(name),'ptr'))");
    });
    it('endswith endswith', async () => {
        let filters = [
            ["name", "endswith", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(endswith(tolower(name),'ptr'))");
    });
    it('contains contains', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(contains(tolower(name),'ptr'))");
    });
    it('notcontains notcontains', async () => {
        let filters = [
            ["name", "notcontains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(not contains(tolower(name),'ptr'))");
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
        expect(result).to.be.eq("((startswith(tolower(name),'ptr')) or (endswith(tolower(title),'ptr'))) and (count ge 100) and (count le 100) and (tag ne 'one')");
    });
});

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

describe('advanced arguments for the filter function', () => {
    it('odata protocol version for default value 4', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result1 = formatFiltersToODataQuery(filters);
        let result2 = formatFiltersToODataQuery(filters, 4);
        console.log("odata filters query result1:", result1);
        expect(result1).to.be.eq("(contains(tolower(name),'ptr'))");
        expect(result1).to.be.eq(result2);
    });
    it('odata protocol version for 2', async () => {
        let filters = [
            ["name", "contains", "ptr"]
        ];
        let result = formatFiltersToODataQuery(filters, 2);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(substringof('ptr',tolower(name)))");
    });
    it('forceLowerCase for defalut value true', async () => {
        let filters = [
            ["title", "contains", "PTR"]
        ];
        let result1 = formatFiltersToODataQuery(filters, 4);
        let result2 = formatFiltersToODataQuery(filters, 4, true);
        console.log("odata filters query result:", result1);
        expect(result1).to.be.eq("(contains(tolower(title),'ptr'))");
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
