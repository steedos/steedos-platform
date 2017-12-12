Creator.Objects.customers = 
	name: "customers"
	label: "Customers"
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


