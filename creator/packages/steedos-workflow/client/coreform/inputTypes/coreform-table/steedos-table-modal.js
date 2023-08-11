Template.steedosTableModal.helpers({
    getId : function (data) {
        return "steedos_table_modal_" + data.field.code + "_" + data.index;
    },

    getSchema : function (data) {
        data.field.__formId = "steedos_table_modal_" + data.field.code + "_" + data.index;
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
		var self = this;
        Meteor.defer(function(){
			$("#instanceform").trigger('change', [self.field.code])
		});
        $(".close", $("#steedos-table-modal")).click(); // Modal.hide();

    },

    'click .steedos-table-modal .steedos-table-delete-button': function(event,template) {
        SteedosTable.removeItem(this.field.code, this.index);
		Session.set("instance_change", true);
		var self = this;
		Meteor.defer(function(){
			$("#instanceform").trigger('change', [self.field.code])
        });
        $('[data-dismiss="modal"]').click();
    }

    
})

Template.steedosTableModal.create = function () {
    Form_formula.initFormScripts()
}

Template.steedosTableModal.rendered = function(){
    Form_formula.runFormScripts(this.data.field.code, "onload");
}

Template.steedosTableModal.rendered = function () {
    Form_formula.runFormScripts(this.data.field.code, "onload");
    // 设置dxOverlay的zIndex值，解决dxOverlay弹出窗口被creator-auotform-modals窗口覆盖的问题
    // 比如弹出的时间、日期控件，popup控件等
    // 因creator-auotform-modals的z-index值为2000，所以这里要比它大
    // DevExpress.ui.dxOverlay.baseZIndex(2100);
}

// Template.steedosTableModal.destroyed = function () {
//     // 还原dxOverlay原来默认的zIndex值
//     DevExpress.ui.dxOverlay.baseZIndex(1500);
// }