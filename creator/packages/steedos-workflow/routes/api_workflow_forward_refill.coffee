JsonRoutes.add("post", "/api/workflow/forward_refill", (req, res, next) ->
	console.log "=========回填子表=========="
	console.log "req?.query?.subTable",req?.query?.subTable
	console.log "=========分发回填的列=========="
	console.log "req?.query?.column",req?.query?.column

	columns = req?.query?.column.split(';')
	console.log "columns",columns


	# 分发的申请单
	forward_ins = req?.body?.instance

	subTable = req?.query?.subTable

	if forward_ins?.state == "completed" && forward_ins?.distribute_from_instances?.length>0 && subTable && columns
		
		# 分发回来的值
		forward_ins_values = forward_ins?.values

		# # 原申请单字段
		original_ins_id = _.last forward_ins?.distribute_from_instances
		original_ins = db.instances.findOne(original_ins_id)
		original_ins_form = db.forms.findOne(original_ins?.form)

		original_ins_fields = []
		original_subtable_fields = []

		console.log "original_ins_form?.current?._id",original_ins_form?.current?._id
		console.log "original_ins?.form_version",original_ins?.form_version

		# 查看原申请单是否有对应的子表
		if original_ins?.form_version == original_ins_form?.current?._id
			original_ins_fields = original_ins_form.current?.fields
			original_ins_fields.forEach (original_ins_field)->
				console.log "original_ins_field",original_ins_field?.code
				if original_ins_field?.code == subTable && original_ins_field?.type == 'table'
					original_subtable_fields = original_ins_field?.fields
		else
			if original_ins_form?.historys?.length > 0
				original_ins_form.historys.forEach (oh)->
					if original_ins?.form_version == oh._id
						original_ins_fields = oh?.fields
						original_ins_fields.forEach (original_ins_field)->
							if original_ins_field?.code == subTable && original_ins_field?.type == 'table'
								original_subtable_fields = original_ins_field?.fields

		console.log "original_subtable_fields",original_subtable_fields?.length

		if original_subtable_fields
			# # 更新步骤的值
			# 1.找到当前的步骤
			# 2.当前步骤中approves中的values
			# 3.在values中找到表格
			# 4.根据表格的fields属性，一个个的赋值
			# 5.把复制的push到表格数组的后面
			traces = original_ins?.traces

			trace = traces[traces.length-1]

			approve = trace?.approves[0]

			table_data = approve?.values[subTable] || []

			row_data = {}

			columns.forEach (column)->
				row_data[column] = forward_ins_values[column] || ""
			
			
			if row_data && row_data != {}
				table_data.push row_data
				traces[traces.length-1].approves[0].values[subTable] = table_data

				console.log traces[traces.length-1].approves[0].values[subTable]

				db.instances.update(original_ins_id,{
					$set:{
						'traces':traces
						}
					})
				JsonRoutes.sendResult res, {
					code: 200,
					data: {
						'success': '回填成功'
					}
				}
			else
				JsonRoutes.sendResult res, {
					code: 200,
					data: {
						'info': '回填数据为空'
					}
				}

		else
			JsonRoutes.sendResult res, {
				code: 200,
				data: {
					'error': '原申请单无相关子表'
				}
			}
	else
		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				'success': '申请单未结束'
			}
		}
)