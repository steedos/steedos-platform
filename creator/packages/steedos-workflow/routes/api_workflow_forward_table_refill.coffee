JsonRoutes.add("post", "/api/workflow/forward_table_refill", (req, res, next) ->
	try
		console.log "=========原表子表=========="
		console.log "req?.query?.oTable",req?.query?.oTable
		console.log "=========现表子表=========="
		console.log "req?.query?.dTable",req?.query?.dTable
		console.log "=========原表单的子表匹配列=========="
		console.log "req?.query?.oMatchCol",req?.query?.oMatchCol
		console.log "=========现表单的子表匹配列=========="
		console.log "req?.query?.dMatchCol",req?.query?.dMatchCol
		console.log "=========需要回填的列=========="	
		console.log "req?.query?.refillCol",req?.query?.refillCol

		# 分发的申请单
		d_ins = req?.body?.instance

		
		if d_ins?.state == "completed"
			if req?.query?.oTable
				o_table = req?.query?.oTable
				if req?.query?.dTable
					d_table = req?.query?.dTable
				else
					d_table = o_table
				if req?.query?.aTable
					a_table = req?.query?.aTable
				if req?.query?.oMatchCol
					o_match_col = req?.query?.oMatchCol
					if req?.query?.dMatchCol
						d_match_col = req?.query?.dMatchCol
					else
						d_match_col = o_match_col
					columns = req?.query?.refillCol.split(';') || []
					console.log "columns",columns					

					if columns || columns.length<1
						console.log "======================"
						console.log d_table, o_match_col, columns

						# 分发回来的值
						d_ins_values = d_ins?.values

						# 原申请单 form 表字段
						o_ins_id = _.last d_ins?.distribute_from_instances
						o_ins = db.instances.findOne(o_ins_id)
						o_ins_form = db.forms.findOne(o_ins?.form)

						d_ins_form = db.forms.findOne(d_ins?.form)

						# 原申请单的 fields
						o_ins_fields = []

						# 原子表字段
						o_subtable_fields = []

						# 分发申请单的 fields
						d_ins_fields = []
						# 现申请单字表字段
						d_subtable_fields = []

						# 赋值对应的字段
						column_list = []

						
						# 分发后申请单的 子表值
						d_table_values = []

						# 查看原申请单是否有对应的子表
						if o_ins?.form_version == o_ins_form?.current?._id
							o_ins_fields = o_ins_form?.current?.fields
							o_ins_fields.forEach (o_ins_field)->
								if o_ins_field?.type == 'table' && o_ins_field?.code == o_table
									o_subtable_fields = o_ins_field?.fields
						else
							if o_ins_form?.historys?.length > 0
								o_ins_form.historys.forEach (oh)->
									if o_ins?.form_version == oh._id
										o_ins_fields = oh?.fields
										o_ins_fields.forEach (o_ins_field)->
											if o_ins_field?.type == 'table' && o_ins_field?.code == o_table
												o_subtable_fields = o_ins_field?.fields
						
						# 查看分发的申请单是否有对应的字表
						if d_ins?.form_version == d_ins_form?.current?._id
							d_ins_fields = d_ins_form?.current?.fields
							d_ins_fields.forEach (d_ins_field)->
								if((d_ins_field?.type == 'table' && d_ins_field?.code == d_table)||(a_table && d_ins_field?.type == 'table' && d_ins_field?.code == a_table))
									d_subtable_fields = d_subtable_fields.concat d_ins_field?.fields
						else
							if d_ins_form?.historys?.length > 0
								d_ins_form.historys.forEach (dh)->
									if d_ins?.form_version == dh._id
										d_ins_fields = dh?.fields
										d_ins_fields.forEach (d_ins_field)->
											if((d_ins_field?.type == 'table' && d_ins_field?.code == d_table)||(a_table && d_ins_field?.type == 'table' && d_ins_field?.code == a_table))
												d_subtable_fields = d_subtable_fields.concat d_ins_field?.fields
						

						

						if o_subtable_fields.length == 0
							console.log "o_subtable_fields",o_subtable_fields
							throw new Meteor.Error('forward table refill error!', '原申请单无对应子表');
						
						if d_subtable_fields.length == 0
							throw new Meteor.Error('forward table refill error!', '分发的申请单无对应子表');

						d_table_values = d_ins?.values[d_table] || []

						
						if a_table
							a_table_values =  d_ins?.values[a_table] || []
							if a_table_values && a_table_values?.length==d_table_values?.length
								a_table_values.forEach (a_row,index)->
									d_table_values[index][key] = value for key,value of a_row

						if d_table_values.length == 0
							throw new Meteor.Error('forward table refill error!', '分发的申请单子表数据为空');
						
						o_match_col_fields = o_subtable_fields.filter((m)->return m.code==o_match_col)
						d_match_col_fields = d_subtable_fields.filter((m)->return m.code==d_match_col)

						# 匹配列判断
						if o_match_col_fields.length == 0
							throw new Meteor.Error('forward table refill error!', '原申请单子表无对应匹配列');

						if d_match_col_fields.length == 0
							throw new Meteor.Error('forward table refill error!', '分发的申请单子表无对应匹配列');

						# 判断匹配列字段的值类型是否一致
						o_match_col_field = o_match_col_fields[0]
						d_match_col_field = d_match_col_fields[0]

						if o_match_col_field?.type != d_match_col_field?.type
							throw new Meteor.Error('forward table refill error!', '分发的申请单和原申请单子表的匹配列字段不一致');

						# 回填列判断
						columns.forEach (column)->
							cols = column.split('-') || []
							if cols.length == 2
								o_col = cols[0]
								d_col = cols[1]
								o_col_fields = o_subtable_fields.filter((m)->return m.code==o_col)
								d_col_fields = d_subtable_fields.filter((m)->return m.code==d_col)

								# 判断是否有对应的回填列
								if o_col_fields.length == 0
									throw new Meteor.Error('forward table refill error!', '原申请单子表无对应回填列');

								if d_col_fields.length == 0
									throw new Meteor.Error('forward table refill error!', '分发的申请单子表无对应回填列');

								# 判断匹配列字段的值类型是否一致
								if o_col_fields?.type != d_col_fields?.type
									throw new Meteor.Error('forward table refill error!', '回填列字段类型不一致');
								
								col = {
									o_col: o_col,
									d_col: d_col
								}
								column_list.push col

							else
								throw new Meteor.Error('forward table refill error!', '回填列不匹配');
						
						# 赋值
						# console.log  '======column_list=======',column_list

						traces = o_ins?.traces

						# 原申请单的 step 
						trace = traces[traces.length-1]

						# 原申请单的当前步骤
						approve = trace?.approves[0]

						# 元申请单的当前 value 的 子表
						table_data = approve?.values[o_table] || []


						# 根据 column_list 赋值对应字段进行赋值
						# 循环分发申请单的每行
						d_table_values.forEach (d_row)->
							# console.log "d_row",d_row
							# 查找匹配的列是否与当前的匹配列一致
							has_obj = false
							count = -1
							
							# 看原子表是否有该匹配列
							table_data.forEach (o_row, index)->
								# console.log "o_row", o_row
								# console.log "index",index
								# console.log "o_row[o_match_col]",o_row[o_match_col]
								# console.log "d_row[d_match_col]",d_row[d_match_col]
								# console.log "o_row[o_match_col] == d_row[d_match_col]",o_row[o_match_col] == d_row[d_match_col]

								if o_row[o_match_col] == d_row[d_match_col]
									has_obj = true
									count = index

							# 原申请单的匹配字段有值
							# console.log "has_obj",has_obj
							if has_obj==true
								column_list.forEach (col)->
									table_data[count][col?.o_col] = d_row[col?.d_col]
							
							else
								row_data = {}
								row_data[o_match_col] = d_row[d_match_col]
								column_list.forEach (col)->
									row_data[col?.o_col] = d_row[col?.d_col]
								table_data.push row_data

						
						traces[traces.length-1].approves[0].values = o_ins?.values
						traces[traces.length-1].approves[0].values[o_table] = table_data

						db.instances.update(o_ins_id,{
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
						return
					else
						throw new Meteor.Error('forward table refill error!', 'webhook未配置子表回填列字段 columns 值');
				else
					throw new Meteor.Error('forward table refill error!', 'webhook未配置匹配列字段 oMatchCol 值');
			else
				throw new Meteor.Error('forward table refill error!', 'webhook未配置原表单子表 oTable 值');
		else
			throw new Meteor.Error('forward table refill error!', '申请单未结束');
	catch e
		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				errors: [e]
			}
		}
)