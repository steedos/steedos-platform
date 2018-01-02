Creator.Objects.archives_borrow = 
	name: "archives_borrow"
	icon: ""
	label: "借阅管理"
	fields:
		BORROWNO:
			type:"text"
			label:"借阅单编号"
			#defaultValue:当前年度的借阅单总数+1
		FILETYPE:
			type:"text"
			label:"类别"
			defaultValue:"立卷方式(文件级)"
			omit:true
		status:
			type:"number"
			label:"状态"
			omit:true
		UNITINFO:
			type:"text"
			label:"单位"
			#字段生成，不可修改
		DEPARMENTSINFO:
			type:"text"
			label:"部门"
			required:true
		PHONENUMBER:
			type:"text"
			label:"联系方式"
			required:true
		STARTDATE:
			type:"date"
			label:"借阅日期"
			#defaultValue:new Date()
		ENDDATE:
			type:"date"
			label:"归还日期"
		#	defaultValue:new Date() #应该是当前日期加7天
			required:true
		USEWITH:
			type:"select"
			label:"利用目的"
			defaultValue:"工作考察"
			options:[
				{label: "工作考察", value: "工作考察"},
				{label: "遍史修志", value: "遍史修志"},
				{label: "学术研究", value: "学术研究"},
				{label: "经济建设", value: "经济建设"},
				{label: "宣传教育", value: "宣传教育"},
				{label: "其他", value: "其他"},
			]
		USEFASHIOH:
			type:"select"
			label:"利用方式"
			defaultValue:"实体借阅"
			options:[
				{label: "实体借阅", value: "实体借阅"},
				{label: "实体外借", value: "实体外借"},
			]
		APPROVE:
			type:"textarea"
			label:"单位审批"
			is_wide:true
		DESCRIPTION:
			type:"textarea"
			label:"备注"
			is_wide:true
		STATUS:
			type:"select"
			label:"状态"
			options: [
				{label: "未审批", value: "未审批"},
				{label: "已审批", value: "已审批"},
				{label: "续借审批中", value: "续借审批中"},
				{label: "续借已审批", value: "续借已审批"},
				{label: "已移交审批", value: "已移交审批"},
				{label: "移交审批完成", value: "移交审批完成"},
				{label: "已结单", value: "已结单"}
				]
			defaultValue:"未审批"
			omit:true
		BORROWNO:
			type:"lookup"
			label:"题名"
			reference_to:"archives_files_clerical"
			is_wide:true
		DETAILSTATUS:
			type:"select"
			label:"明细状态"
			options:[
				{label:"申请中",value:"申请中"},
				{label:"不予批准",value:"不予批准"},
				{label:"已批准",value:"已批准"},
				{label:"审批中",value:"审批中"},
				{label:"续借审批中",value:"续借审批中"},
				{label:"续借已审批",value:"续借已审批"},
				{label:"已归还",value:"已归还"},
				{label:"逾期",value:"逾期"}
				]
		FILETYPE:
			type:"text"
			label:"类别"
			defaultValue:"立卷方式(文件级)"
	list_views:
		default:
			columns:["BORROWNO","STATUS","created","ENDDATE","created_by","UNITINFO
			","DEPARMENTSINFO","PHONENUMBER"]
		all:
			label:"所有借阅记录"
