SteedosTable = {};

SteedosTable.formId = "instanceform";

CreatorTable = {};

CreatorTable.getKeySchema = function(field, autoFormId){
    var formId = autoFormId || AutoForm.getFormId();
    var schema = AutoForm.getFormSchema(formId)._schema;
    var keys = CreatorTable.getKeys(field);
    keys = _.map(keys, function(key){
        var key_schema = {};
        key_schema[field + ".$." + key] = schema[field + ".$." + key];
        return key_schema;
    })
    return keys;
}


CreatorTable.getThead = function(field, keys, autoFormId) {
    var formId = autoFormId || AutoForm.getFormId();

    var ss = AutoForm.getFormSchema(formId);

    trs = "<td class='title-delete'></td>"

    keys.forEach(function(sf, index) {
        label = AutoForm.getLabelForField(field + ".$." + sf);

        if (ss._schema[field + ".$." + sf].autoform && ss._schema[field + ".$." + sf].autoform.type == "hidden") {
            trs = trs + "<td nowrap='nowrap' class='hidden-field'>" + label + "</td>";
        } else {
            trs = trs + "<td nowrap='nowrap' class='title'>" + label + "</td>";
        }

    });
    

    thead = '<tr>' + trs + '</tr>';

    return thead;
}


CreatorTable.getKeys = function(field, autoFormId) {
    var formId = autoFormId || AutoForm.getFormId()

    if (!AutoForm.getCurrentDataForForm(formId)) {
        return [];
    }

    var ss = AutoForm.getFormSchema(formId);

    var keys = [];

    if (ss.schema(field + ".$").type === Object) {
        keys = ss.objectKeys(SimpleSchema._makeGeneric(field) + '.$')
    }

    return keys;

}





if(Meteor.isClient){
    AutoForm.addInputType("table", {
        template: "creatorTable",
        valueOut: function() {
            // console.log("valueOut..............")
            // CreatorTable.getTableValue(this);
			return 
        },
        valueConverters: {
            "stringArray": AutoForm.valueConverters.stringToStringArray,
            "number": AutoForm.valueConverters.stringToNumber,
            "numerArray": AutoForm.valueConverters.stringToNumberArray,
            "boolean": AutoForm.valueConverters.stringToBoolean,
            "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
            "date": AutoForm.valueConverters.stringToDate,
            "dateArray": AutoForm.valueConverters.stringToDateArray
        },
        contextAdjust: function(context) {
            if (typeof context.atts.maxlength === 'undefined' && typeof context.max === 'number') {
                context.atts.maxlength = context.max;
            }
            return context;
        }
    });

    Template.creatorTable.events({
        'click .add-item-tr': function(event, template) {
            var field = template.data.name;
			fieldValues = AutoForm.getFieldValue(field, template.formId);
            var index = fieldValues ? fieldValues.length : 0;
			Blaze.renderWithData(Template.creatorTableTr, {index: index, value: [], name: field, formId: template.formId}, $("#"+field+"Tbody", $("#"+template.data.atts.id))[0], null, template.view)
        },
        
        'click .delete-row': function(event, template) {
			event.currentTarget.parentElement.remove()
        }
    });

    Template.creatorTable.onCreated(function(){
        this.trField = new ReactiveVar([]);
        this.formId = AutoForm.getFormId();
    })

    Template.creatorTable.rendered = function() {
        var field = this.data.name;

        var keys = CreatorTable.getKeys(field);
        

        var validValue = this.data.value

        validValue = _.map(validValue, function(value, index){
            var _value = {};
            _value.index = index;
            _value.value = value;
            return _value
        })
        this.trField.set(validValue);
       
        $("thead[name='" + field + "Thead']").html(CreatorTable.getThead(field, keys));

        str = "新增一行";

        keyLength = keys.length + 1

        addItemTr = "<tr class='add-item-tr'><td colspan='"+keyLength+"'><i class='ion ion-plus-round'></i>"+str+"</td></tr>";

        if (this.data.atts.editable) {
           $("tfoot[name='" + field + "Tfoot']").append(addItemTr);
        }
    };

    Template.creatorTable.helpers({
        trField: function() {
            if (Template.instance().trField) {
                return Template.instance().trField.get();
            }
        },
        trData: function(data){
            data.name = Template.instance().data.name;
            return data
        }
    });


	Template.creatorTableTr.helpers({
		fieldName: function(index, value){

			var field = Template.instance().data.name;

			var formId = Template.instance().data.formId || AutoForm.getFormId();

			var schema = AutoForm.getFormSchema(formId)._schema;

			var keys = CreatorTable.getKeys(field, formId);
			keys = _.map(keys, function(key, i){
				var _value = {};
				_value.name = field + "."+ index +"." + key;
				_value.value = value[i]
				_value.key = field + ".$." + key;
				_value.type = 'field-type-' + schema[_value.key].type.name;
				return _value
			});
			return keys
		},
		isHiddenField: function(key) {
			var formId = Template.instance().data.formId || AutoForm.getFormId();
			var ss = AutoForm.getFormSchema(formId);
			return ss._schema[key].autoform && ss._schema[key].autoform.type == "hidden";
		},
		isDisabledField: function(key) {
			var formId = Template.instance().data.formId || AutoForm.getFormId();
			var ss = AutoForm.getFormSchema(formId);
			return ss._schema[key].autoform && ss._schema[key].autoform.disabled;
		},
		disabledFieldsValue: function(key) {
			var formId = Template.instance().data.formId || AutoForm.getFormId();
			var ss = AutoForm.getFormSchema(formId)
			if (ss._schema[key].autoform && ss._schema[key].autoform.disabled) {
				defaultValue = ss._schema[key].autoform.defaultValue;
				if (_.isFunction(defaultValue)) {
					defaultValue = defaultValue();
				}
				return defaultValue;
			}
			return ;
		}
	});
}