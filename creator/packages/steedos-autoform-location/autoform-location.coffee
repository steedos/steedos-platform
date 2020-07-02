#TODO 接入地图插件

Template.location.helpers
	valueStr: ()->
		return JSON.stringify(this.value)
	address: ()->
		return this.value?.address
	address_key: ()->
		return this.address_key

AutoForm.addInputType "location", {
	template: "location"
	valueOut: ()->
		element = this[0]
		val = JSON.parse(element.dataset.value) || {}
		val.address = $("#" + element.dataset.address).val()
		return val
	contextAdjust: (context) ->
		key = context.atts["data-schema-key"]
		context.address_key = key + "_address"
		return context
}