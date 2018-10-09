SteedosDataManager = {};

SteedosDataManager.organizationRemote = new AjaxCollection("organizations");
SteedosDataManager.spaceUserRemote = new AjaxCollection("space_users");
SteedosDataManager.flowRoleRemote = new AjaxCollection("flow_roles");


// 获取space_users
SteedosDataManager.getSpaceUsers = function (spaceId, userIds) {
  var q = {};
  q.spaceId = spaceId;
  var data = 
  {
    'userIds' : userIds
  }
  var spaceUsers;
  
  $.ajax({
    url: Steedos.absoluteUrl('api/workflow/getSpaceUsers') + '?' + $.param(q),
    type: 'POST',
    async: false,
    data: data,
    dataType: 'json',
    success: function(responseText, status) {
      if (responseText.errors) {
        toastr.error(responseText.errors);
        return;
      }

      spaceUsers = responseText.spaceUsers;
    },
    error: function(xhr, msg, ex) {
      toastr.error(msg);
    }
  });

  return spaceUsers;
}


// 获取space_users
SteedosDataManager.getFormulaUserObjects = function (spaceId, userIds) {
  var q = {};
  q.spaceId = spaceId;
  var data = 
  {
    'userIds' : userIds
  };

  if(userIds && _.isArray(userIds) && userIds.length > 0){
  	if(_.isEmpty(userIds[0])){
  		console.info("userIds is empty")
  		return {spaceUsers: []}
	}
  };

  var spaceUsers;
  var data = JSON.stringify(data);
  $.ajax({
    url: Steedos.absoluteUrl('api/formula/space_users') + '?' + $.param(q),
    type: 'POST',
    async: false,
    data: data,
    dataType: 'json',
    processData: false,
    contentType: "application/json",
    success: function(responseText, status) {
      if (responseText.errors) {
        toastr.error(responseText.errors);
        return;
      }

      spaceUsers = responseText.spaceUsers;
    },
    error: function(xhr, msg, ex) {
      toastr.error(msg);
    }
  });

  return spaceUsers;
}


// 获取space_users
SteedosDataManager.getFormulaOrganizations = function (orgIds, space) {
	var q = {};

	if(space !== false  && Session.get("spaceId")){
		q.spaceId = Session.get("spaceId");
    }
	var data =
		{
			'orgIds' : orgIds
		}
	var orgs;
	var data = JSON.stringify(data);
	$.ajax({
		url: Steedos.absoluteUrl('api/formula/organizations') + '?' + $.param(q),
		type: 'POST',
		async: false,
		data: data,
		dataType: 'json',
		processData: false,
		contentType: "application/json",
		success: function(responseText, status) {
			if (responseText.errors) {
				toastr.error(responseText.errors);
				return;
			}

			orgs = responseText.orgs;
		},
		error: function(xhr, msg, ex) {
			toastr.error(msg);
		}
	});

	return orgs;
}

// Array.prototype.filterProperty = function(h, l){
//     var g = [];
//     this.forEach(function(t){
//         var m = t? t[h]:null;
//         var d = false;
//         if(m instanceof Array){
//             d = m.includes(l);
//         }else{
//             d = (l === undefined)? false:m==l;
//         }
//         if(d){
//             g.push(t);
//         }
//     });
//     return g;
// };