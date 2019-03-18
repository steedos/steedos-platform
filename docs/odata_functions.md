调用自定义方法
===

在 OData 中，可以调用自定义方法处理相关的业务逻辑并返回结果。

### 接口信息

 - 请求方法：POST

 - 请求接口：/api/odata/v4/#{spaceId}/#{object_name}/#{record_id}/#{method_name}

 - 接口说明：
   - spaceId：工作区ID
   - object_name：对象名
   - record_id：记录的主键ID，如果方法中未用到此参数可传all
   - method_name： 方法名，需要在对象的model中预先定义方法，如：
     ```coffeescript
        methods:
          # 可通过this获取到object_name, record_id, space_id, user_id; params为request的body
          confirmReceipt: (params) ->
            return Creator.getCollection('vip_order').findOne({ _id: this.record_id, owner: this.user_id, status: 'delivered' })
      ```

 - 请求参数说明：
   - 对于方法中需要使用的参数，以JSON形式发送

 - response说明：
   - 成功后，将返回方法执行的结果

 - 示例如下：

   - HTTP 请求

   ```
    url
      -X POST https://beta.steedos.com/api/odata/v4/Af8e****DqD3/vip_order/hbysEccFT2fXjHtpd/confirmReceipt
      -H 'Content-type': 'application/json'
        {
          name: '张四'
        }
   ```

   - HTTP 响应

   ```
    {
      "_id" : "p6gGT6R3LXLSq97Kw",
      "name" : "会员卡充值",
      "amount" : 0.01,
      "status" : "delivered",
      "store" : "3NoMAPkdJcPkAxxJm",
      "card" : "ktd9yru2ANYtaJm5j",
      "type" : "recharge",
      "owner" : "sufZtt93b9J49kvip",
      "space" : "3NoMAPkdJcPkAxxJm",
      "created" : ISODate("2018-06-06T06:18:28.659Z"),
      "modified" : ISODate("2018-06-06T06:18:47.172Z"),
      "created_by" : "sufZtt93b9J49kvip",
      "modified_by" : "sufZtt93b9J49kvip",
      "amount_paid" : 0.01
    }
   ```
