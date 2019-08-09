---
title: JsReport报表
---

Steedos 与 [jsreport](https://github.com/jsreport/jsreport) 集成，开发人员可以使用Html和Javascript编写复杂样式的报表。

## 报表查看界面

业务人员在报表模块中选中对应的报表，即可进入报表查看界面。

![合同统计分析报表](assets/jsreport_sample.png#bordered)

### 数据权限
Steedos中的报表数据均通过统一的OData接口传递给报表服务器，自动加上权限过滤的功能，报表中只会显示当前用户被授权访问的数据。

### 数据筛选
如果需要进行明细统计，业务人员还可以借助Steedos的筛选器功能，对统计数据进行进一步筛选，并查看筛选之后的统计报表。

## 报表设计工具

开发人员可以使用报表设计工具，编辑模拟数据，调整报表样式，并实时预览报表的显示效果。

![jsreport报表设计工具](assets/jsreport_studio.png#bordered)

## 报表参数

### 报表名称 name
报表的显示名称
```yaml
name: 合同年度统计表
```

### 报表数据源 data_source
目前只能使用OData作为报表数据源。
```yaml
data_source: odata
```

### 对象名 object_name
定义报表需要查询的主对象名。
```yaml
object_name: contracts
```

### 字段 fields
定义报表需要查询的字段。
```yaml
fields:
  - name
  - amount
  - contract_type
```

### 查询条件 filters
定义使用OData查询报表数据的过滤条件。
```yaml
filters: ["contract_type", "=", "技术合同"]
```

## 报表显示模版
使用Html文件，编写报表的排版样式。模版对应的后缀名为 .report.html

```handlebars
<body>
    <div>
        <table class='table table-border row-border cell-border cell-hover striped'>
            <thead>
                <tr class="heading">
                    <th colspan="13">
                        合同统计报表
                    </th>
                </tr>
                <tr class="headtop">
                    <th colspan="13" class="text-left">
                        <span class="col-1">
                            填报单位：股份机关
                        </span>
                        <span class="col-2">
                            填报单位负责人：
                        </span>
                        <span class="float-right col-3">
                            单位：万元
                        </span>
                    </th>
                </tr>
                <tr>
                    <th rowspan="3">
                        序号
                    </th>
                    <th rowspan="3">
                        合同种类
                    </th>
                    <th colspan="4">
                        正常履行的合同
                    </th>
                    <th colspan="5">
                        履行不正常的合同
                    </th>
                    <th colspan="2" rowspan="2">
                        其中：关联交易合同
                    </th>
                </tr>
                <tr>
                    <th colspan="2">
                        已履行的合同
                    </th>
                    <th colspan="2">
                        尚在履行的合同
                    </th>
                    <th colspan="3">
                        违约但继续履行的合同
                    </th>
                    <th colspan="2">
                        解除的合同
                    </th>
                </tr>
                <tr>
                    <td>
                        份数
                    </td>
                    <td>
                        金额
                    </td>
                    <td>
                        份数
                    </td>
                    <td>
                        金额
                    </td>
                    <td>
                        份数
                    </td>
                    <td>
                        金额
                    </td>
                    <th>
                        违约方
                    </th>
                    <td>
                        份数
                    </td>
                    <td>
                        金额
                    </td>
                    <td>
                        份数
                    </td>
                    <td>
                        金额
                    </td>
                </tr>
            </thead>
            <tbody>
                {{#each contractTypes}}
                    <tr>
                        <th>
                            {{rowIndex @index}}
                        </th>
                        <th>
                            {{name}}
                        </th>
                        <td>
                            {{computeContractTypeTagCount _id 'finished' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagSum _id 'finished' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagCount _id 'pending' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagSum _id 'pending' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagCount _id 'continue' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagSum _id 'continue' ../result}}
                        </td>
                        <td>
                        </td>
                        <td>
                            {{computeContractTypeTagCount _id 'cancel' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagSum _id 'cancel' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagCount _id 'connected' ../result}}
                        </td>
                        <td>
                            {{computeContractTypeTagSum _id 'connected' ../result}}
                        </td>
                    </tr>
                {{/each}}
            </tbody>
            <tfoot>
                <tr class="footer">
                    <th colspan="2">
                        合计
                    </th>
                    <td>
                        {{computeContractTypesTagTotalCount contractTypes 'finished' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalSum contractTypes 'finished' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalCount contractTypes 'pending' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalSum contractTypes 'pending' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalCount contractTypes 'continue' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalSum contractTypes 'continue' result}}
                    </td>
                    <td>
                    </td>
                    <td>
                        {{computeContractTypesTagTotalCount contractTypes 'cancel' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalSum contractTypes 'cancel' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalCount contractTypes 'connected' result}}
                    </td>
                    <td>
                        {{computeContractTypesTagTotalSum contractTypes 'connected' result}}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
    <div>
        <div>1. 重大合同{{computeTotalTagCount 'important' result}}份，标的金额{{computeTotalTagSum 'important' result}}万元</div>
        <div>2. 招标合同{{computeTotalTagCount 'bidding' result}}份，标的金额{{computeTotalTagSum 'bidding' result}}万元</div>
        <div>3. 固定资产合同{{computeTotalTagCount 'solid_investment' result}}份，标的金额{{computeTotalTagSum 'solid_investment' result}}万元</div>
        <div>4. 总合同{{computeTotalCount 'solid_investment' result}}份，标的金额{{computeTotalSum 'solid_investment' result}}万元</div>
    </div>
</body>
```

## 报表脚本
使用Javascript定义报表中用到的帮助函数。帮助脚本对应的后缀名为  .helper.js
```js
//定义一个加法函数，以解决金额相加精度问题
function add(){
    var args = arguments,//获取所有的参数
        lens = args.length,//获取参数的长度
        d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0;//定义sum来接收所有数据的和
    //循环所有的参数
    for(var key in args){//遍历所有的参数
        //把数字转为字符串
        var str = ""+args[key];
        if(str.indexOf(".")!=-1){//判断数字是否为小数
            //获取小数位的长度
            var temp = str.split(".")[1].length;
            //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
            d = d < temp ? temp : d;
        }
    }
    //计算需要乘的数值
    var m = Math.pow(10,d);
    //遍历所有参数并相加
    for(var key1 in args){
        sum += args[key1]*m;
    }
    //返回结果
    return sum/m;
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
    },{
            "_id": "c3mTcfHGZ3nCRmyzq",
            "name": "承揽合同"
    },{
            "_id": "GrKZCAPHYm5v5gLqh",
            "name": "建设工程合同"
    },{
            "_id": "ntpWE3a27Mm64YApM",
            "name": "技术合同"
    },{
            "_id": "z32TeRg5ZpkSNzdyc",
            "name": "买卖合同"
    },{
            "_id": "EFgyJM52j5MLgY3pt",
            "name": "劳务合同"
    },{
            "_id": "ngLXGLJAKsxHGbKNo",
            "name": "港口作业合同"
    },{
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
    },{
            "name": "尚在履行的合同",
            "key": "pending",
            "property": "contract_state",
            "value": "进行中"
    },{
            "name": "违约但继续履行的合同",
            "key": "continue",
            "property": "contract_state",
            "value": "违约但继续履行"
    },{
            "name": "解除的合同",
            "key": "cancel",
            "property": "contract_state",
            "value": "解除"
    },{
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
    },{
            "name": "招标合同",
            "key": "bidding",
            "property": "is_bidding",
            "value": "是"
    },{
            "name": "固定资产合同",
            "key": "solid_investment",
            "property": "is_solid_investment",
            "value": "是"
    }]
}

function beforeRender(req, res, done) { 
    var contractTypes = getContractTypes();
    var contracts = req.data.contracts;
    let result = {};
    var contractTags = getContractTags();
    result.contractTypes = {};
    contractTypes.forEach(function(item){
        result.contractTypes[item._id] = {
            name: item.name
        }
        result.contractTypes[item._id].tags = {};
        contractTags.forEach(function(tagItem){
            result.contractTypes[item._id].tags[tagItem.key] = {
                name: tagItem.name,
                count: 0,
                sum: 0
            }
        });
    });
    var totalTags = geTotalTags();
    result.tags = {};
    totalTags.forEach(function(tagItem){
        result.tags[tagItem.key] = {
            name: tagItem.name,
            count: 0,
            sum: 0
        }
    });
    result.total =  {
        name: "总合同",
        count: 0,
        sum: 0
    }

    contracts.forEach(function(record){
        result.total.count++;
        result.total.sum = add(result.total.sum, record.amount);
        totalTags.forEach(function(tagItem){
            if(record[tagItem.property] === tagItem.value){
                result.tags[tagItem.key].count++;
                result.tags[tagItem.key].sum = add(result.tags[tagItem.key].sum, record.amount);
            }
        });
        var recordContractType = record.contract_type;
        if(recordContractType){
            var resultContractType = result.contractTypes[recordContractType._id];
            if(!resultContractType){
                resultContractType = result.contractTypes[otherContractTypeId];
            }
            contractTags.forEach(function(tagItem){
                if(record[tagItem.property] === tagItem.value){
                    resultContractType.tags[tagItem.key].count++;
                    resultContractType.tags[tagItem.key].sum = add(resultContractType.tags[tagItem.key].sum, record.amount);
                }
            });
        }
    });
    req.data = Object.assign({}, req.data, {
        report_name: "测试合同",
        contractTypes: contractTypes,
        result: result
    });
    delete req.data.contracts;
    done(); 
}
```
