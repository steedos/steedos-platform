Meteor.methods
    "caculate_love_tags": (object_name, space_id)->
        unless object_name
            throw new Error("object_name不能为空")
        unless space_id
            throw new Error("space_id不能为空")
        vipCustomersCollection = Creator.getCollection('vip_customers')
        customers = vipCustomersCollection.find({ 
                space: space_id
            }, { 
                fields: { 
                    owner: 1
                } 
            })
        customers.forEach (customer) ->
            LoveManager.caculateLoveTags customer.owner, space_id, object_name
        return customers.count()