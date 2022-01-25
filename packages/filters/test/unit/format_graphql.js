const formatFiltersToGraphqlQuery = require('../../lib/index').formatFiltersToGraphqlQuery;
const expect = require('chai').expect;

describe('format filter and fields to graphql query', () => {
    it('fields is a array', async () => {
        let filters = [["create_date","between","this_year"]];
        let fields = ["a","a.b.a","x.y","c"];
        let result = formatFiltersToGraphqlQuery("contracts", filters, fields);
        console.log("graphql filters query result:", result);
        expect(result).to.be.include(`((create_date ge ${(new Date()).getFullYear()}-01-01T00:00:00Z) and (create_date le ${(new Date()).getFullYear()}-12-31T23:59:59Z))`);
        expect(result).to.be.include("    a {");
        expect(result).to.be.include("        b {");
        expect(result).to.be.include("    x {");
        expect(result).to.be.include("    c");
    });
    it('fields is a string', async () => {
        let filters = [["create_date","between","this_year"]];
        let fields = "a,a.b.a,x.y,c";
        let result = formatFiltersToGraphqlQuery("contracts", filters, fields);
        console.log("graphql filters query result:", result);
        expect(result).to.be.include(`((create_date ge ${(new Date()).getFullYear()}-01-01T00:00:00Z) and (create_date le ${(new Date()).getFullYear()}-12-31T23:59:59Z))`);
        expect(result).to.be.include("    a {");
        expect(result).to.be.include("        b {");
        expect(result).to.be.include("    x {");
        expect(result).to.be.include("    c");
    });
});
