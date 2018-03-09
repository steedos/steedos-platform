## 查询

- $expand：指示应在所检索的记录或集合中检索相关记录。[详细](#expand)

- $filter：指定为在集合中返回记录计算结果必须为“true”的表达式或函数。[详细](#filter)

- $orderby：确定使用哪些值对记录集合进行排序。[详细](#orderby)

- $select：指定要返回的属性子集。[详细](#select)

- $skip：设置在集合中检索记录之前要跳过的记录数。[详细](#skip)

- $top：确定要返回的最大记录数。[详细](#top)

<span id="expand"></span>
### $expand
如果要检索相关记录，请查找定义此关系的实体关系的名称。 可能必须查看应用程序中的实体关系信息，才能为 Organization Data Service 正确标识关系或概念架构定义语言 (CSDL)，示例如下。 
若要检索与帐户相关的商机记录，请使用 opportunity_customer_accounts 实体关系。

``` /AccountSet?$expand=opportunity_customer_accounts ```

如果要限制返回的列，则还必须在查询中包括导航属性的名称。

``` /AccountSet?$select=Name,opportunity_customer_accounts&$expand=opportunity_customer_accounts ```

默认情况下，最多可以定义六个要展开的关系。 此查询（展开商机和拥有帐户的系统用户）将起作用。

``` /AccountSet?$select=Name,opportunity_customer_accounts,user_accounts&$expand=opportunity_customer_accounts,user_accounts ```

<span id="filter"></span>
### $filter
指定为在集合中返回记录计算结果必须为 true 的表达式或函数。

如果您正在使用 next 链接检索其他数据集，则不应更改 $filter 查询选项值，因为这会导致不可预测的结果。

支持的运算符如下：

 - eq：等于

 ``` /AccountSet?$filter=Address1_City eq 'Redmond' ```

 - ne：不等于

 ``` /AccountSet?$filter=Address1_City ne null ```

 - gt：大于

 ``` /AccountSet?$filter=CreditLimit/Value gt 1000 ```

 - ge：大于或等于

 ``` /AccountSet?&$filter=CreditLimit/Value ge 1000 ``` 

 - lt：小于

 ``` /AccountSet?$filter=CreditLimit/Value lt 1000 ``` 

 - le：小于或等于

 ``` /AccountSet?$filter=CreditLimit/Value le 1000 ``` 

 - and：逻辑与

 ``` /AccountSet?$filter=CreditLimit/Value ge 1000 and Address1_StateOrProvince eq 'TX' ``` 

 - or：逻辑或
 
 ``` /AccountSet?$filter=AccountCategoryCode/Value eq 2 or AccountRatingCode/Value eq 1 ``` 
 
 - not：逻辑非
 
 ``` /AccountSet?$filter=(AccountCategoryCode/Value ne null) and not (AccountCategoryCode/Value eq 1) ```
 


<span id="orderby"></span>
### $orderby
确定使用哪些值对记录集合进行排序。 默认情况下，顺序为升序。 使用 desc 使顺序反向或使用 asc 显式设置默认值。使用 $orderby 最多可以选择 12 列。

如果您正在使用 next 链接检索其他数据集，则不应更改 $orderby 查询选项值，因为这会导致不可预测的结果。

示例如下：

``` /AccountSet?$select=Address1_Country,Address1_City,Name&$orderby=Address1_Country,Address1_City desc&$filter=(Address1_Country ne null) and (Address1_City ne null) ```

<span id="select"></span>
### $select
指定要返回的属性的子集以及数据列的组织顺序。 默认为返回与 $select=* 对应的所有列。

如果使用 $expand 包括相关数据，并使用 $select 限制返回的列，则还必须在查询中包括导航属性的名称。

示例如下：

``` /AccountSet?$select=Name,opportunity_customer_accounts&$expand=opportunity_customer_accounts ```

<span id="skip"></span>
### $skip
设置在集合中检索记录之前要跳过的记录数。

如果您正在使用 next 链接检索其他数据集，则不应更改 $skip 查询选项值，因为这会导致不可预测的结果。

<span id="top"></span>
### $top
确定要返回的最大记录数。

如果您正在使用 next 链接检索其他数据集，则不应更改 $top 查询选项值，因为这会导致不可预测的结果。

## 创建记录

通过对要创建条目的集合的 URI 执行 HTTP POST 请求可创建新记录或条目。 POST 请求使用 JSON 格式在其正文中包括新条目。

服务器会为请求中未指定的任何属性指派默认值，并用包含所创建记录的 URL 的“位置”标题返回结果。 条目标题元素反映实体的主属性。 例如，对于 account 实体而言，name 属性是主属性。 HTTP 状态码 201 指示已成功创建记录。


HTTP 请求

```
    POST <organization root>/XRMServices/2011/OrganizationData.svc/AccountSet HTTP/1.1
    Content-Type:  application/json; charset=utf-8
    Accept-Language: en-us
    Referer: <The URL to the HTML page sending the request>
    Accept:  application/json
    Accept-Encoding: gzip, deflate
    User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1)
    Host: <CRM Server>
    Content-Length: 25
    Connection: Keep-Alive
    Pragma: no-cache
    Cookie: <cookie data>
    Authorization: Negotiate <authentication token>

    {"Name":"Sample Account"}
```

HTTP 响应

```
    HTTP/1.1 201 Created
    Cache-Control: no-cache
    Content-Length: 17720
    Content-Type:  application/json;charset=utf-8
    Location: <organization root>/XRMServices/2011/OrganizationData.svc/AccountSet(guid'5784bd4a-f595-df11-a492-00155dba380c')
    Server: Microsoft-IIS/7.0
    X-AspNet-Version: 4.0.30319
    DataServiceVersion: 1.0;
    X-Powered-By: ASP.NET
    WWW-Authenticate: Negotiate <authentication token>
    Date: Fri, 23 Jul 2010 00:57:40 GMT

    {
        "d" : {
            "__metadata": {
                "uri": "<organization root>/XRMServices/2011/OrganizationData.svc/AccountSet(guid'5784bd4a-f595-df11-a492-00155dba380c')", 
                "type": "Microsoft.Crm.Sdk.Data.Services.Account"
            },
            [Properties removed for brevity]
        }
    }
```

## 更新记录

在 OData 中，可以使用 PUT 或 MERGE 方法来更新记录。MERGE 用于避免重载 PUT 的含义。

成功的更新响应包含 HTTP 状态码 204，并且不返回任何内容。

