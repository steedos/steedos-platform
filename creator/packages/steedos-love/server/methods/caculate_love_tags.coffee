Meteor.methods
    "caculate_love_tags": (object_name, space_id)->
        unless object_name
            object_name = "love_test"
        unless space_id
            space_id = "Lnre96ro35Wf9b3gA"
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