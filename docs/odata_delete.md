业务数据删除
===

通过 DELETE 请求删除业务数据。

### 接口信息

 - 请求方法：DELETE

 - 请求接口：/api/odata/v4/#{spaceId}/#{object_name}/#{object_id}

 - 接口说明：
   - spaceId：工作区ID
   - object_name：删除对象的对象名
   - object_id：删除记录的主键ID

 - 请求参数说明：
   - 无

 - response说明：
   - 删除成功后，将返回状态码200

 - 示例如下：

   - HTTP 请求

   ```
    curl
      -X DELETE https://beta.steedos.com/api/odata/v4/Af8e****DqD3/contacts/hbysEccFT2fXjHtpd
   ```
