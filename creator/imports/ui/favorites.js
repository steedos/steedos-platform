import './favorites.html';
import FavoritesContainer from './containers/FavoritesContainer.jsx'
var _ = require("underscore");

var deleteCallBack = function(){

};

var getFlowRouterPath = function(url){
	var ROOT_URL_PATH_PREFIX = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
	if(ROOT_URL_PATH_PREFIX && url.startsWith(ROOT_URL_PATH_PREFIX)){
		url = url.replace(ROOT_URL_PATH_PREFIX, '');
	}
	if(!/^\//.test(url)){
		url = "/" + url;
	}
	return url;
}

Template.favorites.helpers({
	SteedosFavorites: function(){
		return FavoritesContainer
	},
	onToggleActionSelected: function () {
		return function(e, d){
			var currentRouter = FlowRouter.current();
			if(currentRouter && currentRouter.params){
				var params = currentRouter.params;
				var object_name = "";
				if(_.has(params, 'box') && _.has(params, 'instanceId')){
					var object_name = 'instances';
					params = {record_id: params.instanceId}
				}else{
					object_name = params.object_name || Session.get("object_name")
				}
				if(object_name){
					if(params.list_view_id && !_.has(params, 'record_id')){
						var listView = Creator.getListView(object_name, params.list_view_id, true);
						if(listView){
							var record = Creator.getCollection("favorites").findOne({object_name: object_name, record_type: 'LIST_VIEW', record_id: params.list_view_id});
							if(record){
								Creator.odata.delete('favorites', record._id, deleteCallBack)
							}else{
								var doc = {name: listView.label, object_name: object_name, record_type: 'LIST_VIEW', record_id: params.list_view_id};
								Creator.odata.insert('favorites', doc)
							}
						}
					}else if(params.record_id){
						var record = Creator.getCollection("favorites").findOne({object_name: object_name, record_type: 'RECORD', record_id: params.record_id})
						if(record){
							Creator.odata.delete('favorites', record._id, deleteCallBack)
						}else{
							var name = Session.get("record_name");
							if(object_name == 'instances'){
								name = WorkflowManager.getInstance().name;
							}
							var doc = {name:name , object_name: object_name, record_type: 'RECORD', record_id: params.record_id};
							Creator.odata.insert('favorites', doc)
						}
					}
				}

			}
		}
	},
	recordOnClick: function(){
		return function(record){
			if(record.record_type == 'LIST_VIEW'){
				if(record.object_name && record.record_id){
					var viewUrl = Creator.getListViewUrl(record.object_name, '-', record.record_id);
					FlowRouter.go(getFlowRouterPath(viewUrl));
				}
			}else if(record.record_type == 'RECORD'){
				if(record.object_name && record.record_id){
					if(record.object_name == 'instances'){
						$.ajax({
							url : Steedos.absoluteUrl('/api/workflow/instance/' + record.record_id + '?async' + "&X-User-Id=" + Meteor.userId() + "&X-Auth-Token=" + Accounts._storedLoginToken()),
							type : "get",
							data : {},
							async : false,
							success : function(result) {
								if(result && result.redirect){
									FlowRouter.go(getFlowRouterPath(result.redirect));
								}
							}
						});
					}else{
						var recordUrl = Creator.getObjectUrl(record.object_name, record.record_id, '-');
						FlowRouter.go(getFlowRouterPath(recordUrl));
					}
				}
			}

		}
	},
	editOnClick: function () {
		return function(){
			var url =Creator.getObjectUrl("favorites", null, '-')
			FlowRouter.go(getFlowRouterPath(url));
		}
	}
});
