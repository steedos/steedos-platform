Creator.Objects.contract_rate = 
    name: "contract_rate"
    icon: "record"
    label: "印花税"
    fields:
        no:
            type: "number"
            label: "编号"
        name:
            type: "text"
            label: "名称"
        detail:
            type: "number"
            label: "印花税率"
        remarks:
            type: "text"
            label: "说明"
        startdate:
            type: "date"
            label: "开始时间"
        overdate:
            type: "date"
            label: "结束时间"
        contracttype:
            type: "lookup"
            label: "合同类型"
            reference_to: "contract_type"
            hidden: true
        created:
            type: "datetime"
            label: "创建时间"
        created_by:
            type: "text"
            label: "创建人"
            hidden: true
        modified:
            type: "datetime"
            label: "修改时间"
        modified_by:
            type: "text"
            label: "修改人"
            hidden: true
        isuse:
            type: "select"
            label:"默认值"
            defaultValue: 0
            options:[
                {label:"0",value: 0},
                {label:"1",value: 1}],
            allowedValues:["0","1"]
    
    permission_set:
        user:
            allowCreate: false
            allowDelete: false
            allowEdit: false
            allowRead: false
            modifyAllRecords: false
            viewAllRecords: false
        admin:
            allowCreate: true
            allowDelete: true
            allowEdit: true
            allowRead: true
            modifyAllRecords: true
            viewAllRecords: true
    
    list_views:
        all:
            label: "全部"
            filter_scope: "space"
            columns:["no","name","detail","remarks","created","modified","isuse"]