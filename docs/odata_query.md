## 业务数据查询选项
### $expand
指示应在所检索的记录或集合中检索相关记录.
例如，若要检索与帐户相关的商机记录，请使用 opportunity_customer_accounts 实体关系。 查询 /AccountSet?$expand=opportunity_customer_accounts 将返回商机记录和帐户记录。

如果要限制返回的列，则还必须在查询中包括导航属性的名称。 例如，查询 /AccountSet?$select=Name,opportunity_customer_accounts&$expand=opportunity_customer_accounts 只返回帐户名称和展开的商机记录。

默认情况下，最多可以定义六个要展开的关系。 此查询（展开商机和拥有帐户的系统用户）将起作用：/AccountSet?$select=Name,opportunity_customer_accounts,user_accounts&$expand=opportunity_customer_accounts,user_accounts。

### $filter
指定为在集合中返回记录计算结果必须为 true 的表达式或函数.
如果您正在使用 next 链接检索其他数据集，则不应更改 $filter 查询选项值，因为这会导致不可预测的结果。

筛选系统查询选项的 OData 规格描述了用于创建要在筛选器中计算的表达式的运算符。Microsoft Dynamics 365 使用所有逻辑运算符和可用函数的子集，但是不支持使用算术运算符。 筛选器可以使用用括号指示的分组条件。 时间值的比较必须使用以下格式：datetime’<time value>’，例如 datetime'2010-07-15' 或 datetime'2010-07-15T16:19:54Z'。
以下列出 odata query支持的运算符。
	![](images/filter.png)

### $orderby
确定使用哪些值对记录集合进行排序。 默认情况下，顺序为升序。 使用 desc 使顺序反向或使用 asc 显式设置默认值。

如果您正在使用 next 链接检索其他数据集，则不应更改 $orderby 查询选项值，因为这会导致不可预测的结果。
使用 $orderby 最多可以选择 12 列。
按复杂类型（如 EntityReference 或 OptionSetValue）排序时，只能指定属性名。 


例如，若要按帐户的主要联系人排序，请使用查询 $orderby=PrimaryContactId。 指定 $orderby=PrimaryContactId/Name 将显示错误请求 HTTP 错误（HTTP 错误代码 400）.
以下示例以升序按国家/地区并以降序按城市列出客户类型：
    /AccountSet?$select=Address1_Country,Address1_City,Name&$orderby=Address1_Country,                  Address1_City desc&$filter=(Address1_Country ne null) and (Address1_City ne null)

### $select
指定要返回的属性的子集以及数据列的组织顺序。 默认为返回与 $select=* 对应的所有列。

如果使用 $expand 包括相关数据，并使用 $select 限制返回的列，则还必须在查询中包括导航属性的名称。 例如，以下查询（/AccountSet?$select=Name,opportunity_customer_accounts&$expand=opportunity_customer_accounts）将只返回客户名称和展开的商机记录。

在 Internet Explorer 中，POST 和 GET 请求的最大路径长度为 2048 个字符。 如果曾在 $select 选项中包括客户实体中的每个属性，则很容易达到此限制。

### $skip
设置在集合中检索记录之前要跳过的记录数。

如果您正在使用 next 链接检索其他数据集，则不应更改 $skip 查询选项值，因为这会导致不可预测的结果。
以下示例表示从第3条数据开始返回结果
    /AccountSet?$skip=2

### $top
确定要返回的最大记录数。

如果您正在使用 next 链接检索其他数据集，则不应更改 $top 查询选项值，因为这会导致不可预测的结果。
以下示例表示从第3条记录开始，返回最多6条记录
    /AccountSet?$skip=2&$top=6

## 业务数据查询
在 OData 中，可以使用 GET 方法来查询业务数据记录。

### 接口信息

 - 请求方法：GET

 - 请求接口：查询多条记录 /api/odata/v4/#{spaceId}/#{object_name}/
 			查询特定记录 /api/odata/v4/#{spaceId}/#{object_name}/#{record_id}

 - 接口说明：
   - spaceId：工作区ID
   - object_name：查询对象的对象名
   - record_id:特定记录的_id
 - response说明：
   - 查询成功后，将返回对象内容

 - 示例如下：
   查询多条记录时：
   - HTTP 请求

   ```
    url 
      -X GET https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts/?%24top=10&%24select=name%2Caccount%2Cemail%2Cphone%2Cowner&%24expand=account(%24select%3Dname)%2Cowner(%24select%3Dname)&%24count=true
   ```

   - HTTP 响应

   ```
   {
    {
        "@odata.id": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('hbysEccFT2fXjHtpd')",
        "@odata.etag": "W/\"08D589720BBB3DB1\"",
        "@odata.editLink": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('hbysEccFT2fXjHtpd')",
        "_id": "hbysEccFT2fXjHtpd",
        "name": "张四",
        "mobile": "18969565966",
        "company": "上海某某公司",
        "address": "上海市徐汇区某某街道"
        "account": {
	        "_id": "2LrxGcnvhbFKfXbfR",
	        "name": "公司5·11138"
      	},
      	"owner": {
	        "_id": "hPgDcEd9vKQxwndQR",
	        "name": "系统管理员"
      	}
    }
    {
      "@odata.id": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('EwgZvhjKSNmMkzNPn')",
      "@odata.etag": "W/\"08D589720BBB3DB1\"",
      "@odata.editLink": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('EwgZvhjKSNmMkzNPn')",
      "_id": "EwgZvhjKSNmMkzNPn",
      "name": "周杰伦",
      "mobile": "18988990346",
      "company": "上海某某公司",
      "address": "上海市松江区某某街道"
      "account": {
        "_id": "2LrxGcnvhbFKfXbfR",
        "name": "公司5·11138"
      },
      "owner": {
        "_id": "hPgDcEd9vKQxwndQR",
        "name": "系统管理员"
      }
    },
    ......
    {
      "@odata.id": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('cM3H88eYYCA664aJG')",
      "@odata.etag": "W/\"08D589720BBB3DB1\"",
      "@odata.editLink": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('cM3H88eYYCA664aJG')",
      "_id": "cM3H88eYYCA664aJG",
      "name": "陈奕迅",
      "mobile": "18944557809",
      "company": "上海某某公司",
      "address": "上海市普陀区某某街道"
      "account": {
        "_id": "79rRJJxTdwG7Agv9r",
        "name": "dada1"
      },
      "owner": {
        "_id": "hPgDcEd9vKQxwndQR",
        "name": "系统管理员"
      }
    }
	}
	```
	查询特定记录时
	```
	- url
		-X GET https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts/cM3H88eYYCA664aJG
	```
	- HTTP 响应
	```
	{
      "@odata.id": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('cM3H88eYYCA664aJG')",
      "@odata.etag": "W/\"08D589720BBB3DB1\"",
      "@odata.editLink": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('cM3H88eYYCA664aJG')",
      "_id": "cM3H88eYYCA664aJG",
      "name": "陈奕迅",
      "mobile": "18944557809",
      "company": "上海某某公司",
      "address": "上海市普陀区某某街道"
      "account": {
        "_id": "79rRJJxTdwG7Agv9r",
        "name": "dada1"
      },
      "owner": {
        "_id": "hPgDcEd9vKQxwndQR",
        "name": "系统管理员"
      }
    }
    ```