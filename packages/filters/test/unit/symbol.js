const formatFiltersToODataQuery = require('../../lib/index').formatFiltersToODataQuery;
const formatFiltersToDev = require('../../lib/index').formatFiltersToDev;
const expect = require('chai').expect;
const symbols = ";/?:@&=+$,#%".split("");
const escapeSymbols = "?+$".split("");
describe(`specific symbol like ${symbols.join("")} format filter to odata query`, () => {
    symbols.forEach(function(symbol){
        it(`eq = ${symbol}`, async () => {
            let filters = [
                ["name", "=", `ptr${symbol}`]
            ];
            let result = formatFiltersToODataQuery(filters);
            console.log("odata filters query result:", result);
            expect(result).to.be.eq("(name eq '" + encodeURIComponent(`ptr${symbol}`) + "')");
        });
        it(`contains contains ${symbol}`, async () => {
            let filters = [
                ["name", "contains", `ptr${symbol}`]
            ];
            let result = formatFiltersToODataQuery(filters);
            console.log("odata filters query result:", result);
            if(escapeSymbols.indexOf(symbol) > -1){
                // 正则表达式占位符需要转义，contains，startswith等操作符在mongodb中是按正则来匹配数据的
                symbol = `\\${symbol}`;
            }
            expect(result).to.be.eq("(contains(name,'" + encodeURIComponent(`ptr${symbol}`).toLowerCase() + "'))");
        });
        it(`in in ${symbol}]`, async () => {
            let filters = [
                ["name", "in", [`ptr${symbol}`,`tcr${symbol}`]]
            ];
            let result = formatFiltersToODataQuery(filters);
            console.log("odata filters query result:", result);
            expect(result).to.be.eq("((name in ('" + encodeURIComponent(`ptr${symbol}`) + "','" + encodeURIComponent(`tcr${symbol}`) + "')))");
        });
    });
    it('mixin above for eq =', async () => {
        let filters = [
            ['repository__c', '=', "steedos/mock_image:0.1"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(repository__c eq 'steedos%2Fmock_image%3A0.1')");
    });
    it('mixin above for contains contains', async () => {
        let filters = [
            ['repository__c', 'contains', "steedos/mock_image:0.1"]
        ];
        let result = formatFiltersToODataQuery(filters);
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(contains(repository__c,'steedos%2fmock_image%3a0%5c.1'))");
    });
});

describe(`specific symbol like ${symbols.join("")} format filter to odata query again`, () => {
    // 有时调用formatFiltersToODataQuery函数前可能先调用了一次formatFiltersToDev，这会造成重复对字段值执行encodeURIComponent，需要兼容
    symbols.forEach(function(symbol){
        it(`eq = ${symbol}`, async () => {
            let filters = [
                ["name", "=", `ptr${symbol}`]
            ];
            let result = formatFiltersToODataQuery(formatFiltersToDev(filters));
            console.log("odata filters query result:", result);
            expect(result).to.be.eq("(name eq '" + encodeURIComponent(`ptr${symbol}`) + "')");
        });
        it(`contains contains ${symbol}`, async () => {
            let filters = [
                ["name", "contains", `ptr${symbol}`]
            ];
            let result = formatFiltersToODataQuery(formatFiltersToDev(filters));
            console.log("odata filters query result:", result);
            if(escapeSymbols.indexOf(symbol) > -1){
                // 正则表达式占位符需要转义，contains，startswith等操作符在mongodb中是按正则来匹配数据的
                symbol = `\\${symbol}`;
            }
            expect(result).to.be.eq("(contains(name,'" + encodeURIComponent(`ptr${symbol}`).toLowerCase() + "'))");
        });
        it(`in in ${symbol}]`, async () => {
            let filters = [
                ["name", "in", [`ptr${symbol}`,`tcr${symbol}`]]
            ];
            let result = formatFiltersToODataQuery(formatFiltersToDev(filters));
            console.log("odata filters query result:", result);
            expect(result).to.be.eq("((name in ('" + encodeURIComponent(`ptr${symbol}`) + "','" + encodeURIComponent(`tcr${symbol}`) + "')))");
        });
    });
    it('mixin above for eq =', async () => {
        let filters = [
            ['repository__c', '=', "steedos/mock_image:0.1"]
        ];
        let result = formatFiltersToODataQuery(formatFiltersToDev(filters));
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(repository__c eq 'steedos%2Fmock_image%3A0.1')");
    });
    it('mixin above for contains contains', async () => {
        let filters = [
            ['repository__c', 'contains', "steedos/mock_image:0.1"]
        ];
        let result = formatFiltersToODataQuery(formatFiltersToDev(filters));
        console.log("odata filters query result:", result);
        expect(result).to.be.eq("(contains(repository__c,'steedos%2fmock_image%3a0%5c.1'))");
    });
});
