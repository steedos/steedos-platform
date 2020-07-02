Template.creator_table_checkbox.helpers Creator.helpers

Template.creator_table_checkbox.helpers
	isHeader: ()->
		return Template.instance().data._id == "#"

Template.creator_table_checkbox.events
	'change .select-one': (event, template)->
		container = $(event.currentTarget).closest(".slds-table")
		currentDataset = event.currentTarget.dataset
		currentId = currentDataset.id
		currentObjectName = currentDataset.objectName
		currentIndex = Creator.TabularSelectedIds[currentObjectName].indexOf currentId
		if $(event.currentTarget).is(":checked")
			if currentIndex < 0
				Creator.TabularSelectedIds[currentObjectName].push currentId
		else
			unless currentIndex < 0
				Creator.TabularSelectedIds[currentObjectName].splice(currentIndex, 1)

		checkboxs = container.find(".select-one")
		checkboxAll = container.find(".select-all")
		selectedLength = Creator.TabularSelectedIds[currentObjectName].length
		if selectedLength > 0 and checkboxs.length != selectedLength
			checkboxAll.prop("indeterminate",true)
		else
			checkboxAll.prop("indeterminate",false)
			if selectedLength == 0
				checkboxAll.prop("checked",false)
			else if selectedLength == checkboxs.length
				checkboxAll.prop("checked",true)

	'change .select-all': (event, template)->
		container = $(event.currentTarget).closest(".slds-table")
		currentDataset = event.currentTarget.dataset
		currentObjectName = currentDataset.objectName
		isSelectedAll = $(event.currentTarget).is(":checked")
		checkboxs = container.find(".select-one")
		if isSelectedAll
			checkboxs.each (i,n)->
				Creator.TabularSelectedIds[currentObjectName].push n.dataset.id
		else
			Creator.TabularSelectedIds[currentObjectName] = []
		checkboxs.prop("checked",isSelectedAll)