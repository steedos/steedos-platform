AutoForm.addInputType("section",{
    template:"afSection",
    valueOut:function(){
        return "";
    },
    valueConverters:{
        "stringArray" : AutoForm.valueConverters.stringToStringArray,
        "number" : AutoForm.valueConverters.stringToNumber,
        "numerArray" : AutoForm.valueConverters.stringToNumberArray,
        "boolean" : AutoForm.valueConverters.stringToBoolean,
        "booleanArray" : AutoForm.valueConverters.stringToBooleanArray,
        "date" : AutoForm.valueConverters.stringToDate,
        "dateArray" : AutoForm.valueConverters.stringToDateArray
    },
    contextAdjust: function(context){
        if(typeof context.atts.maxlength ==='undefined' && typeof context.max === 'number'){
            context.atts.maxlength = context.max;
        }

        if(context.atts.description){
            context.atts.description = context.atts.description.replace(new RegExp(/(\n)/g),'</br>')
        }

        return context;
    }
});

Template.afSection.helpers({
	label: function () {
		return this.atts.label || this.name;
	}
})

