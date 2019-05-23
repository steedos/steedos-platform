const moment = require('moment');
const _ = require('underscore');

let t = (key) => {
    return key;
}

let getMonthDays = (year, month) => {
    var days, endDate, millisecond, startDate;
    if (month === 11) {
        return 31;
    }
    millisecond = 1000 * 60 * 60 * 24;
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 1);
    days = (endDate - startDate) / millisecond;
    return days;
}

let getNextQuarterFirstDay = (year, month) => {
    if (!year) {
        year = new Date().getFullYear();
    }
    if (!month) {
        month = new Date().getMonth();
    }
    if (month < 3) {
        month = 3;
    } else if (month < 6) {
        month = 6;
    } else if (month < 9) {
        month = 9;
    } else {
        year++;
        month = 0;
    }
    return new Date(year, month, 1);
}

let getLastMonthFirstDay = (year, month) => {
    if (!year) {
        year = new Date().getFullYear();
    }
    if (!month) {
        month = new Date().getMonth();
    }
    if (month === 0) {
        month = 11;
        year--;
        return new Date(year, month, 1);
    }
    month--;
    return new Date(year, month, 1);
}

let getQuarterStartMonth = (month) => {
    if (!month) {
        month = new Date().getMonth();
    }
    if (month < 3) {
        return 0;
    } else if (month < 6) {
        return 3;
    } else if (month < 9) {
        return 6;
    }
    return 9;
}

let getLastQuarterFirstDay = (year, month) => {
    if (!year) {
        year = new Date().getFullYear();
    }
    if (!month) {
        month = new Date().getMonth();
    }
    if (month < 3) {
        year--;
        month = 9;
    } else if (month < 6) {
        month = 0;
    } else if (month < 9) {
        month = 3;
    } else {
        month = 6;
    }
    return new Date(year, month, 1);
}

let getBetweenTimeBuiltinValueItem = (key) => {
    // 过滤器between运算符，现算日期/日期时间类型字段的values值
    var currentMonth, currentYear, endValue, firstDay, label, lastDay, lastMonday, lastMonthFinalDay, lastMonthFirstDay, lastQuarterEndDay, lastQuarterStartDay, lastSunday, last_120_days, last_30_days, last_60_days, last_7_days, last_90_days, millisecond, minusDay, monday, month, nextMonday, nextMonthFinalDay, nextMonthFirstDay, nextQuarterEndDay, nextQuarterStartDay, nextSunday, nextYear, next_120_days, next_30_days, next_60_days, next_7_days, next_90_days, now, previousYear, startValue, strEndDay, strFirstDay, strLastDay, strMonday, strStartDay, strSunday, strToday, strTomorrow, strYestday, sunday, thisQuarterEndDay, thisQuarterStartDay, tomorrow, values, week, year, yestday;
    now = new Date();
    millisecond = 1000 * 60 * 60 * 24;
    yestday = new Date(now.getTime() - millisecond);
    tomorrow = new Date(now.getTime() + millisecond);
    week = now.getDay();
    minusDay = week !== 0 ? week - 1 : 6;
    monday = new Date(now.getTime() - (minusDay * millisecond));
    sunday = new Date(monday.getTime() + (6 * millisecond));
    lastSunday = new Date(monday.getTime() - millisecond);
    lastMonday = new Date(lastSunday.getTime() - (millisecond * 6));
    nextMonday = new Date(sunday.getTime() + millisecond);
    nextSunday = new Date(nextMonday.getTime() + (millisecond * 6));
    currentYear = now.getFullYear();
    previousYear = currentYear - 1;
    nextYear = currentYear + 1;
    currentMonth = now.getMonth();
    year = now.getFullYear();
    month = now.getMonth();
    firstDay = new Date(currentYear, currentMonth, 1);
    if (currentMonth === 11) {
        year++;
        month++;
    } else {
        month++;
    }
    nextMonthFirstDay = new Date(year, month, 1);
    nextMonthFinalDay = new Date(year, month, getMonthDays(year, month));
    lastDay = new Date(nextMonthFirstDay.getTime() - millisecond);
    lastMonthFirstDay = getLastMonthFirstDay(currentYear, currentMonth);
    lastMonthFinalDay = new Date(firstDay.getTime() - millisecond);
    thisQuarterStartDay = new Date(currentYear, getQuarterStartMonth(currentMonth), 1);
    thisQuarterEndDay = new Date(currentYear, getQuarterStartMonth(currentMonth) + 2, getMonthDays(currentYear, getQuarterStartMonth(currentMonth) + 2));
    lastQuarterStartDay = getLastQuarterFirstDay(currentYear, currentMonth);
    lastQuarterEndDay = new Date(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2, getMonthDays(lastQuarterStartDay.getFullYear(), lastQuarterStartDay.getMonth() + 2));
    nextQuarterStartDay = getNextQuarterFirstDay(currentYear, currentMonth);
    nextQuarterEndDay = new Date(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2, getMonthDays(nextQuarterStartDay.getFullYear(), nextQuarterStartDay.getMonth() + 2));
    last_7_days = new Date(now.getTime() - (6 * millisecond));
    last_30_days = new Date(now.getTime() - (29 * millisecond));
    last_60_days = new Date(now.getTime() - (59 * millisecond));
    last_90_days = new Date(now.getTime() - (89 * millisecond));
    last_120_days = new Date(now.getTime() - (119 * millisecond));
    next_7_days = new Date(now.getTime() + (6 * millisecond));
    next_30_days = new Date(now.getTime() + (29 * millisecond));
    next_60_days = new Date(now.getTime() + (59 * millisecond));
    next_90_days = new Date(now.getTime() + (89 * millisecond));
    next_120_days = new Date(now.getTime() + (119 * millisecond));
    switch (key) {
        case "last_year":
            label = t("creator_filter_operation_between_last_year");
            startValue = new Date(previousYear + "-01-01T00:00:00Z");
            endValue = new Date(previousYear + "-12-31T23:59:59Z");
            break;
        case "this_year":
            label = t("creator_filter_operation_between_this_year");
            startValue = new Date(currentYear + "-01-01T00:00:00Z");
            endValue = new Date(currentYear + "-12-31T23:59:59Z");
            break;
        case "next_year":
            label = t("creator_filter_operation_between_next_year");
            startValue = new Date(nextYear + "-01-01T00:00:00Z");
            endValue = new Date(nextYear + "-12-31T23:59:59Z");
            break;
        case "last_quarter":
            strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "this_quarter":
            strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "next_quarter":
            strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "last_month":
            strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
            strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "this_month":
            strFirstDay = moment(firstDay).format("YYYY-MM-DD");
            strLastDay = moment(lastDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "next_month":
            strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
            strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "last_week":
            strMonday = moment(lastMonday).format("YYYY-MM-DD");
            strSunday = moment(lastSunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "this_week":
            strMonday = moment(monday).format("YYYY-MM-DD");
            strSunday = moment(sunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "next_week":
            strMonday = moment(nextMonday).format("YYYY-MM-DD");
            strSunday = moment(nextSunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "yestday":
            strYestday = moment(yestday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_yestday");
            startValue = new Date(strYestday + "T00:00:00Z");
            endValue = new Date(strYestday + "T23:59:59Z");
            break;
        case "today":
            strToday = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_today");
            startValue = new Date(strToday + "T00:00:00Z");
            endValue = new Date(strToday + "T23:59:59Z");
            break;
        case "tomorrow":
            strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_tomorrow");
            startValue = new Date(strTomorrow + "T00:00:00Z");
            endValue = new Date(strTomorrow + "T23:59:59Z");
            break;
        case "last_7_days":
            strStartDay = moment(last_7_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_7_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_30_days":
            strStartDay = moment(last_30_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_30_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_60_days":
            strStartDay = moment(last_60_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_60_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_90_days":
            strStartDay = moment(last_90_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_90_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_120_days":
            strStartDay = moment(last_120_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_120_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_7_days":
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_7_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_7_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_30_days":
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_30_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_30_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_60_days":
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_60_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_60_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_90_days":
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_90_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_90_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_120_days":
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_120_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_120_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
    }
    values = [startValue, endValue];
    // if (field_type === "datetime") {
    //     _.forEach(values, function (fv) {
    //         if (fv) {
    //             return fv.setHours(fv.getHours() + fv.getTimezoneOffset() / 60);
    //         }
    //     });
    // }
    return {
        label: label,
        key: key,
        values: values
    };
};

let getBetweenBuiltinValueItem = (key) => {
    return getBetweenTimeBuiltinValueItem(key);
};

let isBetweenFilterOperation = (operation) => {
    return operation === "between";
}

exports.getBetweenBuiltinValueItem = getBetweenBuiltinValueItem;
exports.getBetweenTimeBuiltinValueItem = getBetweenTimeBuiltinValueItem;
exports.isBetweenFilterOperation = isBetweenFilterOperation;
