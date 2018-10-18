AutoForm.addInputType("selectuser_localdata",{
    template:"afSelectUser_localData",
    valueIn: function(val, atts){
        if("string" == typeof(val))
            val = CFDataManager.getFormulaSpaceUsers(val);

        if(val instanceof Array && val.length > 0 && "string" == typeof(val[0])){
            val = CFDataManager.getFormulaSpaceUsers(val);
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

        context.atts.class = "selectUser form-control";

        //context.atts.onclick = 'SelectTag.show({data:{orgs:WorkflowManager.getSpaceOrganizations() , users:WorkflowManager.getSpaceUsers()},multiple:false},\"$(\\\"input[name=\''+context.name+'\']\\\").val(SelectTag.values)\")';
        return context;
    }
});

Template.afSelectUser_localData.helpers({
    val: function(value){
        if(value){
            var val = '';
            if(value instanceof Array){ //this.data.atts.multiple && (value instanceof Array)
                if(value.length > 0 && typeof(value[0]) == 'object'){
                    val = value ? value.getProperty("name").toString() : ''
                    this.atts["data-values"] = value ? value.getProperty("id").toString() : '';
                }else{
                    val = value.toString();
                }
            }else{
                if(value && typeof(value) == 'object'){
                    val = value ? value.name : '';
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


Template.afSelectUser_localData.events({
  'click .selectUser': function (event, template) {
    if ("disabled" in template.data.atts)
        return;

    var dataset = $("input[name='"+template.data.name+"']")[0].dataset;

    var data,multiple,showOrg=true;

    if(dataset.userOptions){
        data = {users:WorkflowManager.getUsers(dataset.userOptions.split(","))};
    }else{
        data = {orgs:WorkflowManager.getSpaceOrganizations() , users:WorkflowManager.getSpaceUsers()};
    }

    if(dataset.multiple){
        multiple = dataset.multiple == 'true' ? true : false
    }else{
        multiple = template.data.atts.multiple
    }

    if(dataset.showOrg && dataset.showOrg == 'false'){
        showOrg = false;
    }
    
    var values = $("input[name='"+template.data.name+"']")[0].dataset.values;

    var options = {};

    options.data = data;
    options.multiple = multiple;
    options.showOrg = showOrg;
    
    if(values && values.length > 0){
        options.defaultValues = values.split(",");
    }

    var start_orgId = "";

    if(data.orgs && data.orgs.length > 0){
        var start_org = data.orgs.filterProperty("is_company",true);
        start_org.forEach(function(so){
            start_orgId = so.id;
        });
    }

    options.orgId = start_orgId;
    SelectTag.show(options,"Template.afSelectUser_localData.confirm('"+template.data.name+"')");
  }
});

Template.afSelectUser_localData.confirm = function(name){
    var values = SelectTag.values;
    var valuesObject = SelectTag.valuesObject();
    if(valuesObject.length > 0){
        if($("input[name='"+name+"']")[0].multiple || $("input[name='"+name+"']")[0].dataset.multiple=='true'){
            $("input[name='"+name+"']")[0].dataset.values = values;
            $("input[name='"+name+"']").val(valuesObject.getProperty("name").toString()).trigger("change");
        }else{
            $("input[name='"+name+"']")[0].dataset.values = values[0];
            $("input[name='"+name+"']").val(valuesObject[0].name).trigger("change");
        }
        
    }else{
        $("input[name='"+name+"']")[0].dataset.values = '';
        $("input[name='"+name+"']").val('').trigger("change");
    }

}

Template.afSelectUser_localData.rendered = function(){
    // var value = this.data.value;
    var name = this.data.name;
    var dataset = this.data.dataset;
    // if(value instanceof Array){  //(value instanceof Array) && (this.data.atts && this.data.atts.multiple)
    //     $("input[name='"+name+"']").val(value ? value.getProperty("name").toString() : '');
    //     $("input[name='"+name+"']")[0].dataset.values = value ? value.getProperty("id") : '';
    // }else{
    //     $("input[name='"+name+"']").val(value ? value.name : '');
    //     $("input[name='"+name+"']")[0].dataset.values = value ? value.id : ''; 
    // }

    if(dataset){
        for(var dk in dataset){
            $("input[name='"+name+"']")[0].dataset[dk] = dataset[dk]
        }
    }
    
}

