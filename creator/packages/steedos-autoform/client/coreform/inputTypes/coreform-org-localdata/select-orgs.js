AutoForm.addInputType("selectorg_localdata",{
    template:"afSelectOrg_localData",
    valueIn: function(val, atts){
        if("string" == typeof(val))
            val = WorkflowManager.getFormulaOrgObjects(val);

        if(val instanceof Array && val.length > 0 && "string" == typeof(val[0])){
            val = WorkflowManager.getFormulaOrgObjects(val);
        }

        return val;
    },
    valueOut:function(){
        return this[0].dataset.values;
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

        context.atts.class = "selectOrg form-control";

        //context.atts.onclick = 'SelectTag.show({data:{orgs:WorkflowManager.getSpaceOrganizations() , users:WorkflowManager.getSpaceUsers()},multiple:false},\"$(\\\"input[name=\''+context.name+'\']\\\").val(SelectTag.values)\")';
        return context;
    }
});



Template.afSelectOrg_localData.events({
  'click .selectOrg': function (event, template) {
    if ("disabled" in template.data.atts)
        return;
    var data = {orgs:WorkflowManager.getSpaceOrganizations()};
    var values = $("input[name='"+template.data.name+"']")[0].dataset.values;

    var options = {};
    options.data = data;
    options.multiple = template.data.atts.multiple;
    if(values && values.length > 0){
        options.defaultValues = values.split(",");
    }

    options.showUser = false;

    var start_orgId = "";

    if(data.orgs && data.orgs.length > 0){
        var start_org = data.orgs.filterProperty("parent", null);
        start_org.forEach(function(so){
            start_orgId = so.id;
        });
    }

    options.orgId = start_orgId;

    SelectTag.show(options,"Template.afSelectOrg_localData.confirm('"+template.data.name+"')");
  }
});

Template.afSelectOrg_localData.helpers({
    val: function(value){
        if(value){
            var val = '';
            if(value instanceof Array){ //this.data.atts.multiple && (value instanceof Array)
                if(value.length > 0 && typeof(value[0]) == 'object'){
                    val = value ? value.getProperty("fullname").toString() : ''
                    this.atts["data-values"] = value ? value.getProperty("id").toString() : '';
                }else{
                    val = value.toString();
                }
            }else{
                if(value && typeof(value) == 'object'){
                    val = value ? value.fullname : '';
                    this.atts["data-values"] = value ? value.id : '';
                }else{
                    val = value;
                }
            }

            if(this.dataset && "values" in this.dataset){
                this.atts["data-values"] = this.dataset.values;
            }

            return val;
        }
    }
});

Template.afSelectOrg_localData.confirm = function(name){
    var values = SelectTag.values;
    var valuesObject = SelectTag.valuesObject();
    if(valuesObject.length > 0){
        if($("input[name='"+name+"']")[0].multiple){
            $("input[name='"+name+"']")[0].dataset.values = values;
            $("input[name='"+name+"']").val(valuesObject.getProperty("fullname").toString()).trigger("change");
        }else{
            $("input[name='"+name+"']")[0].dataset.values = values[0];
            $("input[name='"+name+"']").val(valuesObject[0].fullname).trigger("change");
        }

    }else{
        $("input[name='"+name+"']")[0].dataset.values = '';
        $("input[name='"+name+"']").val('').trigger("change");
    }

}

// Template.afSelectOrg_localData.rendered = function(){
//     var value = this.data.value;
//     var name = this.data.name;
//     if(value instanceof Array){ //this.data.atts.multiple && (value instanceof Array)
//         $("input[name='"+name+"']").val(value ? value.getProperty("name").toString() : '');
//         $("input[name='"+name+"']")[0].dataset.values = value ? value.getProperty("id") : '';
//     }else{
//         $("input[name='"+name+"']").val(value ? value.name : '');
//         $("input[name='"+name+"']")[0].dataset.values = value ? value.id : '';
//     }

// }

