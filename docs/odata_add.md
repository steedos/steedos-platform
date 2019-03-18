业务数据新增
===

通过对要只能增数据的对象的 URI 执行 HTTP POST 请求可创建新记录或实体。 POST 请求使用 JSON 格式在其正文中包括新记录。服务器会为请求中未指定的任何属性指派默认值，并返回成功创建的记录。

### 接口信息

 - 请求方法：POST

 - 请求接口：/api/odata/v4/#{spaceId}/#{object_name}

 - 接口说明：
   - spaceId：工作区ID
   - object_name：创建对象的对象名

 - 请求参数说明：
   - body以JSON形式存储记录

 - response说明：
   - 返回创建成功的记录

 - 示例如下：

   - HTTP 请求

   ```
    curl
      -X POST https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts
      -H 'Content-type': 'application/json'
        {
          name: '张三',
          mobile: '18969565966',
          company: "上海某某公司",
          address: "上海市徐汇区某某街道"
        }
   ```

   - HTTP 响应

   ```
    HTTP/1.1 201 Created

    {
        "@odata.id": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('hbysEccFT2fXjHtpd')",
        "@odata.etag": "W/\"08D589720BBB3DB1\"",
        "@odata.editLink": "https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts('hbysEccFT2fXjHtpd')",
        "_id": "hbysEccFT2fXjHtpd",
        "name": "张三",
        "mobile": "18969565966",
        "company": "上海某某公司",
        "address": "上海市徐汇区某某街道"
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
