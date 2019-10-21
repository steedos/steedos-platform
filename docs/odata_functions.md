---
title: 自定义函数
---

在 OData 中，可以调用自定义方法处理相关的业务逻辑并返回结果。

### 接口信息

 - 请求方法：POST

 - 请求接口：/api/v4/{object_name}/{record_id}/{method_name}

 - 接口说明：
   - req.user：当前用户信息
     ```coffeescript
        methods:
          confirmReceipt: (req, res) ->
            let {_id} = req.params
            let {userId} = req.user
            return Steedos.getCollection('vip_order').findOne({ _id: _id, owner: userId, status: 'delivered' })
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
