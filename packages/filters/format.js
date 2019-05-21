
const SteedosFilter = require("./filter");

let formatFiltersToDev = (filters) => {
    return filters;
};

let formatFiltersToODataQuery = (filters, odataProtocolVersion, forceLowerCase) => {
    let devFilters = formatFiltersToDev(filters);
    return new SteedosFilter(devFilters, odataProtocolVersion, forceLowerCase).formatFiltersToODataQuery();
};

exports.formatFiltersToDev = formatFiltersToDev;
exports.formatFiltersToODataQuery = formatFiltersToODataQuery;
