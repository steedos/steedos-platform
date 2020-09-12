
import PageContainer from './containers/PageContainer.jsx';

Template.dashboard.helpers({
	Page: function () {
			return PageContainer;
	},
	pageId: function () {
		FlowRouter.getParam('page_id')
	}
});