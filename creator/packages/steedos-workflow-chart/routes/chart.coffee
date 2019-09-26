FlowversionAPI =

	traceMaxApproveCount: 10
	traceSplitApprovesIndex: 5
	isExpandApprove: false

	writeResponse: (res, httpCode, body)->
		res.statusCode = httpCode;
		res.end(body);
		
	sendInvalidURLResponse: (res)->
		return @writeResponse(res, 404, "url must has querys as instance_id.");
		
	sendAuthTokenExpiredResponse: (res)->
		return @writeResponse(res, 401, "the auth_token has expired.");

	replaceErrorSymbol: (str)->
		return str.replace(/\"/g,"&quot;").replace(/\n/g,"<br/>")

	getStepHandlerName: (step)->
		switch step.deal_type
			when 'specifyUser'
				approverNames = step.approver_users.map (userId)->
					user = db.users.findOne(userId)
					if user
						return user.name
					else
						return ""
				stepHandlerName = approverNames.join(",")
			when 'applicantRole'
				approverNames = step.approver_roles.map (roleId)->
					role = db.flow_roles.findOne(roleId)
					if role
						return role.name
					else
						return ""
				stepHandlerName = approverNames.join(",")
			else
				stepHandlerName = ''
				break
		return stepHandlerName

	getStepName: (stepName, stepHandlerName)->
		# 返回step节点名称
		if stepName
			stepName = "<div class='graph-node'>
				<div class='step-name'>#{stepName}</div>
				<div class='step-handler-name'>#{stepHandlerName}</div>
			</div>"
			# 把特殊字符清空或替换，以避免mermaidAPI出现异常
			stepName = FlowversionAPI.replaceErrorSymbol(stepName)
		else
			stepName = ""
		return stepName

	generateStepsGraphSyntax: (steps, currentStepId, isConvertToString)->
		# 该函数返回以下格式的graph脚本
		# graphSyntax = '''
		# 	graph LR
		# 		A-->B
		# 		A-->C
		# 		B-->C
		# 		C-->A
		# 		D-->C
		# 	'''
		nodes = ["graph TB"]
		steps.forEach (step)->
			lines = step.lines
			if lines?.length
				lines.forEach (line)->
					if step.name
						# 标记条件节点
						if step.step_type == "condition"
							nodes.push "	class #{step._id} condition;"
						stepHandlerName = FlowversionAPI.getStepHandlerName(step)
						stepName = FlowversionAPI.getStepName(step.name, stepHandlerName)
					else
						stepName = ""
					toStepName = steps.findPropertyByPK("_id",line.to_step).name
					toStepName = FlowversionAPI.getStepName(toStepName, "")
					nodes.push "	#{step._id}(\"#{stepName}\")-->#{line.to_step}(\"#{toStepName}\")"

		if currentStepId
			nodes.push "	class #{currentStepId} current-step-node;"
		if isConvertToString
			graphSyntax = nodes.join "\n"
			return graphSyntax
		else
			return nodes

	getApproveJudgeText: (judge)->
		locale = "zh-CN"
		switch judge
			when 'approved'
				# 已核准
				judgeText = TAPi18n.__('Instance State approved', {}, locale)
			when 'rejected'
				# 已驳回
				judgeText = TAPi18n.__('Instance State rejected', {}, locale)
			when 'terminated'
				# 已取消
				judgeText = TAPi18n.__('Instance State terminated', {}, locale)
			when 'reassigned'
				# 转签核
				judgeText = TAPi18n.__('Instance State reassigned', {}, locale)
			when 'relocated'
				# 重定位
				judgeText = TAPi18n.__('Instance State relocated', {}, locale)
			when 'retrieved'
				# 已取回
				judgeText = TAPi18n.__('Instance State retrieved', {}, locale)
			when 'returned'
				# 已退回
				judgeText = TAPi18n.__('Instance State returned', {}, locale)
			when 'readed'
				# 已阅
				judgeText = TAPi18n.__('Instance State readed', {}, locale)
			else
				judgeText = ''
				break
		return judgeText

	getTraceName: (traceName, approveHandlerName)->
		# 返回trace节点名称
		if traceName
			# 把特殊字符清空或替换，以避免mermaidAPI出现异常
			traceName = "<div class='graph-node'>
				<div class='trace-name'>#{traceName}</div>
				<div class='trace-handler-name'>#{approveHandlerName}</div>
			</div>"
			traceName = FlowversionAPI.replaceErrorSymbol(traceName)
		else
			traceName = ""
		return traceName
	
	getTraceFromApproveCountersWithType: (trace)->
		# 该函数生成json结构，表现出所有传阅、分发、转发节点有有后续子节点的计数情况，其结构为：
		# counters = {
		# 	[fromApproveId(来源节点ID)]:{
		# 		[toApproveType(目标结点类型)]:目标节点在指定类型下的后续节点个数
		# 	}
		# }
		counters = {}
		approves = trace.approves
		unless approves
			return null
		approves.forEach (approve)->
			if approve.from_approve_id
				unless counters[approve.from_approve_id]
					counters[approve.from_approve_id] = {}
				if counters[approve.from_approve_id][approve.type]
					counters[approve.from_approve_id][approve.type]++
				else
					counters[approve.from_approve_id][approve.type] = 1
		return counters

	getTraceCountersWithType: (trace, traceFromApproveCounters)->
		# 该函数生成json结构，表现出所有传阅、分发、转发的节点流向，其结构为：
		# counters = {
		# 	[fromApproveId(来源节点ID)]:{
		# 		[toApproveType(目标结点类型)]:[{
		# 			from_type: 来源节点类型
		# 			from_approve_handler_name: 来源节点处理人
		# 			to_approve_id: 目标节点ID
		# 			to_approve_handler_names: [多个目标节点汇总处理人集合]
		# 			is_total: true/false，是否汇总节点
		# 		},...]
		# 	}
		# }
		# 上述目标结点内容中有一个属性is_total表示是否汇总节点，如果是，则把多个节点汇总合并成一个，
		# 但是本身有后续子节点的节点不参与汇总及计数。
		counters = {}
		approves = trace.approves
		unless approves
			return null
		traceMaxApproveCount = FlowversionAPI.traceMaxApproveCount
		isExpandApprove = FlowversionAPI.isExpandApprove

		approves.forEach (toApprove)->
			toApproveType = toApprove.type
			toApproveFromId = toApprove.from_approve_id
			toApproveHandlerName = toApprove.handler_name
			unless toApproveFromId
				return
			approves.forEach (fromApprove)->
				if fromApprove._id == toApproveFromId
					counter = counters[toApproveFromId]
					unless counter
						counter = counters[toApproveFromId] = {}
					unless counter[toApprove.type]
						counter[toApprove.type] = []
					counter2 = counter[toApprove.type]
					if traceFromApproveCounters[toApprove._id]?[toApproveType]
						# 有后续子节点，则不参与汇总及计数
						counter2.push
							from_type: fromApprove.type
							from_approve_handler_name: fromApprove.handler_name
							to_approve_id: toApprove._id
							to_approve_handler_name: toApprove.handler_name

					else
						counterContent = if isExpandApprove then null else counter2.findPropertyByPK("is_total", true)
						# counterContent = counter2.findPropertyByPK("is_total", true)
						# 如果强制要求展开所有节点，则不做汇总处理
						if counterContent
							counterContent.count++
							unless counterContent.count > traceMaxApproveCount
								counterContent.to_approve_handler_names.push toApprove.handler_name
						else
							counter2.push
								from_type: fromApprove.type
								from_approve_handler_name: fromApprove.handler_name
								to_approve_id: toApprove._id
								count: 1
								to_approve_handler_names: [toApprove.handler_name]
								is_total: true

		return counters

	pushApprovesWithTypeGraphSyntax: (nodes, trace)->
		traceFromApproveCounters = FlowversionAPI.getTraceFromApproveCountersWithType trace
		traceCounters = FlowversionAPI.getTraceCountersWithType trace, traceFromApproveCounters
		unless traceCounters
			return
		extraHandlerNamesCounter = {} #记录需要额外生成所有处理人姓名的被传阅、分发、转发节点
		traceMaxApproveCount = FlowversionAPI.traceMaxApproveCount
		splitIndex = FlowversionAPI.traceSplitApprovesIndex
		currentTraceName = trace.name
		for fromApproveId,fromApprove of traceCounters
			for toApproveType,toApproves of fromApprove
				toApproves.forEach (toApprove)->
					typeName = ""
					switch toApproveType
						when 'cc'
							typeName = "传阅"
						when 'forward'
							typeName = "转发"
						when 'distribute'
							typeName = "分发"
					isTypeNode = ["cc","forward","distribute"].indexOf(toApprove.from_type) >= 0
					if isTypeNode
						traceName = toApprove.from_approve_handler_name
					else
						traceName = FlowversionAPI.getTraceName currentTraceName, toApprove.from_approve_handler_name
					if toApprove.is_total
						toHandlerNames = toApprove.to_approve_handler_names
						if splitIndex and toApprove.count > splitIndex
							# 在姓名集合中插入回车符号换行
							toHandlerNames.splice(splitIndex,0,"<br/>,")
						strToHandlerNames = toHandlerNames.join(",").replace(",,","")
						extraCount = toApprove.count - traceMaxApproveCount
						if extraCount > 0
							strToHandlerNames += "等#{toApprove.count}人"
							unless extraHandlerNamesCounter[fromApproveId]
								extraHandlerNamesCounter[fromApproveId] = {}
							extraHandlerNamesCounter[fromApproveId][toApproveType] = toApprove.to_approve_id
					else
						strToHandlerNames = toApprove.to_approve_handler_name
					if isTypeNode
						nodes.push "	#{fromApproveId}>\"#{traceName}\"]--#{typeName}-->#{toApprove.to_approve_id}>\"#{strToHandlerNames}\"]"
					else
						nodes.push "	#{fromApproveId}(\"#{traceName}\")--#{typeName}-->#{toApprove.to_approve_id}>\"#{strToHandlerNames}\"]"

		# 为需要额外生成所有处理人姓名的被传阅、分发、转发节点，增加鼠标弹出详细层事件
		# extraHandlerNamesCounter的结构为：
		# counters = {
		# 	[fromApproveId(来源节点ID)]:{
		# 		[toApproveType(目标结点类型)]:目标结点ID
		# 	}
		# }
		approves = trace.approves
		unless _.isEmpty(extraHandlerNamesCounter)
			for fromApproveId,fromApprove of extraHandlerNamesCounter
				for toApproveType,toApproveId of fromApprove
					tempHandlerNames = []
					approves.forEach (approve)->
						if fromApproveId == approve.from_approve_id
							unless traceFromApproveCounters[approve._id]?[toApproveType]
								# 有后续子节点，则不参与汇总及计数
								tempHandlerNames.push approve.handler_name
					nodes.push "	click #{toApproveId} callback \"#{tempHandlerNames.join(",")}\""

	generateTracesGraphSyntax: (traces, isConvertToString)->
		# 该函数返回以下格式的graph脚本
		# graphSyntax = '''
		# 	graph LR
		# 		A-->B
		# 		A-->C
		# 		B-->C
		# 		C-->A
		# 		D-->C
		# 	'''
		nodes = ["graph LR"]
		lastTrace = null
		lastApproves = []
		traces.forEach (trace)->
			lines = trace.previous_trace_ids
			currentTraceName = trace.name
			if lines?.length
				lines.forEach (line)->
					fromTrace = traces.findPropertyByPK("_id",line)
					currentFromTraceName = fromTrace.name
					fromApproves = fromTrace.approves
					toApproves = trace.approves
					lastTrace = trace
					lastApproves = toApproves
					fromApproves.forEach (fromApprove)->
						fromApproveHandlerName = fromApprove.handler_name
						if toApproves?.length
							toApproves.forEach (toApprove)->
								if ["cc","forward","distribute"].indexOf(toApprove.type) < 0
									if ["cc","forward","distribute"].indexOf(fromApprove.type) < 0
										fromTraceName = FlowversionAPI.getTraceName currentFromTraceName, fromApproveHandlerName
										toTraceName = FlowversionAPI.getTraceName currentTraceName, toApprove.handler_name
										# 不是传阅、分发、转发，则连接到下一个trace
										judgeText = FlowversionAPI.getApproveJudgeText fromApprove.judge
										if judgeText
											nodes.push "	#{fromApprove._id}(\"#{fromTraceName}\")--#{judgeText}-->#{toApprove._id}(\"#{toTraceName}\")"
										else
											nodes.push "	#{fromApprove._id}(\"#{fromTraceName}\")-->#{toApprove._id}(\"#{toTraceName}\")"
						else
							# 最后一个步骤的trace
							if ["cc","forward","distribute"].indexOf(fromApprove.type) < 0
								fromTraceName = FlowversionAPI.getTraceName currentFromTraceName, fromApproveHandlerName
								toTraceName = FlowversionAPI.replaceErrorSymbol(currentTraceName)
								# 不是传阅、分发、转发，则连接到下一个trace
								judgeText = FlowversionAPI.getApproveJudgeText fromApprove.judge
								if judgeText
									nodes.push "	#{fromApprove._id}(\"#{fromTraceName}\")--#{judgeText}-->#{trace._id}(\"#{toTraceName}\")"
								else
									nodes.push "	#{fromApprove._id}(\"#{fromTraceName}\")-->#{trace._id}(\"#{toTraceName}\")"
			else
				# 第一个trace，因traces可能只有一个，这时需要单独显示出来
				trace.approves.forEach (approve)->
					traceName = FlowversionAPI.getTraceName currentTraceName, approve.handler_name
					nodes.push "	#{approve._id}(\"#{traceName}\")"

			FlowversionAPI.pushApprovesWithTypeGraphSyntax nodes, trace

		# 签批历程中最后的approves高亮显示，结束步骤的trace中是没有approves的，所以结束步骤不高亮显示
		lastApproves?.forEach (lastApprove)->
			nodes.push "	class #{lastApprove._id} current-step-node;"

		if isConvertToString
			graphSyntax = nodes.join "\n"
			return graphSyntax
		else
			return nodes

	sendHtmlResponse: (req, res, type)->
		query = req.query
		instance_id = query.instance_id

		unless instance_id
			FlowversionAPI.sendInvalidURLResponse res 

		error_msg = ""
		graphSyntax = ""
		FlowversionAPI.isExpandApprove = false
		if type == "traces_expand"
			type = "traces"
			FlowversionAPI.isExpandApprove = true
		switch type
			when 'traces'
				instance = db.instances.findOne instance_id,{fields:{traces: 1}}
				if instance
					traces = instance.traces
					if traces?.length
						graphSyntax = this.generateTracesGraphSyntax traces
					else
						error_msg = "没有找到当前申请单的流程步骤数据"
				else
					error_msg = "当前申请单不存在或已被删除"
			else
				instance = db.instances.findOne instance_id,{fields:{flow_version:1,flow:1,traces: {$slice: -1}}}
				if instance
					currentStepId = instance.traces?[0]?.step
					flowversion = WorkflowManager.getInstanceFlowVersion(instance)
					steps = flowversion?.steps
					if steps?.length
						graphSyntax = this.generateStepsGraphSyntax steps,currentStepId
					else
						error_msg = "没有找到当前申请单的流程步骤数据"
				else
					error_msg = "当前申请单不存在或已被删除"
				break

		return @writeResponse res, 200, """
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
					<title>Workflow Chart</title>
					<link rel="stylesheet" href="/packages/steedos_workflow-chart/assets/mermaid/dist/mermaid.css"/>
					<script type="text/javascript" src="/lib/jquery/jquery-1.11.2.min.js"></script>
					<script type="text/javascript" src="/packages/steedos_workflow-chart/assets/mermaid/dist/mermaid.min.js"></script>
					<style>
						body { 
							font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
							text-align: center;
							background-color: #fff;
						}
						.loading{
							position: absolute;
							left: 0px;
							right: 0px;
							top: 50%;
							z-index: 1100;
							text-align: center;
							margin-top: -30px;
							font-size: 36px;
							color: #dfdfdf;
						}
						.error-msg{
							position: absolute;
							left: 0px;
							right: 0px;
							bottom: 20px;
							z-index: 1100;
							text-align: center;
							font-size: 20px;
							color: #a94442;
						}
						#flow-steps-svg .node rect{
							fill: #ccccff;
							stroke: rgb(144, 144, 255);
    						stroke-width: 2px;
						}
						#flow-steps-svg .node.current-step-node rect{
							fill: #cde498;
							stroke: #13540c;
							stroke-width: 2px;
						}
						#flow-steps-svg .node.condition rect{
							fill: #ececff;
							stroke: rgb(204, 204, 255);
    						stroke-width: 1px;
						}
						#flow-steps-svg .node .trace-handler-name{
							color: #777;
						}
						#flow-steps-svg .node .step-handler-name{
							color: #777;
						}
						div.mermaidTooltip{
							position: fixed!important;
							text-align: left!important;
							padding: 4px!important;
							font-size: 14px!important;
							max-width: 500px!important;
							left: auto!important;
							top: 15px!important;
							right: 15px;
						}
						.btn-zoom{
							background: rgba(0, 0, 0, 0.1);
							border-color: transparent;
							display: inline-block;
							padding: 2px 10px;
							font-size: 26px;
							border-radius: 20px;
							background: #eee;
							color: #777;
							position: fixed;
							bottom: 15px;
							outline: none;
							cursor: pointer;
							z-index: 99999;
							-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;
							line-height: 1.2;
						}
						@media (max-width: 768px) {
							.btn-zoom{
								display:none;
							}
						}
						.btn-zoom:hover{
							background: rgba(0, 0, 0, 0.2);
						}
						.btn-zoom-up{
							left: 15px;
						}
						.btn-zoom-down{
							left: 60px;
							padding: 1px 13px 3px 13px;
						}
					</style>
				</head>
				<body>
					<div class = "loading">Loading...</div>
					<div class = "error-msg">#{error_msg}</div>
					<div class="mermaid"></div>
					<script type="text/javascript">
						mermaid.initialize({
							startOnLoad:false
						});
						$(function(){
							var graphNodes = #{JSON.stringify(graphSyntax)};
							//方便前面可以通过调用mermaid.currentNodes调式，特意增加currentNodes属性。
							mermaid.currentNodes = graphNodes;
							var graphSyntax = graphNodes.join("\\n");
							console.log(graphNodes);
							console.log(graphSyntax);
							console.log("You can access the graph nodes by 'mermaid.currentNodes' in the console of browser.");
							$(".loading").remove();

							var id = "flow-steps-svg";
							var element = $('.mermaid');
							var insertSvg = function(svgCode, bindFunctions) {
								element.html(svgCode);
								if(typeof callback !== 'undefined'){
									callback(id);
								}
								bindFunctions(element[0]);
							};
							mermaid.render(id, graphSyntax, insertSvg, element[0]);

							var zoomSVG = function(zoom){
								var currentWidth = $("svg").width();
								var newWidth = currentWidth * zoom;
								$("svg").css("maxWidth",newWidth + "px").width(newWidth);
							}

							//支持鼠标滚轮缩放画布
							$(window).on("mousewheel",function(event){
								if(event.ctrlKey){
									event.preventDefault();
									var zoom = event.originalEvent.wheelDelta > 0 ? 1.1 : 0.9;
									zoomSVG(zoom);
								}
							});
							$(".btn-zoom").on("click",function(){
								zoomSVG($(this).attr("zoom"));
							});
						});
					</script>
					<a class="btn-zoom btn-zoom-up" zoom=1.1 title="点击放大">+</a>
					<a class="btn-zoom btn-zoom-down" zoom=0.9 title="点击缩小">-</a>
				</body>
			</html>
		"""

JsonRoutes.add 'get', '/api/workflow/chart?instance_id=:instance_id', (req, res, next) ->
	# 流程图
	FlowversionAPI.sendHtmlResponse req, res

JsonRoutes.add 'get', '/api/workflow/chart/traces?instance_id=:instance_id', (req, res, next) ->
	# 汇总签批历程图
	FlowversionAPI.sendHtmlResponse req, res, "traces"

JsonRoutes.add 'get', '/api/workflow/chart/traces_expand?instance_id=:instance_id', (req, res, next) ->
	# 展开所有节点的签批历程图
	FlowversionAPI.sendHtmlResponse req, res, "traces_expand"

