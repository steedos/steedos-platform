Creator.Objects.archives_entity_relation = 
	name: "archives_entity_relation"
	icon: ""
	label: "实体关系"
	fields:
		entity_identifier:
			type: "text"
			label:"实体标识符"
			require:true
			is_wide:true
		relation_type:
			type: "select"
			label:"关系类型"
			options:[
				{label: "文件-文件", value: "文件-文件"},
				{label: "文件-单位", value: "文件-单位"},
				{label: "文件-个人", value: "文件-个人"},
				{label: "文件-业务", value: "文件-个人"},
				{label: "文件-机构", value: "文件-机构"}
			]
		relation:
			type: "select"
			label:"关系"
			options:[
				{label: "转发/被转发", value: "转发/被转发"},
				{label: "来文/复文", value: "来文/复文"},
				{label: "正文/附件", value: "暂存"},
				{label: "参考/被参考", value: "参考/被参考"},
				{label: "参见/被参见", value: "参见/被参见"},
				{label: "引用/被引用", value: "引用/被引用"},
				{label: "包含/被包含", value: "包含/被包含"},
				{label: "新版本/旧版本", value: "新版本/旧版本"},
				{label: "替代/被替代", value: "替代/被替代"},
				{label: "操控/被操控", value: "操控/被操控"},
				{label: "完成/被完成", value: "完成/被完成"},
				{label: "形成/被形成", value: "形成/被形成"},
				{label: "隶属/被隶属", value: "隶属/被隶属"},
				{label: "前/后", value: "前/后"},
			]
		relation_description:
			type: "textarea"
			label:"关系描述"
			is_wide:true