import './steedos_grid.html';
import SteedosGrid from './containers/SteedosGrid.jsx';

Template.steedos_grid.helpers({
	component: function(){
		return SteedosGrid;
	},
	objectApiName: function(){
		return this.objectApiName || Session.get("object_name");
	},
	name: function(){
		return this.name;
	},
	columnFields: function(){
		return this.columnFields;
	},
	filters: function(){
		return this.filters;
	},
	sort: function(){
		return this.sort;
	},
	onChange: function(){
		return this.onChange;
	},
	onModelUpdated: function (){
		return this.onModelUpdated;
	}
})

