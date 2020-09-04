const _ = require('underscore');
const Filters = require('@steedos/filters');

const getMyAdminOrMonitorFlows = (spaceId, userId)=>{

    if(!spaceId || !userId){
        return []
    }

    var flows, flow_ids = [], curSpaceUser, organization;
	curSpaceUser = db.space_users.findOne({
		space: spaceId,
		user: userId
	});
	if (curSpaceUser) {
		organizations = db.organizations.find({
			_id: {
				$in: curSpaceUser.organizations
			}
		}).fetch();
		flows = db.flows.find({space: spaceId});
		flows.forEach(function(fl) {
			if (WorkflowManager.canMonitor(fl, curSpaceUser, organizations) || WorkflowManager.canAdmin(fl, curSpaceUser, organizations)) {
				flow_ids.push(fl._id);
			}
		})
	}
	return flow_ids;
}

// module.exports = {

//     listenTo: 'instances',

//     beforeFind: async function () {
//         let userId = this.userId;
//         let spaceId = this.spaceId;
//         if(userId && spaceId){
//             let filters = this.query.filters;
//             if(!Steedos.isSpaceAdmin(spaceId, userId)){
//                 let flow_ids = getMyAdminOrMonitorFlows(spaceId, userId)
//                 const permissionsFilters = [ 
//                     [ "inbox_users", "=", userId],
//                     "or", [ "cc_users", "=", userId],
//                     "or", [ "outbox_users", "=", userId],
//                     "or", [ "submitter", "=", userId],
//                     "or", [ "applicant", "=", userId],
//                     "or", [ "flow", "in", flow_ids]
//                 ];
//                 this.query.filters = `(${filters}) and (${Filters.formatFiltersToODataQuery(permissionsFilters)})`
//             }
//         }
//     }
// }