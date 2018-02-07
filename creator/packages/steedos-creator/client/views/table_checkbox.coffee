Template.creator_table_checkbox.helpers Creator.helpers

Template.creator_table_checkbox.helpers
	isHeader: ()->
		return Template.instance().data._id == "#"

