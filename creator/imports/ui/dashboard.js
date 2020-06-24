import './dashboard.html';
import DashboardContainer from './containers/DashboardContainer.jsx'

Template.dashboard.helpers({
	Dashboard: function () {
		var dashboard = Creator.getAppDashboard()
		if (dashboard) {
			// 优先使用数据库或yml配置文件中配置的门户
			return DashboardContainer;
		}
		else {
			return Creator.getAppDashboardComponent()
		}
	},
	config: function () {
		var dashboard = Creator.getAppDashboard()
		return dashboard ? dashboard.widgets : {}
	},
	assistiveText: function () {
		return {
			widgets: {
				apps: {
					label: window.t("webapp_dashboard_widgets_type_apps"),
					tilesSectionLabel: window.t("webapp_dashboard_widgets_apps_tiles_section_label"),
					linksSectionLabel: window.t("webapp_dashboard_widgets_apps_links_section_label")
				},
				object: {
					label: window.t("webapp_dashboard_widgets_object_label"),
					allLinkLabel: window.t("webapp_dashboard_widgets_object_all_link_label"),
					illustrationMessageBody: window.t("webapp_dashboard_widgets_object_illustration_message_body")
				},
				instances_pendings: {
					label: window.t("webapp_dashboard_widgets_instances_pendings_label"),
					columns: {
						name: "Name",
						submitter_name: "Submitter Name",
						modified: "Modified Date"
					},
					illustrationMessageBody: window.t("webapp_dashboard_widgets_instances_pendings_illustration_message_body")
				},
				announcements_week: {
					label: window.t("webapp_dashboard_widgets_announcements_week_label"),
					columns: {
						name: "Name",
						created: "Created Date"
					},
					illustrationMessageBody: window.t("webapp_dashboard_widgets_announcements_week_illustration_message_body")
				},
				tasks_today: {
					label: window.t("webapp_dashboard_widgets_tasks_today_label"),
					columns: {
						name: "Name",
						due_date: "Due Date"
					},
					illustrationMessageBody: window.t("webapp_dashboard_widgets_tasks_today_illustration_message_body")
				},
				events_today: {
					label: window.t("webapp_dashboard_widgets_events_today_label"),
					columns: {
						name: "Name",
						start: "Start Date"
					},
					illustrationMessageBody: window.t("webapp_dashboard_widgets_events_today_illustration_message_body")
				}
			}
		}
	}
});

