import './page.html';

Template.page.helpers({
	PageComponent: function () {
		const pageId = FlowRouter.getParam('page_id')
		if (!pageId || !Creator.Pages[pageId])
			return null;
		return Creator.Pages[pageId]	
	}
});