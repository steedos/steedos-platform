JsonRoutes.add("post", "/api/workflow/getSpaceUsers", function (req, res, next) {
  var
    userIds = req.body.userIds,
    spaceId = req.query.spaceId,
    spaceUsers = []
  ;

  if (!userIds || !spaceId) {
    JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        'errors': '缺少参数'
      }
    });
  }

  spaceUsers = WorkflowManager.getUsers(spaceId, userIds);

  JsonRoutes.sendResult(res, {
    code: 200,
    data: {
      'spaceUsers': spaceUsers
    }
  });
})


  
  