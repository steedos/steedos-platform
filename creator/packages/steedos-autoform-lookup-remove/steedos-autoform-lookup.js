'use strict';

AutoForm.addInputType('steedosLookups', {
    template: 'afSteedosLookUps',
    // valueIsArray: true,
	valueIn: function(val, atts) {
    	console.log("steedos-lookup valueIn3", val, atts);
		val = [val];
    	return val;
    },
	valueOut: function(){
		console.log("-------------------steedos-lookup valueOut-------------------", this.val());
		return "2222222222222222222222222222222";
	},
	valueConverters: {
		"string": function (a,b) {
			console.log("string", a, b)
		},
		"stringArray": AutoForm.valueConverters.stringToStringArray,
		"number": AutoForm.valueConverters.stringToNumber,
		"numerArray": AutoForm.valueConverters.stringToNumberArray,
		"boolean": AutoForm.valueConverters.stringToBoolean,
		"booleanArray": AutoForm.valueConverters.stringToBooleanArray,
		"date": AutoForm.valueConverters.stringToDate,
		"dateArray": AutoForm.valueConverters.stringToDateArray
	},
    contextAdjust: function(context) {
    	console.log("valueIn3", context)

        context.items = _.map(context.selectOptions, function (opt) {
            return {
                label: opt.label,
                value: opt.value,
                selected: _.contains(context.value, opt.value)
            };
        });

        //autosave option
        if (AutoForm && typeof AutoForm.getCurrentDataForForm === 'function') {
            context.atts.autosave = AutoForm.getCurrentDataForForm().autosave || false;
            context.atts.placeholder = AutoForm.getCurrentDataForForm().placeholder || context.atts.uniPlaceholder || null;
            if(_.has(context.atts, "disabled")){
                context.atts.uniDisabled = true
            }

            context.atts.uniDisabled = !!AutoForm.getCurrentDataForForm().disabled || context.atts.uniDisabled || false;
        }

        context.atts.removeButton = context.atts.removeButton || context.atts.remove_button; // support for previous version

        context.atts.dataSchemaKey = context.atts['data-schema-key'];

        return context;
    }
});
