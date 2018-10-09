// 修改fullname值有问题的organizations
JsonRoutes.add("get", "/api/organizations/upgrade/", function (req, res, next) {
  
	var orgs = db.organizations.find({fullname:/新部门/,name:{$ne:"新部门"}});
	if (orgs.count()>0)
	{
		orgs.forEach (function (org)
		{
			// 自己和子部门的fullname修改
			db.organizations.direct.update(org._id, {$set: {fullname: org.calculateFullname()}});
			
		});
	}	

  	JsonRoutes.sendResult(res, {
    	data: {
	      	ret: 0,
	      	msg: "Successfully"
    	}
  	});
});

