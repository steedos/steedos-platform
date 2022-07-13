var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    PERIODS = ["AM", "PM"],
    QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

var cutCaptions = function(captions, format) {
    var lengthByFormat = {
        abbreviated: 3,
        short: 2,
        narrow: 1
    };

    return captions.map(function (caption) {
        return caption.substr(0, lengthByFormat[format]);
    });
};

export function getMonthNames(format) {
    return cutCaptions(MONTHS, format);
}
export function getDayNames(format) {
    return cutCaptions(DAYS, format);
}
export function getQuarterNames(format) {
    return QUARTERS;
}
export function getPeriodNames(format) {
    return PERIODS;
}

export default {
    getMonthNames,
    getDayNames,
    getQuarterNames,
    getPeriodNames
};