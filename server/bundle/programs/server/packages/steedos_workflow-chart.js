(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var InstanceManager = Package['steedos:workflow'].InstanceManager;
var WorkflowManager_format = Package['steedos:workflow'].WorkflowManager_format;
var Workflow = Package['steedos:workflow'].Workflow;
var SteedosTable = Package['steedos:workflow'].SteedosTable;
var InstanceReadOnlyTemplate = Package['steedos:workflow'].InstanceReadOnlyTemplate;
var TemplateManager = Package['steedos:workflow'].TemplateManager;
var CoreForm = Package['steedos:workflow'].CoreForm;
var InstanceNumberRules = Package['steedos:workflow'].InstanceNumberRules;
var workflowTemplate = Package['steedos:workflow'].workflowTemplate;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_workflow-chart/core.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_workflow-chart/routes/chart.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var FlowversionAPI;
FlowversionAPI = {
  traceMaxApproveCount: 10,
  traceSplitApprovesIndex: 5,
  isExpandApprove: false,
  getAbsoluteUrl: function (url) {
    var rootUrl;
    rootUrl = __meteor_runtime_config__ ? __meteor_runtime_config__.ROOT_URL_PATH_PREFIX : "";

    if (rootUrl) {
      url = rootUrl + url;
    }

    return url;
  },
  writeResponse: function (res, httpCode, body) {
    res.statusCode = httpCode;
    return res.end(body);
  },
  sendInvalidURLResponse: function (res) {
    return this.writeResponse(res, 404, "url must has querys as instance_id.");
  },
  sendAuthTokenExpiredResponse: function (res) {
    return this.writeResponse(res, 401, "the auth_token has expired.");
  },
  replaceErrorSymbol: function (str) {
    return str.replace(/\"/g, "&quot;").replace(/\n/g, "<br/>");
  },
  getStepHandlerName: function (step, insId) {
    var approverNames, e, loginUserId, stepHandlerName, stepId, userIds;

    try {
      stepHandlerName = "";

      if (step.step_type === "condition") {
        return stepHandlerName;
      }

      loginUserId = '';
      stepId = step._id;
      userIds = getHandlersManager.getHandlers(insId, stepId, loginUserId);
      approverNames = userIds.map(function (userId) {
        var user;
        user = db.users.findOne(userId, {
          fields: {
            name: 1
          }
        });

        if (user) {
          return user.name;
        } else {
          return "";
        }
      });
      if(approverNames.length > 3){
        stepHandlerName = approverNames.slice(0,3).join(",") + "...";
      }else{
        stepHandlerName = approverNames.join(",");
      }
      
      return stepHandlerName;
    } catch (error) {
      e = error;
      return "";
    }
  },
  getStepLabel: function (stepName, stepHandlerName) {
    if (stepName) {
      stepName = "<div class='graph-node'> <div class='step-name'>" + stepName + "</div> <div class='step-handler-name'>" + stepHandlerName + "</div> </div>";
      stepName = FlowversionAPI.replaceErrorSymbol(stepName);
    } else {
      stepName = "";
    }

    return stepName;
  },
  getStepName: function (step, cachedStepNames, instance_id) {
    var cachedStepName, stepHandlerName, stepName;
    cachedStepName = cachedStepNames[step._id];

    if (cachedStepName) {
      return cachedStepName;
    }

    stepHandlerName = FlowversionAPI.getStepHandlerName(step, instance_id);
    stepName = FlowversionAPI.getStepLabel(step.name, stepHandlerName);
    cachedStepNames[step._id] = stepName;
    return stepName;
  },
  generateStepsGraphSyntax: function (steps, currentStepId, isConvertToString, direction, instance_id) {
    var cachedStepNames, graphSyntax, nodes;
    nodes = ["graph " + direction];
    cachedStepNames = {};
    steps.forEach(function (step) {
      var lines;
      lines = step.lines;

      if (lines != null ? lines.length : void 0) {
        return lines.forEach(function (line) {
          var stepName, toStep, toStepName;

          if (step.name) {
            if (step.step_type === "condition") {
              nodes.push("	class " + step._id + " condition;");
            }

            stepName = FlowversionAPI.getStepName(step, cachedStepNames, instance_id);
          } else {
            stepName = "";
          }

          toStep = steps.findPropertyByPK("_id", line.to_step);
          toStepName = FlowversionAPI.getStepName(toStep, cachedStepNames, instance_id);
          return nodes.push("	" + step._id + "(\"" + stepName + "\")-->" + line.to_step + "(\"" + toStepName + "\")");
        });
      }
    });

    if (currentStepId) {
      nodes.push("	class " + currentStepId + " current-step-node;");
    }

    if (isConvertToString) {
      graphSyntax = nodes.join("\n");
      return graphSyntax;
    } else {
      return nodes;
    }
  },
  getApproveJudgeText: function (judge) {
    var judgeText, locale;
    locale = "zh-CN";

    switch (judge) {
      case 'approved':
        judgeText = TAPi18n.__('Instance State approved', {}, locale);
        break;

      case 'rejected':
        judgeText = TAPi18n.__('Instance State rejected', {}, locale);
        break;

      case 'terminated':
        judgeText = TAPi18n.__('Instance State terminated', {}, locale);
        break;

      case 'reassigned':
        judgeText = TAPi18n.__('Instance State reassigned', {}, locale);
        break;

      case 'relocated':
        judgeText = TAPi18n.__('Instance State relocated', {}, locale);
        break;

      case 'retrieved':
        judgeText = TAPi18n.__('Instance State retrieved', {}, locale);
        break;

      case 'returned':
        judgeText = TAPi18n.__('Instance State returned', {}, locale);
        break;

      case 'readed':
        judgeText = TAPi18n.__('Instance State readed', {}, locale);
        break;

      default:
        judgeText = '';
        break;
    }

    return judgeText;
  },
  getTraceName: function (traceName, approveHandlerName) {
    if (traceName) {
      traceName = "<div class='graph-node'> <div class='trace-name'>" + traceName + "</div> <div class='trace-handler-name'>" + approveHandlerName + "</div> </div>";
      traceName = FlowversionAPI.replaceErrorSymbol(traceName);
    } else {
      traceName = "";
    }

    return traceName;
  },
  getTraceFromApproveCountersWithType: function (trace) {
    var approves, counters;
    counters = {};
    approves = trace.approves;

    if (!approves) {
      return null;
    }

    approves.forEach(function (approve) {
      if (approve.from_approve_id) {
        if (!counters[approve.from_approve_id]) {
          counters[approve.from_approve_id] = {};
        }

        if (counters[approve.from_approve_id][approve.type]) {
          return counters[approve.from_approve_id][approve.type]++;
        } else {
          return counters[approve.from_approve_id][approve.type] = 1;
        }
      }
    });
    return counters;
  },
  getTraceCountersWithType: function (trace, traceFromApproveCounters) {
    var approves, counters, isExpandApprove, traceMaxApproveCount;
    counters = {};
    approves = trace.approves;

    if (!approves) {
      return null;
    }

    traceMaxApproveCount = FlowversionAPI.traceMaxApproveCount;
    isExpandApprove = FlowversionAPI.isExpandApprove;
    approves.forEach(function (toApprove) {
      var toApproveFromId, toApproveHandlerName, toApproveType;
      toApproveType = toApprove.type;
      toApproveFromId = toApprove.from_approve_id;
      toApproveHandlerName = toApprove.handler_name;

      if (!toApproveFromId) {
        return;
      }

      return approves.forEach(function (fromApprove) {
        var counter, counter2, counterContent, ref;

        if (fromApprove._id === toApproveFromId) {
          counter = counters[toApproveFromId];

          if (!counter) {
            counter = counters[toApproveFromId] = {};
          }

          if (!counter[toApprove.type]) {
            counter[toApprove.type] = [];
          }

          counter2 = counter[toApprove.type];

          if ((ref = traceFromApproveCounters[toApprove._id]) != null ? ref[toApproveType] : void 0) {
            return counter2.push({
              from_type: fromApprove.type,
              from_approve_handler_name: fromApprove.handler_name,
              to_approve_id: toApprove._id,
              to_approve_handler_name: toApprove.handler_name
            });
          } else {
            counterContent = isExpandApprove ? null : counter2.findPropertyByPK("is_total", true);

            if (counterContent) {
              counterContent.count++;

              if (!(counterContent.count > traceMaxApproveCount)) {
                return counterContent.to_approve_handler_names.push(toApprove.handler_name);
              }
            } else {
              return counter2.push({
                from_type: fromApprove.type,
                from_approve_handler_name: fromApprove.handler_name,
                to_approve_id: toApprove._id,
                count: 1,
                to_approve_handler_names: [toApprove.handler_name],
                is_total: true
              });
            }
          }
        }
      });
    });
    return counters;
  },
  pushApprovesWithTypeGraphSyntax: function (nodes, trace) {
    var approves, currentTraceName, extraHandlerNamesCounter, fromApprove, fromApproveId, results, splitIndex, tempHandlerNames, toApproveId, toApproveType, toApproves, traceCounters, traceFromApproveCounters, traceMaxApproveCount;
    traceFromApproveCounters = FlowversionAPI.getTraceFromApproveCountersWithType(trace);
    traceCounters = FlowversionAPI.getTraceCountersWithType(trace, traceFromApproveCounters);

    if (!traceCounters) {
      return;
    }

    extraHandlerNamesCounter = {};
    traceMaxApproveCount = FlowversionAPI.traceMaxApproveCount;
    splitIndex = FlowversionAPI.traceSplitApprovesIndex;
    currentTraceName = trace.name;

    for (fromApproveId in meteorBabelHelpers.sanitizeForInObject(traceCounters)) {
      fromApprove = traceCounters[fromApproveId];

      for (toApproveType in meteorBabelHelpers.sanitizeForInObject(fromApprove)) {
        toApproves = fromApprove[toApproveType];
        toApproves.forEach(function (toApprove) {
          var extraCount, isTypeNode, strToHandlerNames, toHandlerNames, traceName, typeName;
          typeName = "";

          switch (toApproveType) {
            case 'cc':
              typeName = "传阅";
              break;

            case 'forward':
              typeName = "转发";
              break;

            case 'distribute':
              typeName = "分发";
          }

          isTypeNode = ["cc", "forward", "distribute"].indexOf(toApprove.from_type) >= 0;

          if (isTypeNode) {
            traceName = toApprove.from_approve_handler_name;
          } else {
            traceName = FlowversionAPI.getTraceName(currentTraceName, toApprove.from_approve_handler_name);
          }

          if (toApprove.is_total) {
            toHandlerNames = toApprove.to_approve_handler_names;

            if (splitIndex && toApprove.count > splitIndex) {
              toHandlerNames.splice(splitIndex, 0, "<br/>,");
            }

            strToHandlerNames = toHandlerNames.join(",").replace(",,", "");
            extraCount = toApprove.count - traceMaxApproveCount;

            if (extraCount > 0) {
              strToHandlerNames += "等" + toApprove.count + "人";

              if (!extraHandlerNamesCounter[fromApproveId]) {
                extraHandlerNamesCounter[fromApproveId] = {};
              }

              extraHandlerNamesCounter[fromApproveId][toApproveType] = toApprove.to_approve_id;
            }
          } else {
            strToHandlerNames = toApprove.to_approve_handler_name;
          }

          if (isTypeNode) {
            return nodes.push("	" + fromApproveId + ">\"" + traceName + "\"]--" + typeName + "-->" + toApprove.to_approve_id + ">\"" + strToHandlerNames + "\"]");
          } else {
            return nodes.push("	" + fromApproveId + "(\"" + traceName + "\")--" + typeName + "-->" + toApprove.to_approve_id + ">\"" + strToHandlerNames + "\"]");
          }
        });
      }
    }

    approves = trace.approves;

    if (!_.isEmpty(extraHandlerNamesCounter)) {
      results = [];

      for (fromApproveId in meteorBabelHelpers.sanitizeForInObject(extraHandlerNamesCounter)) {
        fromApprove = extraHandlerNamesCounter[fromApproveId];
        results.push(function () {
          var results1;
          results1 = [];

          for (toApproveType in meteorBabelHelpers.sanitizeForInObject(fromApprove)) {
            toApproveId = fromApprove[toApproveType];
            tempHandlerNames = [];
            approves.forEach(function (approve) {
              var ref;

              if (fromApproveId === approve.from_approve_id) {
                if (!((ref = traceFromApproveCounters[approve._id]) != null ? ref[toApproveType] : void 0)) {
                  return tempHandlerNames.push(approve.handler_name);
                }
              }
            });
            results1.push(nodes.push("	click " + toApproveId + " callback \"" + tempHandlerNames.join(",") + "\""));
          }

          return results1;
        }());
      }

      return results;
    }
  },
  generateTracesGraphSyntax: function (traces, isConvertToString, direction) {
    var graphSyntax, lastApproves, lastTrace, nodes;
    nodes = ["graph " + direction];
    lastTrace = null;
    lastApproves = [];
    traces.forEach(function (trace) {
      var currentTraceName, lines;
      lines = trace.previous_trace_ids;
      currentTraceName = trace.name;

      if (lines != null ? lines.length : void 0) {
        lines.forEach(function (line) {
          var currentFromTraceName, fromApproves, fromTrace, toApproves;
          fromTrace = traces.findPropertyByPK("_id", line);
          currentFromTraceName = fromTrace.name;
          fromApproves = fromTrace.approves;
          toApproves = trace.approves;
          lastTrace = trace;
          lastApproves = toApproves;
          return fromApproves.forEach(function (fromApprove) {
            var fromApproveHandlerName, fromTraceName, judgeText, toTraceName;
            fromApproveHandlerName = fromApprove.handler_name;

            if (toApproves != null ? toApproves.length : void 0) {
              return toApproves.forEach(function (toApprove) {
                var fromTraceName, judgeText, toTraceName;

                if (["cc", "forward", "distribute"].indexOf(toApprove.type) < 0) {
                  if (["cc", "forward", "distribute"].indexOf(fromApprove.type) < 0) {
                    fromTraceName = FlowversionAPI.getTraceName(currentFromTraceName, fromApproveHandlerName);
                    toTraceName = FlowversionAPI.getTraceName(currentTraceName, toApprove.handler_name);
                    judgeText = FlowversionAPI.getApproveJudgeText(fromApprove.judge);

                    if (judgeText) {
                      return nodes.push("	" + fromApprove._id + "(\"" + fromTraceName + "\")--" + judgeText + "-->" + toApprove._id + "(\"" + toTraceName + "\")");
                    } else {
                      return nodes.push("	" + fromApprove._id + "(\"" + fromTraceName + "\")-->" + toApprove._id + "(\"" + toTraceName + "\")");
                    }
                  }
                }
              });
            } else {
              if (["cc", "forward", "distribute"].indexOf(fromApprove.type) < 0) {
                fromTraceName = FlowversionAPI.getTraceName(currentFromTraceName, fromApproveHandlerName);
                toTraceName = FlowversionAPI.replaceErrorSymbol(currentTraceName);
                judgeText = FlowversionAPI.getApproveJudgeText(fromApprove.judge);

                if (judgeText) {
                  return nodes.push("	" + fromApprove._id + "(\"" + fromTraceName + "\")--" + judgeText + "-->" + trace._id + "(\"" + toTraceName + "\")");
                } else {
                  return nodes.push("	" + fromApprove._id + "(\"" + fromTraceName + "\")-->" + trace._id + "(\"" + toTraceName + "\")");
                }
              }
            }
          });
        });
      } else {
        trace.approves.forEach(function (approve) {
          var traceName;
          traceName = FlowversionAPI.getTraceName(currentTraceName, approve.handler_name);
          return nodes.push("	" + approve._id + "(\"" + traceName + "\")");
        });
      }

      return FlowversionAPI.pushApprovesWithTypeGraphSyntax(nodes, trace);
    });

    if (lastApproves != null) {
      lastApproves.forEach(function (lastApprove) {
        return nodes.push("	class " + lastApprove._id + " current-step-node;");
      });
    }

    if (isConvertToString) {
      graphSyntax = nodes.join("\n");
      return graphSyntax;
    } else {
      return nodes;
    }
  },
  sendHtmlResponse: function (req, res, type) {
    var allowDirections, currentStepId, direction, error_msg, flowversion, graphSyntax, instance, instance_id, query, ref, ref1, steps, title, traces;
    query = req.query;
    instance_id = query.instance_id;
    direction = query.direction || 'TD';
    allowDirections = ['TB', 'BT', 'RL', 'LR', 'TD'];

    if (!_.include(allowDirections, direction)) {
      return this.writeResponse(res, 500, "Invalid direction. The value of direction should be in ['TB', 'BT', 'RL', 'LR', 'TD']");
    }

    if (!instance_id) {
      FlowversionAPI.sendInvalidURLResponse(res);
    }

    title = query.title;

    if (title) {
      title = decodeURIComponent(decodeURIComponent(title));
    } else {
      title = "Workflow Chart";
    }

    error_msg = "";
    graphSyntax = "";
    FlowversionAPI.isExpandApprove = false;

    if (type === "traces_expand") {
      type = "traces";
      FlowversionAPI.isExpandApprove = true;
    }

    switch (type) {
      case 'traces':
        instance = db.instances.findOne(instance_id, {
          fields: {
            traces: 1
          }
        });

        if (instance) {
          traces = instance.traces;

          if (traces != null ? traces.length : void 0) {
            graphSyntax = this.generateTracesGraphSyntax(traces, false, direction);
          } else {
            error_msg = "没有找到当前申请单的流程步骤数据";
          }
        } else {
          error_msg = "当前申请单不存在或已被删除";
        }

        break;

      default:
        instance = db.instances.findOne(instance_id, {
          fields: {
            flow_version: 1,
            flow: 1,
            traces: {
              $slice: -1
            }
          }
        });

        if (instance) {
          currentStepId = (ref = instance.traces) != null ? (ref1 = ref[0]) != null ? ref1.step : void 0 : void 0;
          flowversion = WorkflowManager.getInstanceFlowVersion(instance);
          steps = flowversion != null ? flowversion.steps : void 0;

          if (steps != null ? steps.length : void 0) {
            graphSyntax = this.generateStepsGraphSyntax(steps, currentStepId, false, direction, instance_id);
          } else {
            error_msg = "没有找到当前申请单的流程步骤数据";
          }
        } else {
          error_msg = "当前申请单不存在或已被删除";
        }

        break;
    }

    res.setHeader('Content-Type', 'text/html');
    return this.writeResponse(res, 200, "<!DOCTYPE html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,user-scalable=yes\">\n		<title>" + title + "</title>\n		<meta name=\"mobile-web-app-capable\" content=\"yes\">\n		<meta name=\"theme-color\" content=\"#000\">\n		<meta name=\"application-name\">\n		<script type=\"text/javascript\" src=\"/unpkg.com/jquery@1.11.2/dist/jquery.min.js\"></script>\n		<script type=\"text/javascript\" src=\"/unpkg.com/mermaid@9.1.2/dist/mermaid.min.js\"></script>\n		<style>\n			body { \n				font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n				text-align: center;\n				background-color: #fff;\n			}\n			.loading{\n				position: absolute;\n				left: 0px;\n				right: 0px;\n				top: 50%;\n				z-index: 1100;\n				text-align: center;\n				margin-top: -30px;\n				font-size: 36px;\n				color: #dfdfdf;\n			}\n			.error-msg{\n				position: absolute;\n				left: 0px;\n				right: 0px;\n				bottom: 20px;\n				z-index: 1100;\n				text-align: center;\n				font-size: 20px;\n				color: #a94442;\n			}\n			#flow-steps-svg .node rect{\n				fill: #ccccff;\n				stroke: rgb(144, 144, 255);\n    						stroke-width: 2px;\n			}\n			#flow-steps-svg .node.current-step-node rect{\n				fill: #cde498;\n				stroke: #13540c;\n				stroke-width: 2px;\n			}\n			#flow-steps-svg .node.condition rect{\n				fill: #ececff;\n				stroke: rgb(204, 204, 255);\n    						stroke-width: 1px;\n			}\n			#flow-steps-svg .node .trace-handler-name{\n				color: #777;\n			}\n			#flow-steps-svg .node .step-handler-name{\n				color: #777;\n			}\n			div.mermaidTooltip{\n				position: fixed!important;\n				text-align: left!important;\n				padding: 4px!important;\n				font-size: 14px!important;\n				max-width: 500px!important;\n				left: auto!important;\n				top: 15px!important;\n				right: 15px;\n			}\n			.btn-zoom{\n				background: rgba(0, 0, 0, 0.1);\n				border-color: transparent;\n				display: inline-block;\n				padding: 2px 10px;\n				font-size: 26px;\n				border-radius: 20px;\n				background: #eee;\n				color: #777;\n				position: fixed;\n				bottom: 15px;\n				outline: none;\n				cursor: pointer;\n				z-index: 99999;\n				-webkit-user-select: none;\n				-moz-user-select: none;\n				-ms-user-select: none;\n				user-select: none;\n				line-height: 1.2;\n			}\n			@media (max-width: 768px) {\n				.btn-zoom{\n					display:none;\n				}\n			}\n			.btn-zoom:hover{\n				background: rgba(0, 0, 0, 0.2);\n			}\n			.btn-zoom-up{\n				left: 15px;\n			}\n			.btn-zoom-down{\n				left: 60px;\n				padding: 1px 13px 3px 13px;\n			}\n		</style>\n	</head>\n	<body>\n		<div class = \"loading\">Loading...</div>\n		<div class = \"error-msg\">" + error_msg + "</div>\n		<div class=\"mermaid\"></div>\n		<script type=\"text/javascript\">\n			mermaid.initialize({\n				startOnLoad:false\n			});\n			$(function(){\n				var graphNodes = " + JSON.stringify(graphSyntax) + ";\n				//方便前面可以通过调用mermaid.currentNodes调式，特意增加currentNodes属性。\n				mermaid.currentNodes = graphNodes;\n				var graphSyntax = graphNodes.join(\"\\n\");\n				console.log(graphNodes);\n				console.log(graphSyntax);\n				console.log(\"You can access the graph nodes by 'mermaid.currentNodes' in the console of browser.\");\n				$(\".loading\").remove();\n\n				var id = \"flow-steps-svg\";\n				var element = $('.mermaid');\n				var insertSvg = function(svgCode, bindFunctions) {\n					element.html(svgCode);\n					if(typeof callback !== 'undefined'){\n						callback(id);\n					}\n					bindFunctions(element[0]);\n				};\n				mermaid.render(id, graphSyntax, insertSvg, element[0]);\n\n				var zoomSVG = function(zoom){\n					var currentWidth = $(\"svg\").width();\n					var newWidth = currentWidth * zoom;\n					$(\"svg\").css(\"maxWidth\",newWidth + \"px\").width(newWidth);\n				}\n\n				//支持鼠标滚轮缩放画布\n				$(window).on(\"mousewheel\",function(event){\n					if(event.ctrlKey){\n						event.preventDefault();\n						var zoom = event.originalEvent.wheelDelta > 0 ? 1.1 : 0.9;\n						zoomSVG(zoom);\n					}\n				});\n				$(\".btn-zoom\").on(\"click\",function(){\n					zoomSVG($(this).attr(\"zoom\"));\n				});\n			});\n		</script>\n		<a class=\"btn-zoom btn-zoom-up\" zoom=1.1 title=\"点击放大\">+</a>\n		<a class=\"btn-zoom btn-zoom-down\" zoom=0.9 title=\"点击缩小\">-</a>\n	</body>\n</html>");
  }
};
JsonRoutes.add('get', '/api/workflow/chart?instance_id=:instance_id', function (req, res, next) {
  return FlowversionAPI.sendHtmlResponse(req, res);
});
JsonRoutes.add('get', '/api/workflow/chart/traces?instance_id=:instance_id', function (req, res, next) {
  return FlowversionAPI.sendHtmlResponse(req, res, "traces");
});
JsonRoutes.add('get', '/api/workflow/chart/traces_expand?instance_id=:instance_id', function (req, res, next) {
  return FlowversionAPI.sendHtmlResponse(req, res, "traces_expand");
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:workflow-chart");

})();

//# sourceURL=meteor://💻app/packages/steedos_workflow-chart.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC9yb3V0ZXMvY2hhcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvY2hhcnQuY29mZmVlIl0sIm5hbWVzIjpbIkZsb3d2ZXJzaW9uQVBJIiwidHJhY2VNYXhBcHByb3ZlQ291bnQiLCJ0cmFjZVNwbGl0QXBwcm92ZXNJbmRleCIsImlzRXhwYW5kQXBwcm92ZSIsImdldEFic29sdXRlVXJsIiwidXJsIiwicm9vdFVybCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsIndyaXRlUmVzcG9uc2UiLCJyZXMiLCJodHRwQ29kZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwiZW5kIiwic2VuZEludmFsaWRVUkxSZXNwb25zZSIsInNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2UiLCJyZXBsYWNlRXJyb3JTeW1ib2wiLCJzdHIiLCJyZXBsYWNlIiwiZ2V0U3RlcEhhbmRsZXJOYW1lIiwic3RlcCIsImluc0lkIiwiYXBwcm92ZXJOYW1lcyIsImUiLCJsb2dpblVzZXJJZCIsInN0ZXBIYW5kbGVyTmFtZSIsInN0ZXBJZCIsInVzZXJJZHMiLCJzdGVwX3R5cGUiLCJfaWQiLCJnZXRIYW5kbGVyc01hbmFnZXIiLCJnZXRIYW5kbGVycyIsIm1hcCIsInVzZXJJZCIsInVzZXIiLCJkYiIsInVzZXJzIiwiZmluZE9uZSIsImZpZWxkcyIsIm5hbWUiLCJqb2luIiwiZXJyb3IiLCJnZXRTdGVwTGFiZWwiLCJzdGVwTmFtZSIsImdldFN0ZXBOYW1lIiwiY2FjaGVkU3RlcE5hbWVzIiwiaW5zdGFuY2VfaWQiLCJjYWNoZWRTdGVwTmFtZSIsImdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheCIsInN0ZXBzIiwiY3VycmVudFN0ZXBJZCIsImlzQ29udmVydFRvU3RyaW5nIiwiZGlyZWN0aW9uIiwiZ3JhcGhTeW50YXgiLCJub2RlcyIsImZvckVhY2giLCJsaW5lcyIsImxlbmd0aCIsImxpbmUiLCJ0b1N0ZXAiLCJ0b1N0ZXBOYW1lIiwicHVzaCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJ0b19zdGVwIiwiZ2V0QXBwcm92ZUp1ZGdlVGV4dCIsImp1ZGdlIiwianVkZ2VUZXh0IiwibG9jYWxlIiwiVEFQaTE4biIsIl9fIiwiZ2V0VHJhY2VOYW1lIiwidHJhY2VOYW1lIiwiYXBwcm92ZUhhbmRsZXJOYW1lIiwiZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGUiLCJ0cmFjZSIsImFwcHJvdmVzIiwiY291bnRlcnMiLCJhcHByb3ZlIiwiZnJvbV9hcHByb3ZlX2lkIiwidHlwZSIsImdldFRyYWNlQ291bnRlcnNXaXRoVHlwZSIsInRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyIsInRvQXBwcm92ZSIsInRvQXBwcm92ZUZyb21JZCIsInRvQXBwcm92ZUhhbmRsZXJOYW1lIiwidG9BcHByb3ZlVHlwZSIsImhhbmRsZXJfbmFtZSIsImZyb21BcHByb3ZlIiwiY291bnRlciIsImNvdW50ZXIyIiwiY291bnRlckNvbnRlbnQiLCJyZWYiLCJmcm9tX3R5cGUiLCJmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lIiwidG9fYXBwcm92ZV9pZCIsInRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lIiwiY291bnQiLCJ0b19hcHByb3ZlX2hhbmRsZXJfbmFtZXMiLCJpc190b3RhbCIsInB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXgiLCJjdXJyZW50VHJhY2VOYW1lIiwiZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyIiwiZnJvbUFwcHJvdmVJZCIsInJlc3VsdHMiLCJzcGxpdEluZGV4IiwidGVtcEhhbmRsZXJOYW1lcyIsInRvQXBwcm92ZUlkIiwidG9BcHByb3ZlcyIsInRyYWNlQ291bnRlcnMiLCJleHRyYUNvdW50IiwiaXNUeXBlTm9kZSIsInN0clRvSGFuZGxlck5hbWVzIiwidG9IYW5kbGVyTmFtZXMiLCJ0eXBlTmFtZSIsImluZGV4T2YiLCJzcGxpY2UiLCJfIiwiaXNFbXB0eSIsInJlc3VsdHMxIiwiZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheCIsInRyYWNlcyIsImxhc3RBcHByb3ZlcyIsImxhc3RUcmFjZSIsInByZXZpb3VzX3RyYWNlX2lkcyIsImN1cnJlbnRGcm9tVHJhY2VOYW1lIiwiZnJvbUFwcHJvdmVzIiwiZnJvbVRyYWNlIiwiZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSIsImZyb21UcmFjZU5hbWUiLCJ0b1RyYWNlTmFtZSIsImxhc3RBcHByb3ZlIiwic2VuZEh0bWxSZXNwb25zZSIsInJlcSIsImFsbG93RGlyZWN0aW9ucyIsImVycm9yX21zZyIsImZsb3d2ZXJzaW9uIiwiaW5zdGFuY2UiLCJxdWVyeSIsInJlZjEiLCJ0aXRsZSIsImluY2x1ZGUiLCJkZWNvZGVVUklDb21wb25lbnQiLCJpbnN0YW5jZXMiLCJmbG93X3ZlcnNpb24iLCJmbG93IiwiJHNsaWNlIiwiV29ya2Zsb3dNYW5hZ2VyIiwiZ2V0SW5zdGFuY2VGbG93VmVyc2lvbiIsInNldEhlYWRlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwibmV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxjQUFBO0FBQUFBLGlCQUVDO0FBQUFDLHdCQUFzQixFQUF0QjtBQUNBQywyQkFBeUIsQ0FEekI7QUFFQUMsbUJBQWlCLEtBRmpCO0FBSUFDLGtCQUFnQixVQUFDQyxHQUFEO0FBQ2YsUUFBQUMsT0FBQTtBQUFBQSxjQUFhQyw0QkFBK0JBLDBCQUEwQkMsb0JBQXpELEdBQW1GLEVBQWhHOztBQUNBLFFBQUdGLE9BQUg7QUFDQ0QsWUFBTUMsVUFBVUQsR0FBaEI7QUNFRTs7QURESCxXQUFPQSxHQUFQO0FBUkQ7QUFVQUksaUJBQWUsVUFBQ0MsR0FBRCxFQUFNQyxRQUFOLEVBQWdCQyxJQUFoQjtBQUNkRixRQUFJRyxVQUFKLEdBQWlCRixRQUFqQjtBQ0dFLFdERkZELElB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QWVvSSxnQkFBZixDQUFnQ0MsR0FBaEMsRUFBcUMzSCxHQUFyQyxFQUEwQyxlQUExQyxDQ25IQztBRGlIRixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3dvcmtmbG93LWNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiRmxvd3ZlcnNpb25BUEkgPVxuXG5cdHRyYWNlTWF4QXBwcm92ZUNvdW50OiAxMFxuXHR0cmFjZVNwbGl0QXBwcm92ZXNJbmRleDogNVxuXHRpc0V4cGFuZEFwcHJvdmU6IGZhbHNlXG5cblx0Z2V0QWJzb2x1dGVVcmw6ICh1cmwpLT5cblx0XHRyb290VXJsID0gaWYgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyB0aGVuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggZWxzZSBcIlwiXG5cdFx0aWYgcm9vdFVybFxuXHRcdFx0dXJsID0gcm9vdFVybCArIHVybFxuXHRcdHJldHVybiB1cmw7XG5cblx0d3JpdGVSZXNwb25zZTogKHJlcywgaHR0cENvZGUsIGJvZHkpLT5cblx0XHRyZXMuc3RhdHVzQ29kZSA9IGh0dHBDb2RlO1xuXHRcdHJlcy5lbmQoYm9keSk7XG5cdFx0XG5cdHNlbmRJbnZhbGlkVVJMUmVzcG9uc2U6IChyZXMpLT5cblx0XHRyZXR1cm4gQHdyaXRlUmVzcG9uc2UocmVzLCA0MDQsIFwidXJsIG11c3QgaGFzIHF1ZXJ5cyBhcyBpbnN0YW5jZV9pZC5cIik7XG5cdFx0XG5cdHNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2U6IChyZXMpLT5cblx0XHRyZXR1cm4gQHdyaXRlUmVzcG9uc2UocmVzLCA0MDEsIFwidGhlIGF1dGhfdG9rZW4gaGFzIGV4cGlyZWQuXCIpO1xuXG5cdHJlcGxhY2VFcnJvclN5bWJvbDogKHN0ciktPlxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvXFxcIi9nLFwiJnF1b3Q7XCIpLnJlcGxhY2UoL1xcbi9nLFwiPGJyLz5cIilcblxuXHRnZXRTdGVwSGFuZGxlck5hbWU6IChzdGVwLCBpbnNJZCktPlxuXHRcdHRyeVxuXHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gXCJcIlxuXHRcdFx0aWYgc3RlcC5zdGVwX3R5cGUgPT0gXCJjb25kaXRpb25cIlxuXHRcdFx0XHRyZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cblx0XHRcdCMgVE9ETyDojrflj5blvZPliY3nlKjmiLd1c2VySWRcblx0XHRcdGxvZ2luVXNlcklkID0gJycgXG5cdFx0XHRzdGVwSWQgPSBzdGVwLl9pZFxuXHRcdFx0dXNlcklkcyA9IGdldEhhbmRsZXJzTWFuYWdlci5nZXRIYW5kbGVycyhpbnNJZCwgc3RlcElkLCBsb2dpblVzZXJJZClcblx0XHRcdGFwcHJvdmVyTmFtZXMgPSB1c2VySWRzLm1hcCAodXNlcklkKS0+XG5cdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwgeyBmaWVsZHM6IHsgbmFtZTogMSB9IH0pXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRyZXR1cm4gdXNlci5uYW1lXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gXCJcIlxuXHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0IyBzd2l0Y2ggc3RlcC5kZWFsX3R5cGVcblx0XHQjIFx0d2hlbiAnc3BlY2lmeVVzZXInXG5cdFx0IyBcdFx0YXBwcm92ZXJOYW1lcyA9IHN0ZXAuYXBwcm92ZXJfdXNlcnMubWFwICh1c2VySWQpLT5cblx0XHQjIFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZClcblx0XHQjIFx0XHRcdGlmIHVzZXJcblx0XHQjIFx0XHRcdFx0cmV0dXJuIHVzZXIubmFtZVxuXHRcdCMgXHRcdFx0ZWxzZVxuXHRcdCMgXHRcdFx0XHRyZXR1cm4gXCJcIlxuXHRcdCMgXHRcdHN0ZXBIYW5kbGVyTmFtZSA9IGFwcHJvdmVyTmFtZXMuam9pbihcIixcIilcblx0XHQjIFx0d2hlbiAnYXBwbGljYW50Um9sZSdcblx0XHQjIFx0XHRhcHByb3Zlck5hbWVzID0gc3RlcC5hcHByb3Zlcl9yb2xlcy5tYXAgKHJvbGVJZCktPlxuXHRcdCMgXHRcdFx0cm9sZSA9IGRiLmZsb3dfcm9sZXMuZmluZE9uZShyb2xlSWQpXG5cdFx0IyBcdFx0XHRpZiByb2xlXG5cdFx0IyBcdFx0XHRcdHJldHVybiByb2xlLm5hbWVcblx0XHQjIFx0XHRcdGVsc2Vcblx0XHQjIFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHQjIFx0XHRzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHRzdGVwSGFuZGxlck5hbWUgPSAnJ1xuXHRcdCMgXHRcdGJyZWFrXG5cdFx0IyByZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cblx0Z2V0U3RlcExhYmVsOiAoc3RlcE5hbWUsIHN0ZXBIYW5kbGVyTmFtZSktPlxuXHRcdCMg6L+U5Zuec3N0ZXBOYW1l5LiOc3RlcEhhbmRsZXJOYW1l57uT5ZCI55qE5q2l6aqk5pi+56S65ZCN56ewXG5cdFx0aWYgc3RlcE5hbWVcblx0XHRcdHN0ZXBOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz5cblx0XHRcdFx0PGRpdiBjbGFzcz0nc3RlcC1uYW1lJz4je3N0ZXBOYW1lfTwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPSdzdGVwLWhhbmRsZXItbmFtZSc+I3tzdGVwSGFuZGxlck5hbWV9PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cIlxuXHRcdFx0IyDmiornibnmrorlrZfnrKbmuIXnqbrmiJbmm7/mjaLvvIzku6Xpgb/lhY1tZXJtYWlkQVBJ5Ye6546w5byC5bi4XG5cdFx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChzdGVwTmFtZSlcblx0XHRlbHNlXG5cdFx0XHRzdGVwTmFtZSA9IFwiXCJcblx0XHRyZXR1cm4gc3RlcE5hbWVcblxuXHRnZXRTdGVwTmFtZTogKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpLT5cblx0XHQjIOi/lOWbnnN0ZXDoioLngrnlkI3np7DvvIzkvJjlhYjku47nvJPlrZhjYWNoZWRTdGVwTmFtZXPkuK3lj5bvvIzlkKbliJnosIPnlKhnZXRTdGVwTGFiZWznlJ/miJBcblx0XHRjYWNoZWRTdGVwTmFtZSA9IGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF1cblx0XHRpZiBjYWNoZWRTdGVwTmFtZVxuXHRcdFx0cmV0dXJuIGNhY2hlZFN0ZXBOYW1lXG5cdFx0c3RlcEhhbmRsZXJOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcEhhbmRsZXJOYW1lKHN0ZXAsIGluc3RhbmNlX2lkKVxuXHRcdHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcExhYmVsKHN0ZXAubmFtZSwgc3RlcEhhbmRsZXJOYW1lKVxuXHRcdGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF0gPSBzdGVwTmFtZVxuXHRcdHJldHVybiBzdGVwTmFtZVxuXG5cdGdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheDogKHN0ZXBzLCBjdXJyZW50U3RlcElkLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZCktPlxuXHRcdG5vZGVzID0gW1wiZ3JhcGggI3tkaXJlY3Rpb259XCJdXG5cdFx0Y2FjaGVkU3RlcE5hbWVzID0ge31cblx0XHRzdGVwcy5mb3JFYWNoIChzdGVwKS0+XG5cdFx0XHRsaW5lcyA9IHN0ZXAubGluZXNcblx0XHRcdGlmIGxpbmVzPy5sZW5ndGhcblx0XHRcdFx0bGluZXMuZm9yRWFjaCAobGluZSktPlxuXHRcdFx0XHRcdGlmIHN0ZXAubmFtZVxuXHRcdFx0XHRcdFx0IyDmoIforrDmnaHku7boioLngrlcblx0XHRcdFx0XHRcdGlmIHN0ZXAuc3RlcF90eXBlID09IFwiY29uZGl0aW9uXCJcblx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tzdGVwLl9pZH0gY29uZGl0aW9uO1wiXG5cdFx0XHRcdFx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RlcE5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0dG9TdGVwID0gc3RlcHMuZmluZFByb3BlcnR5QnlQSyhcIl9pZFwiLGxpbmUudG9fc3RlcClcblx0XHRcdFx0XHR0b1N0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcE5hbWUodG9TdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKVxuXHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7c3RlcC5faWR9KFxcXCIje3N0ZXBOYW1lfVxcXCIpLS0+I3tsaW5lLnRvX3N0ZXB9KFxcXCIje3RvU3RlcE5hbWV9XFxcIilcIlxuXG5cdFx0aWYgY3VycmVudFN0ZXBJZFxuXHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tjdXJyZW50U3RlcElkfSBjdXJyZW50LXN0ZXAtbm9kZTtcIlxuXHRcdGlmIGlzQ29udmVydFRvU3RyaW5nXG5cdFx0XHRncmFwaFN5bnRheCA9IG5vZGVzLmpvaW4gXCJcXG5cIlxuXHRcdFx0cmV0dXJuIGdyYXBoU3ludGF4XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5vZGVzXG5cblx0Z2V0QXBwcm92ZUp1ZGdlVGV4dDogKGp1ZGdlKS0+XG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0c3dpdGNoIGp1ZGdlXG5cdFx0XHR3aGVuICdhcHByb3ZlZCdcblx0XHRcdFx0IyDlt7LmoLjlh4Zcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgYXBwcm92ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVqZWN0ZWQnXG5cdFx0XHRcdCMg5bey6amz5ZueXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlamVjdGVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3Rlcm1pbmF0ZWQnXG5cdFx0XHRcdCMg5bey5Y+W5raIXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHRlcm1pbmF0ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVhc3NpZ25lZCdcblx0XHRcdFx0IyDovaznrb7moLhcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhc3NpZ25lZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZWxvY2F0ZWQnXG5cdFx0XHRcdCMg6YeN5a6a5L2NXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlbG9jYXRlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZXRyaWV2ZWQnXG5cdFx0XHRcdCMg5bey5Y+W5ZueXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHJpZXZlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZXR1cm5lZCdcblx0XHRcdFx0IyDlt7LpgIDlm55cblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmV0dXJuZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVhZGVkJ1xuXHRcdFx0XHQjIOW3sumYhVxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWFkZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqdWRnZVRleHQgPSAnJ1xuXHRcdFx0XHRicmVha1xuXHRcdHJldHVybiBqdWRnZVRleHRcblxuXHRnZXRUcmFjZU5hbWU6ICh0cmFjZU5hbWUsIGFwcHJvdmVIYW5kbGVyTmFtZSktPlxuXHRcdCMg6L+U5ZuedHJhY2XoioLngrnlkI3np7Bcblx0XHRpZiB0cmFjZU5hbWVcblx0XHRcdCMg5oqK54m55q6K5a2X56ym5riF56m65oiW5pu/5o2i77yM5Lul6YG/5YWNbWVybWFpZEFQSeWHuueOsOW8guW4uFxuXHRcdFx0dHJhY2VOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz5cblx0XHRcdFx0PGRpdiBjbGFzcz0ndHJhY2UtbmFtZSc+I3t0cmFjZU5hbWV9PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9J3RyYWNlLWhhbmRsZXItbmFtZSc+I3thcHByb3ZlSGFuZGxlck5hbWV9PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cIlxuXHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKHRyYWNlTmFtZSlcblx0XHRlbHNlXG5cdFx0XHR0cmFjZU5hbWUgPSBcIlwiXG5cdFx0cmV0dXJuIHRyYWNlTmFtZVxuXHRcblx0Z2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGU6ICh0cmFjZSktPlxuXHRcdCMg6K+l5Ye95pWw55Sf5oiQanNvbue7k+aehO+8jOihqOeOsOWHuuaJgOacieS8oOmYheOAgeWIhuWPkeOAgei9rOWPkeiKgueCueacieacieWQjue7reWtkOiKgueCueeahOiuoeaVsOaDheWGte+8jOWFtue7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOuebruagh+iKgueCueWcqOaMh+Wumuexu+Wei+S4i+eahOWQjue7reiKgueCueS4quaVsFxuXHRcdCMgXHR9XG5cdFx0IyB9XG5cdFx0Y291bnRlcnMgPSB7fVxuXHRcdGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHR1bmxlc3MgYXBwcm92ZXNcblx0XHRcdHJldHVybiBudWxsXG5cdFx0YXBwcm92ZXMuZm9yRWFjaCAoYXBwcm92ZSktPlxuXHRcdFx0aWYgYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRcblx0XHRcdFx0dW5sZXNzIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVxuXHRcdFx0XHRcdGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXSA9IHt9XG5cdFx0XHRcdGlmIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdXG5cdFx0XHRcdFx0Y291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0rK1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0gPSAxXG5cdFx0cmV0dXJuIGNvdW50ZXJzXG5cblx0Z2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlOiAodHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyktPlxuXHRcdCMg6K+l5Ye95pWw55Sf5oiQanNvbue7k+aehO+8jOihqOeOsOWHuuaJgOacieS8oOmYheOAgeWIhuWPkeOAgei9rOWPkeeahOiKgueCuea1geWQke+8jOWFtue7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOlt7XG5cdFx0IyBcdFx0XHRmcm9tX3R5cGU6IOadpea6kOiKgueCueexu+Wei1xuXHRcdCMgXHRcdFx0ZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTog5p2l5rqQ6IqC54K55aSE55CG5Lq6XG5cdFx0IyBcdFx0XHR0b19hcHByb3ZlX2lkOiDnm67moIfoioLngrlJRFxuXHRcdCMgXHRcdFx0dG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzOiBb5aSa5Liq55uu5qCH6IqC54K55rGH5oC75aSE55CG5Lq66ZuG5ZCIXVxuXHRcdCMgXHRcdFx0aXNfdG90YWw6IHRydWUvZmFsc2XvvIzmmK/lkKbmsYfmgLvoioLngrlcblx0XHQjIFx0XHR9LC4uLl1cblx0XHQjIFx0fVxuXHRcdCMgfVxuXHRcdCMg5LiK6L+w55uu5qCH57uT54K55YaF5a655Lit5pyJ5LiA5Liq5bGe5oCnaXNfdG90YWzooajnpLrmmK/lkKbmsYfmgLvoioLngrnvvIzlpoLmnpzmmK/vvIzliJnmiorlpJrkuKroioLngrnmsYfmgLvlkIjlubbmiJDkuIDkuKrvvIxcblx0XHQjIOS9huaYr+acrOi6q+acieWQjue7reWtkOiKgueCueeahOiKgueCueS4jeWPguS4juaxh+aAu+WPiuiuoeaVsOOAglxuXHRcdGNvdW50ZXJzID0ge31cblx0XHRhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0dW5sZXNzIGFwcHJvdmVzXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRpc0V4cGFuZEFwcHJvdmUgPSBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmVcblxuXHRcdGFwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0dG9BcHByb3ZlVHlwZSA9IHRvQXBwcm92ZS50eXBlXG5cdFx0XHR0b0FwcHJvdmVGcm9tSWQgPSB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXG5cdFx0XHR0b0FwcHJvdmVIYW5kbGVyTmFtZSA9IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdHVubGVzcyB0b0FwcHJvdmVGcm9tSWRcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRhcHByb3Zlcy5mb3JFYWNoIChmcm9tQXBwcm92ZSktPlxuXHRcdFx0XHRpZiBmcm9tQXBwcm92ZS5faWQgPT0gdG9BcHByb3ZlRnJvbUlkXG5cdFx0XHRcdFx0Y291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF1cblx0XHRcdFx0XHR1bmxlc3MgY291bnRlclxuXHRcdFx0XHRcdFx0Y291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF0gPSB7fVxuXHRcdFx0XHRcdHVubGVzcyBjb3VudGVyW3RvQXBwcm92ZS50eXBlXVxuXHRcdFx0XHRcdFx0Y291bnRlclt0b0FwcHJvdmUudHlwZV0gPSBbXVxuXHRcdFx0XHRcdGNvdW50ZXIyID0gY291bnRlclt0b0FwcHJvdmUudHlwZV1cblx0XHRcdFx0XHRpZiB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbdG9BcHByb3ZlLl9pZF0/W3RvQXBwcm92ZVR5cGVdXG5cdFx0XHRcdFx0XHQjIOacieWQjue7reWtkOiKgueCue+8jOWImeS4jeWPguS4juaxh+aAu+WPiuiuoeaVsFxuXHRcdFx0XHRcdFx0Y291bnRlcjIucHVzaFxuXHRcdFx0XHRcdFx0XHRmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGVcblx0XHRcdFx0XHRcdFx0ZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWRcblx0XHRcdFx0XHRcdFx0dG9fYXBwcm92ZV9oYW5kbGVyX25hbWU6IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGNvdW50ZXJDb250ZW50ID0gaWYgaXNFeHBhbmRBcHByb3ZlIHRoZW4gbnVsbCBlbHNlIGNvdW50ZXIyLmZpbmRQcm9wZXJ0eUJ5UEsoXCJpc190b3RhbFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0IyBjb3VudGVyQ29udGVudCA9IGNvdW50ZXIyLmZpbmRQcm9wZXJ0eUJ5UEsoXCJpc190b3RhbFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0IyDlpoLmnpzlvLrliLbopoHmsYLlsZXlvIDmiYDmnInoioLngrnvvIzliJnkuI3lgZrmsYfmgLvlpITnkIZcblx0XHRcdFx0XHRcdGlmIGNvdW50ZXJDb250ZW50XG5cdFx0XHRcdFx0XHRcdGNvdW50ZXJDb250ZW50LmNvdW50Kytcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGNvdW50ZXJDb250ZW50LmNvdW50ID4gdHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRcdFx0XHRcdFx0XHRjb3VudGVyQ29udGVudC50b19hcHByb3ZlX2hhbmRsZXJfbmFtZXMucHVzaCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNvdW50ZXIyLnB1c2hcblx0XHRcdFx0XHRcdFx0XHRmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGVcblx0XHRcdFx0XHRcdFx0XHRmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2lkOiB0b0FwcHJvdmUuX2lkXG5cdFx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2hhbmRsZXJfbmFtZXM6IFt0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXVxuXHRcdFx0XHRcdFx0XHRcdGlzX3RvdGFsOiB0cnVlXG5cblx0XHRyZXR1cm4gY291bnRlcnNcblxuXHRwdXNoQXBwcm92ZXNXaXRoVHlwZUdyYXBoU3ludGF4OiAobm9kZXMsIHRyYWNlKS0+XG5cdFx0dHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGUgdHJhY2Vcblx0XHR0cmFjZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlIHRyYWNlLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNcblx0XHR1bmxlc3MgdHJhY2VDb3VudGVyc1xuXHRcdFx0cmV0dXJuXG5cdFx0ZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyID0ge30gI+iusOW9lemcgOimgemineWklueUn+aIkOaJgOacieWkhOeQhuS6uuWnk+WQjeeahOiiq+S8oOmYheOAgeWIhuWPkeOAgei9rOWPkeiKgueCuVxuXHRcdHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRzcGxpdEluZGV4ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VTcGxpdEFwcHJvdmVzSW5kZXhcblx0XHRjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZVxuXHRcdGZvciBmcm9tQXBwcm92ZUlkLGZyb21BcHByb3ZlIG9mIHRyYWNlQ291bnRlcnNcblx0XHRcdGZvciB0b0FwcHJvdmVUeXBlLHRvQXBwcm92ZXMgb2YgZnJvbUFwcHJvdmVcblx0XHRcdFx0dG9BcHByb3Zlcy5mb3JFYWNoICh0b0FwcHJvdmUpLT5cblx0XHRcdFx0XHR0eXBlTmFtZSA9IFwiXCJcblx0XHRcdFx0XHRzd2l0Y2ggdG9BcHByb3ZlVHlwZVxuXHRcdFx0XHRcdFx0d2hlbiAnY2MnXG5cdFx0XHRcdFx0XHRcdHR5cGVOYW1lID0gXCLkvKDpmIVcIlxuXHRcdFx0XHRcdFx0d2hlbiAnZm9yd2FyZCdcblx0XHRcdFx0XHRcdFx0dHlwZU5hbWUgPSBcIui9rOWPkVwiXG5cdFx0XHRcdFx0XHR3aGVuICdkaXN0cmlidXRlJ1xuXHRcdFx0XHRcdFx0XHR0eXBlTmFtZSA9IFwi5YiG5Y+RXCJcblx0XHRcdFx0XHRpc1R5cGVOb2RlID0gW1wiY2NcIixcImZvcndhcmRcIixcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZih0b0FwcHJvdmUuZnJvbV90eXBlKSA+PSAwXG5cdFx0XHRcdFx0aWYgaXNUeXBlTm9kZVxuXHRcdFx0XHRcdFx0dHJhY2VOYW1lID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUgY3VycmVudFRyYWNlTmFtZSwgdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRpZiB0b0FwcHJvdmUuaXNfdG90YWxcblx0XHRcdFx0XHRcdHRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lc1xuXHRcdFx0XHRcdFx0aWYgc3BsaXRJbmRleCBhbmQgdG9BcHByb3ZlLmNvdW50ID4gc3BsaXRJbmRleFxuXHRcdFx0XHRcdFx0XHQjIOWcqOWnk+WQjembhuWQiOS4reaPkuWFpeWbnui9puespuWPt+aNouihjFxuXHRcdFx0XHRcdFx0XHR0b0hhbmRsZXJOYW1lcy5zcGxpY2Uoc3BsaXRJbmRleCwwLFwiPGJyLz4sXCIpXG5cdFx0XHRcdFx0XHRzdHJUb0hhbmRsZXJOYW1lcyA9IHRvSGFuZGxlck5hbWVzLmpvaW4oXCIsXCIpLnJlcGxhY2UoXCIsLFwiLFwiXCIpXG5cdFx0XHRcdFx0XHRleHRyYUNvdW50ID0gdG9BcHByb3ZlLmNvdW50IC0gdHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRcdFx0XHRcdGlmIGV4dHJhQ291bnQgPiAwXG5cdFx0XHRcdFx0XHRcdHN0clRvSGFuZGxlck5hbWVzICs9IFwi562JI3t0b0FwcHJvdmUuY291bnR95Lq6XCJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXVxuXHRcdFx0XHRcdFx0XHRcdGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXSA9IHt9XG5cdFx0XHRcdFx0XHRcdGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXVt0b0FwcHJvdmVUeXBlXSA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2lkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RyVG9IYW5kbGVyTmFtZXMgPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRpZiBpc1R5cGVOb2RlXG5cdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlSWR9PlxcXCIje3RyYWNlTmFtZX1cXFwiXS0tI3t0eXBlTmFtZX0tLT4je3RvQXBwcm92ZS50b19hcHByb3ZlX2lkfT5cXFwiI3tzdHJUb0hhbmRsZXJOYW1lc31cXFwiXVwiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tmcm9tQXBwcm92ZUlkfShcXFwiI3t0cmFjZU5hbWV9XFxcIiktLSN7dHlwZU5hbWV9LS0+I3t0b0FwcHJvdmUudG9fYXBwcm92ZV9pZH0+XFxcIiN7c3RyVG9IYW5kbGVyTmFtZXN9XFxcIl1cIlxuXG5cdFx0IyDkuLrpnIDopoHpop3lpJbnlJ/miJDmiYDmnInlpITnkIbkurrlp5PlkI3nmoTooqvkvKDpmIXjgIHliIblj5HjgIHovazlj5HoioLngrnvvIzlop7liqDpvKDmoIflvLnlh7ror6bnu4blsYLkuovku7Zcblx0XHQjIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcueahOe7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOuebruagh+e7k+eCuUlEXG5cdFx0IyBcdH1cblx0XHQjIH1cblx0XHRhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0dW5sZXNzIF8uaXNFbXB0eShleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIpXG5cdFx0XHRmb3IgZnJvbUFwcHJvdmVJZCxmcm9tQXBwcm92ZSBvZiBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJcblx0XHRcdFx0Zm9yIHRvQXBwcm92ZVR5cGUsdG9BcHByb3ZlSWQgb2YgZnJvbUFwcHJvdmVcblx0XHRcdFx0XHR0ZW1wSGFuZGxlck5hbWVzID0gW11cblx0XHRcdFx0XHRhcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRcdFx0XHRpZiBmcm9tQXBwcm92ZUlkID09IGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXG5cdFx0XHRcdFx0XHRcdHVubGVzcyB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbYXBwcm92ZS5faWRdP1t0b0FwcHJvdmVUeXBlXVxuXHRcdFx0XHRcdFx0XHRcdCMg5pyJ5ZCO57ut5a2Q6IqC54K577yM5YiZ5LiN5Y+C5LiO5rGH5oC75Y+K6K6h5pWwXG5cdFx0XHRcdFx0XHRcdFx0dGVtcEhhbmRsZXJOYW1lcy5wdXNoIGFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xpY2sgI3t0b0FwcHJvdmVJZH0gY2FsbGJhY2sgXFxcIiN7dGVtcEhhbmRsZXJOYW1lcy5qb2luKFwiLFwiKX1cXFwiXCJcblxuXHRnZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4OiAodHJhY2VzLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uKS0+XG5cdFx0bm9kZXMgPSBbXCJncmFwaCAje2RpcmVjdGlvbn1cIl1cblx0XHRsYXN0VHJhY2UgPSBudWxsXG5cdFx0bGFzdEFwcHJvdmVzID0gW11cblx0XHR0cmFjZXMuZm9yRWFjaCAodHJhY2UpLT5cblx0XHRcdGxpbmVzID0gdHJhY2UucHJldmlvdXNfdHJhY2VfaWRzXG5cdFx0XHRjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZVxuXHRcdFx0aWYgbGluZXM/Lmxlbmd0aFxuXHRcdFx0XHRsaW5lcy5mb3JFYWNoIChsaW5lKS0+XG5cdFx0XHRcdFx0ZnJvbVRyYWNlID0gdHJhY2VzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIixsaW5lKVxuXHRcdFx0XHRcdGN1cnJlbnRGcm9tVHJhY2VOYW1lID0gZnJvbVRyYWNlLm5hbWVcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMgPSBmcm9tVHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHR0b0FwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHRsYXN0VHJhY2UgPSB0cmFjZVxuXHRcdFx0XHRcdGxhc3RBcHByb3ZlcyA9IHRvQXBwcm92ZXNcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMuZm9yRWFjaCAoZnJvbUFwcHJvdmUpLT5cblx0XHRcdFx0XHRcdGZyb21BcHByb3ZlSGFuZGxlck5hbWUgPSBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdGlmIHRvQXBwcm92ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHR0b0FwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLnR5cGUpIDwgMFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgW1wiY2NcIixcImZvcndhcmRcIixcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZihmcm9tQXBwcm92ZS50eXBlKSA8IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5LiN5piv5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R77yM5YiZ6L+e5o6l5Yiw5LiL5LiA5LiqdHJhY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0anVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dCBmcm9tQXBwcm92ZS5qdWRnZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tI3tqdWRnZVRleHR9LS0+I3t0b0FwcHJvdmUuX2lkfShcXFwiI3t0b1RyYWNlTmFtZX1cXFwiKVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tPiN7dG9BcHByb3ZlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQjIOacgOWQjuS4gOS4quatpemqpOeahHRyYWNlXG5cdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKGN1cnJlbnRUcmFjZU5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0IyDkuI3mmK/kvKDpmIXjgIHliIblj5HjgIHovazlj5HvvIzliJnov57mjqXliLDkuIvkuIDkuKp0cmFjZVxuXHRcdFx0XHRcdFx0XHRcdGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQgZnJvbUFwcHJvdmUuanVkZ2Vcblx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0je2p1ZGdlVGV4dH0tLT4je3RyYWNlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0+I3t0cmFjZS5faWR9KFxcXCIje3RvVHJhY2VOYW1lfVxcXCIpXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDnrKzkuIDkuKp0cmFjZe+8jOWboHRyYWNlc+WPr+iDveWPquacieS4gOS4qu+8jOi/meaXtumcgOimgeWNleeLrOaYvuekuuWHuuadpVxuXHRcdFx0XHR0cmFjZS5hcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lIGN1cnJlbnRUcmFjZU5hbWUsIGFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3thcHByb3ZlLl9pZH0oXFxcIiN7dHJhY2VOYW1lfVxcXCIpXCJcblxuXHRcdFx0Rmxvd3ZlcnNpb25BUEkucHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheCBub2RlcywgdHJhY2VcblxuXHRcdCMg562+5om55Y6G56iL5Lit5pyA5ZCO55qEYXBwcm92ZXPpq5jkuq7mmL7npLrvvIznu5PmnZ/mraXpqqTnmoR0cmFjZeS4reaYr+ayoeaciWFwcHJvdmVz55qE77yM5omA5Lul57uT5p2f5q2l6aqk5LiN6auY5Lqu5pi+56S6XG5cdFx0bGFzdEFwcHJvdmVzPy5mb3JFYWNoIChsYXN0QXBwcm92ZSktPlxuXHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tsYXN0QXBwcm92ZS5faWR9IGN1cnJlbnQtc3RlcC1ub2RlO1wiXG5cblx0XHRpZiBpc0NvbnZlcnRUb1N0cmluZ1xuXHRcdFx0Z3JhcGhTeW50YXggPSBub2Rlcy5qb2luIFwiXFxuXCJcblx0XHRcdHJldHVybiBncmFwaFN5bnRheFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBub2Rlc1xuXG5cdHNlbmRIdG1sUmVzcG9uc2U6IChyZXEsIHJlcywgdHlwZSktPlxuXHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdFx0aW5zdGFuY2VfaWQgPSBxdWVyeS5pbnN0YW5jZV9pZFxuXHRcdGRpcmVjdGlvbiA9IHF1ZXJ5LmRpcmVjdGlvbiB8fCAnVEQnXG5cdFx0YWxsb3dEaXJlY3Rpb25zID0gWydUQicsJ0JUJywnUkwnLCdMUicsJ1REJ107XG5cblx0XHRpZiAhXy5pbmNsdWRlKGFsbG93RGlyZWN0aW9ucywgZGlyZWN0aW9uKVxuXHRcdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlKHJlcywgNTAwLCBcIkludmFsaWQgZGlyZWN0aW9uLiBUaGUgdmFsdWUgb2YgZGlyZWN0aW9uIHNob3VsZCBiZSBpbiBbJ1RCJywgJ0JUJywgJ1JMJywgJ0xSJywgJ1REJ11cIik7XG5cblx0XHR1bmxlc3MgaW5zdGFuY2VfaWRcblx0XHRcdEZsb3d2ZXJzaW9uQVBJLnNlbmRJbnZhbGlkVVJMUmVzcG9uc2UgcmVzIFxuXHRcdFxuXHRcdHRpdGxlID0gcXVlcnkudGl0bGVcblx0XHRpZiB0aXRsZVxuXHRcdFx0dGl0bGUgPSBkZWNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHRpdGxlKSlcblx0XHRlbHNlXG5cdFx0XHR0aXRsZSA9IFwiV29ya2Zsb3cgQ2hhcnRcIlxuXG5cdFx0ZXJyb3JfbXNnID0gXCJcIlxuXHRcdGdyYXBoU3ludGF4ID0gXCJcIlxuXHRcdEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IGZhbHNlXG5cdFx0aWYgdHlwZSA9PSBcInRyYWNlc19leHBhbmRcIlxuXHRcdFx0dHlwZSA9IFwidHJhY2VzXCJcblx0XHRcdEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IHRydWVcblx0XHRzd2l0Y2ggdHlwZVxuXHRcdFx0d2hlbiAndHJhY2VzJ1xuXHRcdFx0XHRpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lIGluc3RhbmNlX2lkLHtmaWVsZHM6e3RyYWNlczogMX19XG5cdFx0XHRcdGlmIGluc3RhbmNlXG5cdFx0XHRcdFx0dHJhY2VzID0gaW5zdGFuY2UudHJhY2VzXG5cdFx0XHRcdFx0aWYgdHJhY2VzPy5sZW5ndGhcblx0XHRcdFx0XHRcdGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4IHRyYWNlcywgZmFsc2UsIGRpcmVjdGlvblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSBpbnN0YW5jZV9pZCx7ZmllbGRzOntmbG93X3ZlcnNpb246MSxmbG93OjEsdHJhY2VzOiB7JHNsaWNlOiAtMX19fVxuXHRcdFx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0XHRcdGN1cnJlbnRTdGVwSWQgPSBpbnN0YW5jZS50cmFjZXM/WzBdPy5zdGVwXG5cdFx0XHRcdFx0Zmxvd3ZlcnNpb24gPSBXb3JrZmxvd01hbmFnZXIuZ2V0SW5zdGFuY2VGbG93VmVyc2lvbihpbnN0YW5jZSlcblx0XHRcdFx0XHRzdGVwcyA9IGZsb3d2ZXJzaW9uPy5zdGVwc1xuXHRcdFx0XHRcdGlmIHN0ZXBzPy5sZW5ndGhcblx0XHRcdFx0XHRcdGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXggc3RlcHMsY3VycmVudFN0ZXBJZCxmYWxzZSwgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCJcblx0XHRcdFx0YnJlYWtcblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG5cdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlIHJlcywgMjAwLCBcIlwiXCJcblx0XHRcdDwhRE9DVFlQRSBodG1sPlxuXHRcdFx0PGh0bWw+XG5cdFx0XHRcdDxoZWFkPlxuXHRcdFx0XHRcdDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxuXHRcdFx0XHRcdDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xLHVzZXItc2NhbGFibGU9eWVzXCI+XG5cdFx0XHRcdFx0PHRpdGxlPiN7dGl0bGV9PC90aXRsZT5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwibW9iaWxlLXdlYi1hcHAtY2FwYWJsZVwiIGNvbnRlbnQ9XCJ5ZXNcIj5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwidGhlbWUtY29sb3JcIiBjb250ZW50PVwiIzAwMFwiPlxuXHRcdFx0XHRcdDxtZXRhIG5hbWU9XCJhcHBsaWNhdGlvbi1uYW1lXCI+XG5cdFx0XHRcdFx0PHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiL3VucGtnLmNvbS9qcXVlcnlAMS4xMS4yL2Rpc3QvanF1ZXJ5Lm1pbi5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIi91bnBrZy5jb20vbWVybWFpZEA5LjEuMi9kaXN0L21lcm1haWQubWluLmpzXCI+PC9zY3JpcHQ+XG5cdFx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdFx0Ym9keSB7IFxuXHRcdFx0XHRcdFx0XHRmb250LWZhbWlseTogJ1NvdXJjZSBTYW5zIFBybycsICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5sb2FkaW5ne1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDBweDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDBweDtcblx0XHRcdFx0XHRcdFx0dG9wOiA1MCU7XG5cdFx0XHRcdFx0XHRcdHotaW5kZXg6IDExMDA7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogLTMwcHg7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMzZweDtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICNkZmRmZGY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuZXJyb3ItbXNne1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDBweDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDBweDtcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMHB4O1xuXHRcdFx0XHRcdFx0XHR6LWluZGV4OiAxMTAwO1xuXHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMjBweDtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICNhOTQ0NDI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2NjY2NmZjtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiByZ2IoMTQ0LCAxNDQsIDI1NSk7XG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY3VycmVudC1zdGVwLW5vZGUgcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2NkZTQ5ODtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAjMTM1NDBjO1xuXHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDJweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jb25kaXRpb24gcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2VjZWNmZjtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiByZ2IoMjA0LCAyMDQsIDI1NSk7XG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAxcHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnRyYWNlLWhhbmRsZXItbmFtZXtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICM3Nzc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnN0ZXAtaGFuZGxlci1uYW1le1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogIzc3Nztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRpdi5tZXJtYWlkVG9vbHRpcHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkIWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogbGVmdCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDRweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMTRweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdG1heC13aWR0aDogNTAwcHghaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiBhdXRvIWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0dG9wOiAxNXB4IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDE1cHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb217XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAycHggMTBweDtcblx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAyNnB4O1xuXHRcdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAyMHB4O1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiAjZWVlO1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogIzc3Nztcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkO1xuXHRcdFx0XHRcdFx0XHRib3R0b206IDE1cHg7XG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHRcdFx0ei1pbmRleDogOTk5OTk7XG5cdFx0XHRcdFx0XHRcdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdGxpbmUtaGVpZ2h0OiAxLjI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcblx0XHRcdFx0XHRcdFx0LmJ0bi16b29te1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6bm9uZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmJ0bi16b29tOmhvdmVye1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb20tdXB7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDE1cHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb20tZG93bntcblx0XHRcdFx0XHRcdFx0bGVmdDogNjBweDtcblx0XHRcdFx0XHRcdFx0cGFkZGluZzogMXB4IDEzcHggM3B4IDEzcHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PC9oZWFkPlxuXHRcdFx0XHQ8Ym9keT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzID0gXCJsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3MgPSBcImVycm9yLW1zZ1wiPiN7ZXJyb3JfbXNnfTwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtZXJtYWlkXCI+PC9kaXY+XG5cdFx0XHRcdFx0PHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+XG5cdFx0XHRcdFx0XHRtZXJtYWlkLmluaXRpYWxpemUoe1xuXHRcdFx0XHRcdFx0XHRzdGFydE9uTG9hZDpmYWxzZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQkKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHZhciBncmFwaE5vZGVzID0gI3tKU09OLnN0cmluZ2lmeShncmFwaFN5bnRheCl9O1xuXHRcdFx0XHRcdFx0XHQvL+aWueS+v+WJjemdouWPr+S7pemAmui/h+iwg+eUqG1lcm1haWQuY3VycmVudE5vZGVz6LCD5byP77yM54m55oSP5aKe5YqgY3VycmVudE5vZGVz5bGe5oCn44CCXG5cdFx0XHRcdFx0XHRcdG1lcm1haWQuY3VycmVudE5vZGVzID0gZ3JhcGhOb2Rlcztcblx0XHRcdFx0XHRcdFx0dmFyIGdyYXBoU3ludGF4ID0gZ3JhcGhOb2Rlcy5qb2luKFwiXFxcXG5cIik7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoTm9kZXMpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhncmFwaFN5bnRheCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiWW91IGNhbiBhY2Nlc3MgdGhlIGdyYXBoIG5vZGVzIGJ5ICdtZXJtYWlkLmN1cnJlbnROb2RlcycgaW4gdGhlIGNvbnNvbGUgb2YgYnJvd3Nlci5cIik7XG5cdFx0XHRcdFx0XHRcdCQoXCIubG9hZGluZ1wiKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgaWQgPSBcImZsb3ctc3RlcHMtc3ZnXCI7XG5cdFx0XHRcdFx0XHRcdHZhciBlbGVtZW50ID0gJCgnLm1lcm1haWQnKTtcblx0XHRcdFx0XHRcdFx0dmFyIGluc2VydFN2ZyA9IGZ1bmN0aW9uKHN2Z0NvZGUsIGJpbmRGdW5jdGlvbnMpIHtcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50Lmh0bWwoc3ZnQ29kZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjayhpZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJpbmRGdW5jdGlvbnMoZWxlbWVudFswXSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdG1lcm1haWQucmVuZGVyKGlkLCBncmFwaFN5bnRheCwgaW5zZXJ0U3ZnLCBlbGVtZW50WzBdKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgem9vbVNWRyA9IGZ1bmN0aW9uKHpvb20pe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjdXJyZW50V2lkdGggPSAkKFwic3ZnXCIpLndpZHRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5ld1dpZHRoID0gY3VycmVudFdpZHRoICogem9vbTtcblx0XHRcdFx0XHRcdFx0XHQkKFwic3ZnXCIpLmNzcyhcIm1heFdpZHRoXCIsbmV3V2lkdGggKyBcInB4XCIpLndpZHRoKG5ld1dpZHRoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8v5pSv5oyB6byg5qCH5rua6L2u57yp5pS+55S75biDXG5cdFx0XHRcdFx0XHRcdCQod2luZG93KS5vbihcIm1vdXNld2hlZWxcIixmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZXZlbnQuY3RybEtleSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHpvb20gPSBldmVudC5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPiAwID8gMS4xIDogMC45O1xuXHRcdFx0XHRcdFx0XHRcdFx0em9vbVNWRyh6b29tKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi16b29tXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHpvb21TVkcoJCh0aGlzKS5hdHRyKFwiem9vbVwiKSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0PC9zY3JpcHQ+XG5cdFx0XHRcdFx0PGEgY2xhc3M9XCJidG4tem9vbSBidG4tem9vbS11cFwiIHpvb209MS4xIHRpdGxlPVwi54K55Ye75pS+5aSnXCI+KzwvYT5cblx0XHRcdFx0XHQ8YSBjbGFzcz1cImJ0bi16b29tIGJ0bi16b29tLWRvd25cIiB6b29tPTAuOSB0aXRsZT1cIueCueWHu+e8qeWwj1wiPi08L2E+XG5cdFx0XHRcdDwvYm9keT5cblx0XHRcdDwvaHRtbD5cblx0XHRcIlwiXCJcblxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0P2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0IyDmtYHnqIvlm75cblx0Rmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZSByZXEsIHJlc1xuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0IyDmsYfmgLvnrb7mibnljobnqIvlm75cblx0Rmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZSByZXEsIHJlcywgXCJ0cmFjZXNcIlxuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzX2V4cGFuZD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdCMg5bGV5byA5omA5pyJ6IqC54K555qE562+5om55Y6G56iL5Zu+XG5cdEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UgcmVxLCByZXMsIFwidHJhY2VzX2V4cGFuZFwiXG5cbiIsInZhciBGbG93dmVyc2lvbkFQSTtcblxuRmxvd3ZlcnNpb25BUEkgPSB7XG4gIHRyYWNlTWF4QXBwcm92ZUNvdW50OiAxMCxcbiAgdHJhY2VTcGxpdEFwcHJvdmVzSW5kZXg6IDUsXG4gIGlzRXhwYW5kQXBwcm92ZTogZmFsc2UsXG4gIGdldEFic29sdXRlVXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgcm9vdFVybDtcbiAgICByb290VXJsID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA/IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggOiBcIlwiO1xuICAgIGlmIChyb290VXJsKSB7XG4gICAgICB1cmwgPSByb290VXJsICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9LFxuICB3cml0ZVJlc3BvbnNlOiBmdW5jdGlvbihyZXMsIGh0dHBDb2RlLCBib2R5KSB7XG4gICAgcmVzLnN0YXR1c0NvZGUgPSBodHRwQ29kZTtcbiAgICByZXR1cm4gcmVzLmVuZChib2R5KTtcbiAgfSxcbiAgc2VuZEludmFsaWRVUkxSZXNwb25zZTogZnVuY3Rpb24ocmVzKSB7XG4gICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDQwNCwgXCJ1cmwgbXVzdCBoYXMgcXVlcnlzIGFzIGluc3RhbmNlX2lkLlwiKTtcbiAgfSxcbiAgc2VuZEF1dGhUb2tlbkV4cGlyZWRSZXNwb25zZTogZnVuY3Rpb24ocmVzKSB7XG4gICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDQwMSwgXCJ0aGUgYXV0aF90b2tlbiBoYXMgZXhwaXJlZC5cIik7XG4gIH0sXG4gIHJlcGxhY2VFcnJvclN5bWJvbDogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFwiL2csIFwiJnF1b3Q7XCIpLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xuICB9LFxuICBnZXRTdGVwSGFuZGxlck5hbWU6IGZ1bmN0aW9uKHN0ZXAsIGluc0lkKSB7XG4gICAgdmFyIGFwcHJvdmVyTmFtZXMsIGUsIGxvZ2luVXNlcklkLCBzdGVwSGFuZGxlck5hbWUsIHN0ZXBJZCwgdXNlcklkcztcbiAgICB0cnkge1xuICAgICAgc3RlcEhhbmRsZXJOYW1lID0gXCJcIjtcbiAgICAgIGlmIChzdGVwLnN0ZXBfdHlwZSA9PT0gXCJjb25kaXRpb25cIikge1xuICAgICAgICByZXR1cm4gc3RlcEhhbmRsZXJOYW1lO1xuICAgICAgfVxuICAgICAgbG9naW5Vc2VySWQgPSAnJztcbiAgICAgIHN0ZXBJZCA9IHN0ZXAuX2lkO1xuICAgICAgdXNlcklkcyA9IGdldEhhbmRsZXJzTWFuYWdlci5nZXRIYW5kbGVycyhpbnNJZCwgc3RlcElkLCBsb2dpblVzZXJJZCk7XG4gICAgICBhcHByb3Zlck5hbWVzID0gdXNlcklkcy5tYXAoZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgIHZhciB1c2VyO1xuICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKTtcbiAgICAgIHJldHVybiBzdGVwSGFuZGxlck5hbWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgZ2V0U3RlcExhYmVsOiBmdW5jdGlvbihzdGVwTmFtZSwgc3RlcEhhbmRsZXJOYW1lKSB7XG4gICAgaWYgKHN0ZXBOYW1lKSB7XG4gICAgICBzdGVwTmFtZSA9IFwiPGRpdiBjbGFzcz0nZ3JhcGgtbm9kZSc+IDxkaXYgY2xhc3M9J3N0ZXAtbmFtZSc+XCIgKyBzdGVwTmFtZSArIFwiPC9kaXY+IDxkaXYgY2xhc3M9J3N0ZXAtaGFuZGxlci1uYW1lJz5cIiArIHN0ZXBIYW5kbGVyTmFtZSArIFwiPC9kaXY+IDwvZGl2PlwiO1xuICAgICAgc3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2woc3RlcE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGVwTmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBzdGVwTmFtZTtcbiAgfSxcbiAgZ2V0U3RlcE5hbWU6IGZ1bmN0aW9uKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpIHtcbiAgICB2YXIgY2FjaGVkU3RlcE5hbWUsIHN0ZXBIYW5kbGVyTmFtZSwgc3RlcE5hbWU7XG4gICAgY2FjaGVkU3RlcE5hbWUgPSBjYWNoZWRTdGVwTmFtZXNbc3RlcC5faWRdO1xuICAgIGlmIChjYWNoZWRTdGVwTmFtZSkge1xuICAgICAgcmV0dXJuIGNhY2hlZFN0ZXBOYW1lO1xuICAgIH1cbiAgICBzdGVwSGFuZGxlck5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwSGFuZGxlck5hbWUoc3RlcCwgaW5zdGFuY2VfaWQpO1xuICAgIHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcExhYmVsKHN0ZXAubmFtZSwgc3RlcEhhbmRsZXJOYW1lKTtcbiAgICBjYWNoZWRTdGVwTmFtZXNbc3RlcC5faWRdID0gc3RlcE5hbWU7XG4gICAgcmV0dXJuIHN0ZXBOYW1lO1xuICB9LFxuICBnZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXg6IGZ1bmN0aW9uKHN0ZXBzLCBjdXJyZW50U3RlcElkLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZCkge1xuICAgIHZhciBjYWNoZWRTdGVwTmFtZXMsIGdyYXBoU3ludGF4LCBub2RlcztcbiAgICBub2RlcyA9IFtcImdyYXBoIFwiICsgZGlyZWN0aW9uXTtcbiAgICBjYWNoZWRTdGVwTmFtZXMgPSB7fTtcbiAgICBzdGVwcy5mb3JFYWNoKGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgIHZhciBsaW5lcztcbiAgICAgIGxpbmVzID0gc3RlcC5saW5lcztcbiAgICAgIGlmIChsaW5lcyAhPSBudWxsID8gbGluZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICB2YXIgc3RlcE5hbWUsIHRvU3RlcCwgdG9TdGVwTmFtZTtcbiAgICAgICAgICBpZiAoc3RlcC5uYW1lKSB7XG4gICAgICAgICAgICBpZiAoc3RlcC5zdGVwX3R5cGUgPT09IFwiY29uZGl0aW9uXCIpIHtcbiAgICAgICAgICAgICAgbm9kZXMucHVzaChcIlx0Y2xhc3MgXCIgKyBzdGVwLl9pZCArIFwiIGNvbmRpdGlvbjtcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGVwTmFtZSA9IFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvU3RlcCA9IHN0ZXBzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIiwgbGluZS50b19zdGVwKTtcbiAgICAgICAgICB0b1N0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcE5hbWUodG9TdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKTtcbiAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBzdGVwLl9pZCArIFwiKFxcXCJcIiArIHN0ZXBOYW1lICsgXCJcXFwiKS0tPlwiICsgbGluZS50b19zdGVwICsgXCIoXFxcIlwiICsgdG9TdGVwTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChjdXJyZW50U3RlcElkKSB7XG4gICAgICBub2Rlcy5wdXNoKFwiXHRjbGFzcyBcIiArIGN1cnJlbnRTdGVwSWQgKyBcIiBjdXJyZW50LXN0ZXAtbm9kZTtcIik7XG4gICAgfVxuICAgIGlmIChpc0NvbnZlcnRUb1N0cmluZykge1xuICAgICAgZ3JhcGhTeW50YXggPSBub2Rlcy5qb2luKFwiXFxuXCIpO1xuICAgICAgcmV0dXJuIGdyYXBoU3ludGF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICB9LFxuICBnZXRBcHByb3ZlSnVkZ2VUZXh0OiBmdW5jdGlvbihqdWRnZSkge1xuICAgIHZhciBqdWRnZVRleHQsIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgc3dpdGNoIChqdWRnZSkge1xuICAgICAgY2FzZSAnYXBwcm92ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSBhcHByb3ZlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlamVjdGVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVqZWN0ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXJtaW5hdGVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgdGVybWluYXRlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYXNzaWduZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWFzc2lnbmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVsb2NhdGVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVsb2NhdGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmV0cmlldmVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmV0cmlldmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmV0dXJuZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZXR1cm5lZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlYWRlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlYWRlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGp1ZGdlVGV4dCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGp1ZGdlVGV4dDtcbiAgfSxcbiAgZ2V0VHJhY2VOYW1lOiBmdW5jdGlvbih0cmFjZU5hbWUsIGFwcHJvdmVIYW5kbGVyTmFtZSkge1xuICAgIGlmICh0cmFjZU5hbWUpIHtcbiAgICAgIHRyYWNlTmFtZSA9IFwiPGRpdiBjbGFzcz0nZ3JhcGgtbm9kZSc+IDxkaXYgY2xhc3M9J3RyYWNlLW5hbWUnPlwiICsgdHJhY2VOYW1lICsgXCI8L2Rpdj4gPGRpdiBjbGFzcz0ndHJhY2UtaGFuZGxlci1uYW1lJz5cIiArIGFwcHJvdmVIYW5kbGVyTmFtZSArIFwiPC9kaXY+IDwvZGl2PlwiO1xuICAgICAgdHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKHRyYWNlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNlTmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJldHVybiB0cmFjZU5hbWU7XG4gIH0sXG4gIGdldFRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1dpdGhUeXBlOiBmdW5jdGlvbih0cmFjZSkge1xuICAgIHZhciBhcHByb3ZlcywgY291bnRlcnM7XG4gICAgY291bnRlcnMgPSB7fTtcbiAgICBhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzO1xuICAgIGlmICghYXBwcm92ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBhcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcHJvdmUpIHtcbiAgICAgIGlmIChhcHByb3ZlLmZyb21fYXBwcm92ZV9pZCkge1xuICAgICAgICBpZiAoIWNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXSkge1xuICAgICAgICAgIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXSkge1xuICAgICAgICAgIHJldHVybiBjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXSA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY291bnRlcnM7XG4gIH0sXG4gIGdldFRyYWNlQ291bnRlcnNXaXRoVHlwZTogZnVuY3Rpb24odHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycykge1xuICAgIHZhciBhcHByb3ZlcywgY291bnRlcnMsIGlzRXhwYW5kQXBwcm92ZSwgdHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgY291bnRlcnMgPSB7fTtcbiAgICBhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzO1xuICAgIGlmICghYXBwcm92ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0cmFjZU1heEFwcHJvdmVDb3VudCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlTWF4QXBwcm92ZUNvdW50O1xuICAgIGlzRXhwYW5kQXBwcm92ZSA9IEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZTtcbiAgICBhcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKHRvQXBwcm92ZSkge1xuICAgICAgdmFyIHRvQXBwcm92ZUZyb21JZCwgdG9BcHByb3ZlSGFuZGxlck5hbWUsIHRvQXBwcm92ZVR5cGU7XG4gICAgICB0b0FwcHJvdmVUeXBlID0gdG9BcHByb3ZlLnR5cGU7XG4gICAgICB0b0FwcHJvdmVGcm9tSWQgPSB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkO1xuICAgICAgdG9BcHByb3ZlSGFuZGxlck5hbWUgPSB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lO1xuICAgICAgaWYgKCF0b0FwcHJvdmVGcm9tSWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgdmFyIGNvdW50ZXIsIGNvdW50ZXIyLCBjb3VudGVyQ29udGVudCwgcmVmO1xuICAgICAgICBpZiAoZnJvbUFwcHJvdmUuX2lkID09PSB0b0FwcHJvdmVGcm9tSWQpIHtcbiAgICAgICAgICBjb3VudGVyID0gY291bnRlcnNbdG9BcHByb3ZlRnJvbUlkXTtcbiAgICAgICAgICBpZiAoIWNvdW50ZXIpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSBjb3VudGVyc1t0b0FwcHJvdmVGcm9tSWRdID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghY291bnRlclt0b0FwcHJvdmUudHlwZV0pIHtcbiAgICAgICAgICAgIGNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdID0gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50ZXIyID0gY291bnRlclt0b0FwcHJvdmUudHlwZV07XG4gICAgICAgICAgaWYgKChyZWYgPSB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbdG9BcHByb3ZlLl9pZF0pICE9IG51bGwgPyByZWZbdG9BcHByb3ZlVHlwZV0gOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBjb3VudGVyMi5wdXNoKHtcbiAgICAgICAgICAgICAgZnJvbV90eXBlOiBmcm9tQXBwcm92ZS50eXBlLFxuICAgICAgICAgICAgICBmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWUsXG4gICAgICAgICAgICAgIHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWQsXG4gICAgICAgICAgICAgIHRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlckNvbnRlbnQgPSBpc0V4cGFuZEFwcHJvdmUgPyBudWxsIDogY291bnRlcjIuZmluZFByb3BlcnR5QnlQSyhcImlzX3RvdGFsXCIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGNvdW50ZXJDb250ZW50KSB7XG4gICAgICAgICAgICAgIGNvdW50ZXJDb250ZW50LmNvdW50Kys7XG4gICAgICAgICAgICAgIGlmICghKGNvdW50ZXJDb250ZW50LmNvdW50ID4gdHJhY2VNYXhBcHByb3ZlQ291bnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ZXJDb250ZW50LnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcy5wdXNoKHRvQXBwcm92ZS5oYW5kbGVyX25hbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gY291bnRlcjIucHVzaCh7XG4gICAgICAgICAgICAgICAgZnJvbV90eXBlOiBmcm9tQXBwcm92ZS50eXBlLFxuICAgICAgICAgICAgICAgIGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZSxcbiAgICAgICAgICAgICAgICB0b19hcHByb3ZlX2lkOiB0b0FwcHJvdmUuX2lkLFxuICAgICAgICAgICAgICAgIGNvdW50OiAxLFxuICAgICAgICAgICAgICAgIHRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lczogW3RvQXBwcm92ZS5oYW5kbGVyX25hbWVdLFxuICAgICAgICAgICAgICAgIGlzX3RvdGFsOiB0cnVlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvdW50ZXJzO1xuICB9LFxuICBwdXNoQXBwcm92ZXNXaXRoVHlwZUdyYXBoU3ludGF4OiBmdW5jdGlvbihub2RlcywgdHJhY2UpIHtcbiAgICB2YXIgYXBwcm92ZXMsIGN1cnJlbnRUcmFjZU5hbWUsIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlciwgZnJvbUFwcHJvdmUsIGZyb21BcHByb3ZlSWQsIHJlc3VsdHMsIHNwbGl0SW5kZXgsIHRlbXBIYW5kbGVyTmFtZXMsIHRvQXBwcm92ZUlkLCB0b0FwcHJvdmVUeXBlLCB0b0FwcHJvdmVzLCB0cmFjZUNvdW50ZXJzLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMsIHRyYWNlTWF4QXBwcm92ZUNvdW50O1xuICAgIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1dpdGhUeXBlKHRyYWNlKTtcbiAgICB0cmFjZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlKHRyYWNlLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMpO1xuICAgIGlmICghdHJhY2VDb3VudGVycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIgPSB7fTtcbiAgICB0cmFjZU1heEFwcHJvdmVDb3VudCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlTWF4QXBwcm92ZUNvdW50O1xuICAgIHNwbGl0SW5kZXggPSBGbG93dmVyc2lvbkFQSS50cmFjZVNwbGl0QXBwcm92ZXNJbmRleDtcbiAgICBjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZTtcbiAgICBmb3IgKGZyb21BcHByb3ZlSWQgaW4gdHJhY2VDb3VudGVycykge1xuICAgICAgZnJvbUFwcHJvdmUgPSB0cmFjZUNvdW50ZXJzW2Zyb21BcHByb3ZlSWRdO1xuICAgICAgZm9yICh0b0FwcHJvdmVUeXBlIGluIGZyb21BcHByb3ZlKSB7XG4gICAgICAgIHRvQXBwcm92ZXMgPSBmcm9tQXBwcm92ZVt0b0FwcHJvdmVUeXBlXTtcbiAgICAgICAgdG9BcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKHRvQXBwcm92ZSkge1xuICAgICAgICAgIHZhciBleHRyYUNvdW50LCBpc1R5cGVOb2RlLCBzdHJUb0hhbmRsZXJOYW1lcywgdG9IYW5kbGVyTmFtZXMsIHRyYWNlTmFtZSwgdHlwZU5hbWU7XG4gICAgICAgICAgdHlwZU5hbWUgPSBcIlwiO1xuICAgICAgICAgIHN3aXRjaCAodG9BcHByb3ZlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnY2MnOlxuICAgICAgICAgICAgICB0eXBlTmFtZSA9IFwi5Lyg6ZiFXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZm9yd2FyZCc6XG4gICAgICAgICAgICAgIHR5cGVOYW1lID0gXCLovazlj5FcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXN0cmlidXRlJzpcbiAgICAgICAgICAgICAgdHlwZU5hbWUgPSBcIuWIhuWPkVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpc1R5cGVOb2RlID0gW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKHRvQXBwcm92ZS5mcm9tX3R5cGUpID49IDA7XG4gICAgICAgICAgaWYgKGlzVHlwZU5vZGUpIHtcbiAgICAgICAgICAgIHRyYWNlTmFtZSA9IHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudFRyYWNlTmFtZSwgdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodG9BcHByb3ZlLmlzX3RvdGFsKSB7XG4gICAgICAgICAgICB0b0hhbmRsZXJOYW1lcyA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2hhbmRsZXJfbmFtZXM7XG4gICAgICAgICAgICBpZiAoc3BsaXRJbmRleCAmJiB0b0FwcHJvdmUuY291bnQgPiBzcGxpdEluZGV4KSB7XG4gICAgICAgICAgICAgIHRvSGFuZGxlck5hbWVzLnNwbGljZShzcGxpdEluZGV4LCAwLCBcIjxici8+LFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0clRvSGFuZGxlck5hbWVzID0gdG9IYW5kbGVyTmFtZXMuam9pbihcIixcIikucmVwbGFjZShcIiwsXCIsIFwiXCIpO1xuICAgICAgICAgICAgZXh0cmFDb3VudCA9IHRvQXBwcm92ZS5jb3VudCAtIHRyYWNlTWF4QXBwcm92ZUNvdW50O1xuICAgICAgICAgICAgaWYgKGV4dHJhQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgIHN0clRvSGFuZGxlck5hbWVzICs9IFwi562JXCIgKyB0b0FwcHJvdmUuY291bnQgKyBcIuS6ulwiO1xuICAgICAgICAgICAgICBpZiAoIWV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXSkge1xuICAgICAgICAgICAgICAgIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXSA9IHt9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXVt0b0FwcHJvdmVUeXBlXSA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJUb0hhbmRsZXJOYW1lcyA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2hhbmRsZXJfbmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzVHlwZU5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlSWQgKyBcIj5cXFwiXCIgKyB0cmFjZU5hbWUgKyBcIlxcXCJdLS1cIiArIHR5cGVOYW1lICsgXCItLT5cIiArIHRvQXBwcm92ZS50b19hcHByb3ZlX2lkICsgXCI+XFxcIlwiICsgc3RyVG9IYW5kbGVyTmFtZXMgKyBcIlxcXCJdXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZUlkICsgXCIoXFxcIlwiICsgdHJhY2VOYW1lICsgXCJcXFwiKS0tXCIgKyB0eXBlTmFtZSArIFwiLS0+XCIgKyB0b0FwcHJvdmUudG9fYXBwcm92ZV9pZCArIFwiPlxcXCJcIiArIHN0clRvSGFuZGxlck5hbWVzICsgXCJcXFwiXVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzO1xuICAgIGlmICghXy5pc0VtcHR5KGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcikpIHtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoZnJvbUFwcHJvdmVJZCBpbiBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIpIHtcbiAgICAgICAgZnJvbUFwcHJvdmUgPSBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF07XG4gICAgICAgIHJlc3VsdHMucHVzaCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdHMxO1xuICAgICAgICAgIHJlc3VsdHMxID0gW107XG4gICAgICAgICAgZm9yICh0b0FwcHJvdmVUeXBlIGluIGZyb21BcHByb3ZlKSB7XG4gICAgICAgICAgICB0b0FwcHJvdmVJZCA9IGZyb21BcHByb3ZlW3RvQXBwcm92ZVR5cGVdO1xuICAgICAgICAgICAgdGVtcEhhbmRsZXJOYW1lcyA9IFtdO1xuICAgICAgICAgICAgYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihhcHByb3ZlKSB7XG4gICAgICAgICAgICAgIHZhciByZWY7XG4gICAgICAgICAgICAgIGlmIChmcm9tQXBwcm92ZUlkID09PSBhcHByb3ZlLmZyb21fYXBwcm92ZV9pZCkge1xuICAgICAgICAgICAgICAgIGlmICghKChyZWYgPSB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbYXBwcm92ZS5faWRdKSAhPSBudWxsID8gcmVmW3RvQXBwcm92ZVR5cGVdIDogdm9pZCAwKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBIYW5kbGVyTmFtZXMucHVzaChhcHByb3ZlLmhhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdHMxLnB1c2gobm9kZXMucHVzaChcIlx0Y2xpY2sgXCIgKyB0b0FwcHJvdmVJZCArIFwiIGNhbGxiYWNrIFxcXCJcIiArICh0ZW1wSGFuZGxlck5hbWVzLmpvaW4oXCIsXCIpKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzMTtcbiAgICAgICAgfSkoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH0sXG4gIGdlbmVyYXRlVHJhY2VzR3JhcGhTeW50YXg6IGZ1bmN0aW9uKHRyYWNlcywgaXNDb252ZXJ0VG9TdHJpbmcsIGRpcmVjdGlvbikge1xuICAgIHZhciBncmFwaFN5bnRheCwgbGFzdEFwcHJvdmVzLCBsYXN0VHJhY2UsIG5vZGVzO1xuICAgIG5vZGVzID0gW1wiZ3JhcGggXCIgKyBkaXJlY3Rpb25dO1xuICAgIGxhc3RUcmFjZSA9IG51bGw7XG4gICAgbGFzdEFwcHJvdmVzID0gW107XG4gICAgdHJhY2VzLmZvckVhY2goZnVuY3Rpb24odHJhY2UpIHtcbiAgICAgIHZhciBjdXJyZW50VHJhY2VOYW1lLCBsaW5lcztcbiAgICAgIGxpbmVzID0gdHJhY2UucHJldmlvdXNfdHJhY2VfaWRzO1xuICAgICAgY3VycmVudFRyYWNlTmFtZSA9IHRyYWNlLm5hbWU7XG4gICAgICBpZiAobGluZXMgIT0gbnVsbCA/IGxpbmVzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICB2YXIgY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlcywgZnJvbVRyYWNlLCB0b0FwcHJvdmVzO1xuICAgICAgICAgIGZyb21UcmFjZSA9IHRyYWNlcy5maW5kUHJvcGVydHlCeVBLKFwiX2lkXCIsIGxpbmUpO1xuICAgICAgICAgIGN1cnJlbnRGcm9tVHJhY2VOYW1lID0gZnJvbVRyYWNlLm5hbWU7XG4gICAgICAgICAgZnJvbUFwcHJvdmVzID0gZnJvbVRyYWNlLmFwcHJvdmVzO1xuICAgICAgICAgIHRvQXBwcm92ZXMgPSB0cmFjZS5hcHByb3ZlcztcbiAgICAgICAgICBsYXN0VHJhY2UgPSB0cmFjZTtcbiAgICAgICAgICBsYXN0QXBwcm92ZXMgPSB0b0FwcHJvdmVzO1xuICAgICAgICAgIHJldHVybiBmcm9tQXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihmcm9tQXBwcm92ZSkge1xuICAgICAgICAgICAgdmFyIGZyb21BcHByb3ZlSGFuZGxlck5hbWUsIGZyb21UcmFjZU5hbWUsIGp1ZGdlVGV4dCwgdG9UcmFjZU5hbWU7XG4gICAgICAgICAgICBmcm9tQXBwcm92ZUhhbmRsZXJOYW1lID0gZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lO1xuICAgICAgICAgICAgaWYgKHRvQXBwcm92ZXMgIT0gbnVsbCA/IHRvQXBwcm92ZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0b0FwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24odG9BcHByb3ZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyb21UcmFjZU5hbWUsIGp1ZGdlVGV4dCwgdG9UcmFjZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKFtcImNjXCIsIFwiZm9yd2FyZFwiLCBcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZih0b0FwcHJvdmUudHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKGZyb21BcHByb3ZlLnR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lKGN1cnJlbnRGcm9tVHJhY2VOYW1lLCBmcm9tQXBwcm92ZUhhbmRsZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdG9UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudFRyYWNlTmFtZSwgdG9BcHByb3ZlLmhhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQoZnJvbUFwcHJvdmUuanVkZ2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoanVkZ2VUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgZnJvbVRyYWNlTmFtZSArIFwiXFxcIiktLVwiICsganVkZ2VUZXh0ICsgXCItLT5cIiArIHRvQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgZnJvbVRyYWNlTmFtZSArIFwiXFxcIiktLT5cIiArIHRvQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKFtcImNjXCIsIFwiZm9yd2FyZFwiLCBcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZihmcm9tQXBwcm92ZS50eXBlKSA8IDApIHtcbiAgICAgICAgICAgICAgICBmcm9tVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lKGN1cnJlbnRGcm9tVHJhY2VOYW1lLCBmcm9tQXBwcm92ZUhhbmRsZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChjdXJyZW50VHJhY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBqdWRnZVRleHQgPSBGbG93dmVyc2lvbkFQSS5nZXRBcHByb3ZlSnVkZ2VUZXh0KGZyb21BcHByb3ZlLmp1ZGdlKTtcbiAgICAgICAgICAgICAgICBpZiAoanVkZ2VUZXh0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tXCIgKyBqdWRnZVRleHQgKyBcIi0tPlwiICsgdHJhY2UuX2lkICsgXCIoXFxcIlwiICsgdG9UcmFjZU5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tPlwiICsgdHJhY2UuX2lkICsgXCIoXFxcIlwiICsgdG9UcmFjZU5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNlLmFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oYXBwcm92ZSkge1xuICAgICAgICAgIHZhciB0cmFjZU5hbWU7XG4gICAgICAgICAgdHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lKGN1cnJlbnRUcmFjZU5hbWUsIGFwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBhcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIHRyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZsb3d2ZXJzaW9uQVBJLnB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXgobm9kZXMsIHRyYWNlKTtcbiAgICB9KTtcbiAgICBpZiAobGFzdEFwcHJvdmVzICE9IG51bGwpIHtcbiAgICAgIGxhc3RBcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGxhc3RBcHByb3ZlKSB7XG4gICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRjbGFzcyBcIiArIGxhc3RBcHByb3ZlLl9pZCArIFwiIGN1cnJlbnQtc3RlcC1ub2RlO1wiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNDb252ZXJ0VG9TdHJpbmcpIHtcbiAgICAgIGdyYXBoU3ludGF4ID0gbm9kZXMuam9pbihcIlxcblwiKTtcbiAgICAgIHJldHVybiBncmFwaFN5bnRheDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgfSxcbiAgc2VuZEh0bWxSZXNwb25zZTogZnVuY3Rpb24ocmVxLCByZXMsIHR5cGUpIHtcbiAgICB2YXIgYWxsb3dEaXJlY3Rpb25zLCBjdXJyZW50U3RlcElkLCBkaXJlY3Rpb24sIGVycm9yX21zZywgZmxvd3ZlcnNpb24sIGdyYXBoU3ludGF4LCBpbnN0YW5jZSwgaW5zdGFuY2VfaWQsIHF1ZXJ5LCByZWYsIHJlZjEsIHN0ZXBzLCB0aXRsZSwgdHJhY2VzO1xuICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgIGluc3RhbmNlX2lkID0gcXVlcnkuaW5zdGFuY2VfaWQ7XG4gICAgZGlyZWN0aW9uID0gcXVlcnkuZGlyZWN0aW9uIHx8ICdURCc7XG4gICAgYWxsb3dEaXJlY3Rpb25zID0gWydUQicsICdCVCcsICdSTCcsICdMUicsICdURCddO1xuICAgIGlmICghXy5pbmNsdWRlKGFsbG93RGlyZWN0aW9ucywgZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDUwMCwgXCJJbnZhbGlkIGRpcmVjdGlvbi4gVGhlIHZhbHVlIG9mIGRpcmVjdGlvbiBzaG91bGQgYmUgaW4gWydUQicsICdCVCcsICdSTCcsICdMUicsICdURCddXCIpO1xuICAgIH1cbiAgICBpZiAoIWluc3RhbmNlX2lkKSB7XG4gICAgICBGbG93dmVyc2lvbkFQSS5zZW5kSW52YWxpZFVSTFJlc3BvbnNlKHJlcyk7XG4gICAgfVxuICAgIHRpdGxlID0gcXVlcnkudGl0bGU7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICB0aXRsZSA9IGRlY29kZVVSSUNvbXBvbmVudChkZWNvZGVVUklDb21wb25lbnQodGl0bGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGUgPSBcIldvcmtmbG93IENoYXJ0XCI7XG4gICAgfVxuICAgIGVycm9yX21zZyA9IFwiXCI7XG4gICAgZ3JhcGhTeW50YXggPSBcIlwiO1xuICAgIEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IGZhbHNlO1xuICAgIGlmICh0eXBlID09PSBcInRyYWNlc19leHBhbmRcIikge1xuICAgICAgdHlwZSA9IFwidHJhY2VzXCI7XG4gICAgICBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSB0cnVlO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3RyYWNlcyc6XG4gICAgICAgIGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoaW5zdGFuY2VfaWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHRyYWNlczogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIHRyYWNlcyA9IGluc3RhbmNlLnRyYWNlcztcbiAgICAgICAgICBpZiAodHJhY2VzICE9IG51bGwgPyB0cmFjZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICBncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheCh0cmFjZXMsIGZhbHNlLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZShpbnN0YW5jZV9pZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgZmxvd192ZXJzaW9uOiAxLFxuICAgICAgICAgICAgZmxvdzogMSxcbiAgICAgICAgICAgIHRyYWNlczoge1xuICAgICAgICAgICAgICAkc2xpY2U6IC0xXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgY3VycmVudFN0ZXBJZCA9IChyZWYgPSBpbnN0YW5jZS50cmFjZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZlswXSkgIT0gbnVsbCA/IHJlZjEuc3RlcCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBmbG93dmVyc2lvbiA9IFdvcmtmbG93TWFuYWdlci5nZXRJbnN0YW5jZUZsb3dWZXJzaW9uKGluc3RhbmNlKTtcbiAgICAgICAgICBzdGVwcyA9IGZsb3d2ZXJzaW9uICE9IG51bGwgPyBmbG93dmVyc2lvbi5zdGVwcyA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoc3RlcHMgIT0gbnVsbCA/IHN0ZXBzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgZ3JhcGhTeW50YXggPSB0aGlzLmdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheChzdGVwcywgY3VycmVudFN0ZXBJZCwgZmFsc2UsIGRpcmVjdGlvbiwgaW5zdGFuY2VfaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG4gICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDIwMCwgXCI8IURPQ1RZUEUgaHRtbD5cXG48aHRtbD5cXG5cdDxoZWFkPlxcblx0XHQ8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCI+XFxuXHRcdDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xLHVzZXItc2NhbGFibGU9eWVzXFxcIj5cXG5cdFx0PHRpdGxlPlwiICsgdGl0bGUgKyBcIjwvdGl0bGU+XFxuXHRcdDxtZXRhIG5hbWU9XFxcIm1vYmlsZS13ZWItYXBwLWNhcGFibGVcXFwiIGNvbnRlbnQ9XFxcInllc1xcXCI+XFxuXHRcdDxtZXRhIG5hbWU9XFxcInRoZW1lLWNvbG9yXFxcIiBjb250ZW50PVxcXCIjMDAwXFxcIj5cXG5cdFx0PG1ldGEgbmFtZT1cXFwiYXBwbGljYXRpb24tbmFtZVxcXCI+XFxuXHRcdDxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIi91bnBrZy5jb20vanF1ZXJ5QDEuMTEuMi9kaXN0L2pxdWVyeS5taW4uanNcXFwiPjwvc2NyaXB0Plxcblx0XHQ8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIvdW5wa2cuY29tL21lcm1haWRAOS4xLjIvZGlzdC9tZXJtYWlkLm1pbi5qc1xcXCI+PC9zY3JpcHQ+XFxuXHRcdDxzdHlsZT5cXG5cdFx0XHRib2R5IHsgXFxuXHRcdFx0XHRmb250LWZhbWlseTogJ1NvdXJjZSBTYW5zIFBybycsICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XFxuXHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcblx0XHRcdH1cXG5cdFx0XHQubG9hZGluZ3tcXG5cdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cdFx0XHRcdGxlZnQ6IDBweDtcXG5cdFx0XHRcdHJpZ2h0OiAwcHg7XFxuXHRcdFx0XHR0b3A6IDUwJTtcXG5cdFx0XHRcdHotaW5kZXg6IDExMDA7XFxuXHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXHRcdFx0XHRtYXJnaW4tdG9wOiAtMzBweDtcXG5cdFx0XHRcdGZvbnQtc2l6ZTogMzZweDtcXG5cdFx0XHRcdGNvbG9yOiAjZGZkZmRmO1xcblx0XHRcdH1cXG5cdFx0XHQuZXJyb3ItbXNne1xcblx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xcblx0XHRcdFx0bGVmdDogMHB4O1xcblx0XHRcdFx0cmlnaHQ6IDBweDtcXG5cdFx0XHRcdGJvdHRvbTogMjBweDtcXG5cdFx0XHRcdHotaW5kZXg6IDExMDA7XFxuXHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXHRcdFx0XHRmb250LXNpemU6IDIwcHg7XFxuXHRcdFx0XHRjb2xvcjogI2E5NDQ0MjtcXG5cdFx0XHR9XFxuXHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIHJlY3R7XFxuXHRcdFx0XHRmaWxsOiAjY2NjY2ZmO1xcblx0XHRcdFx0c3Ryb2tlOiByZ2IoMTQ0LCAxNDQsIDI1NSk7XFxuICAgIFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMnB4O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY3VycmVudC1zdGVwLW5vZGUgcmVjdHtcXG5cdFx0XHRcdGZpbGw6ICNjZGU0OTg7XFxuXHRcdFx0XHRzdHJva2U6ICMxMzU0MGM7XFxuXHRcdFx0XHRzdHJva2Utd2lkdGg6IDJweDtcXG5cdFx0XHR9XFxuXHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlLmNvbmRpdGlvbiByZWN0e1xcblx0XHRcdFx0ZmlsbDogI2VjZWNmZjtcXG5cdFx0XHRcdHN0cm9rZTogcmdiKDIwNCwgMjA0LCAyNTUpO1xcbiAgICBcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDFweDtcXG5cdFx0XHR9XFxuXHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIC50cmFjZS1oYW5kbGVyLW5hbWV7XFxuXHRcdFx0XHRjb2xvcjogIzc3NztcXG5cdFx0XHR9XFxuXHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIC5zdGVwLWhhbmRsZXItbmFtZXtcXG5cdFx0XHRcdGNvbG9yOiAjNzc3O1xcblx0XHRcdH1cXG5cdFx0XHRkaXYubWVybWFpZFRvb2x0aXB7XFxuXHRcdFx0XHRwb3NpdGlvbjogZml4ZWQhaW1wb3J0YW50O1xcblx0XHRcdFx0dGV4dC1hbGlnbjogbGVmdCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRwYWRkaW5nOiA0cHghaW1wb3J0YW50O1xcblx0XHRcdFx0Zm9udC1zaXplOiAxNHB4IWltcG9ydGFudDtcXG5cdFx0XHRcdG1heC13aWR0aDogNTAwcHghaW1wb3J0YW50O1xcblx0XHRcdFx0bGVmdDogYXV0byFpbXBvcnRhbnQ7XFxuXHRcdFx0XHR0b3A6IDE1cHghaW1wb3J0YW50O1xcblx0XHRcdFx0cmlnaHQ6IDE1cHg7XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbXtcXG5cdFx0XHRcdGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcXG5cdFx0XHRcdGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuXHRcdFx0XHRwYWRkaW5nOiAycHggMTBweDtcXG5cdFx0XHRcdGZvbnQtc2l6ZTogMjZweDtcXG5cdFx0XHRcdGJvcmRlci1yYWRpdXM6IDIwcHg7XFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiAjZWVlO1xcblx0XHRcdFx0Y29sb3I6ICM3Nzc7XFxuXHRcdFx0XHRwb3NpdGlvbjogZml4ZWQ7XFxuXHRcdFx0XHRib3R0b206IDE1cHg7XFxuXHRcdFx0XHRvdXRsaW5lOiBub25lO1xcblx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xcblx0XHRcdFx0ei1pbmRleDogOTk5OTk7XFxuXHRcdFx0XHQtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0LW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG5cdFx0XHRcdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXG5cdFx0XHRcdHVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0bGluZS1oZWlnaHQ6IDEuMjtcXG5cdFx0XHR9XFxuXHRcdFx0QG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XFxuXHRcdFx0XHQuYnRuLXpvb217XFxuXHRcdFx0XHRcdGRpc3BsYXk6bm9uZTtcXG5cdFx0XHRcdH1cXG5cdFx0XHR9XFxuXHRcdFx0LmJ0bi16b29tOmhvdmVye1xcblx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpO1xcblx0XHRcdH1cXG5cdFx0XHQuYnRuLXpvb20tdXB7XFxuXHRcdFx0XHRsZWZ0OiAxNXB4O1xcblx0XHRcdH1cXG5cdFx0XHQuYnRuLXpvb20tZG93bntcXG5cdFx0XHRcdGxlZnQ6IDYwcHg7XFxuXHRcdFx0XHRwYWRkaW5nOiAxcHggMTNweCAzcHggMTNweDtcXG5cdFx0XHR9XFxuXHRcdDwvc3R5bGU+XFxuXHQ8L2hlYWQ+XFxuXHQ8Ym9keT5cXG5cdFx0PGRpdiBjbGFzcyA9IFxcXCJsb2FkaW5nXFxcIj5Mb2FkaW5nLi4uPC9kaXY+XFxuXHRcdDxkaXYgY2xhc3MgPSBcXFwiZXJyb3ItbXNnXFxcIj5cIiArIGVycm9yX21zZyArIFwiPC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XFxcIm1lcm1haWRcXFwiPjwvZGl2Plxcblx0XHQ8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+XFxuXHRcdFx0bWVybWFpZC5pbml0aWFsaXplKHtcXG5cdFx0XHRcdHN0YXJ0T25Mb2FkOmZhbHNlXFxuXHRcdFx0fSk7XFxuXHRcdFx0JChmdW5jdGlvbigpe1xcblx0XHRcdFx0dmFyIGdyYXBoTm9kZXMgPSBcIiArIChKU09OLnN0cmluZ2lmeShncmFwaFN5bnRheCkpICsgXCI7XFxuXHRcdFx0XHQvL+aWueS+v+WJjemdouWPr+S7pemAmui/h+iwg+eUqG1lcm1haWQuY3VycmVudE5vZGVz6LCD5byP77yM54m55oSP5aKe5YqgY3VycmVudE5vZGVz5bGe5oCn44CCXFxuXHRcdFx0XHRtZXJtYWlkLmN1cnJlbnROb2RlcyA9IGdyYXBoTm9kZXM7XFxuXHRcdFx0XHR2YXIgZ3JhcGhTeW50YXggPSBncmFwaE5vZGVzLmpvaW4oXFxcIlxcXFxuXFxcIik7XFxuXHRcdFx0XHRjb25zb2xlLmxvZyhncmFwaE5vZGVzKTtcXG5cdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoU3ludGF4KTtcXG5cdFx0XHRcdGNvbnNvbGUubG9nKFxcXCJZb3UgY2FuIGFjY2VzcyB0aGUgZ3JhcGggbm9kZXMgYnkgJ21lcm1haWQuY3VycmVudE5vZGVzJyBpbiB0aGUgY29uc29sZSBvZiBicm93c2VyLlxcXCIpO1xcblx0XHRcdFx0JChcXFwiLmxvYWRpbmdcXFwiKS5yZW1vdmUoKTtcXG5cXG5cdFx0XHRcdHZhciBpZCA9IFxcXCJmbG93LXN0ZXBzLXN2Z1xcXCI7XFxuXHRcdFx0XHR2YXIgZWxlbWVudCA9ICQoJy5tZXJtYWlkJyk7XFxuXHRcdFx0XHR2YXIgaW5zZXJ0U3ZnID0gZnVuY3Rpb24oc3ZnQ29kZSwgYmluZEZ1bmN0aW9ucykge1xcblx0XHRcdFx0XHRlbGVtZW50Lmh0bWwoc3ZnQ29kZSk7XFxuXHRcdFx0XHRcdGlmKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpe1xcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGlkKTtcXG5cdFx0XHRcdFx0fVxcblx0XHRcdFx0XHRiaW5kRnVuY3Rpb25zKGVsZW1lbnRbMF0pO1xcblx0XHRcdFx0fTtcXG5cdFx0XHRcdG1lcm1haWQucmVuZGVyKGlkLCBncmFwaFN5bnRheCwgaW5zZXJ0U3ZnLCBlbGVtZW50WzBdKTtcXG5cXG5cdFx0XHRcdHZhciB6b29tU1ZHID0gZnVuY3Rpb24oem9vbSl7XFxuXHRcdFx0XHRcdHZhciBjdXJyZW50V2lkdGggPSAkKFxcXCJzdmdcXFwiKS53aWR0aCgpO1xcblx0XHRcdFx0XHR2YXIgbmV3V2lkdGggPSBjdXJyZW50V2lkdGggKiB6b29tO1xcblx0XHRcdFx0XHQkKFxcXCJzdmdcXFwiKS5jc3MoXFxcIm1heFdpZHRoXFxcIixuZXdXaWR0aCArIFxcXCJweFxcXCIpLndpZHRoKG5ld1dpZHRoKTtcXG5cdFx0XHRcdH1cXG5cXG5cdFx0XHRcdC8v5pSv5oyB6byg5qCH5rua6L2u57yp5pS+55S75biDXFxuXHRcdFx0XHQkKHdpbmRvdykub24oXFxcIm1vdXNld2hlZWxcXFwiLGZ1bmN0aW9uKGV2ZW50KXtcXG5cdFx0XHRcdFx0aWYoZXZlbnQuY3RybEtleSl7XFxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcXG5cdFx0XHRcdFx0XHR2YXIgem9vbSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA+IDAgPyAxLjEgOiAwLjk7XFxuXHRcdFx0XHRcdFx0em9vbVNWRyh6b29tKTtcXG5cdFx0XHRcdFx0fVxcblx0XHRcdFx0fSk7XFxuXHRcdFx0XHQkKFxcXCIuYnRuLXpvb21cXFwiKS5vbihcXFwiY2xpY2tcXFwiLGZ1bmN0aW9uKCl7XFxuXHRcdFx0XHRcdHpvb21TVkcoJCh0aGlzKS5hdHRyKFxcXCJ6b29tXFxcIikpO1xcblx0XHRcdFx0fSk7XFxuXHRcdFx0fSk7XFxuXHRcdDwvc2NyaXB0Plxcblx0XHQ8YSBjbGFzcz1cXFwiYnRuLXpvb20gYnRuLXpvb20tdXBcXFwiIHpvb209MS4xIHRpdGxlPVxcXCLngrnlh7vmlL7lpKdcXFwiPis8L2E+XFxuXHRcdDxhIGNsYXNzPVxcXCJidG4tem9vbSBidG4tem9vbS1kb3duXFxcIiB6b29tPTAuOSB0aXRsZT1cXFwi54K55Ye757yp5bCPXFxcIj4tPC9hPlxcblx0PC9ib2R5PlxcbjwvaHRtbD5cIik7XG4gIH1cbn07XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZShyZXEsIHJlcyk7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0L3RyYWNlcz9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZShyZXEsIHJlcywgXCJ0cmFjZXNcIik7XG59KTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0L3RyYWNlc19leHBhbmQ/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UocmVxLCByZXMsIFwidHJhY2VzX2V4cGFuZFwiKTtcbn0pO1xuIl19
