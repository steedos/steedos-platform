'use strict';

AutoForm.addInputType('steedos-lookup', {
    template: 'afSteedosLookUp',
    valueIsArray: true,
    valueOut() {
        return this.val();
    },
    contextAdjust(context) {

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
