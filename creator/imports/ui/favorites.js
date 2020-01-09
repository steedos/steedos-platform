import './favorites.html';
import FavoritesContainer from './containers/FavoritesContainer.jsx'

deleteCallBack = function(){

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
				var object_name = params.object_name || Session.get("object_name")
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
							var doc = {name: Session.get("record_name"), object_name: object_name, record_type: 'RECORD', record_id: params.record_id};
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
					FlowRouter.go(Creator.getListViewUrl(record.object_name, '-', record.record_id));
				}
			}else if(record.record_type == 'RECORD'){
				if(record.object_name && record.record_id){
					FlowRouter.go(Creator.getObjectUrl(record.object_name, record.record_id, '-'));
				}
			}

		}
	},
	editOnClick: function () {
		return function(){
			FlowRouter.go(Creator.getObjectUrl("favorites", null, '-'));
		}
	}
});
