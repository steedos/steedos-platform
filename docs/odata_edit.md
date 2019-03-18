业务数据编辑
===

在 OData 中，可以使用 PUT 方法来更新修改业务数据记录。成功的更新响应返回更新后的记录。使用 PUT 更新记录会用提供的数据替换现有记录。 记录中的所有属性值使用请求中提供的值或设置为默认值（如果请求中未包括这些值）。

### 接口信息

 - 请求方法：PUT

 - 请求接口：/api/odata/v4/#{spaceId}/#{object_name}/#{record_id}

 - 接口说明：
   - spaceId：工作区ID
   - object_name：更新对象的对象名
   - record_id：更新记录的主键ID

 - 请求参数说明：
   - 对于记录中需要更新的字段，以JSON形式发送

 - response说明：
   - 更新成功后，将返回新的对象内容

 - 示例如下：

   - HTTP 请求

   ```
    url
      -X PUT https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts/hbysEccFT2fXjHtpd
      -H 'Content-type': 'application/json'
        {
          name: '张四'
        }
   ```

   - HTTP 响应

   ```
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
          "_id": "79rRJJxTdwG7Agv9r",
          "name": "dada1"
        },
        "owner": {
          "_id": "hPgDcEd9vKQxwndQR",
          "name": "系统管理员"
        }
        "created": "2018-03-29T08:50:35.092Z",
        "modified": "2018-03-29T08:50:44.990Z",
        "created_by": "qjcwDX3icX3KnZJhZ",
        "modified_by": "qjcwDX3icX3KnZJhZ",
        "score": 0
    }
   ```
