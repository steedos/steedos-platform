Creator.Objects['license_auth_token'].methods = {
  sync: function (req, res) {
      return Fiber(function () {
          let userSession = req.user;
          var userId = userSession.userId
          var spaceId = userSession.spaceId
          if(!Creator.isSpaceAdmin(spaceId, userId)){
              return res.status(401).send({
                  "success": false
              });
          }
          let queryParams = req.query;
          let record = Creator.getCollection("license_auth_token").findOne({space: spaceId}, {fields: {_id: 1}})
          if(!record){
            Creator.getCollection("license_auth_token").insert({user: queryParams['X-User-Id'], token: queryParams['X-Auth-Token'], space: spaceId})
          }else{
            Creator.getCollection("license_auth_token").update({_id: record._id}, {$set: {user: queryParams['X-User-Id'], token: queryParams['X-Auth-Token']}})
          }
          let licenseServer = 'https://community.trial.steedos.com:8443';
          let space = Creator.getCollection("spaces").findOne({_id: spaceId}, {fields: {_id: 1, name: 1}});
          res.redirect(302, Meteor.absoluteUrl(`/api/v4/license_spaces/my_spaces/sync?n=${space.name}&q=${space._id}`, {rootUrl: licenseServer}));
      }).run();
  }
}