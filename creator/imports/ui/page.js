import './page.html';

import PageContainer from './containers/PageContainer.jsx';

Template.page.helpers({
	pageContainer: function () {
			return PageContainer;
	},
	pageId: function () {
		return FlowRouter.getParam('page_id')
	}
});