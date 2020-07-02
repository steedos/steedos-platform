flowManager = {}

flowManager.getCategoriesFlows = (spaceId, categorieId, fields)->

	categoriesForms = formManager.getCategoriesForms(spaceId, categorieId, {_id: 1}).fetch()

	return db.flows.find({form: {$in : categoriesForms.getProperty("_id")}})

flowManager.getUnCategoriesFlows = (spaceId, fields)->

	unCategoriesForms = formManager.getUnCategoriesForms(spaceId, {_id: 1}).fetch()

	return db.flows.find({form: {$in : unCategoriesForms.getProperty("_id")}})







