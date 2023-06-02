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

      if (approverNames.length > 3) {
        stepHandlerName = approverNames.slice(0, 3).join(",") + "...";
      } else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC9yb3V0ZXMvY2hhcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvY2hhcnQuY29mZmVlIl0sIm5hbWVzIjpbIkZsb3d2ZXJzaW9uQVBJIiwidHJhY2VNYXhBcHByb3ZlQ291bnQiLCJ0cmFjZVNwbGl0QXBwcm92ZXNJbmRleCIsImlzRXhwYW5kQXBwcm92ZSIsImdldEFic29sdXRlVXJsIiwidXJsIiwicm9vdFVybCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsIndyaXRlUmVzcG9uc2UiLCJyZXMiLCJodHRwQ29kZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwiZW5kIiwic2VuZEludmFsaWRVUkxSZXNwb25zZSIsInNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2UiLCJyZXBsYWNlRXJyb3JTeW1ib2wiLCJzdHIiLCJyZXBsYWNlIiwiZ2V0U3RlcEhhbmRsZXJOYW1lIiwic3RlcCIsImluc0lkIiwiYXBwcm92ZXJOYW1lcyIsImUiLCJsb2dpblVzZXJJZCIsInN0ZXBIYW5kbGVyTmFtZSIsInN0ZXBJZCIsInVzZXJJZHMiLCJzdGVwX3R5cGUiLCJfaWQiLCJnZXRIYW5kbGVyc01hbmFnZXIiLCJnZXRIYW5kbGVycyIsIm1hcCIsInVzZXJJZCIsInVzZXIiLCJkYiIsInVzZXJzIiwiZmluZE9uZSIsImZpZWxkcyIsIm5hbWUiLCJsZW5ndGgiLCJzbGljZSIsImpvaW4iLCJlcnJvciIsImdldFN0ZXBMYWJlbCIsInN0ZXBOYW1lIiwiZ2V0U3RlcE5hbWUiLCJjYWNoZWRTdGVwTmFtZXMiLCJpbnN0YW5jZV9pZCIsImNhY2hlZFN0ZXBOYW1lIiwiZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4Iiwic3RlcHMiLCJjdXJyZW50U3RlcElkIiwiaXNDb252ZXJ0VG9TdHJpbmciLCJkaXJlY3Rpb24iLCJncmFwaFN5bnRheCIsIm5vZGVzIiwiZm9yRWFjaCIsImxpbmVzIiwibGluZSIsInRvU3RlcCIsInRvU3RlcE5hbWUiLCJwdXNoIiwiZmluZFByb3BlcnR5QnlQSyIsInRvX3N0ZXAiLCJnZXRBcHByb3ZlSnVkZ2VUZXh0IiwianVkZ2UiLCJqdWRnZVRleHQiLCJsb2NhbGUiLCJUQVBpMThuIiwiX18iLCJnZXRUcmFjZU5hbWUiLCJ0cmFjZU5hbWUiLCJhcHByb3ZlSGFuZGxlck5hbWUiLCJnZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZSIsInRyYWNlIiwiYXBwcm92ZXMiLCJjb3VudGVycyIsImFwcHJvdmUiLCJmcm9tX2FwcHJvdmVfaWQiLCJ0eXBlIiwiZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlIiwidHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzIiwidG9BcHByb3ZlIiwidG9BcHByb3ZlRnJvbUlkIiwidG9BcHByb3ZlSGFuZGxlck5hbWUiLCJ0b0FwcHJvdmVUeXBlIiwiaGFuZGxlcl9uYW1lIiwiZnJvbUFwcHJvdmUiLCJjb3VudGVyIiwiY291bnRlcjIiLCJjb3VudGVyQ29udGVudCIsInJlZiIsImZyb21fdHlwZSIsImZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWUiLCJ0b19hcHByb3ZlX2lkIiwidG9fYXBwcm92ZV9oYW5kbGVyX25hbWUiLCJjb3VudCIsInRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcyIsImlzX3RvdGFsIiwicHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheCIsImN1cnJlbnRUcmFjZU5hbWUiLCJleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIiLCJmcm9tQXBwcm92ZUlkIiwicmVzdWx0cyIsInNwbGl0SW5kZXgiLCJ0ZW1wSGFuZGxlck5hbWVzIiwidG9BcHByb3ZlSWQiLCJ0b0FwcHJvdmVzIiwidHJhY2VDb3VudGVycyIsImV4dHJhQ291bnQiLCJpc1R5cGVOb2RlIiwic3RyVG9IYW5kbGVyTmFtZXMiLCJ0b0hhbmRsZXJOYW1lcyIsInR5cGVOYW1lIiwiaW5kZXhPZiIsInNwbGljZSIsIl8iLCJpc0VtcHR5IiwicmVzdWx0czEiLCJnZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4IiwidHJhY2VzIiwibGFzdEFwcHJvdmVzIiwibGFzdFRyYWNlIiwicHJldmlvdXNfdHJhY2VfaWRzIiwiY3VycmVudEZyb21UcmFjZU5hbWUiLCJmcm9tQXBwcm92ZXMiLCJmcm9tVHJhY2UiLCJmcm9tQXBwcm92ZUhhbmRsZXJOYW1lIiwiZnJvbVRyYWNlTmFtZSIsInRvVHJhY2VOYW1lIiwibGFzdEFwcHJvdmUiLCJzZW5kSHRtbFJlc3BvbnNlIiwicmVxIiwiYWxsb3dEaXJlY3Rpb25zIiwiZXJyb3JfbXNnIiwiZmxvd3ZlcnNpb24iLCJpbnN0YW5jZSIsInF1ZXJ5IiwicmVmMSIsInRpdGxlIiwiaW5jbHVkZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImluc3RhbmNlcyIsImZsb3dfdmVyc2lvbiIsImZsb3ciLCIkc2xpY2UiLCJXb3JrZmxvd01hbmFnZXIiLCJnZXRJbnN0YW5jZUZsb3dWZXJzaW9uIiwic2V0SGVhZGVyIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJuZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGNBQUE7QUFBQUEsaUJBRUM7QUFBQUMsd0JBQXNCLEVBQXRCO0FBQ0FDLDJCQUF5QixDQUR6QjtBQUVBQyxtQkFBaUIsS0FGakI7QUFJQUMsa0JBQWdCLFVBQUNDLEdBQUQ7QUFDZixRQUFBQyxPQUFBO0FBQUFBLGNBQWFDLDRCQUErQkEsMEJBQTBCQyxvQkFBekQsR0FBbUYsRUFBaEc7O0FBQ0EsUUFBR0YsT0FBSDtBQUNDRCxZQUFNQyxVQUFVRCxHQUFoQjtBQ0VFOztBRERILFdBQU9BLEdBQVA7QUFSRDtBQVVBSSxpQkFBZSxVQUFDQyxHQUFELEVBQU1DLFFBQU4sRUFBZ0JDLElBQWhCO0FBQ2RGLFFBQUlHLFVBQUosR0FBaUJGLFFBQWpCO0FDR0Us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Q0FBZ0NDLEdBQWhDLEVBQXFDNUgsR0FBckMsRUFBMEMsUUFBMUMsQ0NsSEM7QURnSEY7QUFJQStJLFdBQVdDLEdBQVgsQ0FBZSxLQUFmLEVBQXNCLDREQUF0QixFQUFvRixVQUFDcEIsR0FBRCxFQUFNNUgsR0FBTixFQUFXaUosSUFBWDtBQ2hIbEYsU0RrSEQzSixlQUFlcUksZ0JBQWYsQ0FBZ0NDLEdBQWhDLEVBQXFDNUgsR0FBckMsRUFBMEMsZUFBMUMsQ0NsSEM7QURnSEYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIkZsb3d2ZXJzaW9uQVBJID1cblxuXHR0cmFjZU1heEFwcHJvdmVDb3VudDogMTBcblx0dHJhY2VTcGxpdEFwcHJvdmVzSW5kZXg6IDVcblx0aXNFeHBhbmRBcHByb3ZlOiBmYWxzZVxuXG5cdGdldEFic29sdXRlVXJsOiAodXJsKS0+XG5cdFx0cm9vdFVybCA9IGlmIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gdGhlbiBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYIGVsc2UgXCJcIlxuXHRcdGlmIHJvb3RVcmxcblx0XHRcdHVybCA9IHJvb3RVcmwgKyB1cmxcblx0XHRyZXR1cm4gdXJsO1xuXG5cdHdyaXRlUmVzcG9uc2U6IChyZXMsIGh0dHBDb2RlLCBib2R5KS0+XG5cdFx0cmVzLnN0YXR1c0NvZGUgPSBodHRwQ29kZTtcblx0XHRyZXMuZW5kKGJvZHkpO1xuXHRcdFxuXHRzZW5kSW52YWxpZFVSTFJlc3BvbnNlOiAocmVzKS0+XG5cdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlKHJlcywgNDA0LCBcInVybCBtdXN0IGhhcyBxdWVyeXMgYXMgaW5zdGFuY2VfaWQuXCIpO1xuXHRcdFxuXHRzZW5kQXV0aFRva2VuRXhwaXJlZFJlc3BvbnNlOiAocmVzKS0+XG5cdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlKHJlcywgNDAxLCBcInRoZSBhdXRoX3Rva2VuIGhhcyBleHBpcmVkLlwiKTtcblxuXHRyZXBsYWNlRXJyb3JTeW1ib2w6IChzdHIpLT5cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL1xcXCIvZyxcIiZxdW90O1wiKS5yZXBsYWNlKC9cXG4vZyxcIjxici8+XCIpXG5cblx0Z2V0U3RlcEhhbmRsZXJOYW1lOiAoc3RlcCwgaW5zSWQpLT5cblx0XHR0cnlcblx0XHRcdHN0ZXBIYW5kbGVyTmFtZSA9IFwiXCJcblx0XHRcdGlmIHN0ZXAuc3RlcF90eXBlID09IFwiY29uZGl0aW9uXCJcblx0XHRcdFx0cmV0dXJuIHN0ZXBIYW5kbGVyTmFtZVxuXG5cdFx0XHQjIFRPRE8g6I635Y+W5b2T5YmN55So5oi3dXNlcklkXG5cdFx0XHRsb2dpblVzZXJJZCA9ICcnIFxuXHRcdFx0c3RlcElkID0gc3RlcC5faWRcblx0XHRcdHVzZXJJZHMgPSBnZXRIYW5kbGVyc01hbmFnZXIuZ2V0SGFuZGxlcnMoaW5zSWQsIHN0ZXBJZCwgbG9naW5Vc2VySWQpXG5cdFx0XHRhcHByb3Zlck5hbWVzID0gdXNlcklkcy5tYXAgKHVzZXJJZCktPlxuXHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHsgZmllbGRzOiB7IG5hbWU6IDEgfSB9KVxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0cmV0dXJuIHVzZXIubmFtZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHRcdGlmIGFwcHJvdmVyTmFtZXMubGVuZ3RoID4gM1xuICAgICAgICBcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5zbGljZSgwLDMpLmpvaW4oXCIsXCIpICsgXCIuLi5cIlxuICAgICAgXHRcdGVsc2VcbiAgICAgICAgXHRcdHN0ZXBIYW5kbGVyTmFtZSA9IGFwcHJvdmVyTmFtZXMuam9pbihcIixcIilcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHN0ZXBIYW5kbGVyTmFtZVxuXHRcdGNhdGNoIGVcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdCMgc3dpdGNoIHN0ZXAuZGVhbF90eXBlXG5cdFx0IyBcdHdoZW4gJ3NwZWNpZnlVc2VyJ1xuXHRcdCMgXHRcdGFwcHJvdmVyTmFtZXMgPSBzdGVwLmFwcHJvdmVyX3VzZXJzLm1hcCAodXNlcklkKS0+XG5cdFx0IyBcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQpXG5cdFx0IyBcdFx0XHRpZiB1c2VyXG5cdFx0IyBcdFx0XHRcdHJldHVybiB1c2VyLm5hbWVcblx0XHQjIFx0XHRcdGVsc2Vcblx0XHQjIFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHQjIFx0XHRzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpXG5cdFx0IyBcdHdoZW4gJ2FwcGxpY2FudFJvbGUnXG5cdFx0IyBcdFx0YXBwcm92ZXJOYW1lcyA9IHN0ZXAuYXBwcm92ZXJfcm9sZXMubWFwIChyb2xlSWQpLT5cblx0XHQjIFx0XHRcdHJvbGUgPSBkYi5mbG93X3JvbGVzLmZpbmRPbmUocm9sZUlkKVxuXHRcdCMgXHRcdFx0aWYgcm9sZVxuXHRcdCMgXHRcdFx0XHRyZXR1cm4gcm9sZS5uYW1lXG5cdFx0IyBcdFx0XHRlbHNlXG5cdFx0IyBcdFx0XHRcdHJldHVybiBcIlwiXG5cdFx0IyBcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKVxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0c3RlcEhhbmRsZXJOYW1lID0gJydcblx0XHQjIFx0XHRicmVha1xuXHRcdCMgcmV0dXJuIHN0ZXBIYW5kbGVyTmFtZVxuXG5cdGdldFN0ZXBMYWJlbDogKHN0ZXBOYW1lLCBzdGVwSGFuZGxlck5hbWUpLT5cblx0XHQjIOi/lOWbnnNzdGVwTmFtZeS4jnN0ZXBIYW5kbGVyTmFtZee7k+WQiOeahOatpemqpOaYvuekuuWQjeensFxuXHRcdGlmIHN0ZXBOYW1lXG5cdFx0XHRzdGVwTmFtZSA9IFwiPGRpdiBjbGFzcz0nZ3JhcGgtbm9kZSc+XG5cdFx0XHRcdDxkaXYgY2xhc3M9J3N0ZXAtbmFtZSc+I3tzdGVwTmFtZX08L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz0nc3RlcC1oYW5kbGVyLW5hbWUnPiN7c3RlcEhhbmRsZXJOYW1lfTwvZGl2PlxuXHRcdFx0PC9kaXY+XCJcblx0XHRcdCMg5oqK54m55q6K5a2X56ym5riF56m65oiW5pu/5o2i77yM5Lul6YG/5YWNbWVybWFpZEFQSeWHuueOsOW8guW4uFxuXHRcdFx0c3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2woc3RlcE5hbWUpXG5cdFx0ZWxzZVxuXHRcdFx0c3RlcE5hbWUgPSBcIlwiXG5cdFx0cmV0dXJuIHN0ZXBOYW1lXG5cblx0Z2V0U3RlcE5hbWU6IChzdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKS0+XG5cdFx0IyDov5Tlm55zdGVw6IqC54K55ZCN56ew77yM5LyY5YWI5LuO57yT5a2YY2FjaGVkU3RlcE5hbWVz5Lit5Y+W77yM5ZCm5YiZ6LCD55SoZ2V0U3RlcExhYmVs55Sf5oiQXG5cdFx0Y2FjaGVkU3RlcE5hbWUgPSBjYWNoZWRTdGVwTmFtZXNbc3RlcC5faWRdXG5cdFx0aWYgY2FjaGVkU3RlcE5hbWVcblx0XHRcdHJldHVybiBjYWNoZWRTdGVwTmFtZVxuXHRcdHN0ZXBIYW5kbGVyTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBIYW5kbGVyTmFtZShzdGVwLCBpbnN0YW5jZV9pZClcblx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBMYWJlbChzdGVwLm5hbWUsIHN0ZXBIYW5kbGVyTmFtZSlcblx0XHRjYWNoZWRTdGVwTmFtZXNbc3RlcC5faWRdID0gc3RlcE5hbWVcblx0XHRyZXR1cm4gc3RlcE5hbWVcblxuXHRnZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXg6IChzdGVwcywgY3VycmVudFN0ZXBJZCwgaXNDb252ZXJ0VG9TdHJpbmcsIGRpcmVjdGlvbiwgaW5zdGFuY2VfaWQpLT5cblx0XHRub2RlcyA9IFtcImdyYXBoICN7ZGlyZWN0aW9ufVwiXVxuXHRcdGNhY2hlZFN0ZXBOYW1lcyA9IHt9XG5cdFx0c3RlcHMuZm9yRWFjaCAoc3RlcCktPlxuXHRcdFx0bGluZXMgPSBzdGVwLmxpbmVzXG5cdFx0XHRpZiBsaW5lcz8ubGVuZ3RoXG5cdFx0XHRcdGxpbmVzLmZvckVhY2ggKGxpbmUpLT5cblx0XHRcdFx0XHRpZiBzdGVwLm5hbWVcblx0XHRcdFx0XHRcdCMg5qCH6K6w5p2h5Lu26IqC54K5XG5cdFx0XHRcdFx0XHRpZiBzdGVwLnN0ZXBfdHlwZSA9PSBcImNvbmRpdGlvblwiXG5cdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdGNsYXNzICN7c3RlcC5faWR9IGNvbmRpdGlvbjtcIlxuXHRcdFx0XHRcdFx0c3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwTmFtZShzdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0ZXBOYW1lID0gXCJcIlxuXHRcdFx0XHRcdHRvU3RlcCA9IHN0ZXBzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIixsaW5lLnRvX3N0ZXApXG5cdFx0XHRcdFx0dG9TdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHRvU3RlcCwgY2FjaGVkU3RlcE5hbWVzLCBpbnN0YW5jZV9pZClcblx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje3N0ZXAuX2lkfShcXFwiI3tzdGVwTmFtZX1cXFwiKS0tPiN7bGluZS50b19zdGVwfShcXFwiI3t0b1N0ZXBOYW1lfVxcXCIpXCJcblxuXHRcdGlmIGN1cnJlbnRTdGVwSWRcblx0XHRcdG5vZGVzLnB1c2ggXCJcdGNsYXNzICN7Y3VycmVudFN0ZXBJZH0gY3VycmVudC1zdGVwLW5vZGU7XCJcblx0XHRpZiBpc0NvbnZlcnRUb1N0cmluZ1xuXHRcdFx0Z3JhcGhTeW50YXggPSBub2Rlcy5qb2luIFwiXFxuXCJcblx0XHRcdHJldHVybiBncmFwaFN5bnRheFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBub2Rlc1xuXG5cdGdldEFwcHJvdmVKdWRnZVRleHQ6IChqdWRnZSktPlxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdHN3aXRjaCBqdWRnZVxuXHRcdFx0d2hlbiAnYXBwcm92ZWQnXG5cdFx0XHRcdCMg5bey5qC45YeGXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIGFwcHJvdmVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JlamVjdGVkJ1xuXHRcdFx0XHQjIOW3sumps+WbnlxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWplY3RlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICd0ZXJtaW5hdGVkJ1xuXHRcdFx0XHQjIOW3suWPlua2iFxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSB0ZXJtaW5hdGVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JlYXNzaWduZWQnXG5cdFx0XHRcdCMg6L2s562+5qC4XG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlYXNzaWduZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVsb2NhdGVkJ1xuXHRcdFx0XHQjIOmHjeWumuS9jVxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWxvY2F0ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmV0cmlldmVkJ1xuXHRcdFx0XHQjIOW3suWPluWbnlxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZXRyaWV2ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmV0dXJuZWQnXG5cdFx0XHRcdCMg5bey6YCA5ZueXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHVybmVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JlYWRlZCdcblx0XHRcdFx0IyDlt7LpmIVcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhZGVkJywge30sIGxvY2FsZSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0anVkZ2VUZXh0ID0gJydcblx0XHRcdFx0YnJlYWtcblx0XHRyZXR1cm4ganVkZ2VUZXh0XG5cblx0Z2V0VHJhY2VOYW1lOiAodHJhY2VOYW1lLCBhcHByb3ZlSGFuZGxlck5hbWUpLT5cblx0XHQjIOi/lOWbnnRyYWNl6IqC54K55ZCN56ewXG5cdFx0aWYgdHJhY2VOYW1lXG5cdFx0XHQjIOaKiueJueauiuWtl+espua4heepuuaIluabv+aNou+8jOS7pemBv+WFjW1lcm1haWRBUEnlh7rnjrDlvILluLhcblx0XHRcdHRyYWNlTmFtZSA9IFwiPGRpdiBjbGFzcz0nZ3JhcGgtbm9kZSc+XG5cdFx0XHRcdDxkaXYgY2xhc3M9J3RyYWNlLW5hbWUnPiN7dHJhY2VOYW1lfTwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPSd0cmFjZS1oYW5kbGVyLW5hbWUnPiN7YXBwcm92ZUhhbmRsZXJOYW1lfTwvZGl2PlxuXHRcdFx0PC9kaXY+XCJcblx0XHRcdHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbCh0cmFjZU5hbWUpXG5cdFx0ZWxzZVxuXHRcdFx0dHJhY2VOYW1lID0gXCJcIlxuXHRcdHJldHVybiB0cmFjZU5hbWVcblx0XG5cdGdldFRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1dpdGhUeXBlOiAodHJhY2UpLT5cblx0XHQjIOivpeWHveaVsOeUn+aIkGpzb27nu5PmnoTvvIzooajnjrDlh7rmiYDmnInkvKDpmIXjgIHliIblj5HjgIHovazlj5HoioLngrnmnInmnInlkI7nu63lrZDoioLngrnnmoTorqHmlbDmg4XlhrXvvIzlhbbnu5PmnoTkuLrvvJpcblx0XHQjIGNvdW50ZXJzID0ge1xuXHRcdCMgXHRbZnJvbUFwcHJvdmVJZCjmnaXmupDoioLngrlJRCldOntcblx0XHQjIFx0XHRbdG9BcHByb3ZlVHlwZSjnm67moIfnu5PngrnnsbvlnospXTrnm67moIfoioLngrnlnKjmjIflrprnsbvlnovkuIvnmoTlkI7nu63oioLngrnkuKrmlbBcblx0XHQjIFx0fVxuXHRcdCMgfVxuXHRcdGNvdW50ZXJzID0ge31cblx0XHRhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0dW5sZXNzIGFwcHJvdmVzXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdGFwcHJvdmVzLmZvckVhY2ggKGFwcHJvdmUpLT5cblx0XHRcdGlmIGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXG5cdFx0XHRcdHVubGVzcyBjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1cblx0XHRcdFx0XHRjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF0gPSB7fVxuXHRcdFx0XHRpZiBjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXVxuXHRcdFx0XHRcdGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdKytcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdID0gMVxuXHRcdHJldHVybiBjb3VudGVyc1xuXG5cdGdldFRyYWNlQ291bnRlcnNXaXRoVHlwZTogKHRyYWNlLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMpLT5cblx0XHQjIOivpeWHveaVsOeUn+aIkGpzb27nu5PmnoTvvIzooajnjrDlh7rmiYDmnInkvKDpmIXjgIHliIblj5HjgIHovazlj5HnmoToioLngrnmtYHlkJHvvIzlhbbnu5PmnoTkuLrvvJpcblx0XHQjIGNvdW50ZXJzID0ge1xuXHRcdCMgXHRbZnJvbUFwcHJvdmVJZCjmnaXmupDoioLngrlJRCldOntcblx0XHQjIFx0XHRbdG9BcHByb3ZlVHlwZSjnm67moIfnu5PngrnnsbvlnospXTpbe1xuXHRcdCMgXHRcdFx0ZnJvbV90eXBlOiDmnaXmupDoioLngrnnsbvlnotcblx0XHQjIFx0XHRcdGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IOadpea6kOiKgueCueWkhOeQhuS6ulxuXHRcdCMgXHRcdFx0dG9fYXBwcm92ZV9pZDog55uu5qCH6IqC54K5SURcblx0XHQjIFx0XHRcdHRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lczogW+WkmuS4quebruagh+iKgueCueaxh+aAu+WkhOeQhuS6uumbhuWQiF1cblx0XHQjIFx0XHRcdGlzX3RvdGFsOiB0cnVlL2ZhbHNl77yM5piv5ZCm5rGH5oC76IqC54K5XG5cdFx0IyBcdFx0fSwuLi5dXG5cdFx0IyBcdH1cblx0XHQjIH1cblx0XHQjIOS4iui/sOebruagh+e7k+eCueWGheWuueS4reacieS4gOS4quWxnuaAp2lzX3RvdGFs6KGo56S65piv5ZCm5rGH5oC76IqC54K577yM5aaC5p6c5piv77yM5YiZ5oqK5aSa5Liq6IqC54K55rGH5oC75ZCI5bm25oiQ5LiA5Liq77yMXG5cdFx0IyDkvYbmmK/mnKzouqvmnInlkI7nu63lrZDoioLngrnnmoToioLngrnkuI3lj4LkuI7msYfmgLvlj4rorqHmlbDjgIJcblx0XHRjb3VudGVycyA9IHt9XG5cdFx0YXBwcm92ZXMgPSB0cmFjZS5hcHByb3Zlc1xuXHRcdHVubGVzcyBhcHByb3Zlc1xuXHRcdFx0cmV0dXJuIG51bGxcblx0XHR0cmFjZU1heEFwcHJvdmVDb3VudCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlTWF4QXBwcm92ZUNvdW50XG5cdFx0aXNFeHBhbmRBcHByb3ZlID0gRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlXG5cblx0XHRhcHByb3Zlcy5mb3JFYWNoICh0b0FwcHJvdmUpLT5cblx0XHRcdHRvQXBwcm92ZVR5cGUgPSB0b0FwcHJvdmUudHlwZVxuXHRcdFx0dG9BcHByb3ZlRnJvbUlkID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9pZFxuXHRcdFx0dG9BcHByb3ZlSGFuZGxlck5hbWUgPSB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHR1bmxlc3MgdG9BcHByb3ZlRnJvbUlkXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0YXBwcm92ZXMuZm9yRWFjaCAoZnJvbUFwcHJvdmUpLT5cblx0XHRcdFx0aWYgZnJvbUFwcHJvdmUuX2lkID09IHRvQXBwcm92ZUZyb21JZFxuXHRcdFx0XHRcdGNvdW50ZXIgPSBjb3VudGVyc1t0b0FwcHJvdmVGcm9tSWRdXG5cdFx0XHRcdFx0dW5sZXNzIGNvdW50ZXJcblx0XHRcdFx0XHRcdGNvdW50ZXIgPSBjb3VudGVyc1t0b0FwcHJvdmVGcm9tSWRdID0ge31cblx0XHRcdFx0XHR1bmxlc3MgY291bnRlclt0b0FwcHJvdmUudHlwZV1cblx0XHRcdFx0XHRcdGNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdID0gW11cblx0XHRcdFx0XHRjb3VudGVyMiA9IGNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdXG5cdFx0XHRcdFx0aWYgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzW3RvQXBwcm92ZS5faWRdP1t0b0FwcHJvdmVUeXBlXVxuXHRcdFx0XHRcdFx0IyDmnInlkI7nu63lrZDoioLngrnvvIzliJnkuI3lj4LkuI7msYfmgLvlj4rorqHmlbBcblx0XHRcdFx0XHRcdGNvdW50ZXIyLnB1c2hcblx0XHRcdFx0XHRcdFx0ZnJvbV90eXBlOiBmcm9tQXBwcm92ZS50eXBlXG5cdFx0XHRcdFx0XHRcdGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2lkOiB0b0FwcHJvdmUuX2lkXG5cdFx0XHRcdFx0XHRcdHRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRjb3VudGVyQ29udGVudCA9IGlmIGlzRXhwYW5kQXBwcm92ZSB0aGVuIG51bGwgZWxzZSBjb3VudGVyMi5maW5kUHJvcGVydHlCeVBLKFwiaXNfdG90YWxcIiwgdHJ1ZSlcblx0XHRcdFx0XHRcdCMgY291bnRlckNvbnRlbnQgPSBjb3VudGVyMi5maW5kUHJvcGVydHlCeVBLKFwiaXNfdG90YWxcIiwgdHJ1ZSlcblx0XHRcdFx0XHRcdCMg5aaC5p6c5by65Yi26KaB5rGC5bGV5byA5omA5pyJ6IqC54K577yM5YiZ5LiN5YGa5rGH5oC75aSE55CGXG5cdFx0XHRcdFx0XHRpZiBjb3VudGVyQ29udGVudFxuXHRcdFx0XHRcdFx0XHRjb3VudGVyQ29udGVudC5jb3VudCsrXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBjb3VudGVyQ29udGVudC5jb3VudCA+IHRyYWNlTWF4QXBwcm92ZUNvdW50XG5cdFx0XHRcdFx0XHRcdFx0Y291bnRlckNvbnRlbnQudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzLnB1c2ggdG9BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRjb3VudGVyMi5wdXNoXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbV90eXBlOiBmcm9tQXBwcm92ZS50eXBlXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdFx0dG9fYXBwcm92ZV9pZDogdG9BcHByb3ZlLl9pZFxuXHRcdFx0XHRcdFx0XHRcdGNvdW50OiAxXG5cdFx0XHRcdFx0XHRcdFx0dG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzOiBbdG9BcHByb3ZlLmhhbmRsZXJfbmFtZV1cblx0XHRcdFx0XHRcdFx0XHRpc190b3RhbDogdHJ1ZVxuXG5cdFx0cmV0dXJuIGNvdW50ZXJzXG5cblx0cHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheDogKG5vZGVzLCB0cmFjZSktPlxuXHRcdHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1dpdGhUeXBlIHRyYWNlXG5cdFx0dHJhY2VDb3VudGVycyA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlQ291bnRlcnNXaXRoVHlwZSB0cmFjZSwgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzXG5cdFx0dW5sZXNzIHRyYWNlQ291bnRlcnNcblx0XHRcdHJldHVyblxuXHRcdGV4dHJhSGFuZGxlck5hbWVzQ291bnRlciA9IHt9ICPorrDlvZXpnIDopoHpop3lpJbnlJ/miJDmiYDmnInlpITnkIbkurrlp5PlkI3nmoTooqvkvKDpmIXjgIHliIblj5HjgIHovazlj5HoioLngrlcblx0XHR0cmFjZU1heEFwcHJvdmVDb3VudCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlTWF4QXBwcm92ZUNvdW50XG5cdFx0c3BsaXRJbmRleCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlU3BsaXRBcHByb3Zlc0luZGV4XG5cdFx0Y3VycmVudFRyYWNlTmFtZSA9IHRyYWNlLm5hbWVcblx0XHRmb3IgZnJvbUFwcHJvdmVJZCxmcm9tQXBwcm92ZSBvZiB0cmFjZUNvdW50ZXJzXG5cdFx0XHRmb3IgdG9BcHByb3ZlVHlwZSx0b0FwcHJvdmVzIG9mIGZyb21BcHByb3ZlXG5cdFx0XHRcdHRvQXBwcm92ZXMuZm9yRWFjaCAodG9BcHByb3ZlKS0+XG5cdFx0XHRcdFx0dHlwZU5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0c3dpdGNoIHRvQXBwcm92ZVR5cGVcblx0XHRcdFx0XHRcdHdoZW4gJ2NjJ1xuXHRcdFx0XHRcdFx0XHR0eXBlTmFtZSA9IFwi5Lyg6ZiFXCJcblx0XHRcdFx0XHRcdHdoZW4gJ2ZvcndhcmQnXG5cdFx0XHRcdFx0XHRcdHR5cGVOYW1lID0gXCLovazlj5FcIlxuXHRcdFx0XHRcdFx0d2hlbiAnZGlzdHJpYnV0ZSdcblx0XHRcdFx0XHRcdFx0dHlwZU5hbWUgPSBcIuWIhuWPkVwiXG5cdFx0XHRcdFx0aXNUeXBlTm9kZSA9IFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLmZyb21fdHlwZSkgPj0gMFxuXHRcdFx0XHRcdGlmIGlzVHlwZU5vZGVcblx0XHRcdFx0XHRcdHRyYWNlTmFtZSA9IHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lIGN1cnJlbnRUcmFjZU5hbWUsIHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0aWYgdG9BcHByb3ZlLmlzX3RvdGFsXG5cdFx0XHRcdFx0XHR0b0hhbmRsZXJOYW1lcyA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2hhbmRsZXJfbmFtZXNcblx0XHRcdFx0XHRcdGlmIHNwbGl0SW5kZXggYW5kIHRvQXBwcm92ZS5jb3VudCA+IHNwbGl0SW5kZXhcblx0XHRcdFx0XHRcdFx0IyDlnKjlp5PlkI3pm4blkIjkuK3mj5LlhaXlm57ovabnrKblj7fmjaLooYxcblx0XHRcdFx0XHRcdFx0dG9IYW5kbGVyTmFtZXMuc3BsaWNlKHNwbGl0SW5kZXgsMCxcIjxici8+LFwiKVxuXHRcdFx0XHRcdFx0c3RyVG9IYW5kbGVyTmFtZXMgPSB0b0hhbmRsZXJOYW1lcy5qb2luKFwiLFwiKS5yZXBsYWNlKFwiLCxcIixcIlwiKVxuXHRcdFx0XHRcdFx0ZXh0cmFDb3VudCA9IHRvQXBwcm92ZS5jb3VudCAtIHRyYWNlTWF4QXBwcm92ZUNvdW50XG5cdFx0XHRcdFx0XHRpZiBleHRyYUNvdW50ID4gMFxuXHRcdFx0XHRcdFx0XHRzdHJUb0hhbmRsZXJOYW1lcyArPSBcIuetiSN7dG9BcHByb3ZlLmNvdW50feS6ulwiXG5cdFx0XHRcdFx0XHRcdHVubGVzcyBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF1cblx0XHRcdFx0XHRcdFx0XHRleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF0gPSB7fVxuXHRcdFx0XHRcdFx0XHRleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF1bdG9BcHByb3ZlVHlwZV0gPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9pZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0clRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0aWYgaXNUeXBlTm9kZVxuXHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tmcm9tQXBwcm92ZUlkfT5cXFwiI3t0cmFjZU5hbWV9XFxcIl0tLSN7dHlwZU5hbWV9LS0+I3t0b0FwcHJvdmUudG9fYXBwcm92ZV9pZH0+XFxcIiN7c3RyVG9IYW5kbGVyTmFtZXN9XFxcIl1cIlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmVJZH0oXFxcIiN7dHJhY2VOYW1lfVxcXCIpLS0je3R5cGVOYW1lfS0tPiN7dG9BcHByb3ZlLnRvX2FwcHJvdmVfaWR9PlxcXCIje3N0clRvSGFuZGxlck5hbWVzfVxcXCJdXCJcblxuXHRcdCMg5Li66ZyA6KaB6aKd5aSW55Sf5oiQ5omA5pyJ5aSE55CG5Lq65aeT5ZCN55qE6KKr5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R6IqC54K577yM5aKe5Yqg6byg5qCH5by55Ye66K+m57uG5bGC5LqL5Lu2XG5cdFx0IyBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXLnmoTnu5PmnoTkuLrvvJpcblx0XHQjIGNvdW50ZXJzID0ge1xuXHRcdCMgXHRbZnJvbUFwcHJvdmVJZCjmnaXmupDoioLngrlJRCldOntcblx0XHQjIFx0XHRbdG9BcHByb3ZlVHlwZSjnm67moIfnu5PngrnnsbvlnospXTrnm67moIfnu5PngrlJRFxuXHRcdCMgXHR9XG5cdFx0IyB9XG5cdFx0YXBwcm92ZXMgPSB0cmFjZS5hcHByb3Zlc1xuXHRcdHVubGVzcyBfLmlzRW1wdHkoZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyKVxuXHRcdFx0Zm9yIGZyb21BcHByb3ZlSWQsZnJvbUFwcHJvdmUgb2YgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyXG5cdFx0XHRcdGZvciB0b0FwcHJvdmVUeXBlLHRvQXBwcm92ZUlkIG9mIGZyb21BcHByb3ZlXG5cdFx0XHRcdFx0dGVtcEhhbmRsZXJOYW1lcyA9IFtdXG5cdFx0XHRcdFx0YXBwcm92ZXMuZm9yRWFjaCAoYXBwcm92ZSktPlxuXHRcdFx0XHRcdFx0aWYgZnJvbUFwcHJvdmVJZCA9PSBhcHByb3ZlLmZyb21fYXBwcm92ZV9pZFxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzW2FwcHJvdmUuX2lkXT9bdG9BcHByb3ZlVHlwZV1cblx0XHRcdFx0XHRcdFx0XHQjIOacieWQjue7reWtkOiKgueCue+8jOWImeS4jeWPguS4juaxh+aAu+WPiuiuoeaVsFxuXHRcdFx0XHRcdFx0XHRcdHRlbXBIYW5kbGVyTmFtZXMucHVzaCBhcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdGNsaWNrICN7dG9BcHByb3ZlSWR9IGNhbGxiYWNrIFxcXCIje3RlbXBIYW5kbGVyTmFtZXMuam9pbihcIixcIil9XFxcIlwiXG5cblx0Z2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheDogKHRyYWNlcywgaXNDb252ZXJ0VG9TdHJpbmcsIGRpcmVjdGlvbiktPlxuXHRcdG5vZGVzID0gW1wiZ3JhcGggI3tkaXJlY3Rpb259XCJdXG5cdFx0bGFzdFRyYWNlID0gbnVsbFxuXHRcdGxhc3RBcHByb3ZlcyA9IFtdXG5cdFx0dHJhY2VzLmZvckVhY2ggKHRyYWNlKS0+XG5cdFx0XHRsaW5lcyA9IHRyYWNlLnByZXZpb3VzX3RyYWNlX2lkc1xuXHRcdFx0Y3VycmVudFRyYWNlTmFtZSA9IHRyYWNlLm5hbWVcblx0XHRcdGlmIGxpbmVzPy5sZW5ndGhcblx0XHRcdFx0bGluZXMuZm9yRWFjaCAobGluZSktPlxuXHRcdFx0XHRcdGZyb21UcmFjZSA9IHRyYWNlcy5maW5kUHJvcGVydHlCeVBLKFwiX2lkXCIsbGluZSlcblx0XHRcdFx0XHRjdXJyZW50RnJvbVRyYWNlTmFtZSA9IGZyb21UcmFjZS5uYW1lXG5cdFx0XHRcdFx0ZnJvbUFwcHJvdmVzID0gZnJvbVRyYWNlLmFwcHJvdmVzXG5cdFx0XHRcdFx0dG9BcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0XHRcdFx0bGFzdFRyYWNlID0gdHJhY2Vcblx0XHRcdFx0XHRsYXN0QXBwcm92ZXMgPSB0b0FwcHJvdmVzXG5cdFx0XHRcdFx0ZnJvbUFwcHJvdmVzLmZvckVhY2ggKGZyb21BcHByb3ZlKS0+XG5cdFx0XHRcdFx0XHRmcm9tQXBwcm92ZUhhbmRsZXJOYW1lID0gZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRpZiB0b0FwcHJvdmVzPy5sZW5ndGhcblx0XHRcdFx0XHRcdFx0dG9BcHByb3Zlcy5mb3JFYWNoICh0b0FwcHJvdmUpLT5cblx0XHRcdFx0XHRcdFx0XHRpZiBbXCJjY1wiLFwiZm9yd2FyZFwiLFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKHRvQXBwcm92ZS50eXBlKSA8IDBcblx0XHRcdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUgY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG9UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUgY3VycmVudFRyYWNlTmFtZSwgdG9BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQjIOS4jeaYr+S8oOmYheOAgeWIhuWPkeOAgei9rOWPke+8jOWImei/nuaOpeWIsOS4i+S4gOS4qnRyYWNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQgZnJvbUFwcHJvdmUuanVkZ2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYganVkZ2VUZXh0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tmcm9tQXBwcm92ZS5faWR9KFxcXCIje2Zyb21UcmFjZU5hbWV9XFxcIiktLSN7anVkZ2VUZXh0fS0tPiN7dG9BcHByb3ZlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tmcm9tQXBwcm92ZS5faWR9KFxcXCIje2Zyb21UcmFjZU5hbWV9XFxcIiktLT4je3RvQXBwcm92ZS5faWR9KFxcXCIje3RvVHJhY2VOYW1lfVxcXCIpXCJcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0IyDmnIDlkI7kuIDkuKrmraXpqqTnmoR0cmFjZVxuXHRcdFx0XHRcdFx0XHRpZiBbXCJjY1wiLFwiZm9yd2FyZFwiLFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKGZyb21BcHByb3ZlLnR5cGUpIDwgMFxuXHRcdFx0XHRcdFx0XHRcdGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUgY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWVcblx0XHRcdFx0XHRcdFx0XHR0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChjdXJyZW50VHJhY2VOYW1lKVxuXHRcdFx0XHRcdFx0XHRcdCMg5LiN5piv5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R77yM5YiZ6L+e5o6l5Yiw5LiL5LiA5LiqdHJhY2Vcblx0XHRcdFx0XHRcdFx0XHRqdWRnZVRleHQgPSBGbG93dmVyc2lvbkFQSS5nZXRBcHByb3ZlSnVkZ2VUZXh0IGZyb21BcHByb3ZlLmp1ZGdlXG5cdFx0XHRcdFx0XHRcdFx0aWYganVkZ2VUZXh0XG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tI3tqdWRnZVRleHR9LS0+I3t0cmFjZS5faWR9KFxcXCIje3RvVHJhY2VOYW1lfVxcXCIpXCJcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tPiN7dHJhY2UuX2lkfShcXFwiI3t0b1RyYWNlTmFtZX1cXFwiKVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg56ys5LiA5LiqdHJhY2XvvIzlm6B0cmFjZXPlj6/og73lj6rmnInkuIDkuKrvvIzov5nml7bpnIDopoHljZXni6zmmL7npLrlh7rmnaVcblx0XHRcdFx0dHJhY2UuYXBwcm92ZXMuZm9yRWFjaCAoYXBwcm92ZSktPlxuXHRcdFx0XHRcdHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50VHJhY2VOYW1lLCBhcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7YXBwcm92ZS5faWR9KFxcXCIje3RyYWNlTmFtZX1cXFwiKVwiXG5cblx0XHRcdEZsb3d2ZXJzaW9uQVBJLnB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXggbm9kZXMsIHRyYWNlXG5cblx0XHQjIOetvuaJueWOhueoi+S4reacgOWQjueahGFwcHJvdmVz6auY5Lqu5pi+56S677yM57uT5p2f5q2l6aqk55qEdHJhY2XkuK3mmK/msqHmnIlhcHByb3Zlc+eahO+8jOaJgOS7pee7k+adn+atpemqpOS4jemrmOS6ruaYvuekulxuXHRcdGxhc3RBcHByb3Zlcz8uZm9yRWFjaCAobGFzdEFwcHJvdmUpLT5cblx0XHRcdG5vZGVzLnB1c2ggXCJcdGNsYXNzICN7bGFzdEFwcHJvdmUuX2lkfSBjdXJyZW50LXN0ZXAtbm9kZTtcIlxuXG5cdFx0aWYgaXNDb252ZXJ0VG9TdHJpbmdcblx0XHRcdGdyYXBoU3ludGF4ID0gbm9kZXMuam9pbiBcIlxcblwiXG5cdFx0XHRyZXR1cm4gZ3JhcGhTeW50YXhcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gbm9kZXNcblxuXHRzZW5kSHRtbFJlc3BvbnNlOiAocmVxLCByZXMsIHR5cGUpLT5cblx0XHRxdWVyeSA9IHJlcS5xdWVyeVxuXHRcdGluc3RhbmNlX2lkID0gcXVlcnkuaW5zdGFuY2VfaWRcblx0XHRkaXJlY3Rpb24gPSBxdWVyeS5kaXJlY3Rpb24gfHwgJ1REJ1xuXHRcdGFsbG93RGlyZWN0aW9ucyA9IFsnVEInLCdCVCcsJ1JMJywnTFInLCdURCddO1xuXG5cdFx0aWYgIV8uaW5jbHVkZShhbGxvd0RpcmVjdGlvbnMsIGRpcmVjdGlvbilcblx0XHRcdHJldHVybiBAd3JpdGVSZXNwb25zZShyZXMsIDUwMCwgXCJJbnZhbGlkIGRpcmVjdGlvbi4gVGhlIHZhbHVlIG9mIGRpcmVjdGlvbiBzaG91bGQgYmUgaW4gWydUQicsICdCVCcsICdSTCcsICdMUicsICdURCddXCIpO1xuXG5cdFx0dW5sZXNzIGluc3RhbmNlX2lkXG5cdFx0XHRGbG93dmVyc2lvbkFQSS5zZW5kSW52YWxpZFVSTFJlc3BvbnNlIHJlcyBcblx0XHRcblx0XHR0aXRsZSA9IHF1ZXJ5LnRpdGxlXG5cdFx0aWYgdGl0bGVcblx0XHRcdHRpdGxlID0gZGVjb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudCh0aXRsZSkpXG5cdFx0ZWxzZVxuXHRcdFx0dGl0bGUgPSBcIldvcmtmbG93IENoYXJ0XCJcblxuXHRcdGVycm9yX21zZyA9IFwiXCJcblx0XHRncmFwaFN5bnRheCA9IFwiXCJcblx0XHRGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSBmYWxzZVxuXHRcdGlmIHR5cGUgPT0gXCJ0cmFjZXNfZXhwYW5kXCJcblx0XHRcdHR5cGUgPSBcInRyYWNlc1wiXG5cdFx0XHRGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSB0cnVlXG5cdFx0c3dpdGNoIHR5cGVcblx0XHRcdHdoZW4gJ3RyYWNlcydcblx0XHRcdFx0aW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSBpbnN0YW5jZV9pZCx7ZmllbGRzOnt0cmFjZXM6IDF9fVxuXHRcdFx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0XHRcdHRyYWNlcyA9IGluc3RhbmNlLnRyYWNlc1xuXHRcdFx0XHRcdGlmIHRyYWNlcz8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheCB0cmFjZXMsIGZhbHNlLCBkaXJlY3Rpb25cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUgaW5zdGFuY2VfaWQse2ZpZWxkczp7Zmxvd192ZXJzaW9uOjEsZmxvdzoxLHRyYWNlczogeyRzbGljZTogLTF9fX1cblx0XHRcdFx0aWYgaW5zdGFuY2Vcblx0XHRcdFx0XHRjdXJyZW50U3RlcElkID0gaW5zdGFuY2UudHJhY2VzP1swXT8uc3RlcFxuXHRcdFx0XHRcdGZsb3d2ZXJzaW9uID0gV29ya2Zsb3dNYW5hZ2VyLmdldEluc3RhbmNlRmxvd1ZlcnNpb24oaW5zdGFuY2UpXG5cdFx0XHRcdFx0c3RlcHMgPSBmbG93dmVyc2lvbj8uc3RlcHNcblx0XHRcdFx0XHRpZiBzdGVwcz8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4IHN0ZXBzLGN1cnJlbnRTdGVwSWQsZmFsc2UsIGRpcmVjdGlvbiwgaW5zdGFuY2VfaWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiXG5cdFx0XHRcdGJyZWFrXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuXHRcdHJldHVybiBAd3JpdGVSZXNwb25zZSByZXMsIDIwMCwgXCJcIlwiXG5cdFx0XHQ8IURPQ1RZUEUgaHRtbD5cblx0XHRcdDxodG1sPlxuXHRcdFx0XHQ8aGVhZD5cblx0XHRcdFx0XHQ8bWV0YSBjaGFyc2V0PVwidXRmLThcIj5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSx1c2VyLXNjYWxhYmxlPXllc1wiPlxuXHRcdFx0XHRcdDx0aXRsZT4je3RpdGxlfTwvdGl0bGU+XG5cdFx0XHRcdFx0PG1ldGEgbmFtZT1cIm1vYmlsZS13ZWItYXBwLWNhcGFibGVcIiBjb250ZW50PVwieWVzXCI+XG5cdFx0XHRcdFx0PG1ldGEgbmFtZT1cInRoZW1lLWNvbG9yXCIgY29udGVudD1cIiMwMDBcIj5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwiYXBwbGljYXRpb24tbmFtZVwiPlxuXHRcdFx0XHRcdDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIi91bnBrZy5jb20vanF1ZXJ5QDEuMTEuMi9kaXN0L2pxdWVyeS5taW4uanNcIj48L3NjcmlwdD5cblx0XHRcdFx0XHQ8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCIvdW5wa2cuY29tL21lcm1haWRAOS4xLjIvZGlzdC9tZXJtYWlkLm1pbi5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdGJvZHkgeyBcblx0XHRcdFx0XHRcdFx0Zm9udC1mYW1pbHk6ICdTb3VyY2UgU2FucyBQcm8nLCAnSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuXHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQubG9hZGluZ3tcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAwcHg7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAwcHg7XG5cdFx0XHRcdFx0XHRcdHRvcDogNTAlO1xuXHRcdFx0XHRcdFx0XHR6LWluZGV4OiAxMTAwO1xuXHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IC0zMHB4O1xuXHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDM2cHg7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAjZGZkZmRmO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmVycm9yLW1zZ3tcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAwcHg7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAwcHg7XG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMjBweDtcblx0XHRcdFx0XHRcdFx0ei1pbmRleDogMTEwMDtcblx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDIwcHg7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAjYTk0NDQyO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIHJlY3R7XG5cdFx0XHRcdFx0XHRcdGZpbGw6ICNjY2NjZmY7XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogcmdiKDE0NCwgMTQ0LCAyNTUpO1xuICAgIFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMnB4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlLmN1cnJlbnQtc3RlcC1ub2RlIHJlY3R7XG5cdFx0XHRcdFx0XHRcdGZpbGw6ICNjZGU0OTg7XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogIzEzNTQwYztcblx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY29uZGl0aW9uIHJlY3R7XG5cdFx0XHRcdFx0XHRcdGZpbGw6ICNlY2VjZmY7XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogcmdiKDIwNCwgMjA0LCAyNTUpO1xuICAgIFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMXB4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIC50cmFjZS1oYW5kbGVyLW5hbWV7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAjNzc3O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlIC5zdGVwLWhhbmRsZXItbmFtZXtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICM3Nzc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkaXYubWVybWFpZFRvb2x0aXB7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBmaXhlZCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGxlZnQhaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRwYWRkaW5nOiA0cHghaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDE0cHghaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRtYXgtd2lkdGg6IDUwMHB4IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0bGVmdDogYXV0byFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdHRvcDogMTVweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAxNXB4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmJ0bi16b29te1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XG5cdFx0XHRcdFx0XHRcdGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0cGFkZGluZzogMnB4IDEwcHg7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMjZweDtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMjBweDtcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZDogI2VlZTtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICM3Nzc7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBmaXhlZDtcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAxNXB4O1xuXHRcdFx0XHRcdFx0XHRvdXRsaW5lOiBub25lO1xuXHRcdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0XHRcdHotaW5kZXg6IDk5OTk5O1xuXHRcdFx0XHRcdFx0XHQtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdFx0XHQtbW96LXVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdFx0XHQtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdHVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdFx0XHRsaW5lLWhlaWdodDogMS4yO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0QG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG5cdFx0XHRcdFx0XHRcdC5idG4tem9vbXtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5Om5vbmU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5idG4tem9vbTpob3Zlcntcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmJ0bi16b29tLXVwe1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiAxNXB4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmJ0bi16b29tLWRvd257XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDYwcHg7XG5cdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDFweCAxM3B4IDNweCAxM3B4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDwvaGVhZD5cblx0XHRcdFx0PGJvZHk+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcyA9IFwibG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzID0gXCJlcnJvci1tc2dcIj4je2Vycm9yX21zZ308L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibWVybWFpZFwiPjwvZGl2PlxuXHRcdFx0XHRcdDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxuXHRcdFx0XHRcdFx0bWVybWFpZC5pbml0aWFsaXplKHtcblx0XHRcdFx0XHRcdFx0c3RhcnRPbkxvYWQ6ZmFsc2Vcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0JChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3JhcGhOb2RlcyA9ICN7SlNPTi5zdHJpbmdpZnkoZ3JhcGhTeW50YXgpfTtcblx0XHRcdFx0XHRcdFx0Ly/mlrnkvr/liY3pnaLlj6/ku6XpgJrov4fosIPnlKhtZXJtYWlkLmN1cnJlbnROb2Rlc+iwg+W8j++8jOeJueaEj+WinuWKoGN1cnJlbnROb2Rlc+WxnuaAp+OAglxuXHRcdFx0XHRcdFx0XHRtZXJtYWlkLmN1cnJlbnROb2RlcyA9IGdyYXBoTm9kZXM7XG5cdFx0XHRcdFx0XHRcdHZhciBncmFwaFN5bnRheCA9IGdyYXBoTm9kZXMuam9pbihcIlxcXFxuXCIpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhncmFwaE5vZGVzKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZ3JhcGhTeW50YXgpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIllvdSBjYW4gYWNjZXNzIHRoZSBncmFwaCBub2RlcyBieSAnbWVybWFpZC5jdXJyZW50Tm9kZXMnIGluIHRoZSBjb25zb2xlIG9mIGJyb3dzZXIuXCIpO1xuXHRcdFx0XHRcdFx0XHQkKFwiLmxvYWRpbmdcIikucmVtb3ZlKCk7XG5cblx0XHRcdFx0XHRcdFx0dmFyIGlkID0gXCJmbG93LXN0ZXBzLXN2Z1wiO1xuXHRcdFx0XHRcdFx0XHR2YXIgZWxlbWVudCA9ICQoJy5tZXJtYWlkJyk7XG5cdFx0XHRcdFx0XHRcdHZhciBpbnNlcnRTdmcgPSBmdW5jdGlvbihzdmdDb2RlLCBiaW5kRnVuY3Rpb25zKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5odG1sKHN2Z0NvZGUpO1xuXHRcdFx0XHRcdFx0XHRcdGlmKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soaWQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRiaW5kRnVuY3Rpb25zKGVsZW1lbnRbMF0pO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHRtZXJtYWlkLnJlbmRlcihpZCwgZ3JhcGhTeW50YXgsIGluc2VydFN2ZywgZWxlbWVudFswXSk7XG5cblx0XHRcdFx0XHRcdFx0dmFyIHpvb21TVkcgPSBmdW5jdGlvbih6b29tKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VycmVudFdpZHRoID0gJChcInN2Z1wiKS53aWR0aCgpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBuZXdXaWR0aCA9IGN1cnJlbnRXaWR0aCAqIHpvb207XG5cdFx0XHRcdFx0XHRcdFx0JChcInN2Z1wiKS5jc3MoXCJtYXhXaWR0aFwiLG5ld1dpZHRoICsgXCJweFwiKS53aWR0aChuZXdXaWR0aCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvL+aUr+aMgem8oOagh+a7mui9rue8qeaUvueUu+W4g1xuXHRcdFx0XHRcdFx0XHQkKHdpbmRvdykub24oXCJtb3VzZXdoZWVsXCIsZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKGV2ZW50LmN0cmxLZXkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciB6b29tID0gZXZlbnQub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCA/IDEuMSA6IDAuOTtcblx0XHRcdFx0XHRcdFx0XHRcdHpvb21TVkcoem9vbSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0JChcIi5idG4tem9vbVwiKS5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR6b29tU1ZHKCQodGhpcykuYXR0cihcInpvb21cIikpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdDwvc2NyaXB0PlxuXHRcdFx0XHRcdDxhIGNsYXNzPVwiYnRuLXpvb20gYnRuLXpvb20tdXBcIiB6b29tPTEuMSB0aXRsZT1cIueCueWHu+aUvuWkp1wiPis8L2E+XG5cdFx0XHRcdFx0PGEgY2xhc3M9XCJidG4tem9vbSBidG4tem9vbS1kb3duXCIgem9vbT0wLjkgdGl0bGU9XCLngrnlh7vnvKnlsI9cIj4tPC9hPlxuXHRcdFx0XHQ8L2JvZHk+XG5cdFx0XHQ8L2h0bWw+XG5cdFx0XCJcIlwiXG5cbkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdCMg5rWB56iL5Zu+XG5cdEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UgcmVxLCByZXNcblxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0L3RyYWNlcz9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdCMg5rGH5oC7562+5om55Y6G56iL5Zu+XG5cdEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UgcmVxLCByZXMsIFwidHJhY2VzXCJcblxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0L3RyYWNlc19leHBhbmQ/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHQjIOWxleW8gOaJgOacieiKgueCueeahOetvuaJueWOhueoi+WbvlxuXHRGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlIHJlcSwgcmVzLCBcInRyYWNlc19leHBhbmRcIlxuXG4iLCJ2YXIgRmxvd3ZlcnNpb25BUEk7XG5cbkZsb3d2ZXJzaW9uQVBJID0ge1xuICB0cmFjZU1heEFwcHJvdmVDb3VudDogMTAsXG4gIHRyYWNlU3BsaXRBcHByb3Zlc0luZGV4OiA1LFxuICBpc0V4cGFuZEFwcHJvdmU6IGZhbHNlLFxuICBnZXRBYnNvbHV0ZVVybDogZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHJvb3RVcmw7XG4gICAgcm9vdFVybCA9IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18gPyBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLlJPT1RfVVJMX1BBVEhfUFJFRklYIDogXCJcIjtcbiAgICBpZiAocm9vdFVybCkge1xuICAgICAgdXJsID0gcm9vdFVybCArIHVybDtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgd3JpdGVSZXNwb25zZTogZnVuY3Rpb24ocmVzLCBodHRwQ29kZSwgYm9keSkge1xuICAgIHJlcy5zdGF0dXNDb2RlID0gaHR0cENvZGU7XG4gICAgcmV0dXJuIHJlcy5lbmQoYm9keSk7XG4gIH0sXG4gIHNlbmRJbnZhbGlkVVJMUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcykge1xuICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCA0MDQsIFwidXJsIG11c3QgaGFzIHF1ZXJ5cyBhcyBpbnN0YW5jZV9pZC5cIik7XG4gIH0sXG4gIHNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcykge1xuICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCA0MDEsIFwidGhlIGF1dGhfdG9rZW4gaGFzIGV4cGlyZWQuXCIpO1xuICB9LFxuICByZXBsYWNlRXJyb3JTeW1ib2w6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcIi9nLCBcIiZxdW90O1wiKS5yZXBsYWNlKC9cXG4vZywgXCI8YnIvPlwiKTtcbiAgfSxcbiAgZ2V0U3RlcEhhbmRsZXJOYW1lOiBmdW5jdGlvbihzdGVwLCBpbnNJZCkge1xuICAgIHZhciBhcHByb3Zlck5hbWVzLCBlLCBsb2dpblVzZXJJZCwgc3RlcEhhbmRsZXJOYW1lLCBzdGVwSWQsIHVzZXJJZHM7XG4gICAgdHJ5IHtcbiAgICAgIHN0ZXBIYW5kbGVyTmFtZSA9IFwiXCI7XG4gICAgICBpZiAoc3RlcC5zdGVwX3R5cGUgPT09IFwiY29uZGl0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXBIYW5kbGVyTmFtZTtcbiAgICAgIH1cbiAgICAgIGxvZ2luVXNlcklkID0gJyc7XG4gICAgICBzdGVwSWQgPSBzdGVwLl9pZDtcbiAgICAgIHVzZXJJZHMgPSBnZXRIYW5kbGVyc01hbmFnZXIuZ2V0SGFuZGxlcnMoaW5zSWQsIHN0ZXBJZCwgbG9naW5Vc2VySWQpO1xuICAgICAgYXBwcm92ZXJOYW1lcyA9IHVzZXJJZHMubWFwKGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChhcHByb3Zlck5hbWVzLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgc3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5zbGljZSgwLCAzKS5qb2luKFwiLFwiKSArIFwiLi4uXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZXBIYW5kbGVyTmFtZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICBnZXRTdGVwTGFiZWw6IGZ1bmN0aW9uKHN0ZXBOYW1lLCBzdGVwSGFuZGxlck5hbWUpIHtcbiAgICBpZiAoc3RlcE5hbWUpIHtcbiAgICAgIHN0ZXBOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz4gPGRpdiBjbGFzcz0nc3RlcC1uYW1lJz5cIiArIHN0ZXBOYW1lICsgXCI8L2Rpdj4gPGRpdiBjbGFzcz0nc3RlcC1oYW5kbGVyLW5hbWUnPlwiICsgc3RlcEhhbmRsZXJOYW1lICsgXCI8L2Rpdj4gPC9kaXY+XCI7XG4gICAgICBzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChzdGVwTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ZXBOYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIHN0ZXBOYW1lO1xuICB9LFxuICBnZXRTdGVwTmFtZTogZnVuY3Rpb24oc3RlcCwgY2FjaGVkU3RlcE5hbWVzLCBpbnN0YW5jZV9pZCkge1xuICAgIHZhciBjYWNoZWRTdGVwTmFtZSwgc3RlcEhhbmRsZXJOYW1lLCBzdGVwTmFtZTtcbiAgICBjYWNoZWRTdGVwTmFtZSA9IGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF07XG4gICAgaWYgKGNhY2hlZFN0ZXBOYW1lKSB7XG4gICAgICByZXR1cm4gY2FjaGVkU3RlcE5hbWU7XG4gICAgfVxuICAgIHN0ZXBIYW5kbGVyTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBIYW5kbGVyTmFtZShzdGVwLCBpbnN0YW5jZV9pZCk7XG4gICAgc3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwTGFiZWwoc3RlcC5uYW1lLCBzdGVwSGFuZGxlck5hbWUpO1xuICAgIGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF0gPSBzdGVwTmFtZTtcbiAgICByZXR1cm4gc3RlcE5hbWU7XG4gIH0sXG4gIGdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheDogZnVuY3Rpb24oc3RlcHMsIGN1cnJlbnRTdGVwSWQsIGlzQ29udmVydFRvU3RyaW5nLCBkaXJlY3Rpb24sIGluc3RhbmNlX2lkKSB7XG4gICAgdmFyIGNhY2hlZFN0ZXBOYW1lcywgZ3JhcGhTeW50YXgsIG5vZGVzO1xuICAgIG5vZGVzID0gW1wiZ3JhcGggXCIgKyBkaXJlY3Rpb25dO1xuICAgIGNhY2hlZFN0ZXBOYW1lcyA9IHt9O1xuICAgIHN0ZXBzLmZvckVhY2goZnVuY3Rpb24oc3RlcCkge1xuICAgICAgdmFyIGxpbmVzO1xuICAgICAgbGluZXMgPSBzdGVwLmxpbmVzO1xuICAgICAgaWYgKGxpbmVzICE9IG51bGwgPyBsaW5lcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgIHZhciBzdGVwTmFtZSwgdG9TdGVwLCB0b1N0ZXBOYW1lO1xuICAgICAgICAgIGlmIChzdGVwLm5hbWUpIHtcbiAgICAgICAgICAgIGlmIChzdGVwLnN0ZXBfdHlwZSA9PT0gXCJjb25kaXRpb25cIikge1xuICAgICAgICAgICAgICBub2Rlcy5wdXNoKFwiXHRjbGFzcyBcIiArIHN0ZXAuX2lkICsgXCIgY29uZGl0aW9uO1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcE5hbWUoc3RlcCwgY2FjaGVkU3RlcE5hbWVzLCBpbnN0YW5jZV9pZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ZXBOYW1lID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9TdGVwID0gc3RlcHMuZmluZFByb3BlcnR5QnlQSyhcIl9pZFwiLCBsaW5lLnRvX3N0ZXApO1xuICAgICAgICAgIHRvU3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwTmFtZSh0b1N0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpO1xuICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIHN0ZXAuX2lkICsgXCIoXFxcIlwiICsgc3RlcE5hbWUgKyBcIlxcXCIpLS0+XCIgKyBsaW5lLnRvX3N0ZXAgKyBcIihcXFwiXCIgKyB0b1N0ZXBOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGN1cnJlbnRTdGVwSWQpIHtcbiAgICAgIG5vZGVzLnB1c2goXCJcdGNsYXNzIFwiICsgY3VycmVudFN0ZXBJZCArIFwiIGN1cnJlbnQtc3RlcC1ub2RlO1wiKTtcbiAgICB9XG4gICAgaWYgKGlzQ29udmVydFRvU3RyaW5nKSB7XG4gICAgICBncmFwaFN5bnRheCA9IG5vZGVzLmpvaW4oXCJcXG5cIik7XG4gICAgICByZXR1cm4gZ3JhcGhTeW50YXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gIH0sXG4gIGdldEFwcHJvdmVKdWRnZVRleHQ6IGZ1bmN0aW9uKGp1ZGdlKSB7XG4gICAgdmFyIGp1ZGdlVGV4dCwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICBzd2l0Y2ggKGp1ZGdlKSB7XG4gICAgICBjYXNlICdhcHByb3ZlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIGFwcHJvdmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWplY3RlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm1pbmF0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSB0ZXJtaW5hdGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhc3NpZ25lZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlYXNzaWduZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWxvY2F0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWxvY2F0ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXRyaWV2ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZXRyaWV2ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXR1cm5lZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHVybmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZGVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhZGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAganVkZ2VUZXh0ID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4ganVkZ2VUZXh0O1xuICB9LFxuICBnZXRUcmFjZU5hbWU6IGZ1bmN0aW9uKHRyYWNlTmFtZSwgYXBwcm92ZUhhbmRsZXJOYW1lKSB7XG4gICAgaWYgKHRyYWNlTmFtZSkge1xuICAgICAgdHJhY2VOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz4gPGRpdiBjbGFzcz0ndHJhY2UtbmFtZSc+XCIgKyB0cmFjZU5hbWUgKyBcIjwvZGl2PiA8ZGl2IGNsYXNzPSd0cmFjZS1oYW5kbGVyLW5hbWUnPlwiICsgYXBwcm92ZUhhbmRsZXJOYW1lICsgXCI8L2Rpdj4gPC9kaXY+XCI7XG4gICAgICB0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2wodHJhY2VOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2VOYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWNlTmFtZTtcbiAgfSxcbiAgZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGU6IGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgdmFyIGFwcHJvdmVzLCBjb3VudGVycztcbiAgICBjb3VudGVycyA9IHt9O1xuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFhcHByb3Zlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oYXBwcm92ZSkge1xuICAgICAgaWYgKGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkKSB7XG4gICAgICAgIGlmICghY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdKSB7XG4gICAgICAgICAgY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdKSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjb3VudGVycztcbiAgfSxcbiAgZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlOiBmdW5jdGlvbih0cmFjZSwgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzKSB7XG4gICAgdmFyIGFwcHJvdmVzLCBjb3VudGVycywgaXNFeHBhbmRBcHByb3ZlLCB0cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICBjb3VudGVycyA9IHt9O1xuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFhcHByb3Zlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgaXNFeHBhbmRBcHByb3ZlID0gRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlO1xuICAgIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24odG9BcHByb3ZlKSB7XG4gICAgICB2YXIgdG9BcHByb3ZlRnJvbUlkLCB0b0FwcHJvdmVIYW5kbGVyTmFtZSwgdG9BcHByb3ZlVHlwZTtcbiAgICAgIHRvQXBwcm92ZVR5cGUgPSB0b0FwcHJvdmUudHlwZTtcbiAgICAgIHRvQXBwcm92ZUZyb21JZCA9IHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaWQ7XG4gICAgICB0b0FwcHJvdmVIYW5kbGVyTmFtZSA9IHRvQXBwcm92ZS5oYW5kbGVyX25hbWU7XG4gICAgICBpZiAoIXRvQXBwcm92ZUZyb21JZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihmcm9tQXBwcm92ZSkge1xuICAgICAgICB2YXIgY291bnRlciwgY291bnRlcjIsIGNvdW50ZXJDb250ZW50LCByZWY7XG4gICAgICAgIGlmIChmcm9tQXBwcm92ZS5faWQgPT09IHRvQXBwcm92ZUZyb21JZCkge1xuICAgICAgICAgIGNvdW50ZXIgPSBjb3VudGVyc1t0b0FwcHJvdmVGcm9tSWRdO1xuICAgICAgICAgIGlmICghY291bnRlcikge1xuICAgICAgICAgICAgY291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFjb3VudGVyW3RvQXBwcm92ZS50eXBlXSkge1xuICAgICAgICAgICAgY291bnRlclt0b0FwcHJvdmUudHlwZV0gPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY291bnRlcjIgPSBjb3VudGVyW3RvQXBwcm92ZS50eXBlXTtcbiAgICAgICAgICBpZiAoKHJlZiA9IHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1t0b0FwcHJvdmUuX2lkXSkgIT0gbnVsbCA/IHJlZlt0b0FwcHJvdmVUeXBlXSA6IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvdW50ZXIyLnB1c2goe1xuICAgICAgICAgICAgICBmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGUsXG4gICAgICAgICAgICAgIGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZSxcbiAgICAgICAgICAgICAgdG9fYXBwcm92ZV9pZDogdG9BcHByb3ZlLl9pZCxcbiAgICAgICAgICAgICAgdG9fYXBwcm92ZV9oYW5kbGVyX25hbWU6IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyQ29udGVudCA9IGlzRXhwYW5kQXBwcm92ZSA/IG51bGwgOiBjb3VudGVyMi5maW5kUHJvcGVydHlCeVBLKFwiaXNfdG90YWxcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoY291bnRlckNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgY291bnRlckNvbnRlbnQuY291bnQrKztcbiAgICAgICAgICAgICAgaWYgKCEoY291bnRlckNvbnRlbnQuY291bnQgPiB0cmFjZU1heEFwcHJvdmVDb3VudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY291bnRlckNvbnRlbnQudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzLnB1c2godG9BcHByb3ZlLmhhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb3VudGVyMi5wdXNoKHtcbiAgICAgICAgICAgICAgICBmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGUsXG4gICAgICAgICAgICAgICAgZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lLFxuICAgICAgICAgICAgICAgIHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWQsXG4gICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgdG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzOiBbdG9BcHByb3ZlLmhhbmRsZXJfbmFtZV0sXG4gICAgICAgICAgICAgICAgaXNfdG90YWw6IHRydWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gY291bnRlcnM7XG4gIH0sXG4gIHB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXg6IGZ1bmN0aW9uKG5vZGVzLCB0cmFjZSkge1xuICAgIHZhciBhcHByb3ZlcywgY3VycmVudFRyYWNlTmFtZSwgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyLCBmcm9tQXBwcm92ZSwgZnJvbUFwcHJvdmVJZCwgcmVzdWx0cywgc3BsaXRJbmRleCwgdGVtcEhhbmRsZXJOYW1lcywgdG9BcHByb3ZlSWQsIHRvQXBwcm92ZVR5cGUsIHRvQXBwcm92ZXMsIHRyYWNlQ291bnRlcnMsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycywgdHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGUodHJhY2UpO1xuICAgIHRyYWNlQ291bnRlcnMgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGUodHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyk7XG4gICAgaWYgKCF0cmFjZUNvdW50ZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlciA9IHt9O1xuICAgIHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgc3BsaXRJbmRleCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlU3BsaXRBcHByb3Zlc0luZGV4O1xuICAgIGN1cnJlbnRUcmFjZU5hbWUgPSB0cmFjZS5uYW1lO1xuICAgIGZvciAoZnJvbUFwcHJvdmVJZCBpbiB0cmFjZUNvdW50ZXJzKSB7XG4gICAgICBmcm9tQXBwcm92ZSA9IHRyYWNlQ291bnRlcnNbZnJvbUFwcHJvdmVJZF07XG4gICAgICBmb3IgKHRvQXBwcm92ZVR5cGUgaW4gZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgdG9BcHByb3ZlcyA9IGZyb21BcHByb3ZlW3RvQXBwcm92ZVR5cGVdO1xuICAgICAgICB0b0FwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24odG9BcHByb3ZlKSB7XG4gICAgICAgICAgdmFyIGV4dHJhQ291bnQsIGlzVHlwZU5vZGUsIHN0clRvSGFuZGxlck5hbWVzLCB0b0hhbmRsZXJOYW1lcywgdHJhY2VOYW1lLCB0eXBlTmFtZTtcbiAgICAgICAgICB0eXBlTmFtZSA9IFwiXCI7XG4gICAgICAgICAgc3dpdGNoICh0b0FwcHJvdmVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdjYyc6XG4gICAgICAgICAgICAgIHR5cGVOYW1lID0gXCLkvKDpmIVcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3J3YXJkJzpcbiAgICAgICAgICAgICAgdHlwZU5hbWUgPSBcIui9rOWPkVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Rpc3RyaWJ1dGUnOlxuICAgICAgICAgICAgICB0eXBlTmFtZSA9IFwi5YiG5Y+RXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlzVHlwZU5vZGUgPSBbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLmZyb21fdHlwZSkgPj0gMDtcbiAgICAgICAgICBpZiAoaXNUeXBlTm9kZSkge1xuICAgICAgICAgICAgdHJhY2VOYW1lID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0b0FwcHJvdmUuaXNfdG90YWwpIHtcbiAgICAgICAgICAgIHRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcztcbiAgICAgICAgICAgIGlmIChzcGxpdEluZGV4ICYmIHRvQXBwcm92ZS5jb3VudCA+IHNwbGl0SW5kZXgpIHtcbiAgICAgICAgICAgICAgdG9IYW5kbGVyTmFtZXMuc3BsaWNlKHNwbGl0SW5kZXgsIDAsIFwiPGJyLz4sXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyVG9IYW5kbGVyTmFtZXMgPSB0b0hhbmRsZXJOYW1lcy5qb2luKFwiLFwiKS5yZXBsYWNlKFwiLCxcIiwgXCJcIik7XG4gICAgICAgICAgICBleHRyYUNvdW50ID0gdG9BcHByb3ZlLmNvdW50IC0gdHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgICAgICAgICBpZiAoZXh0cmFDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgc3RyVG9IYW5kbGVyTmFtZXMgKz0gXCLnrYlcIiArIHRvQXBwcm92ZS5jb3VudCArIFwi5Lq6XCI7XG4gICAgICAgICAgICAgIGlmICghZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdID0ge307XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdW3RvQXBwcm92ZVR5cGVdID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0clRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNUeXBlTm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmVJZCArIFwiPlxcXCJcIiArIHRyYWNlTmFtZSArIFwiXFxcIl0tLVwiICsgdHlwZU5hbWUgKyBcIi0tPlwiICsgdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWQgKyBcIj5cXFwiXCIgKyBzdHJUb0hhbmRsZXJOYW1lcyArIFwiXFxcIl1cIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlSWQgKyBcIihcXFwiXCIgKyB0cmFjZU5hbWUgKyBcIlxcXCIpLS1cIiArIHR5cGVOYW1lICsgXCItLT5cIiArIHRvQXBwcm92ZS50b19hcHByb3ZlX2lkICsgXCI+XFxcIlwiICsgc3RyVG9IYW5kbGVyTmFtZXMgKyBcIlxcXCJdXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFfLmlzRW1wdHkoZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyKSkge1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChmcm9tQXBwcm92ZUlkIGluIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcikge1xuICAgICAgICBmcm9tQXBwcm92ZSA9IGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKHRvQXBwcm92ZVR5cGUgaW4gZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgICAgIHRvQXBwcm92ZUlkID0gZnJvbUFwcHJvdmVbdG9BcHByb3ZlVHlwZV07XG4gICAgICAgICAgICB0ZW1wSGFuZGxlck5hbWVzID0gW107XG4gICAgICAgICAgICBhcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcHJvdmUpIHtcbiAgICAgICAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgICAgICAgaWYgKGZyb21BcHByb3ZlSWQgPT09IGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoKHJlZiA9IHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1thcHByb3ZlLl9pZF0pICE9IG51bGwgPyByZWZbdG9BcHByb3ZlVHlwZV0gOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcEhhbmRsZXJOYW1lcy5wdXNoKGFwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0czEucHVzaChub2Rlcy5wdXNoKFwiXHRjbGljayBcIiArIHRvQXBwcm92ZUlkICsgXCIgY2FsbGJhY2sgXFxcIlwiICsgKHRlbXBIYW5kbGVyTmFtZXMuam9pbihcIixcIikpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICB9KSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfSxcbiAgZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheDogZnVuY3Rpb24odHJhY2VzLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uKSB7XG4gICAgdmFyIGdyYXBoU3ludGF4LCBsYXN0QXBwcm92ZXMsIGxhc3RUcmFjZSwgbm9kZXM7XG4gICAgbm9kZXMgPSBbXCJncmFwaCBcIiArIGRpcmVjdGlvbl07XG4gICAgbGFzdFRyYWNlID0gbnVsbDtcbiAgICBsYXN0QXBwcm92ZXMgPSBbXTtcbiAgICB0cmFjZXMuZm9yRWFjaChmdW5jdGlvbih0cmFjZSkge1xuICAgICAgdmFyIGN1cnJlbnRUcmFjZU5hbWUsIGxpbmVzO1xuICAgICAgbGluZXMgPSB0cmFjZS5wcmV2aW91c190cmFjZV9pZHM7XG4gICAgICBjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZTtcbiAgICAgIGlmIChsaW5lcyAhPSBudWxsID8gbGluZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgIHZhciBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVzLCBmcm9tVHJhY2UsIHRvQXBwcm92ZXM7XG4gICAgICAgICAgZnJvbVRyYWNlID0gdHJhY2VzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIiwgbGluZSk7XG4gICAgICAgICAgY3VycmVudEZyb21UcmFjZU5hbWUgPSBmcm9tVHJhY2UubmFtZTtcbiAgICAgICAgICBmcm9tQXBwcm92ZXMgPSBmcm9tVHJhY2UuYXBwcm92ZXM7XG4gICAgICAgICAgdG9BcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzO1xuICAgICAgICAgIGxhc3RUcmFjZSA9IHRyYWNlO1xuICAgICAgICAgIGxhc3RBcHByb3ZlcyA9IHRvQXBwcm92ZXM7XG4gICAgICAgICAgcmV0dXJuIGZyb21BcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGZyb21BcHByb3ZlKSB7XG4gICAgICAgICAgICB2YXIgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSwgZnJvbVRyYWNlTmFtZSwganVkZ2VUZXh0LCB0b1RyYWNlTmFtZTtcbiAgICAgICAgICAgIGZyb21BcHByb3ZlSGFuZGxlck5hbWUgPSBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWU7XG4gICAgICAgICAgICBpZiAodG9BcHByb3ZlcyAhPSBudWxsID8gdG9BcHByb3Zlcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRvQXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbih0b0FwcHJvdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJvbVRyYWNlTmFtZSwganVkZ2VUZXh0LCB0b1RyYWNlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKHRvQXBwcm92ZS50eXBlKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGlmIChbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAganVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dChmcm9tQXBwcm92ZS5qdWRnZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqdWRnZVRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tXCIgKyBqdWRnZVRleHQgKyBcIi0tPlwiICsgdG9BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tPlwiICsgdG9BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKGZyb21BcHByb3ZlLnR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKGN1cnJlbnRUcmFjZU5hbWUpO1xuICAgICAgICAgICAgICAgIGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQoZnJvbUFwcHJvdmUuanVkZ2UpO1xuICAgICAgICAgICAgICAgIGlmIChqdWRnZVRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS1cIiArIGp1ZGdlVGV4dCArIFwiLS0+XCIgKyB0cmFjZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS0+XCIgKyB0cmFjZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2UuYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihhcHByb3ZlKSB7XG4gICAgICAgICAgdmFyIHRyYWNlTmFtZTtcbiAgICAgICAgICB0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudFRyYWNlTmFtZSwgYXBwcm92ZS5oYW5kbGVyX25hbWUpO1xuICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgdHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRmxvd3ZlcnNpb25BUEkucHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheChub2RlcywgdHJhY2UpO1xuICAgIH0pO1xuICAgIGlmIChsYXN0QXBwcm92ZXMgIT0gbnVsbCkge1xuICAgICAgbGFzdEFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24obGFzdEFwcHJvdmUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdGNsYXNzIFwiICsgbGFzdEFwcHJvdmUuX2lkICsgXCIgY3VycmVudC1zdGVwLW5vZGU7XCIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc0NvbnZlcnRUb1N0cmluZykge1xuICAgICAgZ3JhcGhTeW50YXggPSBub2Rlcy5qb2luKFwiXFxuXCIpO1xuICAgICAgcmV0dXJuIGdyYXBoU3ludGF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICB9LFxuICBzZW5kSHRtbFJlc3BvbnNlOiBmdW5jdGlvbihyZXEsIHJlcywgdHlwZSkge1xuICAgIHZhciBhbGxvd0RpcmVjdGlvbnMsIGN1cnJlbnRTdGVwSWQsIGRpcmVjdGlvbiwgZXJyb3JfbXNnLCBmbG93dmVyc2lvbiwgZ3JhcGhTeW50YXgsIGluc3RhbmNlLCBpbnN0YW5jZV9pZCwgcXVlcnksIHJlZiwgcmVmMSwgc3RlcHMsIHRpdGxlLCB0cmFjZXM7XG4gICAgcXVlcnkgPSByZXEucXVlcnk7XG4gICAgaW5zdGFuY2VfaWQgPSBxdWVyeS5pbnN0YW5jZV9pZDtcbiAgICBkaXJlY3Rpb24gPSBxdWVyeS5kaXJlY3Rpb24gfHwgJ1REJztcbiAgICBhbGxvd0RpcmVjdGlvbnMgPSBbJ1RCJywgJ0JUJywgJ1JMJywgJ0xSJywgJ1REJ107XG4gICAgaWYgKCFfLmluY2x1ZGUoYWxsb3dEaXJlY3Rpb25zLCBkaXJlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy53cml0ZVJlc3BvbnNlKHJlcywgNTAwLCBcIkludmFsaWQgZGlyZWN0aW9uLiBUaGUgdmFsdWUgb2YgZGlyZWN0aW9uIHNob3VsZCBiZSBpbiBbJ1RCJywgJ0JUJywgJ1JMJywgJ0xSJywgJ1REJ11cIik7XG4gICAgfVxuICAgIGlmICghaW5zdGFuY2VfaWQpIHtcbiAgICAgIEZsb3d2ZXJzaW9uQVBJLnNlbmRJbnZhbGlkVVJMUmVzcG9uc2UocmVzKTtcbiAgICB9XG4gICAgdGl0bGUgPSBxdWVyeS50aXRsZTtcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHRpdGxlID0gZGVjb2RlVVJJQ29tcG9uZW50KGRlY29kZVVSSUNvbXBvbmVudCh0aXRsZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aXRsZSA9IFwiV29ya2Zsb3cgQ2hhcnRcIjtcbiAgICB9XG4gICAgZXJyb3JfbXNnID0gXCJcIjtcbiAgICBncmFwaFN5bnRheCA9IFwiXCI7XG4gICAgRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlID0gZmFsc2U7XG4gICAgaWYgKHR5cGUgPT09IFwidHJhY2VzX2V4cGFuZFwiKSB7XG4gICAgICB0eXBlID0gXCJ0cmFjZXNcIjtcbiAgICAgIEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IHRydWU7XG4gICAgfVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAndHJhY2VzJzpcbiAgICAgICAgaW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZShpbnN0YW5jZV9pZCwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdHJhY2VzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgdHJhY2VzID0gaW5zdGFuY2UudHJhY2VzO1xuICAgICAgICAgIGlmICh0cmFjZXMgIT0gbnVsbCA/IHRyYWNlcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4KHRyYWNlcywgZmFsc2UsIGRpcmVjdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCI7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKGluc3RhbmNlX2lkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBmbG93X3ZlcnNpb246IDEsXG4gICAgICAgICAgICBmbG93OiAxLFxuICAgICAgICAgICAgdHJhY2VzOiB7XG4gICAgICAgICAgICAgICRzbGljZTogLTFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICBjdXJyZW50U3RlcElkID0gKHJlZiA9IGluc3RhbmNlLnRyYWNlcykgIT0gbnVsbCA/IChyZWYxID0gcmVmWzBdKSAhPSBudWxsID8gcmVmMS5zdGVwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGZsb3d2ZXJzaW9uID0gV29ya2Zsb3dNYW5hZ2VyLmdldEluc3RhbmNlRmxvd1ZlcnNpb24oaW5zdGFuY2UpO1xuICAgICAgICAgIHN0ZXBzID0gZmxvd3ZlcnNpb24gIT0gbnVsbCA/IGZsb3d2ZXJzaW9uLnN0ZXBzIDogdm9pZCAwO1xuICAgICAgICAgIGlmIChzdGVwcyAhPSBudWxsID8gc3RlcHMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgICAgICBncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4KHN0ZXBzLCBjdXJyZW50U3RlcElkLCBmYWxzZSwgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCI7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcbiAgICByZXR1cm4gdGhpcy53cml0ZVJlc3BvbnNlKHJlcywgMjAwLCBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblx0PGhlYWQ+XFxuXHRcdDxtZXRhIGNoYXJzZXQ9XFxcInV0Zi04XFxcIj5cXG5cdFx0PG1ldGEgbmFtZT1cXFwidmlld3BvcnRcXFwiIGNvbnRlbnQ9XFxcIndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTEsdXNlci1zY2FsYWJsZT15ZXNcXFwiPlxcblx0XHQ8dGl0bGU+XCIgKyB0aXRsZSArIFwiPC90aXRsZT5cXG5cdFx0PG1ldGEgbmFtZT1cXFwibW9iaWxlLXdlYi1hcHAtY2FwYWJsZVxcXCIgY29udGVudD1cXFwieWVzXFxcIj5cXG5cdFx0PG1ldGEgbmFtZT1cXFwidGhlbWUtY29sb3JcXFwiIGNvbnRlbnQ9XFxcIiMwMDBcXFwiPlxcblx0XHQ8bWV0YSBuYW1lPVxcXCJhcHBsaWNhdGlvbi1uYW1lXFxcIj5cXG5cdFx0PHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiL3VucGtnLmNvbS9qcXVlcnlAMS4xMS4yL2Rpc3QvanF1ZXJ5Lm1pbi5qc1xcXCI+PC9zY3JpcHQ+XFxuXHRcdDxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIi91bnBrZy5jb20vbWVybWFpZEA5LjEuMi9kaXN0L21lcm1haWQubWluLmpzXFxcIj48L3NjcmlwdD5cXG5cdFx0PHN0eWxlPlxcblx0XHRcdGJvZHkgeyBcXG5cdFx0XHRcdGZvbnQtZmFtaWx5OiAnU291cmNlIFNhbnMgUHJvJywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuXHRcdFx0fVxcblx0XHRcdC5sb2FkaW5ne1xcblx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xcblx0XHRcdFx0bGVmdDogMHB4O1xcblx0XHRcdFx0cmlnaHQ6IDBweDtcXG5cdFx0XHRcdHRvcDogNTAlO1xcblx0XHRcdFx0ei1pbmRleDogMTEwMDtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdG1hcmdpbi10b3A6IC0zMHB4O1xcblx0XHRcdFx0Zm9udC1zaXplOiAzNnB4O1xcblx0XHRcdFx0Y29sb3I6ICNkZmRmZGY7XFxuXHRcdFx0fVxcblx0XHRcdC5lcnJvci1tc2d7XFxuXHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXHRcdFx0XHRsZWZ0OiAwcHg7XFxuXHRcdFx0XHRyaWdodDogMHB4O1xcblx0XHRcdFx0Ym90dG9tOiAyMHB4O1xcblx0XHRcdFx0ei1pbmRleDogMTEwMDtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdGZvbnQtc2l6ZTogMjBweDtcXG5cdFx0XHRcdGNvbG9yOiAjYTk0NDQyO1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgcmVjdHtcXG5cdFx0XHRcdGZpbGw6ICNjY2NjZmY7XFxuXHRcdFx0XHRzdHJva2U6IHJnYigxNDQsIDE0NCwgMjU1KTtcXG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jdXJyZW50LXN0ZXAtbm9kZSByZWN0e1xcblx0XHRcdFx0ZmlsbDogI2NkZTQ5ODtcXG5cdFx0XHRcdHN0cm9rZTogIzEzNTQwYztcXG5cdFx0XHRcdHN0cm9rZS13aWR0aDogMnB4O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY29uZGl0aW9uIHJlY3R7XFxuXHRcdFx0XHRmaWxsOiAjZWNlY2ZmO1xcblx0XHRcdFx0c3Ryb2tlOiByZ2IoMjA0LCAyMDQsIDI1NSk7XFxuICAgIFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMXB4O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnRyYWNlLWhhbmRsZXItbmFtZXtcXG5cdFx0XHRcdGNvbG9yOiAjNzc3O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnN0ZXAtaGFuZGxlci1uYW1le1xcblx0XHRcdFx0Y29sb3I6ICM3Nzc7XFxuXHRcdFx0fVxcblx0XHRcdGRpdi5tZXJtYWlkVG9vbHRpcHtcXG5cdFx0XHRcdHBvc2l0aW9uOiBmaXhlZCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHR0ZXh0LWFsaWduOiBsZWZ0IWltcG9ydGFudDtcXG5cdFx0XHRcdHBhZGRpbmc6IDRweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRmb250LXNpemU6IDE0cHghaW1wb3J0YW50O1xcblx0XHRcdFx0bWF4LXdpZHRoOiA1MDBweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRsZWZ0OiBhdXRvIWltcG9ydGFudDtcXG5cdFx0XHRcdHRvcDogMTVweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRyaWdodDogMTVweDtcXG5cdFx0XHR9XFxuXHRcdFx0LmJ0bi16b29te1xcblx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xcblx0XHRcdFx0Ym9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cdFx0XHRcdHBhZGRpbmc6IDJweCAxMHB4O1xcblx0XHRcdFx0Zm9udC1zaXplOiAyNnB4O1xcblx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMjBweDtcXG5cdFx0XHRcdGJhY2tncm91bmQ6ICNlZWU7XFxuXHRcdFx0XHRjb2xvcjogIzc3NztcXG5cdFx0XHRcdHBvc2l0aW9uOiBmaXhlZDtcXG5cdFx0XHRcdGJvdHRvbTogMTVweDtcXG5cdFx0XHRcdG91dGxpbmU6IG5vbmU7XFxuXHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XFxuXHRcdFx0XHR6LWluZGV4OiA5OTk5OTtcXG5cdFx0XHRcdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHQtbW96LXVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0LW1zLXVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHRsaW5lLWhlaWdodDogMS4yO1xcblx0XHRcdH1cXG5cdFx0XHRAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG5cdFx0XHRcdC5idG4tem9vbXtcXG5cdFx0XHRcdFx0ZGlzcGxheTpub25lO1xcblx0XHRcdFx0fVxcblx0XHRcdH1cXG5cdFx0XHQuYnRuLXpvb206aG92ZXJ7XFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbS11cHtcXG5cdFx0XHRcdGxlZnQ6IDE1cHg7XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbS1kb3due1xcblx0XHRcdFx0bGVmdDogNjBweDtcXG5cdFx0XHRcdHBhZGRpbmc6IDFweCAxM3B4IDNweCAxM3B4O1xcblx0XHRcdH1cXG5cdFx0PC9zdHlsZT5cXG5cdDwvaGVhZD5cXG5cdDxib2R5Plxcblx0XHQ8ZGl2IGNsYXNzID0gXFxcImxvYWRpbmdcXFwiPkxvYWRpbmcuLi48L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcyA9IFxcXCJlcnJvci1tc2dcXFwiPlwiICsgZXJyb3JfbXNnICsgXCI8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cXFwibWVybWFpZFxcXCI+PC9kaXY+XFxuXHRcdDxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj5cXG5cdFx0XHRtZXJtYWlkLmluaXRpYWxpemUoe1xcblx0XHRcdFx0c3RhcnRPbkxvYWQ6ZmFsc2VcXG5cdFx0XHR9KTtcXG5cdFx0XHQkKGZ1bmN0aW9uKCl7XFxuXHRcdFx0XHR2YXIgZ3JhcGhOb2RlcyA9IFwiICsgKEpTT04uc3RyaW5naWZ5KGdyYXBoU3ludGF4KSkgKyBcIjtcXG5cdFx0XHRcdC8v5pa55L6/5YmN6Z2i5Y+v5Lul6YCa6L+H6LCD55SobWVybWFpZC5jdXJyZW50Tm9kZXPosIPlvI/vvIznibnmhI/lop7liqBjdXJyZW50Tm9kZXPlsZ7mgKfjgIJcXG5cdFx0XHRcdG1lcm1haWQuY3VycmVudE5vZGVzID0gZ3JhcGhOb2RlcztcXG5cdFx0XHRcdHZhciBncmFwaFN5bnRheCA9IGdyYXBoTm9kZXMuam9pbihcXFwiXFxcXG5cXFwiKTtcXG5cdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoTm9kZXMpO1xcblx0XHRcdFx0Y29uc29sZS5sb2coZ3JhcGhTeW50YXgpO1xcblx0XHRcdFx0Y29uc29sZS5sb2coXFxcIllvdSBjYW4gYWNjZXNzIHRoZSBncmFwaCBub2RlcyBieSAnbWVybWFpZC5jdXJyZW50Tm9kZXMnIGluIHRoZSBjb25zb2xlIG9mIGJyb3dzZXIuXFxcIik7XFxuXHRcdFx0XHQkKFxcXCIubG9hZGluZ1xcXCIpLnJlbW92ZSgpO1xcblxcblx0XHRcdFx0dmFyIGlkID0gXFxcImZsb3ctc3RlcHMtc3ZnXFxcIjtcXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJCgnLm1lcm1haWQnKTtcXG5cdFx0XHRcdHZhciBpbnNlcnRTdmcgPSBmdW5jdGlvbihzdmdDb2RlLCBiaW5kRnVuY3Rpb25zKSB7XFxuXHRcdFx0XHRcdGVsZW1lbnQuaHRtbChzdmdDb2RlKTtcXG5cdFx0XHRcdFx0aWYodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJyl7XFxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soaWQpO1xcblx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdGJpbmRGdW5jdGlvbnMoZWxlbWVudFswXSk7XFxuXHRcdFx0XHR9O1xcblx0XHRcdFx0bWVybWFpZC5yZW5kZXIoaWQsIGdyYXBoU3ludGF4LCBpbnNlcnRTdmcsIGVsZW1lbnRbMF0pO1xcblxcblx0XHRcdFx0dmFyIHpvb21TVkcgPSBmdW5jdGlvbih6b29tKXtcXG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRXaWR0aCA9ICQoXFxcInN2Z1xcXCIpLndpZHRoKCk7XFxuXHRcdFx0XHRcdHZhciBuZXdXaWR0aCA9IGN1cnJlbnRXaWR0aCAqIHpvb207XFxuXHRcdFx0XHRcdCQoXFxcInN2Z1xcXCIpLmNzcyhcXFwibWF4V2lkdGhcXFwiLG5ld1dpZHRoICsgXFxcInB4XFxcIikud2lkdGgobmV3V2lkdGgpO1xcblx0XHRcdFx0fVxcblxcblx0XHRcdFx0Ly/mlK/mjIHpvKDmoIfmu5rova7nvKnmlL7nlLvluINcXG5cdFx0XHRcdCQod2luZG93KS5vbihcXFwibW91c2V3aGVlbFxcXCIsZnVuY3Rpb24oZXZlbnQpe1xcblx0XHRcdFx0XHRpZihldmVudC5jdHJsS2V5KXtcXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xcblx0XHRcdFx0XHRcdHZhciB6b29tID0gZXZlbnQub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCA/IDEuMSA6IDAuOTtcXG5cdFx0XHRcdFx0XHR6b29tU1ZHKHpvb20pO1xcblx0XHRcdFx0XHR9XFxuXHRcdFx0XHR9KTtcXG5cdFx0XHRcdCQoXFxcIi5idG4tem9vbVxcXCIpLm9uKFxcXCJjbGlja1xcXCIsZnVuY3Rpb24oKXtcXG5cdFx0XHRcdFx0em9vbVNWRygkKHRoaXMpLmF0dHIoXFxcInpvb21cXFwiKSk7XFxuXHRcdFx0XHR9KTtcXG5cdFx0XHR9KTtcXG5cdFx0PC9zY3JpcHQ+XFxuXHRcdDxhIGNsYXNzPVxcXCJidG4tem9vbSBidG4tem9vbS11cFxcXCIgem9vbT0xLjEgdGl0bGU9XFxcIueCueWHu+aUvuWkp1xcXCI+KzwvYT5cXG5cdFx0PGEgY2xhc3M9XFxcImJ0bi16b29tIGJ0bi16b29tLWRvd25cXFwiIHpvb209MC45IHRpdGxlPVxcXCLngrnlh7vnvKnlsI9cXFwiPi08L2E+XFxuXHQ8L2JvZHk+XFxuPC9odG1sPlwiKTtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0P2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlKHJlcSwgcmVzKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlKHJlcSwgcmVzLCBcInRyYWNlc1wiKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzX2V4cGFuZD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZShyZXEsIHJlcywgXCJ0cmFjZXNfZXhwYW5kXCIpO1xufSk7XG4iXX0=
