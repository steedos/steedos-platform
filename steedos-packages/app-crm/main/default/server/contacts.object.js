Creator.Objects['contacts'].methods = {
    disable_customer_spaceuser: function (req, res) {
        return Fiber(function () {
            var userSession = req.user
            var recordId = req.params._id;
            var spaceId = userSession.spaceId
            var userId = userSession.userId
            if(!Steedos.isSpaceAdmin(spaceId, userId)){
                return res.status(404).send({});
            }
            var contact = Creator.getCollection('contacts').findOne({_id: recordId});
            if(contact){
                if(contact.user){
                    db.space_users.direct.find({contact_id: recordId, is_customer: true, space: spaceId}).forEach(function(spaceUser){
                        Creator.getCollection('contacts').direct.update({_id: spaceUser.contact_id}, {$unset: {user: 1}});
                        db.space_users.direct.update({_id: spaceUser._id}, {$set: {user_accepted: false}, $unset: {contact_id: 1}})
                    })
                }
            }
            return res.send({});
        }).run();
        
    },
    disable_supplier_spaceuser: function (req, res) {
        return Fiber(function () {
            var userSession = req.user
            var recordId = req.params._id;
            var spaceId = userSession.spaceId
            var userId = userSession.userId
            if(!Steedos.isSpaceAdmin(spaceId, userId)){
                return res.status(404).send({});
            }
            var contact = Creator.getCollection('contacts').findOne({_id: recordId});
            if(contact){
                if(contact.user){
                    db.space_users.direct.find({contact_id: recordId, is_supplier: true, space: spaceId}).forEach(function(spaceUser){
                        Creator.getCollection('contacts').direct.update({_id: spaceUser.contact_id}, {$unset: {user: 1}});
                        db.space_users.direct.update({_id: spaceUser._id}, {$set: {user_accepted: false}, $unset: {contact_id: 1}})
                    })
                }
            }
            return res.send({});
        }).run()
    }
}