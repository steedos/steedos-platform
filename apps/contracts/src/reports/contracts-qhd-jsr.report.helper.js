function rowIndex(i) {
    return i + 1;
}

function computeContractTypeTagCount(contractTypeId, tag, result) {
    return result.contractTypes[contractTypeId].tags[tag].count;
}

function computeContractTypeTagSum(contractTypeId, tag, result) {
    return deci(result.contractTypes[contractTypeId].tags[tag].sum / 10000, 2);
}

function computeContractTypesTagTotalCount(contractTypes, tag, result) {
    var count = 0;
    contractTypes.forEach(function (item) {
        count += computeContractTypeTagCount(item._id, tag, result);
    });
    return count;
}

function computeContractTypesTagTotalSum(contractTypes, tag, result) {
    var sum = 0;
    contractTypes.forEach(function (item) {
        sum = add(sum, computeContractTypeTagSum(item._id, tag, result));
    });
    return sum;
}

function computeTotalTagCount(tag, result) {
    return result.tags[tag].count;
}

function computeTotalTagSum(tag, result) {
    return deci(result.tags[tag].sum / 10000, 2);
}

function computeTotalCount(tag, result) {
    return result.total.count;
}

function computeTotalSum(tag, result) {
    return deci(result.total.sum / 10000, 2);
}

//定义一个加法函数，以解决金额相加精度问题
function add() {
    var args = arguments,//获取所有的参数
        lens = args.length,//获取参数的长度
        d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0;//定义sum来接收所有数据的和
    //循环所有的参数
    for (var key in args) {//遍历所有的参数
        //把数字转为字符串
        var str = "" + args[key];
        if (str.indexOf(".") != -1) {//判断数字是否为小数
            //获取小数位的长度
            var temp = str.split(".")[1].length;
            //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
            d = d < temp ? temp : d;
        }
    }
    //计算需要乘的数值
    var m = Math.pow(10, d);
    //遍历所有参数并相加
    for (var key1 in args) {
        sum += args[key1] * m;
    }
    //返回结果
    return sum / m;
}

function deci(num, v) {
    /*
        十进制浮点数转换，
        num表示要四舍五入的数，
        v表示要保留的小数位数。
    */
    var vv = Math.pow(10, v);
    return Math.round(num * vv) / vv;
}

function filteredReportName(userFilters, userFilterCompany) {
    let moment = require("moment");
    let reName = "QHD";
    let companyName = filteredCompanyName(userFilterCompany);
    reName += companyName;
    let filteredStr = "";
    if (userFilters) {
        let getBetweenTimeBuiltinValueItem = require("@steedos/filters").getBetweenTimeBuiltinValueItem;
        userFilters.forEach(function (item) {
            if (item.field === "signed_date" && item.value && item.value.length) {
                if (typeof item.value === "string") {
                    item.value = getBetweenTimeBuiltinValueItem(item.value).values;
                }
                let start = item.value[0];
                let end = item.value[1];
                // moment.utc(end).format('YYYY-MM-DD');
                if (start && end) {
                    filteredStr = " " + moment.utc(start).format('YYYY-MM-DD') + "至" + moment.utc(end).format('YYYY-MM-DD') + " ";
                }
                else if (start) {
                    filteredStr = " " + moment.utc(start).format('YYYY-MM-DD') + "至今 ";
                }
                else if (end) {
                    filteredStr = " " + moment.utc(end).format('YYYY-MM-DD') + "之前 ";
                }
                else {
                    filteredStr = " 全部 ";
                }
            }
            else if (item.field === "bop") {
                if (item.value && item.value.length) {
                    filteredStr += item.value.join(",") + "类";
                }
            }
        });
        if (filteredStr) {
            reName += filteredStr;
        }
    }
    reName += "合同统计报表";
    return reName;
}

function filteredCompanyName(userFilterCompany, isNeedToShowEmpty) {
    if (!userFilterCompany) {
        if (isNeedToShowEmpty) {
            return "未设置";
        }
        else {
            return "";
        }
    }
    let result;
    if (userFilterCompany.errors) {
        if (!isNeedToShowEmpty) {
            return "";
        }
        // {"errors":[{"message":"You must be logged in to do this."}]}
        if (userFilterCompany.errors.length) {
            result = userFilterCompany.errors[0];
            if (result && result.message) {
                result = result.message;
            }
            else {
                result = JSON.stringify(userFilterCompany.errors[0]);
            }
        }
        else {
            result = JSON.stringify(userFilterCompany.errors);
        }
    }
    else {
        // { "data": { "organizations": [{ "name": "七公司", "fullname": "股份公司/股份基层单位/七公司" }] } }
        result = userFilterCompany.data && userFilterCompany.data.organizations && userFilterCompany.data.organizations;
        if (result) {
            if (result.length) {
                result = result[0].name;
            }
            else {
                if (!isNeedToShowEmpty) {
                    return "";
                }
                result = `未找到指定ID值的公司`;
            }
        }
        else {
            if (!isNeedToShowEmpty) {
                return "";
            }
            result = JSON.stringify(userFilterCompany);
        }
    }
    return result;
}