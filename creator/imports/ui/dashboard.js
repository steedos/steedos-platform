import './dashboard.html';
import DashboardContainer from './containers/DashboardContainer.jsx'

Template.dashboard.helpers({
	Dashboard: function(){
		var dashboard = Creator.getAppDashboard()
		if(dashboard){
			// 优先使用数据库或yml配置文件中配置的门户
			return DashboardContainer;
		}
		else{
			return Creator.getAppDashboardComponent()
		}
	},
	config: function(){
		var dashboard = Creator.getAppDashboard()
		return dashboard ? dashboard.widgets : {}
	}
});

