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

// getContractTypes中排它性的id值，该分类指其他分类以外的所有分类
var otherContractTypeId = "--other--";

function getContractTypes() {
  return [{
    "_id": "7CbxwqzjkkHrtFNeH",
    "name": "租赁合同"
  }, {
    "_id": "c3mTcfHGZ3nCRmyzq",
    "name": "承揽合同"
  }, {
    "_id": "GrKZCAPHYm5v5gLqh",
    "name": "建设工程合同"
  }, {
    "_id": "ntpWE3a27Mm64YApM",
    "name": "技术合同"
  }, {
    "_id": "z32TeRg5ZpkSNzdyc",
    "name": "买卖合同"
  }, {
    "_id": "EFgyJM52j5MLgY3pt",
    "name": "劳务合同"
  }, {
    "_id": "ngLXGLJAKsxHGbKNo",
    "name": "港口作业合同"
  }, {
    "_id": otherContractTypeId,
    "name": "其他合同"
  }]
}

function getContractTags() {
  return [{
    "name": "已履行的合同",
    "key": "finished",
    "property": "contract_state",
    "value": "完毕"
  }, {
    "name": "尚在履行的合同",
    "key": "pending",
    "property": "contract_state",
    "value": "进行中"
  }, {
    "name": "违约但继续履行的合同",
    "key": "continue",
    "property": "contract_state",
    "value": "违约但继续履行"
  }, {
    "name": "解除的合同",
    "key": "cancel",
    "property": "contract_state",
    "value": "解除"
  }, {
    "name": "关联交易合同",
    "key": "connected",
    "property": "is_connected_transaction",
    "value": "是"
  }]
}

function geTotalTags() {
  return [{
    "name": "重大合同",
    "key": "important",
    "property": "is_important",
    "value": "是"
  }, {
    "name": "招标合同",
    "key": "bidding",
    "property": "is_bidding",
    "value": "是"
  }, {
    "name": "固定资产合同",
    "key": "solid_investment",
    "property": "is_solid_investment",
    "value": "是"
  }]
}

async function getUserFilterCompany(userFilters, userSession, rootUrl) {
  let companyId = "";
  let reCompany = null;
  if (userFilters) {
    userFilters.forEach(function (item) {
      if (item.field === "company_id") {
        companyId = item.value;
      }
    });
  }
  if (companyId) {
    // 根据companyId取得companyName
    const fetch = require('cross-fetch');
    let fetchParams = {
      query: `query {
        organizations(filters:"_id eq '${companyId}'") {
          name
          fullname
        }
      }`,
      variables: null
    };
    if (/\/$/.test(rootUrl)) {
      // 去除url中最后一个斜杆符号
      rootUrl = rootUrl.substr(0, rootUrl.length - 1);
    }
    let url = `${rootUrl}/graphql/default/${userSession.spaceId}`;
    try {
      let authToken = userSession ? userSession.authToken : "";
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken
        },
        method: 'POST',
        body: JSON.stringify(fetchParams)
      });
      let reJson = await res.json();
      reCompany = reJson;
    } catch (err) {
      reCompany = err;
      console.error(err);
    }
  }
  return reCompany;
}

async function beforeRender(req, res, done) {
  var contractTypes = getContractTypes();
  var contracts = req.data.data.contracts;
  let result = {};
  /**
   * 生成初始化的result结构：
   * {
   *  "contractTypes":{
   *    "c3mTcfHGZ3nCRmyzq":{
   *      "name": "承揽合同",
   *      "tags": {
   *          "finished": {
   *              "name": "已履行的合同",
   *              "count": 0,
   *              "sum": 0
   *          },
   *          "pending": {
   *              "name": "尚在履行的合同",
   *              "count": 0,
   *              "sum": 0
   *          }
   *          ...
   *      }
   *    }
   *    ...
   *  },
   *  "tags":{
   *    "important":{
   *      "name": "重大合同",
   *      "count": 0,
   *      "sum": 0
   *    },
   *    "bidding":{
   *      "name": "招标合同",
   *      "count": 0,
   *      "sum": 0
   *    }
   *    ...
   *  },
   *  "total":{
   *    "name": "总合同",
   *    "count": 0,
   *    "sum": 0
   *  }
   * }
   */
  var contractTags = getContractTags();
  result.contractTypes = {};
  contractTypes.forEach(function (item) {
    result.contractTypes[item._id] = {
      name: item.name
    }
    result.contractTypes[item._id].tags = {};
    contractTags.forEach(function (tagItem) {
      result.contractTypes[item._id].tags[tagItem.key] = {
        name: tagItem.name,
        count: 0,
        sum: 0
      }
    });
  });
  var totalTags = geTotalTags();
  result.tags = {};
  totalTags.forEach(function (tagItem) {
    result.tags[tagItem.key] = {
      name: tagItem.name,
      count: 0,
      sum: 0
    }
  });
  result.total = {
    name: "总合同",
    count: 0,
    sum: 0
  }

  contracts.forEach(function (record) {
    result.total.count++;
    result.total.sum = add(result.total.sum, record.amount);
    totalTags.forEach(function (tagItem) {
      if (record[tagItem.property] === tagItem.value) {
        result.tags[tagItem.key].count++;
        result.tags[tagItem.key].sum = add(result.tags[tagItem.key].sum, record.amount);
      }
    });
    var recordContractType = record.contract_type;
    if (recordContractType) {
      var resultContractType = result.contractTypes[recordContractType];
      if (!resultContractType) {
        resultContractType = result.contractTypes[otherContractTypeId];
      }
      contractTags.forEach(function (tagItem) {
        if (record[tagItem.property] === tagItem.value) {
          resultContractType.tags[tagItem.key].count++;
          resultContractType.tags[tagItem.key].sum = add(resultContractType.tags[tagItem.key].sum, record.amount);
        }
      });
    }
  });

  let userFilters = req.data.user_filters;
  let userSession = req.data.user_session;
  // let rootUrl = req.data.root_url;
  let env = req.data.env;
  let rootUrl = env.ROOT_URL_INTRANET ? env.ROOT_URL_INTRANET : env.ROOT_URL;
  let userFilterCompany = await getUserFilterCompany(userFilters, userSession, rootUrl).catch((error) => {
    return { "errors": [{ "message": JSON.stringify(error) }] };
  });
  req.data = Object.assign({}, req.data, {
    report_name: "QHD年度合同统计",
    contractTypes: contractTypes,
    userFilterCompany: userFilterCompany,
    result: result
  });
  delete req.data.data;
  done();
}