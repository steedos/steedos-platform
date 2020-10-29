
const SteedosFilter = require("./filter");
const _ = require('underscore');
const utils = require("./utils");
const formula = require("./formula");

let extendUserContext = (userContext, utcOffset) => {
    if (!userContext.now) {
        userContext.now = new Date();
        if (utcOffset) {
            // 注意这里取的值是moment().utcOffset() / 60得到的，不是new Date().getTimezoneOffset() / 60
            // 它们的值正好为正负关系，北京时间前者为 +8，后者为 -8
            // userContext.now.setHours(userContext.now.getHours() - utcOffset);
        }
    }
    return userContext;
}

let formatFiltersToDev = (filters, userContext = { userId: null, spaceId: null, user: { utcOffset: 0 } }) => {
    let utcOffset = userContext.user ? userContext.user.utcOffset : 0;
    userContext = extendUserContext(userContext, utcOffset);
    // 2019-03-23T01:00:33.524Z或2019-03-23T01:00:33Z这种格式
    var regDate = /^\d{4}-\d{1,2}-\d{1,2}(T|\s)\d{1,2}\:\d{1,2}\:\d{1,2}(\.\d{1,3})?(Z)?$/;
    var filtersLooper, selector;
    if (!_.isFunction(filters) && !filters.length) {
        return;
    }
    selector = [];
    filtersLooper = function (filters_loop) {
        var builtinValue, field, i, isBetweenOperation, option, ref, sub_selector, tempFilters, tempLooperResult, value;
        tempFilters = [];
        tempLooperResult = null;
        if (filters_loop === "!") {
            return filters_loop;
        }
        if (_.isFunction(filters_loop)) {
            filters_loop = filters_loop();
        }
        if (!_.isArray(filters_loop)) {
            if (_.isObject(filters_loop)) {
                // 当filters不是[Array]类型而是[Object]类型时，进行格式转换
                if (filters_loop.operation) {
                    filters_loop = [filters_loop.field, filters_loop.operation, filters_loop.value];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        if (filters_loop.length === 1) {
            // 只有一个元素，进一步解析其内容
            tempLooperResult = filtersLooper(filters_loop[0]);
            if (tempLooperResult) {
                tempFilters.push(tempLooperResult);
            }
        } else if (filters_loop.length === 2) {
            // 只有两个元素，进一步解析其内容，省略"and"连接符，但是有"and"效果
            filters_loop.forEach(function (n, i) {
                tempLooperResult = filtersLooper(n);
                if (tempLooperResult) {
                    return tempFilters.push(tempLooperResult);
                }
            });
        } else if (filters_loop.length === 3) {
            // 只有三个元素，可能中间是"or","and"连接符也可能是普通数组，区别对待解析
            if (_.include(["or", "and"], filters_loop[1])) {
                // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
                // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
                // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
                // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
                tempFilters = [];
                i = 0;
                while (i < filters_loop.length) {
                    if (_.include(["or", "and"], filters_loop[i])) {
                        i++;
                        continue;
                    }
                    tempLooperResult = filtersLooper(filters_loop[i]);
                    if (!tempLooperResult) {
                        i++;
                        continue;
                    }
                    if (i > 0) {
                        tempFilters.push(filters_loop[i - 1]);
                    }
                    tempFilters.push(tempLooperResult);
                    i++;
                }
                if (_.include(["or", "and"], tempFilters[0])) {
                    tempFilters.shift();
                }
            } else {
                if (_.isString(filters_loop[1])) {
                    // 第二个元素为字符串，则认为是某一个具体的过虑条件
                    field = filters_loop[0];
                    option = filters_loop[1];
                    value = filters_loop[2];
                    if (_.isFunction(value)) {
                        value = value();
                    }
                    if (option === "!=") {
                        // 支持!=为不等于操作
                        option = "<>";
                    }
                    value = formula.evaluateFormula(value, userContext)
                    sub_selector = [];
                    isBetweenOperation = utils.isBetweenFilterOperation(option);
                    if (isBetweenOperation && _.isString(value)) {
                        // 如果是between运算符内置值，则取出对应values作为过滤值
                        // 比如value为last_year，返回对应的时间值
                        builtinValue = utils.getBetweenBuiltinValueItem(value, utcOffset);
                        if (builtinValue) {
                            value = builtinValue.values;
                        }
                    }
                    if (_.isArray(value)) {
                        value = value.map(function (item) {
                            if (typeof item === "string" && regDate.test(item)) {
                                // 如果value正好是regDate格式，则转换为Date类型
                                item = new Date(item);
                            }
                            return item;
                        });
                        if (["=", "in"].indexOf(option) > -1) {
                            if(value.length){
                                _.each(value, function (v) {
                                    return sub_selector.push([field, "=", v], "or");
                                });
                            }
                            else{
                                // 空数组返回空值
                                sub_selector.push([field, "=", "__badQueryForEmptyArray"], "and");
                            }
                        } else if (["<>", "notin"].indexOf(option) > -1) {
                            _.each(value, function (v) {
                                return sub_selector.push([field, "<>", v], "and");
                            });
                        } else if (["notcontains", "notstartswith", "notendswith"].indexOf(option) > -1) {
                            _.each(value, function (v) {
                                return sub_selector.push([field, option, v], "and");
                            });
                        } else if (isBetweenOperation && (value.length = 2)) {
                            if (value[0] !== null || value[1] !== null) {
                                if (value[0] !== null) {
                                    sub_selector.push([field, ">=", value[0]], "and");
                                }
                                if (value[1] !== null) {
                                    sub_selector.push([field, "<=", value[1]], "and");
                                }
                            }
                        } else {
                            // contains、startswith、endswith等，如果value为空数组，不加任何条件，即查找所有数据
                            _.each(value, function (v) {
                                return sub_selector.push([field, option, v], "or");
                            });
                        }
                        if (sub_selector[sub_selector.length - 1] === "and" || sub_selector[sub_selector.length - 1] === "or") {
                            sub_selector.pop();
                        }
                        if (sub_selector.length) {
                            tempFilters = sub_selector;
                        }
                    } else if(value === false) {
                        // boolean类型字段优化，选择否时，应该兼容undefined值的情况
                        // 主要是为了落地版本，目前我们有的项目yml中一些字段是项目交付上线后再加的，
                        // 就造成按false搜索时搜索不到老数据（因为老数据中该字段值为空）
                        if(option === "="){
                            tempFilters = [[field, "=", false], "or", [field, "=", null]];
                        }
                        else if(option === "<>"){
                            tempFilters = [field, "=", true];
                        }
                    } else {
                        if (isBetweenOperation && !_.isArray(value)) {
                            // between操作符时，value必须是数组，不能是undefined等其他值
                        }
                        else {
                            if (typeof value === "string" && regDate.test(value)) {
                                // 如果value正好是regDate格式，则转换为Date类型
                                value = new Date(value);
                            }
                            tempFilters = [field, option, value];
                        }
                    }
                } else {
                    // 普通数组，当成完整过虑条件进一步循环解析每个条件
                    filters_loop.forEach(function (n, i) {
                        tempLooperResult = filtersLooper(n);
                        if (tempLooperResult) {
                            return tempFilters.push(tempLooperResult);
                        }
                    });
                }
            }
        } else {
            // 超过3个元素的数组，可能中间是"or","and"连接符也可能是普通数组，区别对待解析
            if ((ref = _.intersection(["or", "and"], filters_loop)) != null ? ref.length : void 0) {
                // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
                // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
                // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
                // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
                tempFilters = [];
                i = 0;
                while (i < filters_loop.length) {
                    if (_.include(["or", "and"], filters_loop[i])) {
                        i++;
                        continue;
                    }
                    tempLooperResult = filtersLooper(filters_loop[i]);
                    if (!tempLooperResult) {
                        i++;
                        continue;
                    }
                    if (i > 0) {
                        tempFilters.push(filters_loop[i - 1]);
                    }
                    tempFilters.push(tempLooperResult);
                    i++;
                }
                if (_.include(["or", "and"], tempFilters[0])) {
                    tempFilters.shift();
                }
            } else {
                // 普通过虑条件，当成完整过虑条件进一步循环解析每个条件
                filters_loop.forEach(function (n, i) {
                    tempLooperResult = filtersLooper(n);
                    if (tempLooperResult) {
                        return tempFilters.push(tempLooperResult);
                    }
                });
            }
        }
        if (tempFilters.length) {
            return tempFilters;
        } else {
            return null;
        }
    };
    selector = filtersLooper(filters);
    return selector;
};

let formatFiltersToODataQuery = (filters, userContext, odataProtocolVersion, forceLowerCase) => {
    let devFilters = formatFiltersToDev(filters, userContext);
    return new SteedosFilter(devFilters, odataProtocolVersion, forceLowerCase).formatFiltersToODataQuery();
};

exports.formatFiltersToDev = formatFiltersToDev;
exports.formatFiltersToODataQuery = formatFiltersToODataQuery;
