Creator.Objects.customers = 
	name: "customers"
	label: "Customers"
	icon: "ion-ios-world-outline"
	schema: 
		name: 
			label: "Name",
			type: "String"
		description: 
			label: "Description",
			type: "String",
			optional: true,
			autoform:
				rows: 3
	list_views:
		default:
			columns: ["name", "description", "modified"]
	permissions:
		default:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false