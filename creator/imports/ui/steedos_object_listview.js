import './steedos_object_listview.html';
import SteedosObjectListView from './containers/SteedosObjectListView';

Template.steedos_object_listview.helpers({
	component: function(){
		return SteedosObjectListView;
	},
	objectApiName: function(){
		return this.objectApiName || Session.get("object_name");
	},
	name: function(){
		return this.name;
	},
	listName: function(){
		return this.listName;
	},
	filters: function (){
		return this.filters;
	},
	onModelUpdated: function (){
		return this.onModelUpdated;
	},
	sideBar: function () {
		return this.sideBar;
	},
	pageSize: function(){
		return this.pageSize;
	},
	onUpdated: function(){
		return this.onUpdated;
	},
	checkboxSelection: function(){
		return this.checkboxSelection;
	},
	columnFields: function(){
		return this.columnFields;
	}
})

