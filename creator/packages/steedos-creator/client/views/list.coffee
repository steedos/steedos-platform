Template.creator_list.helpers

	collectionName: ()->
		return FlowRouter.getParam("collection_name")

	collection: ()->
		return "Creator.Collections." + FlowRouter.getParam("collection_name")

	tabular_table: ()->
		return Creator.TabularTables[FlowRouter.getParam("collection_name")]