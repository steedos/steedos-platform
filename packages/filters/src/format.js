
import SteedosFilter from "./filter";
import { isNull, isUndefined, isFunction, isArray, isObject, include, isString, each, intersection } from 'underscore';
import { isBetweenFilterOperation, getBetweenBuiltinValueItem } from "./utils";
import { evaluateFormula } from "./formula";
// 正则包括encodeURIComponent函数编码的11个特殊符号;/?:@&=+$,#
// 还包括convertSpecialCharacter函数中转义的特殊符号^$()*+?.\|[]{}
// 注意encodeURIComponent("\\(")的结果是%5C(，需要特别处理
// 注意encodeURIComponent("\\.")的结果是%5C.，需要特别处理
// 注意encodeURIComponent("\\*")的结果是%5C*，因为不需要encodeURIComponent函数编码，所以不用加入REG_FOR_ENCORD变量
const REG_FOR_ENCORD = /\;|\/|\?|\:|\@|\&|\=|\+|\$|\,|\#|\^|(\\\()|(\\\))|(\\\.)|\\|\||\[|\]|\{|\}/;

/**
    ^$()*+?.\|[]{}等特殊符号需要转义，否则有可能会报错且无法正确识别
    encodeURIComponent函数并不能完全编码上述所有特殊符号
    这里保持跟版本1.23一样的处理逻辑，只是额外判断了下避免重复转义或重复执行encodeURIComponent编码的可能
 */
const convertSpecialCharacter = (str) => {
    // if(str.indexOf("\\") > -1){
    //     // 如果有转义符号就按已经执行过转义处理，否则重复转义会有问题
    //     return str;
    // }
    // encodeURIComponent("\\(")的结果是%5C(,进一步转义的话会变成%5C\(，里面包括了符号\，会通过上面的正则REG_FOR_ENCORD，
    // 从而造成重复执行encodeURIComponent，所以这个不可以进一步转义，否则会搜索不到正确结果
    // 类似的有符号.*
    if(str.indexOf("%5C(") > -1 || str.indexOf("%5C)") > -1){
        return str;
    }
    if(str.indexOf("%5C.") > -1){
        return str;
    }
    if(str.indexOf("%5C*") > -1){
        return str;
    }
	return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1");
}

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
    if(isNull(filters) || isUndefined(filters)){
        return;
    }
    let utcOffset = userContext.user ? userContext.user.utcOffset : 0;
    userContext = extendUserContext(userContext, utcOffset);
    // 2019-03-23T01:00:33.524Z、2019-03-23T01:00:33Z、2022-06-11T00:00:00.444+08:00这种格式
    var regDate = /^\d{4}-\d{1,2}-\d{1,2}(T|\s)\d{1,2}\:\d{1,2}(\:\d{1,2}(\.\d{1,3})?)?(Z|((\+|\-)\d{1,2}\:\d{1,2}))?$/;
    var filtersLooper, selector;
    if (!isFunction(filters) && !filters.length) {
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
        if (isFunction(filters_loop)) {
            filters_loop = filters_loop();
        }
        if (!isArray(filters_loop)) {
            if (isObject(filters_loop)) {
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
            if (include(["or", "and"], filters_loop[1])) {
                // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
                // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
                // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
                // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
                tempFilters = [];
                i = 0;
                while (i < filters_loop.length) {
                    if (include(["or", "and"], filters_loop[i])) {
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
                if (include(["or", "and"], tempFilters[0])) {
                    tempFilters.shift();
                }
            } else {
                if (isString(filters_loop[1])) {
                    // 第二个元素为字符串，则认为是某一个具体的过虑条件
                    field = filters_loop[0];
                    option = filters_loop[1];
                    value = filters_loop[2];
                    if (isFunction(value)) {
                        value = value();
                    }
                    if (option === "!=") {
                        // 支持!=为不等于操作
                        option = "<>";
                    }
                    value = evaluateFormula(value, userContext)
                    sub_selector = [];
                    isBetweenOperation = isBetweenFilterOperation(option);
                    if (isBetweenOperation && isString(value)) {
                        // 如果是between运算符内置值，则取出对应values作为过滤值
                        // 比如value为last_year，返回对应的时间值
                        builtinValue = getBetweenBuiltinValueItem(value, utcOffset);
                        if (builtinValue) {
                            value = builtinValue.values;
                        }
                    }
                    if (isArray(value)) {
                        value = value.map(function (item) {
                            if (typeof item === "string") {
                                if(["contains", "startswith", "endswith", "notcontains", "notstartswith", "notendswith"].indexOf(option) > -1){
                                    item = convertSpecialCharacter(item);
                                }
                                if(regDate.test(item)){
                                    // 如果item正好是regDate格式，则转换为Date类型
                                    item = new Date(item);
                                }
                                else if(REG_FOR_ENCORD.test(item)){
                                    item = encodeURIComponent(item);
                                }
                            }
                            return item;
                        });
                        if (["=", "in"].indexOf(option) > -1) {
                            if(value.length){
                                sub_selector.push([field, "in", `(${JSON.stringify(value).replace(/\"/g, "'").slice(1).slice(0, -1)})`], "and")
                                // _.each(value, function (v) {
                                //     return sub_selector.push([field, "=", v], "or");
                                // });
                            }
                            else{
                                // 空数组返回空值
                                sub_selector.push([field, "=", "__badQueryForEmptyArray"], "and");
                            }
                        } else if (["<>", "notin"].indexOf(option) > -1) {
                            sub_selector.push([field, "notin", `(${JSON.stringify(value).replace(/\"/g, "'").slice(1).slice(0, -1)})`], "and")
                            // _.each(value, function (v) {
                            //     return sub_selector.push([field, "<>", v], "and");
                            // });
                        } else if (["notcontains", "notstartswith", "notendswith"].indexOf(option) > -1) {
                            each(value, function (v) {
                                return sub_selector.push([field, option, v], "and");
                            });
                        } else if (isBetweenOperation) {
                            if(value.length > 0){
                                if ([null, undefined, ''].indexOf(value[0]) < 0 || [null, undefined, ''].indexOf(value[1]) < 0) {
                                    if ([null, undefined, ''].indexOf(value[0]) < 0) {
                                        sub_selector.push([field, ">=", value[0]], "and");
                                    }
                                    if ([null, undefined, ''].indexOf(value[1]) < 0) {
                                        sub_selector.push([field, "<=", value[1]], "and");
                                    }
                                }
                            }
                            else{
                                // 如果是between连的空数组，不加任何条件，即查找所有数据
                            }
                        } else {
                            // contains、startswith、endswith等，如果value为空数组，不加任何条件，即查找所有数据
                            each(value, function (v) {
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
                        if (isBetweenOperation && !isArray(value)) {
                            // between操作符时，value必须是数组，不能是undefined等其他值
                        }
                        else {
                            if (typeof value === "string") {
                                if(["contains", "startswith", "endswith", "notcontains", "notstartswith", "notendswith"].indexOf(option) > -1){
                                    value = convertSpecialCharacter(value);
                                }
                                if(regDate.test(value)){
                                    // 如果value正好是regDate格式，则转换为Date类型
                                    value = new Date(value);
                                }
                                else if(REG_FOR_ENCORD.test(value)){
                                    value = encodeURIComponent(value);
                                }
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
            if ((ref = intersection(["or", "and"], filters_loop)) != null ? ref.length : void 0) {
                // 中间有"or","and"连接符，则循环filters_loop，依次用filtersLooper解析其过虑条件
                // 最后生成的结果格式：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2]), ...]
                // 因要判断filtersLooper(filters_loop[0])及filtersLooper(filters_loop[2])是否为空
                // 所以不能直接写：tempFilters = [filtersLooper(filters_loop[0]), filters_loop[1], filtersLooper(filters_loop[2])]
                tempFilters = [];
                i = 0;
                while (i < filters_loop.length) {
                    if (include(["or", "and"], filters_loop[i])) {
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
                if (include(["or", "and"], tempFilters[0])) {
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

const _formatFiltersToDev = formatFiltersToDev;
export { _formatFiltersToDev as formatFiltersToDev };
const _formatFiltersToODataQuery = formatFiltersToODataQuery;
export { _formatFiltersToODataQuery as formatFiltersToODataQuery };
