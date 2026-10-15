const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const expect = require('chai').expect;

const userContext = { userId: "hPgDcEd9vKQxwndQR", user: { _id: "hPgDcEd9vKQxwndQR", name: "系统管理员", email: "test1@steedos.cn" } };

describe("format formula filter to odata query", () => {
    it('simple formula format', async () => {
        let filters = [["assignees", "=", "{userId}"], ["state", "<>", "completed"]];
        let result = formatFiltersToODataQuery(filters, userContext);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(assignees eq 'hPgDcEd9vKQxwndQR') and (state ne 'completed')");
    });
    it('complex formula format', async () => {
        let filters = [["email", "=", "{user.email}"]];
        let result = formatFiltersToODataQuery(filters, userContext);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq(`(email eq '${encodeURIComponent("test1@steedos.cn")}')`);
    });
    it('non formula string should keep as it is', async () => {
        let value = "{ user . email }";
        let filters = [["email", "=", value]];
        let result = formatFiltersToODataQuery(filters, userContext);
        expect(result).to.be.eq(`(email eq '${encodeURIComponent(value)}')`);
    });
    it('js expression should not be evaluated', async () => {
        global.__formulaInjected = false;
        let value = "{userId} || (global.__formulaInjected = true)";
        let filters = [["name", "=", value]];
        expect(() => formatFiltersToODataQuery(filters, userContext)).to.throw("Unsupported filter formula");
        expect(global.__formulaInjected).to.be.eq(false);
        delete global.__formulaInjected;
    });
    it('formula with surrounding whitespace format', async () => {
        let filters = [["assignees", "=", " {userId} "]];
        let result = formatFiltersToODataQuery(filters, userContext);
        expect(result).to.be.eq("(assignees eq 'hPgDcEd9vKQxwndQR')");
    });
    it('prototype keys should not be resolved', async () => {
        let filters = [["name", "=", "{user.constructor}"]];
        let result = formatFiltersToODataQuery(filters, userContext);
        expect(result).to.not.contain("function");
    });
});
