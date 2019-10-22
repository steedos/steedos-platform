WorkflowManager_format = {};


// //获取user select2 标签的 options
// var getSpaceUserSelect2Options = function (){

//   // todo WorkflowManager.getSpaceUsers(spaceId);
//   // 数据格式转换

//   var spaceUsers = WorkflowManager.getSpaceUsers();

//   var options = new Array();

//   spaceUsers.forEach(
//     function(user){
//         options.push({
//             optgroup : user.organization.fullname,
//             options: [
//                 {label : user.name, value : user.id}
//             ]
//         });
//     }
//   );

//   return options ;

// };

// //获取group select2 标签的 options
// var getSpaceOrganizationSelect2Options = function(){
//   var spaceOrgs = WorkflowManager.getSpaceOrganizations();

//   var options = new Array();

//   spaceOrgs.forEach(
//     function(spaceOrg){
//         options.push(
//             {label : spaceOrg.fullname, value : spaceOrg.id}
//         );
//     }
//   );

//   return options ;
// };

var number_step = function (digits) {
    if (digits && typeof(digits) == 'number' && digits > 0) {
        var step = '0.';

        for (var i = 0; i < (digits - 1); i++) {
            step = step + '0';
        }

        step = step + '1';

        return step;
    }
}

var s_autoform = function (schema, field) {

    var type = field.type;

    var options = field.options;

    var optionsArr = []

	if(InstanceMacro.check(options)){
		optionsArr = InstanceMacro.run(options);
	}else if(options != null && options.length > 0){
		optionsArr = options.split("\n");
    }

    var permission = field.permission == 'editable' ? 'editable' : 'readonly';

    var is_multiselect = field.is_multiselect;

    if (field.type != 'odata' && field["formula"])
        permission = "readonly";

    var autoform = {};

    //字段类型转换
    switch (type) {
        case 'input' :
            schema.type = String;
            autoform.disabled = (permission == 'readonly');

            if(options != null && options.length > 0){
                autoform.type = 'typeahead';
            }else{
                if (field.is_textarea) {
                    autoform.type = 'coreform-textarea';
                    autoform.rows = field.rows;
                } else {
                    autoform.type = 'text';
                }
            }
            break;
        case 'section' : //div
            schema.type = String;
            autoform.disabled = true;
            autoform.type = 'section';
            break;
        case 'geolocation' : //地理位置
            schema.type = String;
            autoform.disabled = (permission == 'readonly');
            autoform.type = 'text';
            break;
        case 'number' :
            schema.type = Number;
            autoform.disabled = (permission == 'readonly');
            autoform.type = 'coreform-number';
            autoform.step = number_step(field.digits); //控制有效位数
            break;
        case 'date' :
            schema.type = String;
            autoform.disabled = (permission == 'readonly');
            if (Steedos.isMobile() || Steedos.isPad())
                autoform.type = 'date';
            else {
                autoform.type = 'coreform-datepicker';
                autoform.outFormat = 'yyyy-MM-dd';
                autoform.dateTimePickerOptions = {
                    showClear: true,
                    format: "YYYY-MM-DD",
                    locale: Session.get("TAPi18n::loaded_lang"),
                    widgetPositioning:{
                        // horizontal: 'right'
                    }
                }
            }
            break;
        case 'dateTime' :
            schema.type = Date;
            autoform.disabled = (permission == 'readonly');
            if (Steedos.isMobile() || Steedos.isPad())
                autoform.type = 'datetime-local';
            else {
                autoform.type = 'bootstrap-datetimepicker';
                autoform.dateTimePickerOptions = {
                    showClear: true,
                    format: "YYYY-MM-DD HH:mm",
                    locale: Session.get("TAPi18n::loaded_lang"),
                    widgetPositioning:{
                        // horizontal: 'right'
                    }
                }
            }
            break;
        case 'checkbox' :
            schema.type = Boolean;
            autoform.disabled = (permission == 'readonly');
            autoform.type = 'coreform-checkbox';
            break;
        case 'select' :
            if (is_multiselect) {
                schema.type = [String];
                autoform.multiple = true;
            } else {
                schema.type = String;
            }
            autoform.readonly = (permission == 'readonly');
            autoform.type = (permission == 'readonly') ? 'text' : 'select';
            autoform.disabled = (permission == 'readonly');
            break;
        case 'radio' :
            schema.type = [String];
            autoform.disabled = (permission == 'readonly');
            autoform.type = 'coreform-radio';
            break;
        case 'multiSelect' :
            schema.type = [String];
            autoform.disabled = (permission == 'readonly');
            autoform.type = 'coreform-multiSelect';
            break;
        case 'user' :
            if (is_multiselect) {
                schema.type = [String];
                autoform.multiple = true;
            } else {
                schema.type = String; // 如果是单选，不能设置multiple 参数
            }
            autoform.disabled = (permission == 'readonly');
            autoform.type = "selectuser";
            break;
        case 'email' :
            schema.type = String;
            autoform.type = "steedosEmail";
            autoform.readonly = (permission == 'readonly');
            autoform.disabled = (permission == 'readonly');
            break;
        case 'url' :
            schema.type = String;
            autoform.type = "steedosUrl";
            autoform.readonly = (permission == 'readonly');
            autoform.disabled = (permission == 'readonly');
            break;
        case 'group' :
            if (is_multiselect) {
                schema.type = [String];
                autoform.multiple = true;
            } else {
                schema.type = String; // 如果是单选，不能设置multiple 参数
            }

            autoform.disabled = (permission == 'readonly');
            autoform.type = "selectorg";

            break;
        case 'odata':
			if (is_multiselect) {
				schema.type = [Object];
				autoform.multiple = true;
			}else{
				schema.type = Object;
            }
			schema.blackbox = true;
			autoform.type = "steedos-selectize";
			autoform.readonly = (permission === 'readonly');
			autoform.disabled = (permission === 'readonly');
			autoform.related_object = field.related_object;
			autoform.url = field.url;
			autoform.filters = field.filters;
			autoform.formula = field.formula;
			autoform.search_field = field.search_field;
			break;
        default:
            schema.type = String;
            autoform.readonly = (permission == 'readonly');
            autoform.disabled = (permission == 'readonly');
            autoform.type = type;
            break; //地理位置
    }

    if (optionsArr != null && optionsArr.length > 0) {

        var afoptions = new Array();

        for (var s = 0; s < optionsArr.length; s++) {
            afoptions.push({label: optionsArr[s], value: optionsArr[s]});
        }

        autoform.options = afoptions;
    }
    return autoform;
};

var s_schema = function (label, field) {

    var fieldType = field.type, is_required = field.is_required;

    schema = {};

    schema.label = label;

    schema.optional = (field.permission == "readonly") || (!is_required);

    if (fieldType == 'email') {

        schema.regEx = SimpleSchema.RegEx.Email;
    } else if (fieldType == 'url') {

        schema.regEx = SimpleSchema.RegEx.Url;

    }

    schema.autoform = new s_autoform(schema, field);



    if(schema.autoform.disabled == false){

		if(!field.default_value || field.default_value.indexOf("auto_number(") < 0){
			schema.autoform.defaultValue = field.default_value;
		}

		if(InstanceMacro.check(field.default_value)){
			schema.autoform.defaultValue = InstanceMacro.run(field.default_value);
		}

		if(field.default_value && field.default_value.indexOf("auto_number(") > -1){

			schema.autoform["data-new-number"] = true

			schema.autoform["data-formula"] = field.default_value

			schema.autoform.defaultValue = ""

        }

    }

    if (fieldType === 'section') {
        schema.autoform.description = field.description;
		schema.autoform.label = field.name;
    }

	schema.autoform.title = schema.label;

    return schema;
};


WorkflowManager_format.getTableItemSchema = function (field) {
    var fieldSchema = {};
    if (field.type == 'table') {
        var label = (field.name != null && field.name.length > 0) ? field.name : field.code;
        fieldSchema[field.code] = {
            type: Object,
            optional: (field.permission == "readonly") || (!field.is_required),
            label: label
        };

        field.sfields.forEach(function (sfield) {
            label = (sfield.name != null && sfield.name.length > 0) ? sfield.name : sfield.code;

            sfields_schema = new s_schema(label, sfield);
            fieldSchema[field.code + "." + sfield.code] = sfields_schema;
        });
    }

    return fieldSchema;
}

WorkflowManager_format.getAutoformSchema = function (steedosForm) {
    var fieldSchema = {};
    var fields = steedosForm.fields;

    var instanceIsreadOnly = ApproveManager.isReadOnly();

    for (var i = 0; i < fields.length; i++) {

        var field = fields[i];

        var label = (field.name != null && field.name.length > 0) ? field.name : field.code;

        if (instanceIsreadOnly) {
            field.permission = "readonly";
        }

        if (field.type == 'table') {

            fieldSchema[field.code] = {
                type: Array,
                optional: (field.permission == "readonly") || (!field.is_required),
                minCount: 0,
                maxCount: 200,
                //initialCount: 0,
                label: label,
                autoform: {
                    schema: [],
                    initialCount: 0,
                    type: "table",
                    editable: field.permission == 'editable' ? true : false,
                    description: field.description
                }
            };
            if (ApproveManager.isReadOnly()) {
                fieldSchema[field.code].autoform.editable = false
            }

            fieldSchema[field.code + ".$"] = {type: Object, label: label}

            if(field.sfields){
				for (var si = 0; si < field.sfields.length; si++) {

					var tableField = field.sfields[si];

					label = (tableField.name != null && tableField.name.length > 0) ? tableField.name : tableField.code;

					tableField_schema = new s_schema(label, tableField);

					fieldSchema[field.code + ".$." + tableField.code] = tableField_schema;

				}
			}

        } else {

            fieldSchema[field.code] = new s_schema(label, field);

        }
    }
    return fieldSchema;
};


// var getSchemaValue = function(field,value){
//   var rev ;
//   switch(field.type){
//     // case 'checkbox':
//     //   rev = (value && value != 'false') ? true : false;
//     //   break;
//     // case 'multiSelect':
//     //   if(value instanceof Array)
//     //     rev = value;
//     //   else
//     //     rev = value ? value.split(",") : [];
//     //   break;
//     // case 'radio':
//     //   if(value instanceof Array)
//     //     rev = value
//     //   else
//     //     rev = value ? value.split(",") : [];
//     default:
//       rev = value;
//       break;
//   }
//   return rev;
// };


WorkflowManager_format.getAutoformSchemaValues = function () {
    // var form = WorkflowManager.getInstanceFormVersion();
    // if(!form) return ;
    // var fields = form.fields;

    // var values = {};

    var instanceValue = InstanceManager.getCurrentValues();

    if (!instanceValue)
        instanceValue = {}

    // fields.forEach(function(field){
    //   if(field.type == 'table')
    //     if (!instanceValue[field.code])
    //       instanceValue[field.code] = []
    // });

    return instanceValue;
}
