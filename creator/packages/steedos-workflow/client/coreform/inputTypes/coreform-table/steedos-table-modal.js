Template.steedosTableModal.helpers({
    getId : function (data) {
        return "steedos_table_modal_" + data.field.code + "_" + data.index;
    },

    getSchema : function (data) {
        return new SimpleSchema(WorkflowManager_format.getTableItemSchema(data.field));
    },

    equals: function (a,b) {
        return (a == b)
    },
})



Template.steedosTableModal.events({

    'change .steedos-table-modal .form-control,.steedos-table-modal .checkbox input,.steedos-table-modal .af-radio-group input,.steedos-table-modal .af-checkbox-group input': function(event, template){

        var name = event.target.name;

        var p = name.split(".")

        if(p.length < 2){
            return ;
        }
        
        var table = p[0], field = p[1];

        var item_index = template.data.index;

        var item_formula = template.data.field.formula;

        var item_value = SteedosTable.getItemModalValue(table, item_index);

        if(!item_value)
            return;

        //InstanceManager.checkFormFieldValue(event.target);

        var table_fields = WorkflowManager.getInstanceFields().findPropertyByPK("code",table).sfields;

        Form_formula.run(field, table + ".", item_formula, item_value, table_fields);

        //SteedosTable.updateItem(table, item_index);
    },

    // 'click .steedos-table-modal .remove-steedos-table-item': function(event, template){
    //     var field = template.data.field.code;
    //     var item_index = template.data.index;
    //     SteedosTable.removeItem(field, item_index);
    //     Modal.hide();
    // },

    'click .steedos-table-modal .steedos-table-ok-button': function(event, template){
        var field = template.data.field.code;
        var item_index = template.data.index;

        var item_value = SteedosTable.getItemModalValue(field, item_index);
        if(item_value){
            //检测item 字段值: 必填及数据格式
            if(!SteedosTable.checkItem(field, item_index)){
                return ;
            }
            Session.set("instance_change", true);
            SteedosTable.updateItem(field, item_index);
        }
        // 关闭Modal。使用Modal.hide() 不能关闭 Modal.allowMultiple = true 的底层Modal。此情况场景为：在字表中选择用户、部门
		$("#instanceform").trigger('change', [this.field.code])
        $(".close", $("#steedos-table-modal")).click(); // Modal.hide();

    },

    'click .steedos-table-modal .steedos-table-delete-button': function(event,template) {
        SteedosTable.removeItem(this.field.code, this.index);
		Session.set("instance_change", true);
		$("#instanceform").trigger('change', [this.field.code]);
        $('[data-dismiss="modal"]').click();
    }

    
})

Template.steedosTableModal.create = function () {
    Form_formula.initFormScripts()
}

Template.steedosTableModal.rendered = function(){
    Form_formula.runFormScripts(this.data.field.code, "onload");
}