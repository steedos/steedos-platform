import './dashboard.html';
import DashboardContainer from './containers/DashboardContainer.jsx'

Template.dashboard.helpers({
	Dashboard: function(){
		return DashboardContainer
	},
	config: function(){
		var app = Creator.getApp();
		return app ? app.dashboard : {}
	}
});

