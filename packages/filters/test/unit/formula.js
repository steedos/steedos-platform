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
});
