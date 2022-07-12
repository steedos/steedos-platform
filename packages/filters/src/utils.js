import moment from 'moment';

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
	// 月份为0代表本年的第一月
    if (month === 0) {
        month = 11;
        year--;
        return new Date(year, month, 1);
    }
    // 否则,只减去月份
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

let getBetweenTimeBuiltinValueItem = (key, utcOffset) => {
    // 过滤器between运算符，现算日期/日期时间类型字段的values值
    var currentMonth, currentYear, endValue, firstDay, label, lastDay, lastMonday, lastMonthFinalDay, lastMonthFirstDay, lastQuarterEndDay, lastQuarterStartDay, lastSunday, last_120_days, last_30_days, last_60_days, last_7_days, last_90_days, millisecond, minusDay, monday, month, nextMonday, nextMonthFinalDay, nextMonthFirstDay, nextQuarterEndDay, nextQuarterStartDay, nextSunday, nextYear, next_120_days, next_30_days, next_60_days, next_7_days, next_90_days, now, previousYear, startValue, strEndDay, strFirstDay, strLastDay, strMonday, strStartDay, strSunday, strToday, strTomorrow, strYestday, sunday, thisQuarterEndDay, thisQuarterStartDay, tomorrow, values, week, year, yestday;
    now = new Date();
    // 一天的毫秒数
    millisecond = 1000 * 60 * 60 * 24;
    yestday = new Date(now.getTime() - millisecond);
    tomorrow = new Date(now.getTime() + millisecond);
    // 一周中的某一天
    week = now.getDay();
    // 减去的天数
    minusDay = week !== 0 ? week - 1 : 6;
    monday = new Date(now.getTime() - (minusDay * millisecond));
    sunday = new Date(monday.getTime() + (6 * millisecond));
    // 上周日
    lastSunday = new Date(monday.getTime() - millisecond);
    // 上周一
    lastMonday = new Date(lastSunday.getTime() - (millisecond * 6));
    // 下周一
    nextMonday = new Date(sunday.getTime() + millisecond);
    // 下周日
    nextSunday = new Date(nextMonday.getTime() + (millisecond * 6));
    currentYear = now.getFullYear();
    previousYear = currentYear - 1;
    nextYear = currentYear + 1;
    // 当前月份
    currentMonth = now.getMonth();
    // 计数年、月
    year = now.getFullYear();
    month = now.getMonth();
    // 本月第一天
    firstDay = new Date(currentYear, currentMonth, 1);
	// 当为12月的时候年份需要加1
	// 月份需要更新为0 也就是下一年的第一个月
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
            // 去年
            label = t("creator_filter_operation_between_last_year");
            startValue = new Date(previousYear + "-01-01T00:00:00Z");
            endValue = new Date(previousYear + "-12-31T23:59:59Z");
            break;
        case "this_year":
            // 今年
            label = t("creator_filter_operation_between_this_year");
            startValue = new Date(currentYear + "-01-01T00:00:00Z");
            endValue = new Date(currentYear + "-12-31T23:59:59Z");
            break;
        case "next_year":
            // 明年
            label = t("creator_filter_operation_between_next_year");
            startValue = new Date(nextYear + "-01-01T00:00:00Z");
            endValue = new Date(nextYear + "-12-31T23:59:59Z");
            break;
        case "last_quarter":
            // 上季度
            strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "this_quarter":
            // 本季度
            strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "next_quarter":
            // 下季度
            strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD");
            strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_quarter");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "last_month":
            // 上月
            strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD");
            strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "this_month":
            // 本月
            strFirstDay = moment(firstDay).format("YYYY-MM-DD");
            strLastDay = moment(lastDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "next_month":
            // 下月
            strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD");
            strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_month");
            startValue = new Date(strFirstDay + "T00:00:00Z");
            endValue = new Date(strLastDay + "T23:59:59Z");
            break;
        case "last_week":
            // 上周
            strMonday = moment(lastMonday).format("YYYY-MM-DD");
            strSunday = moment(lastSunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "this_week":
            // 本周
            strMonday = moment(monday).format("YYYY-MM-DD");
            strSunday = moment(sunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_this_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "next_week":
            // 下周
            strMonday = moment(nextMonday).format("YYYY-MM-DD");
            strSunday = moment(nextSunday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_week");
            startValue = new Date(strMonday + "T00:00:00Z");
            endValue = new Date(strSunday + "T23:59:59Z");
            break;
        case "yestday":
            // 昨天
            strYestday = moment(yestday).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_yestday");
            startValue = new Date(strYestday + "T00:00:00Z");
            endValue = new Date(strYestday + "T23:59:59Z");
            break;
        case "today":
            // 今天
            strToday = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_today");
            startValue = new Date(strToday + "T00:00:00Z");
            endValue = new Date(strToday + "T23:59:59Z");
            break;
        case "tomorrow":
            // 明天
            strTomorrow = moment(tomorrow).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_tomorrow");
            startValue = new Date(strTomorrow + "T00:00:00Z");
            endValue = new Date(strTomorrow + "T23:59:59Z");
            break;
        case "last_7_days":
            // 过去7天
            strStartDay = moment(last_7_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_7_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_30_days":
            // 过去30天
            strStartDay = moment(last_30_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_30_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_60_days":
            // 过去60天
            strStartDay = moment(last_60_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_60_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_90_days":
            // 过去90天
            strStartDay = moment(last_90_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_90_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "last_120_days":
            // 过去120天
            strStartDay = moment(last_120_days).format("YYYY-MM-DD");
            strEndDay = moment(now).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_last_120_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_7_days":
            // 未来7天
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_7_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_7_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_30_days":
            // 未来30天
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_30_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_30_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_60_days":
            // 未来60天
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_60_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_60_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_90_days":
            // 未来90天
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_90_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_90_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
            break;
        case "next_120_days":
            // 未来120天
            strStartDay = moment(now).format("YYYY-MM-DD");
            strEndDay = moment(next_120_days).format("YYYY-MM-DD");
            label = t("creator_filter_operation_between_next_120_days");
            startValue = new Date(strStartDay + "T00:00:00Z");
            endValue = new Date(strEndDay + "T23:59:59Z");
    }
    values = [startValue, endValue];
    // 时间类型字段，应该考虑偏移时区值，否则过滤数据存在偏差
    // 日期类型字段，数据库本来就存的是UTC的0点；
    // 日期类型字段，目前creator代码（2019年08月07号存的）存的是UTC的16点，见：https://github.com/steedos/creator/issues/1271；
    // 比如用户想搜索2019-08-07的数据，请求会是：((created ge 2019-08-06T16:00:00Z) and (created le 2019-08-07T15:59:59Z)) ，
    // 如果数据库中存储的是2019-08-07T16:00:00Z而不是2019-08-07T00:00:00Z，那么就搜索不到数据。
    // 所以，日期类型字段，要求存储的是UTC的0点，而不可以是16点，否则可能搜索不到数据。
    if (utcOffset) {
        values = values.map(function (fv) {
            if (fv) {
                // 注意这里取的值是moment().utcOffset() / 60得到的，不是new Date().getTimezoneOffset() / 60
                // 它们的值正好为正负关系，北京时间前者为 +8，后者为 -8
                fv = new Date(fv.getTime());// clone fv的值以防止原来的值被更改
                fv.setHours(fv.getHours() - utcOffset);
            }
            return fv;
        });
    }
    return {
        label: label,
        key: key,
        values: values
    };
};

let getBetweenBuiltinValueItem = (key, utcOffset) => {
    return getBetweenTimeBuiltinValueItem(key, utcOffset);
};

let isBetweenFilterOperation = (operation) => {
    return operation === "between";
}

export {
    getMonthDays,
    getQuarterStartMonth,
    getLastMonthFirstDay,
    getLastQuarterFirstDay,
    getNextQuarterFirstDay,
    getBetweenBuiltinValueItem,
    getBetweenTimeBuiltinValueItem,
    isBetweenFilterOperation
};