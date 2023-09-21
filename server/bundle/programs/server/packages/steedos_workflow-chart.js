(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC9yb3V0ZXMvY2hhcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvY2hhcnQuY29mZmVlIl0sIm5hbWVzIjpbIkZsb3d2ZXJzaW9uQVBJIiwidHJhY2VNYXhBcHByb3ZlQ291bnQiLCJ0cmFjZVNwbGl0QXBwcm92ZXNJbmRleCIsImlzRXhwYW5kQXBwcm92ZSIsImdldEFic29sdXRlVXJsIiwidXJsIiwicm9vdFVybCIsIl9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18iLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsIndyaXRlUmVzcG9uc2UiLCJyZXMiLCJodHRwQ29kZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwiZW5kIiwic2VuZEludmFsaWRVUkxSZXNwb25zZSIsInNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2UiLCJyZXBsYWNlRXJyb3JTeW1ib2wiLCJzdHIiLCJyZXBsYWNlIiwiZ2V0U3RlcEhhbmRsZXJOYW1lIiwic3RlcCIsImluc0lkIiwiYXBwcm92ZXJOYW1lcyIsImUiLCJsb2dpblVzZXJJZCIsInN0ZXBIYW5kbGVyTmFtZSIsInN0ZXBJZCIsInVzZXJJZHMiLCJzdGVwX3R5cGUiLCJfaWQiLCJnZXRIYW5kbGVyc01hbmFnZXIiLCJnZXRIYW5kbGVycyIsIm1hcCIsInVzZXJJZCIsInVzZXIiLCJkYiIsInVzZXJzIiwiZmluZE9uZSIsImZpZWxkcyIsIm5hbWUiLCJsZW5ndGgiLCJzbGljZSIsImpvaW4iLCJlcnJvciIsImdldFN0ZXBMYWJlbCIsInN0ZXBOYW1lIiwiZ2V0U3RlcE5hbWUiLCJjYWNoZWRTdGVwTmFtZXMiLCJpbnN0YW5jZV9pZCIsImNhY2hlZFN0ZXBOYW1lIiwiZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4Iiwic3RlcHMiLCJjdXJyZW50U3RlcElkIiwiaXNDb252ZXJ0VG9TdHJpbmciLCJkaXJlY3Rpb24iLCJncmFwaFN5bnRheCIsIm5vZGVzIiwiZm9yRWFjaCIsImxpbmVzIiwibGluZSIsInRvU3RlcCIsInRvU3RlcE5hbWUiLCJwdXNoIiwiZmluZFByb3BlcnR5QnlQSyIsInRvX3N0ZXAiLCJnZXRBcHByb3ZlSnVkZ2VUZXh0IiwianVkZ2UiLCJqdWRnZVRleHQiLCJsb2NhbGUiLCJUQVBpMThuIiwiX18iLCJnZXRUcmFjZU5hbWUiLCJ0cmFjZU5hbWUiLCJhcHByb3ZlSGFuZGxlck5hbWUiLCJnZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZSIsInRyYWNlIiwiYXBwcm92ZXMiLCJjb3VudGVycyIsImFwcHJvdmUiLCJmcm9tX2FwcHJvdmVfaWQiLCJ0eXBlIiwiZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlIiwidHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzIiwidG9BcHByb3ZlIiwidG9BcHByb3ZlRnJvbUlkIiwidG9BcHByb3ZlSGFuZGxlck5hbWUiLCJ0b0FwcHJvdmVUeXBlIiwiaGFuZGxlcl9uYW1lIiwiZnJvbUFwcHJvdmUiLCJjb3VudGVyIiwiY291bnRlcjIiLCJjb3VudGVyQ29udGVudCIsInJlZiIsImZyb21fdHlwZSIsImZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWUiLCJ0b19hcHByb3ZlX2lkIiwidG9fYXBwcm92ZV9oYW5kbGVyX25hbWUiLCJjb3VudCIsInRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcyIsImlzX3RvdGFsIiwicHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheCIsImN1cnJlbnRUcmFjZU5hbWUiLCJleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIiLCJmcm9tQXBwcm92ZUlkIiwicmVzdWx0cyIsInNwbGl0SW5kZXgiLCJ0ZW1wSGFuZGxlck5hbWVzIiwidG9BcHByb3ZlSWQiLCJ0b0FwcHJvdmVzIiwidHJhY2VDb3VudGVycyIsImV4dHJhQ291bnQiLCJpc1R5cGVOb2RlIiwic3RyVG9IYW5kbGVyTmFtZXMiLCJ0b0hhbmRsZXJOYW1lcyIsInR5cGVOYW1lIiwiaW5kZXhPZiIsInNwbGljZSIsIl8iLCJpc0VtcHR5IiwicmVzdWx0czEiLCJnZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4IiwidHJhY2VzIiwibGFzdEFwcHJvdmVzIiwibGFzdFRyYWNlIiwicHJldmlvdXNfdHJhY2VfaWRzIiwiY3VycmVudEZyb21UcmFjZU5hbWUiLCJmcm9tQXBwcm92ZXMiLCJmcm9tVHJhY2UiLCJmcm9tQXBwcm92ZUhhbmRsZXJOYW1lIiwiZnJvbVRyYWNlTmFtZSIsInRvVHJhY2VOYW1lIiwibGFzdEFwcHJvdmUiLCJzZW5kSHRtbFJlc3BvbnNlIiwicmVxIiwiYWxsb3dEaXJlY3Rpb25zIiwiZXJyb3JfbXNnIiwiZmxvd3ZlcnNpb24iLCJpbnN0YW5jZSIsInF1ZXJ5IiwicmVmMSIsInRpdGxlIiwiaW5jbHVkZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImluc3RhbmNlcyIsImZsb3dfdmVyc2lvbiIsImZsb3ciLCIkc2xpY2UiLCJXb3JrZmxvd01hbmFnZXIiLCJnZXRJbnN0YW5jZUZsb3dWZXJzaW9uIiwic2V0SGVhZGVyIiwiSlNPTiIsInN0cmluZ2lmeSIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJuZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsY0FBQTtBQUFBQSxpQkFFQztBQUFBQyx3QkFBc0IsRUFBdEI7QUFDQUMsMkJBQXlCLENBRHpCO0FBRUFDLG1CQUFpQixLQUZqQjtBQUlBQyxrQkFBZ0IsVUFBQ0MsR0FBRDtBQUNmLFFBQUFDLE9BQUE7QUFBQUEsY0FBYUMsNEJBQStCQSwwQkFBMEJDLG9CQUF6RCxHQUFtRixFQUFoRzs7QUFDQSxRQUFHRixPQUFIO0FBQ0NELFlBQU1DLFVBQVVELEdBQWhCO0FDRUU7O0FEREgsV0FBT0EsR0FBUDtBQVJEO0FBVUFJLGlCQUFlLFVBQUNDLEdBQUQsRUFBTUMsUUFBTixFQUFnQkMsSUFBaEI7QUFDZEYsUUFBSUcsVUFBSixHQUFpQkYsUUFBakI7QUNHRSxX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QUFnQ0MsR0FBaEMsRUFBcUM1SCxHQUFyQyxFQUEwQyxRQUExQyxDQ2xIQztBRGdIRjtBQUlBK0ksV0FBV0MsR0FBWCxDQUFlLEtBQWYsRUFBc0IsNERBQXRCLEVBQW9GLFVBQUNwQixHQUFELEVBQU01SCxHQUFOLEVBQVdpSixJQUFYO0FDaEhsRixTRGtIRDNKLGVBQWVxSSxnQkFBZixDQUFnQ0MsR0FBaEMsRUFBcUM1SCxHQUFyQyxFQUEwQyxlQUExQyxDQ2xIQztBRGdIRixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3dvcmtmbG93LWNoYXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiRmxvd3ZlcnNpb25BUEkgPVxuXG5cdHRyYWNlTWF4QXBwcm92ZUNvdW50OiAxMFxuXHR0cmFjZVNwbGl0QXBwcm92ZXNJbmRleDogNVxuXHRpc0V4cGFuZEFwcHJvdmU6IGZhbHNlXG5cblx0Z2V0QWJzb2x1dGVVcmw6ICh1cmwpLT5cblx0XHRyb290VXJsID0gaWYgX19tZXRlb3JfcnVudGltZV9jb25maWdfXyB0aGVuIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggZWxzZSBcIlwiXG5cdFx0aWYgcm9vdFVybFxuXHRcdFx0dXJsID0gcm9vdFVybCArIHVybFxuXHRcdHJldHVybiB1cmw7XG5cblx0d3JpdGVSZXNwb25zZTogKHJlcywgaHR0cENvZGUsIGJvZHkpLT5cblx0XHRyZXMuc3RhdHVzQ29kZSA9IGh0dHBDb2RlO1xuXHRcdHJlcy5lbmQoYm9keSk7XG5cdFx0XG5cdHNlbmRJbnZhbGlkVVJMUmVzcG9uc2U6IChyZXMpLT5cblx0XHRyZXR1cm4gQHdyaXRlUmVzcG9uc2UocmVzLCA0MDQsIFwidXJsIG11c3QgaGFzIHF1ZXJ5cyBhcyBpbnN0YW5jZV9pZC5cIik7XG5cdFx0XG5cdHNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2U6IChyZXMpLT5cblx0XHRyZXR1cm4gQHdyaXRlUmVzcG9uc2UocmVzLCA0MDEsIFwidGhlIGF1dGhfdG9rZW4gaGFzIGV4cGlyZWQuXCIpO1xuXG5cdHJlcGxhY2VFcnJvclN5bWJvbDogKHN0ciktPlxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvXFxcIi9nLFwiJnF1b3Q7XCIpLnJlcGxhY2UoL1xcbi9nLFwiPGJyLz5cIilcblxuXHRnZXRTdGVwSGFuZGxlck5hbWU6IChzdGVwLCBpbnNJZCktPlxuXHRcdHRyeVxuXHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gXCJcIlxuXHRcdFx0aWYgc3RlcC5zdGVwX3R5cGUgPT0gXCJjb25kaXRpb25cIlxuXHRcdFx0XHRyZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cblx0XHRcdCMgVE9ETyDojrflj5blvZPliY3nlKjmiLd1c2VySWRcblx0XHRcdGxvZ2luVXNlcklkID0gJycgXG5cdFx0XHRzdGVwSWQgPSBzdGVwLl9pZFxuXHRcdFx0dXNlcklkcyA9IGdldEhhbmRsZXJzTWFuYWdlci5nZXRIYW5kbGVycyhpbnNJZCwgc3RlcElkLCBsb2dpblVzZXJJZClcblx0XHRcdGFwcHJvdmVyTmFtZXMgPSB1c2VySWRzLm1hcCAodXNlcklkKS0+XG5cdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwgeyBmaWVsZHM6IHsgbmFtZTogMSB9IH0pXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRyZXR1cm4gdXNlci5uYW1lXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gXCJcIlxuXHRcdFx0aWYgYXBwcm92ZXJOYW1lcy5sZW5ndGggPiAzXG4gICAgICAgIFx0XHRzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLnNsaWNlKDAsMykuam9pbihcIixcIikgKyBcIi4uLlwiXG4gICAgICBcdFx0ZWxzZVxuICAgICAgICBcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0IyBzd2l0Y2ggc3RlcC5kZWFsX3R5cGVcblx0XHQjIFx0d2hlbiAnc3BlY2lmeVVzZXInXG5cdFx0IyBcdFx0YXBwcm92ZXJOYW1lcyA9IHN0ZXAuYXBwcm92ZXJfdXNlcnMubWFwICh1c2VySWQpLT5cblx0XHQjIFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZClcblx0XHQjIFx0XHRcdGlmIHVzZXJcblx0XHQjIFx0XHRcdFx0cmV0dXJuIHVzZXIubmFtZVxuXHRcdCMgXHRcdFx0ZWxzZVxuXHRcdCMgXHRcdFx0XHRyZXR1cm4gXCJcIlxuXHRcdCMgXHRcdHN0ZXBIYW5kbGVyTmFtZSA9IGFwcHJvdmVyTmFtZXMuam9pbihcIixcIilcblx0XHQjIFx0d2hlbiAnYXBwbGljYW50Um9sZSdcblx0XHQjIFx0XHRhcHByb3Zlck5hbWVzID0gc3RlcC5hcHByb3Zlcl9yb2xlcy5tYXAgKHJvbGVJZCktPlxuXHRcdCMgXHRcdFx0cm9sZSA9IGRiLmZsb3dfcm9sZXMuZmluZE9uZShyb2xlSWQpXG5cdFx0IyBcdFx0XHRpZiByb2xlXG5cdFx0IyBcdFx0XHRcdHJldHVybiByb2xlLm5hbWVcblx0XHQjIFx0XHRcdGVsc2Vcblx0XHQjIFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHQjIFx0XHRzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHRzdGVwSGFuZGxlck5hbWUgPSAnJ1xuXHRcdCMgXHRcdGJyZWFrXG5cdFx0IyByZXR1cm4gc3RlcEhhbmRsZXJOYW1lXG5cblx0Z2V0U3RlcExhYmVsOiAoc3RlcE5hbWUsIHN0ZXBIYW5kbGVyTmFtZSktPlxuXHRcdCMg6L+U5Zuec3N0ZXBOYW1l5LiOc3RlcEhhbmRsZXJOYW1l57uT5ZCI55qE5q2l6aqk5pi+56S65ZCN56ewXG5cdFx0aWYgc3RlcE5hbWVcblx0XHRcdHN0ZXBOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz5cblx0XHRcdFx0PGRpdiBjbGFzcz0nc3RlcC1uYW1lJz4je3N0ZXBOYW1lfTwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPSdzdGVwLWhhbmRsZXItbmFtZSc+I3tzdGVwSGFuZGxlck5hbWV9PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cIlxuXHRcdFx0IyDmiornibnmrorlrZfnrKbmuIXnqbrmiJbmm7/mjaLvvIzku6Xpgb/lhY1tZXJtYWlkQVBJ5Ye6546w5byC5bi4XG5cdFx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChzdGVwTmFtZSlcblx0XHRlbHNlXG5cdFx0XHRzdGVwTmFtZSA9IFwiXCJcblx0XHRyZXR1cm4gc3RlcE5hbWVcblxuXHRnZXRTdGVwTmFtZTogKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpLT5cblx0XHQjIOi/lOWbnnN0ZXDoioLngrnlkI3np7DvvIzkvJjlhYjku47nvJPlrZhjYWNoZWRTdGVwTmFtZXPkuK3lj5bvvIzlkKbliJnosIPnlKhnZXRTdGVwTGFiZWznlJ/miJBcblx0XHRjYWNoZWRTdGVwTmFtZSA9IGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF1cblx0XHRpZiBjYWNoZWRTdGVwTmFtZVxuXHRcdFx0cmV0dXJuIGNhY2hlZFN0ZXBOYW1lXG5cdFx0c3RlcEhhbmRsZXJOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcEhhbmRsZXJOYW1lKHN0ZXAsIGluc3RhbmNlX2lkKVxuXHRcdHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcExhYmVsKHN0ZXAubmFtZSwgc3RlcEhhbmRsZXJOYW1lKVxuXHRcdGNhY2hlZFN0ZXBOYW1lc1tzdGVwLl9pZF0gPSBzdGVwTmFtZVxuXHRcdHJldHVybiBzdGVwTmFtZVxuXG5cdGdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheDogKHN0ZXBzLCBjdXJyZW50U3RlcElkLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZCktPlxuXHRcdG5vZGVzID0gW1wiZ3JhcGggI3tkaXJlY3Rpb259XCJdXG5cdFx0Y2FjaGVkU3RlcE5hbWVzID0ge31cblx0XHRzdGVwcy5mb3JFYWNoIChzdGVwKS0+XG5cdFx0XHRsaW5lcyA9IHN0ZXAubGluZXNcblx0XHRcdGlmIGxpbmVzPy5sZW5ndGhcblx0XHRcdFx0bGluZXMuZm9yRWFjaCAobGluZSktPlxuXHRcdFx0XHRcdGlmIHN0ZXAubmFtZVxuXHRcdFx0XHRcdFx0IyDmoIforrDmnaHku7boioLngrlcblx0XHRcdFx0XHRcdGlmIHN0ZXAuc3RlcF90eXBlID09IFwiY29uZGl0aW9uXCJcblx0XHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tzdGVwLl9pZH0gY29uZGl0aW9uO1wiXG5cdFx0XHRcdFx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHN0ZXAsIGNhY2hlZFN0ZXBOYW1lcywgaW5zdGFuY2VfaWQpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RlcE5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0dG9TdGVwID0gc3RlcHMuZmluZFByb3BlcnR5QnlQSyhcIl9pZFwiLGxpbmUudG9fc3RlcClcblx0XHRcdFx0XHR0b1N0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcE5hbWUodG9TdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKVxuXHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7c3RlcC5faWR9KFxcXCIje3N0ZXBOYW1lfVxcXCIpLS0+I3tsaW5lLnRvX3N0ZXB9KFxcXCIje3RvU3RlcE5hbWV9XFxcIilcIlxuXG5cdFx0aWYgY3VycmVudFN0ZXBJZFxuXHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tjdXJyZW50U3RlcElkfSBjdXJyZW50LXN0ZXAtbm9kZTtcIlxuXHRcdGlmIGlzQ29udmVydFRvU3RyaW5nXG5cdFx0XHRncmFwaFN5bnRheCA9IG5vZGVzLmpvaW4gXCJcXG5cIlxuXHRcdFx0cmV0dXJuIGdyYXBoU3ludGF4XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG5vZGVzXG5cblx0Z2V0QXBwcm92ZUp1ZGdlVGV4dDogKGp1ZGdlKS0+XG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0c3dpdGNoIGp1ZGdlXG5cdFx0XHR3aGVuICdhcHByb3ZlZCdcblx0XHRcdFx0IyDlt7LmoLjlh4Zcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgYXBwcm92ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVqZWN0ZWQnXG5cdFx0XHRcdCMg5bey6amz5ZueXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlamVjdGVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3Rlcm1pbmF0ZWQnXG5cdFx0XHRcdCMg5bey5Y+W5raIXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHRlcm1pbmF0ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVhc3NpZ25lZCdcblx0XHRcdFx0IyDovaznrb7moLhcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhc3NpZ25lZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZWxvY2F0ZWQnXG5cdFx0XHRcdCMg6YeN5a6a5L2NXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlbG9jYXRlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZXRyaWV2ZWQnXG5cdFx0XHRcdCMg5bey5Y+W5ZueXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHJpZXZlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZXR1cm5lZCdcblx0XHRcdFx0IyDlt7LpgIDlm55cblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmV0dXJuZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAncmVhZGVkJ1xuXHRcdFx0XHQjIOW3sumYhVxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWFkZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqdWRnZVRleHQgPSAnJ1xuXHRcdFx0XHRicmVha1xuXHRcdHJldHVybiBqdWRnZVRleHRcblxuXHRnZXRUcmFjZU5hbWU6ICh0cmFjZU5hbWUsIGFwcHJvdmVIYW5kbGVyTmFtZSktPlxuXHRcdCMg6L+U5ZuedHJhY2XoioLngrnlkI3np7Bcblx0XHRpZiB0cmFjZU5hbWVcblx0XHRcdCMg5oqK54m55q6K5a2X56ym5riF56m65oiW5pu/5o2i77yM5Lul6YG/5YWNbWVybWFpZEFQSeWHuueOsOW8guW4uFxuXHRcdFx0dHJhY2VOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz5cblx0XHRcdFx0PGRpdiBjbGFzcz0ndHJhY2UtbmFtZSc+I3t0cmFjZU5hbWV9PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9J3RyYWNlLWhhbmRsZXItbmFtZSc+I3thcHByb3ZlSGFuZGxlck5hbWV9PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cIlxuXHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKHRyYWNlTmFtZSlcblx0XHRlbHNlXG5cdFx0XHR0cmFjZU5hbWUgPSBcIlwiXG5cdFx0cmV0dXJuIHRyYWNlTmFtZVxuXHRcblx0Z2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGU6ICh0cmFjZSktPlxuXHRcdCMg6K+l5Ye95pWw55Sf5oiQanNvbue7k+aehO+8jOihqOeOsOWHuuaJgOacieS8oOmYheOAgeWIhuWPkeOAgei9rOWPkeiKgueCueacieacieWQjue7reWtkOiKgueCueeahOiuoeaVsOaDheWGte+8jOWFtue7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOuebruagh+iKgueCueWcqOaMh+Wumuexu+Wei+S4i+eahOWQjue7reiKgueCueS4quaVsFxuXHRcdCMgXHR9XG5cdFx0IyB9XG5cdFx0Y291bnRlcnMgPSB7fVxuXHRcdGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHR1bmxlc3MgYXBwcm92ZXNcblx0XHRcdHJldHVybiBudWxsXG5cdFx0YXBwcm92ZXMuZm9yRWFjaCAoYXBwcm92ZSktPlxuXHRcdFx0aWYgYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRcblx0XHRcdFx0dW5sZXNzIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVxuXHRcdFx0XHRcdGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXSA9IHt9XG5cdFx0XHRcdGlmIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdXG5cdFx0XHRcdFx0Y291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0rK1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0gPSAxXG5cdFx0cmV0dXJuIGNvdW50ZXJzXG5cblx0Z2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlOiAodHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyktPlxuXHRcdCMg6K+l5Ye95pWw55Sf5oiQanNvbue7k+aehO+8jOihqOeOsOWHuuaJgOacieS8oOmYheOAgeWIhuWPkeOAgei9rOWPkeeahOiKgueCuea1geWQke+8jOWFtue7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOlt7XG5cdFx0IyBcdFx0XHRmcm9tX3R5cGU6IOadpea6kOiKgueCueexu+Wei1xuXHRcdCMgXHRcdFx0ZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTog5p2l5rqQ6IqC54K55aSE55CG5Lq6XG5cdFx0IyBcdFx0XHR0b19hcHByb3ZlX2lkOiDnm67moIfoioLngrlJRFxuXHRcdCMgXHRcdFx0dG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzOiBb5aSa5Liq55uu5qCH6IqC54K55rGH5oC75aSE55CG5Lq66ZuG5ZCIXVxuXHRcdCMgXHRcdFx0aXNfdG90YWw6IHRydWUvZmFsc2XvvIzmmK/lkKbmsYfmgLvoioLngrlcblx0XHQjIFx0XHR9LC4uLl1cblx0XHQjIFx0fVxuXHRcdCMgfVxuXHRcdCMg5LiK6L+w55uu5qCH57uT54K55YaF5a655Lit5pyJ5LiA5Liq5bGe5oCnaXNfdG90YWzooajnpLrmmK/lkKbmsYfmgLvoioLngrnvvIzlpoLmnpzmmK/vvIzliJnmiorlpJrkuKroioLngrnmsYfmgLvlkIjlubbmiJDkuIDkuKrvvIxcblx0XHQjIOS9huaYr+acrOi6q+acieWQjue7reWtkOiKgueCueeahOiKgueCueS4jeWPguS4juaxh+aAu+WPiuiuoeaVsOOAglxuXHRcdGNvdW50ZXJzID0ge31cblx0XHRhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0dW5sZXNzIGFwcHJvdmVzXG5cdFx0XHRyZXR1cm4gbnVsbFxuXHRcdHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRpc0V4cGFuZEFwcHJvdmUgPSBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmVcblxuXHRcdGFwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0dG9BcHByb3ZlVHlwZSA9IHRvQXBwcm92ZS50eXBlXG5cdFx0XHR0b0FwcHJvdmVGcm9tSWQgPSB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXG5cdFx0XHR0b0FwcHJvdmVIYW5kbGVyTmFtZSA9IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdHVubGVzcyB0b0FwcHJvdmVGcm9tSWRcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRhcHByb3Zlcy5mb3JFYWNoIChmcm9tQXBwcm92ZSktPlxuXHRcdFx0XHRpZiBmcm9tQXBwcm92ZS5faWQgPT0gdG9BcHByb3ZlRnJvbUlkXG5cdFx0XHRcdFx0Y291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF1cblx0XHRcdFx0XHR1bmxlc3MgY291bnRlclxuXHRcdFx0XHRcdFx0Y291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF0gPSB7fVxuXHRcdFx0XHRcdHVubGVzcyBjb3VudGVyW3RvQXBwcm92ZS50eXBlXVxuXHRcdFx0XHRcdFx0Y291bnRlclt0b0FwcHJvdmUudHlwZV0gPSBbXVxuXHRcdFx0XHRcdGNvdW50ZXIyID0gY291bnRlclt0b0FwcHJvdmUudHlwZV1cblx0XHRcdFx0XHRpZiB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbdG9BcHByb3ZlLl9pZF0/W3RvQXBwcm92ZVR5cGVdXG5cdFx0XHRcdFx0XHQjIOacieWQjue7reWtkOiKgueCue+8jOWImeS4jeWPguS4juaxh+aAu+WPiuiuoeaVsFxuXHRcdFx0XHRcdFx0Y291bnRlcjIucHVzaFxuXHRcdFx0XHRcdFx0XHRmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGVcblx0XHRcdFx0XHRcdFx0ZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWRcblx0XHRcdFx0XHRcdFx0dG9fYXBwcm92ZV9oYW5kbGVyX25hbWU6IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGNvdW50ZXJDb250ZW50ID0gaWYgaXNFeHBhbmRBcHByb3ZlIHRoZW4gbnVsbCBlbHNlIGNvdW50ZXIyLmZpbmRQcm9wZXJ0eUJ5UEsoXCJpc190b3RhbFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0IyBjb3VudGVyQ29udGVudCA9IGNvdW50ZXIyLmZpbmRQcm9wZXJ0eUJ5UEsoXCJpc190b3RhbFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0IyDlpoLmnpzlvLrliLbopoHmsYLlsZXlvIDmiYDmnInoioLngrnvvIzliJnkuI3lgZrmsYfmgLvlpITnkIZcblx0XHRcdFx0XHRcdGlmIGNvdW50ZXJDb250ZW50XG5cdFx0XHRcdFx0XHRcdGNvdW50ZXJDb250ZW50LmNvdW50Kytcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGNvdW50ZXJDb250ZW50LmNvdW50ID4gdHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRcdFx0XHRcdFx0XHRjb3VudGVyQ29udGVudC50b19hcHByb3ZlX2hhbmRsZXJfbmFtZXMucHVzaCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGNvdW50ZXIyLnB1c2hcblx0XHRcdFx0XHRcdFx0XHRmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGVcblx0XHRcdFx0XHRcdFx0XHRmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2lkOiB0b0FwcHJvdmUuX2lkXG5cdFx0XHRcdFx0XHRcdFx0Y291bnQ6IDFcblx0XHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2hhbmRsZXJfbmFtZXM6IFt0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXVxuXHRcdFx0XHRcdFx0XHRcdGlzX3RvdGFsOiB0cnVlXG5cblx0XHRyZXR1cm4gY291bnRlcnNcblxuXHRwdXNoQXBwcm92ZXNXaXRoVHlwZUdyYXBoU3ludGF4OiAobm9kZXMsIHRyYWNlKS0+XG5cdFx0dHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGUgdHJhY2Vcblx0XHR0cmFjZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlIHRyYWNlLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNcblx0XHR1bmxlc3MgdHJhY2VDb3VudGVyc1xuXHRcdFx0cmV0dXJuXG5cdFx0ZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyID0ge30gI+iusOW9lemcgOimgemineWklueUn+aIkOaJgOacieWkhOeQhuS6uuWnk+WQjeeahOiiq+S8oOmYheOAgeWIhuWPkeOAgei9rOWPkeiKgueCuVxuXHRcdHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRzcGxpdEluZGV4ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VTcGxpdEFwcHJvdmVzSW5kZXhcblx0XHRjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZVxuXHRcdGZvciBmcm9tQXBwcm92ZUlkLGZyb21BcHByb3ZlIG9mIHRyYWNlQ291bnRlcnNcblx0XHRcdGZvciB0b0FwcHJvdmVUeXBlLHRvQXBwcm92ZXMgb2YgZnJvbUFwcHJvdmVcblx0XHRcdFx0dG9BcHByb3Zlcy5mb3JFYWNoICh0b0FwcHJvdmUpLT5cblx0XHRcdFx0XHR0eXBlTmFtZSA9IFwiXCJcblx0XHRcdFx0XHRzd2l0Y2ggdG9BcHByb3ZlVHlwZVxuXHRcdFx0XHRcdFx0d2hlbiAnY2MnXG5cdFx0XHRcdFx0XHRcdHR5cGVOYW1lID0gXCLkvKDpmIVcIlxuXHRcdFx0XHRcdFx0d2hlbiAnZm9yd2FyZCdcblx0XHRcdFx0XHRcdFx0dHlwZU5hbWUgPSBcIui9rOWPkVwiXG5cdFx0XHRcdFx0XHR3aGVuICdkaXN0cmlidXRlJ1xuXHRcdFx0XHRcdFx0XHR0eXBlTmFtZSA9IFwi5YiG5Y+RXCJcblx0XHRcdFx0XHRpc1R5cGVOb2RlID0gW1wiY2NcIixcImZvcndhcmRcIixcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZih0b0FwcHJvdmUuZnJvbV90eXBlKSA+PSAwXG5cdFx0XHRcdFx0aWYgaXNUeXBlTm9kZVxuXHRcdFx0XHRcdFx0dHJhY2VOYW1lID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUgY3VycmVudFRyYWNlTmFtZSwgdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRpZiB0b0FwcHJvdmUuaXNfdG90YWxcblx0XHRcdFx0XHRcdHRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lc1xuXHRcdFx0XHRcdFx0aWYgc3BsaXRJbmRleCBhbmQgdG9BcHByb3ZlLmNvdW50ID4gc3BsaXRJbmRleFxuXHRcdFx0XHRcdFx0XHQjIOWcqOWnk+WQjembhuWQiOS4reaPkuWFpeWbnui9puespuWPt+aNouihjFxuXHRcdFx0XHRcdFx0XHR0b0hhbmRsZXJOYW1lcy5zcGxpY2Uoc3BsaXRJbmRleCwwLFwiPGJyLz4sXCIpXG5cdFx0XHRcdFx0XHRzdHJUb0hhbmRsZXJOYW1lcyA9IHRvSGFuZGxlck5hbWVzLmpvaW4oXCIsXCIpLnJlcGxhY2UoXCIsLFwiLFwiXCIpXG5cdFx0XHRcdFx0XHRleHRyYUNvdW50ID0gdG9BcHByb3ZlLmNvdW50IC0gdHJhY2VNYXhBcHByb3ZlQ291bnRcblx0XHRcdFx0XHRcdGlmIGV4dHJhQ291bnQgPiAwXG5cdFx0XHRcdFx0XHRcdHN0clRvSGFuZGxlck5hbWVzICs9IFwi562JI3t0b0FwcHJvdmUuY291bnR95Lq6XCJcblx0XHRcdFx0XHRcdFx0dW5sZXNzIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXVxuXHRcdFx0XHRcdFx0XHRcdGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXSA9IHt9XG5cdFx0XHRcdFx0XHRcdGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXVt0b0FwcHJvdmVUeXBlXSA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2lkXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0c3RyVG9IYW5kbGVyTmFtZXMgPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRpZiBpc1R5cGVOb2RlXG5cdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlSWR9PlxcXCIje3RyYWNlTmFtZX1cXFwiXS0tI3t0eXBlTmFtZX0tLT4je3RvQXBwcm92ZS50b19hcHByb3ZlX2lkfT5cXFwiI3tzdHJUb0hhbmRsZXJOYW1lc31cXFwiXVwiXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tmcm9tQXBwcm92ZUlkfShcXFwiI3t0cmFjZU5hbWV9XFxcIiktLSN7dHlwZU5hbWV9LS0+I3t0b0FwcHJvdmUudG9fYXBwcm92ZV9pZH0+XFxcIiN7c3RyVG9IYW5kbGVyTmFtZXN9XFxcIl1cIlxuXG5cdFx0IyDkuLrpnIDopoHpop3lpJbnlJ/miJDmiYDmnInlpITnkIbkurrlp5PlkI3nmoTooqvkvKDpmIXjgIHliIblj5HjgIHovazlj5HoioLngrnvvIzlop7liqDpvKDmoIflvLnlh7ror6bnu4blsYLkuovku7Zcblx0XHQjIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcueahOe7k+aehOS4uu+8mlxuXHRcdCMgY291bnRlcnMgPSB7XG5cdFx0IyBcdFtmcm9tQXBwcm92ZUlkKOadpea6kOiKgueCuUlEKV06e1xuXHRcdCMgXHRcdFt0b0FwcHJvdmVUeXBlKOebruagh+e7k+eCueexu+WeiyldOuebruagh+e7k+eCuUlEXG5cdFx0IyBcdH1cblx0XHQjIH1cblx0XHRhcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzXG5cdFx0dW5sZXNzIF8uaXNFbXB0eShleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIpXG5cdFx0XHRmb3IgZnJvbUFwcHJvdmVJZCxmcm9tQXBwcm92ZSBvZiBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJcblx0XHRcdFx0Zm9yIHRvQXBwcm92ZVR5cGUsdG9BcHByb3ZlSWQgb2YgZnJvbUFwcHJvdmVcblx0XHRcdFx0XHR0ZW1wSGFuZGxlck5hbWVzID0gW11cblx0XHRcdFx0XHRhcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRcdFx0XHRpZiBmcm9tQXBwcm92ZUlkID09IGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXG5cdFx0XHRcdFx0XHRcdHVubGVzcyB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnNbYXBwcm92ZS5faWRdP1t0b0FwcHJvdmVUeXBlXVxuXHRcdFx0XHRcdFx0XHRcdCMg5pyJ5ZCO57ut5a2Q6IqC54K577yM5YiZ5LiN5Y+C5LiO5rGH5oC75Y+K6K6h5pWwXG5cdFx0XHRcdFx0XHRcdFx0dGVtcEhhbmRsZXJOYW1lcy5wdXNoIGFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xpY2sgI3t0b0FwcHJvdmVJZH0gY2FsbGJhY2sgXFxcIiN7dGVtcEhhbmRsZXJOYW1lcy5qb2luKFwiLFwiKX1cXFwiXCJcblxuXHRnZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4OiAodHJhY2VzLCBpc0NvbnZlcnRUb1N0cmluZywgZGlyZWN0aW9uKS0+XG5cdFx0bm9kZXMgPSBbXCJncmFwaCAje2RpcmVjdGlvbn1cIl1cblx0XHRsYXN0VHJhY2UgPSBudWxsXG5cdFx0bGFzdEFwcHJvdmVzID0gW11cblx0XHR0cmFjZXMuZm9yRWFjaCAodHJhY2UpLT5cblx0XHRcdGxpbmVzID0gdHJhY2UucHJldmlvdXNfdHJhY2VfaWRzXG5cdFx0XHRjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZVxuXHRcdFx0aWYgbGluZXM/Lmxlbmd0aFxuXHRcdFx0XHRsaW5lcy5mb3JFYWNoIChsaW5lKS0+XG5cdFx0XHRcdFx0ZnJvbVRyYWNlID0gdHJhY2VzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIixsaW5lKVxuXHRcdFx0XHRcdGN1cnJlbnRGcm9tVHJhY2VOYW1lID0gZnJvbVRyYWNlLm5hbWVcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMgPSBmcm9tVHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHR0b0FwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHRsYXN0VHJhY2UgPSB0cmFjZVxuXHRcdFx0XHRcdGxhc3RBcHByb3ZlcyA9IHRvQXBwcm92ZXNcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMuZm9yRWFjaCAoZnJvbUFwcHJvdmUpLT5cblx0XHRcdFx0XHRcdGZyb21BcHByb3ZlSGFuZGxlck5hbWUgPSBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdGlmIHRvQXBwcm92ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHR0b0FwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLnR5cGUpIDwgMFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgW1wiY2NcIixcImZvcndhcmRcIixcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZihmcm9tQXBwcm92ZS50eXBlKSA8IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5LiN5piv5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R77yM5YiZ6L+e5o6l5Yiw5LiL5LiA5LiqdHJhY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0anVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dCBmcm9tQXBwcm92ZS5qdWRnZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tI3tqdWRnZVRleHR9LS0+I3t0b0FwcHJvdmUuX2lkfShcXFwiI3t0b1RyYWNlTmFtZX1cXFwiKVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tPiN7dG9BcHByb3ZlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQjIOacgOWQjuS4gOS4quatpemqpOeahHRyYWNlXG5cdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKGN1cnJlbnRUcmFjZU5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0IyDkuI3mmK/kvKDpmIXjgIHliIblj5HjgIHovazlj5HvvIzliJnov57mjqXliLDkuIvkuIDkuKp0cmFjZVxuXHRcdFx0XHRcdFx0XHRcdGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQgZnJvbUFwcHJvdmUuanVkZ2Vcblx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0je2p1ZGdlVGV4dH0tLT4je3RyYWNlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0+I3t0cmFjZS5faWR9KFxcXCIje3RvVHJhY2VOYW1lfVxcXCIpXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDnrKzkuIDkuKp0cmFjZe+8jOWboHRyYWNlc+WPr+iDveWPquacieS4gOS4qu+8jOi/meaXtumcgOimgeWNleeLrOaYvuekuuWHuuadpVxuXHRcdFx0XHR0cmFjZS5hcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lIGN1cnJlbnRUcmFjZU5hbWUsIGFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3thcHByb3ZlLl9pZH0oXFxcIiN7dHJhY2VOYW1lfVxcXCIpXCJcblxuXHRcdFx0Rmxvd3ZlcnNpb25BUEkucHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheCBub2RlcywgdHJhY2VcblxuXHRcdCMg562+5om55Y6G56iL5Lit5pyA5ZCO55qEYXBwcm92ZXPpq5jkuq7mmL7npLrvvIznu5PmnZ/mraXpqqTnmoR0cmFjZeS4reaYr+ayoeaciWFwcHJvdmVz55qE77yM5omA5Lul57uT5p2f5q2l6aqk5LiN6auY5Lqu5pi+56S6XG5cdFx0bGFzdEFwcHJvdmVzPy5mb3JFYWNoIChsYXN0QXBwcm92ZSktPlxuXHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tsYXN0QXBwcm92ZS5faWR9IGN1cnJlbnQtc3RlcC1ub2RlO1wiXG5cblx0XHRpZiBpc0NvbnZlcnRUb1N0cmluZ1xuXHRcdFx0Z3JhcGhTeW50YXggPSBub2Rlcy5qb2luIFwiXFxuXCJcblx0XHRcdHJldHVybiBncmFwaFN5bnRheFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBub2Rlc1xuXG5cdHNlbmRIdG1sUmVzcG9uc2U6IChyZXEsIHJlcywgdHlwZSktPlxuXHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdFx0aW5zdGFuY2VfaWQgPSBxdWVyeS5pbnN0YW5jZV9pZFxuXHRcdGRpcmVjdGlvbiA9IHF1ZXJ5LmRpcmVjdGlvbiB8fCAnVEQnXG5cdFx0YWxsb3dEaXJlY3Rpb25zID0gWydUQicsJ0JUJywnUkwnLCdMUicsJ1REJ107XG5cblx0XHRpZiAhXy5pbmNsdWRlKGFsbG93RGlyZWN0aW9ucywgZGlyZWN0aW9uKVxuXHRcdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlKHJlcywgNTAwLCBcIkludmFsaWQgZGlyZWN0aW9uLiBUaGUgdmFsdWUgb2YgZGlyZWN0aW9uIHNob3VsZCBiZSBpbiBbJ1RCJywgJ0JUJywgJ1JMJywgJ0xSJywgJ1REJ11cIik7XG5cblx0XHR1bmxlc3MgaW5zdGFuY2VfaWRcblx0XHRcdEZsb3d2ZXJzaW9uQVBJLnNlbmRJbnZhbGlkVVJMUmVzcG9uc2UgcmVzIFxuXHRcdFxuXHRcdHRpdGxlID0gcXVlcnkudGl0bGVcblx0XHRpZiB0aXRsZVxuXHRcdFx0dGl0bGUgPSBkZWNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHRpdGxlKSlcblx0XHRlbHNlXG5cdFx0XHR0aXRsZSA9IFwiV29ya2Zsb3cgQ2hhcnRcIlxuXG5cdFx0ZXJyb3JfbXNnID0gXCJcIlxuXHRcdGdyYXBoU3ludGF4ID0gXCJcIlxuXHRcdEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IGZhbHNlXG5cdFx0aWYgdHlwZSA9PSBcInRyYWNlc19leHBhbmRcIlxuXHRcdFx0dHlwZSA9IFwidHJhY2VzXCJcblx0XHRcdEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZSA9IHRydWVcblx0XHRzd2l0Y2ggdHlwZVxuXHRcdFx0d2hlbiAndHJhY2VzJ1xuXHRcdFx0XHRpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lIGluc3RhbmNlX2lkLHtmaWVsZHM6e3RyYWNlczogMX19XG5cdFx0XHRcdGlmIGluc3RhbmNlXG5cdFx0XHRcdFx0dHJhY2VzID0gaW5zdGFuY2UudHJhY2VzXG5cdFx0XHRcdFx0aWYgdHJhY2VzPy5sZW5ndGhcblx0XHRcdFx0XHRcdGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4IHRyYWNlcywgZmFsc2UsIGRpcmVjdGlvblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSBpbnN0YW5jZV9pZCx7ZmllbGRzOntmbG93X3ZlcnNpb246MSxmbG93OjEsdHJhY2VzOiB7JHNsaWNlOiAtMX19fVxuXHRcdFx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0XHRcdGN1cnJlbnRTdGVwSWQgPSBpbnN0YW5jZS50cmFjZXM/WzBdPy5zdGVwXG5cdFx0XHRcdFx0Zmxvd3ZlcnNpb24gPSBXb3JrZmxvd01hbmFnZXIuZ2V0SW5zdGFuY2VGbG93VmVyc2lvbihpbnN0YW5jZSlcblx0XHRcdFx0XHRzdGVwcyA9IGZsb3d2ZXJzaW9uPy5zdGVwc1xuXHRcdFx0XHRcdGlmIHN0ZXBzPy5sZW5ndGhcblx0XHRcdFx0XHRcdGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXggc3RlcHMsY3VycmVudFN0ZXBJZCxmYWxzZSwgZGlyZWN0aW9uLCBpbnN0YW5jZV9pZFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5rKh5pyJ5om+5Yiw5b2T5YmN55Sz6K+35Y2V55qE5rWB56iL5q2l6aqk5pWw5o2uXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGVycm9yX21zZyA9IFwi5b2T5YmN55Sz6K+35Y2V5LiN5a2Y5Zyo5oiW5bey6KKr5Yig6ZmkXCJcblx0XHRcdFx0YnJlYWtcblx0XHRyZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJyk7XG5cdFx0cmV0dXJuIEB3cml0ZVJlc3BvbnNlIHJlcywgMjAwLCBcIlwiXCJcblx0XHRcdDwhRE9DVFlQRSBodG1sPlxuXHRcdFx0PGh0bWw+XG5cdFx0XHRcdDxoZWFkPlxuXHRcdFx0XHRcdDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxuXHRcdFx0XHRcdDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xLHVzZXItc2NhbGFibGU9eWVzXCI+XG5cdFx0XHRcdFx0PHRpdGxlPiN7dGl0bGV9PC90aXRsZT5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwibW9iaWxlLXdlYi1hcHAtY2FwYWJsZVwiIGNvbnRlbnQ9XCJ5ZXNcIj5cblx0XHRcdFx0XHQ8bWV0YSBuYW1lPVwidGhlbWUtY29sb3JcIiBjb250ZW50PVwiIzAwMFwiPlxuXHRcdFx0XHRcdDxtZXRhIG5hbWU9XCJhcHBsaWNhdGlvbi1uYW1lXCI+XG5cdFx0XHRcdFx0PHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiL3VucGtnLmNvbS9qcXVlcnlAMS4xMS4yL2Rpc3QvanF1ZXJ5Lm1pbi5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIi91bnBrZy5jb20vbWVybWFpZEA5LjEuMi9kaXN0L21lcm1haWQubWluLmpzXCI+PC9zY3JpcHQ+XG5cdFx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdFx0Ym9keSB7IFxuXHRcdFx0XHRcdFx0XHRmb250LWZhbWlseTogJ1NvdXJjZSBTYW5zIFBybycsICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5sb2FkaW5ne1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDBweDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDBweDtcblx0XHRcdFx0XHRcdFx0dG9wOiA1MCU7XG5cdFx0XHRcdFx0XHRcdHotaW5kZXg6IDExMDA7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogLTMwcHg7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMzZweDtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICNkZmRmZGY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuZXJyb3ItbXNne1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDBweDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDBweDtcblx0XHRcdFx0XHRcdFx0Ym90dG9tOiAyMHB4O1xuXHRcdFx0XHRcdFx0XHR6LWluZGV4OiAxMTAwO1xuXHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMjBweDtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICNhOTQ0NDI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2NjY2NmZjtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiByZ2IoMTQ0LCAxNDQsIDI1NSk7XG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY3VycmVudC1zdGVwLW5vZGUgcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2NkZTQ5ODtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAjMTM1NDBjO1xuXHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDJweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jb25kaXRpb24gcmVjdHtcblx0XHRcdFx0XHRcdFx0ZmlsbDogI2VjZWNmZjtcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiByZ2IoMjA0LCAyMDQsIDI1NSk7XG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAxcHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnRyYWNlLWhhbmRsZXItbmFtZXtcblx0XHRcdFx0XHRcdFx0Y29sb3I6ICM3Nzc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnN0ZXAtaGFuZGxlci1uYW1le1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogIzc3Nztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRpdi5tZXJtYWlkVG9vbHRpcHtcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkIWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogbGVmdCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDRweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMTRweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdG1heC13aWR0aDogNTAwcHghaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiBhdXRvIWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0dG9wOiAxNXB4IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0cmlnaHQ6IDE1cHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb217XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAycHggMTBweDtcblx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAyNnB4O1xuXHRcdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAyMHB4O1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiAjZWVlO1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogIzc3Nztcblx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGZpeGVkO1xuXHRcdFx0XHRcdFx0XHRib3R0b206IDE1cHg7XG5cdFx0XHRcdFx0XHRcdG91dGxpbmU6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHRcdFx0ei1pbmRleDogOTk5OTk7XG5cdFx0XHRcdFx0XHRcdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdC1tcy11c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0XHRcdGxpbmUtaGVpZ2h0OiAxLjI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcblx0XHRcdFx0XHRcdFx0LmJ0bi16b29te1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6bm9uZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmJ0bi16b29tOmhvdmVye1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb20tdXB7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDE1cHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb20tZG93bntcblx0XHRcdFx0XHRcdFx0bGVmdDogNjBweDtcblx0XHRcdFx0XHRcdFx0cGFkZGluZzogMXB4IDEzcHggM3B4IDEzcHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PC9oZWFkPlxuXHRcdFx0XHQ8Ym9keT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzID0gXCJsb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3MgPSBcImVycm9yLW1zZ1wiPiN7ZXJyb3JfbXNnfTwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtZXJtYWlkXCI+PC9kaXY+XG5cdFx0XHRcdFx0PHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI+XG5cdFx0XHRcdFx0XHRtZXJtYWlkLmluaXRpYWxpemUoe1xuXHRcdFx0XHRcdFx0XHRzdGFydE9uTG9hZDpmYWxzZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQkKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdHZhciBncmFwaE5vZGVzID0gI3tKU09OLnN0cmluZ2lmeShncmFwaFN5bnRheCl9O1xuXHRcdFx0XHRcdFx0XHQvL+aWueS+v+WJjemdouWPr+S7pemAmui/h+iwg+eUqG1lcm1haWQuY3VycmVudE5vZGVz6LCD5byP77yM54m55oSP5aKe5YqgY3VycmVudE5vZGVz5bGe5oCn44CCXG5cdFx0XHRcdFx0XHRcdG1lcm1haWQuY3VycmVudE5vZGVzID0gZ3JhcGhOb2Rlcztcblx0XHRcdFx0XHRcdFx0dmFyIGdyYXBoU3ludGF4ID0gZ3JhcGhOb2Rlcy5qb2luKFwiXFxcXG5cIik7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoTm9kZXMpO1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhncmFwaFN5bnRheCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiWW91IGNhbiBhY2Nlc3MgdGhlIGdyYXBoIG5vZGVzIGJ5ICdtZXJtYWlkLmN1cnJlbnROb2RlcycgaW4gdGhlIGNvbnNvbGUgb2YgYnJvd3Nlci5cIik7XG5cdFx0XHRcdFx0XHRcdCQoXCIubG9hZGluZ1wiKS5yZW1vdmUoKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgaWQgPSBcImZsb3ctc3RlcHMtc3ZnXCI7XG5cdFx0XHRcdFx0XHRcdHZhciBlbGVtZW50ID0gJCgnLm1lcm1haWQnKTtcblx0XHRcdFx0XHRcdFx0dmFyIGluc2VydFN2ZyA9IGZ1bmN0aW9uKHN2Z0NvZGUsIGJpbmRGdW5jdGlvbnMpIHtcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50Lmh0bWwoc3ZnQ29kZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjayhpZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJpbmRGdW5jdGlvbnMoZWxlbWVudFswXSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdG1lcm1haWQucmVuZGVyKGlkLCBncmFwaFN5bnRheCwgaW5zZXJ0U3ZnLCBlbGVtZW50WzBdKTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgem9vbVNWRyA9IGZ1bmN0aW9uKHpvb20pe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjdXJyZW50V2lkdGggPSAkKFwic3ZnXCIpLndpZHRoKCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5ld1dpZHRoID0gY3VycmVudFdpZHRoICogem9vbTtcblx0XHRcdFx0XHRcdFx0XHQkKFwic3ZnXCIpLmNzcyhcIm1heFdpZHRoXCIsbmV3V2lkdGggKyBcInB4XCIpLndpZHRoKG5ld1dpZHRoKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8v5pSv5oyB6byg5qCH5rua6L2u57yp5pS+55S75biDXG5cdFx0XHRcdFx0XHRcdCQod2luZG93KS5vbihcIm1vdXNld2hlZWxcIixmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoZXZlbnQuY3RybEtleSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHpvb20gPSBldmVudC5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPiAwID8gMS4xIDogMC45O1xuXHRcdFx0XHRcdFx0XHRcdFx0em9vbVNWRyh6b29tKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHQkKFwiLmJ0bi16b29tXCIpLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHpvb21TVkcoJCh0aGlzKS5hdHRyKFwiem9vbVwiKSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0PC9zY3JpcHQ+XG5cdFx0XHRcdFx0PGEgY2xhc3M9XCJidG4tem9vbSBidG4tem9vbS11cFwiIHpvb209MS4xIHRpdGxlPVwi54K55Ye75pS+5aSnXCI+KzwvYT5cblx0XHRcdFx0XHQ8YSBjbGFzcz1cImJ0bi16b29tIGJ0bi16b29tLWRvd25cIiB6b29tPTAuOSB0aXRsZT1cIueCueWHu+e8qeWwj1wiPi08L2E+XG5cdFx0XHRcdDwvYm9keT5cblx0XHRcdDwvaHRtbD5cblx0XHRcIlwiXCJcblxuSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0P2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0IyDmtYHnqIvlm75cblx0Rmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZSByZXEsIHJlc1xuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0IyDmsYfmgLvnrb7mibnljobnqIvlm75cblx0Rmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZSByZXEsIHJlcywgXCJ0cmFjZXNcIlxuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzX2V4cGFuZD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdCMg5bGV5byA5omA5pyJ6IqC54K555qE562+5om55Y6G56iL5Zu+XG5cdEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UgcmVxLCByZXMsIFwidHJhY2VzX2V4cGFuZFwiXG5cbiIsInZhciBGbG93dmVyc2lvbkFQSTtcblxuRmxvd3ZlcnNpb25BUEkgPSB7XG4gIHRyYWNlTWF4QXBwcm92ZUNvdW50OiAxMCxcbiAgdHJhY2VTcGxpdEFwcHJvdmVzSW5kZXg6IDUsXG4gIGlzRXhwYW5kQXBwcm92ZTogZmFsc2UsXG4gIGdldEFic29sdXRlVXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgcm9vdFVybDtcbiAgICByb290VXJsID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXyA/IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggOiBcIlwiO1xuICAgIGlmIChyb290VXJsKSB7XG4gICAgICB1cmwgPSByb290VXJsICsgdXJsO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9LFxuICB3cml0ZVJlc3BvbnNlOiBmdW5jdGlvbihyZXMsIGh0dHBDb2RlLCBib2R5KSB7XG4gICAgcmVzLnN0YXR1c0NvZGUgPSBodHRwQ29kZTtcbiAgICByZXR1cm4gcmVzLmVuZChib2R5KTtcbiAgfSxcbiAgc2VuZEludmFsaWRVUkxSZXNwb25zZTogZnVuY3Rpb24ocmVzKSB7XG4gICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDQwNCwgXCJ1cmwgbXVzdCBoYXMgcXVlcnlzIGFzIGluc3RhbmNlX2lkLlwiKTtcbiAgfSxcbiAgc2VuZEF1dGhUb2tlbkV4cGlyZWRSZXNwb25zZTogZnVuY3Rpb24ocmVzKSB7XG4gICAgcmV0dXJuIHRoaXMud3JpdGVSZXNwb25zZShyZXMsIDQwMSwgXCJ0aGUgYXV0aF90b2tlbiBoYXMgZXhwaXJlZC5cIik7XG4gIH0sXG4gIHJlcGxhY2VFcnJvclN5bWJvbDogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFwiL2csIFwiJnF1b3Q7XCIpLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xuICB9LFxuICBnZXRTdGVwSGFuZGxlck5hbWU6IGZ1bmN0aW9uKHN0ZXAsIGluc0lkKSB7XG4gICAgdmFyIGFwcHJvdmVyTmFtZXMsIGUsIGxvZ2luVXNlcklkLCBzdGVwSGFuZGxlck5hbWUsIHN0ZXBJZCwgdXNlcklkcztcbiAgICB0cnkge1xuICAgICAgc3RlcEhhbmRsZXJOYW1lID0gXCJcIjtcbiAgICAgIGlmIChzdGVwLnN0ZXBfdHlwZSA9PT0gXCJjb25kaXRpb25cIikge1xuICAgICAgICByZXR1cm4gc3RlcEhhbmRsZXJOYW1lO1xuICAgICAgfVxuICAgICAgbG9naW5Vc2VySWQgPSAnJztcbiAgICAgIHN0ZXBJZCA9IHN0ZXAuX2lkO1xuICAgICAgdXNlcklkcyA9IGdldEhhbmRsZXJzTWFuYWdlci5nZXRIYW5kbGVycyhpbnNJZCwgc3RlcElkLCBsb2dpblVzZXJJZCk7XG4gICAgICBhcHByb3Zlck5hbWVzID0gdXNlcklkcy5tYXAoZnVuY3Rpb24odXNlcklkKSB7XG4gICAgICAgIHZhciB1c2VyO1xuICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGFwcHJvdmVyTmFtZXMubGVuZ3RoID4gMykge1xuICAgICAgICBzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLnNsaWNlKDAsIDMpLmpvaW4oXCIsXCIpICsgXCIuLi5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ZXBIYW5kbGVyTmFtZSA9IGFwcHJvdmVyTmFtZXMuam9pbihcIixcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlcEhhbmRsZXJOYW1lO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIGdldFN0ZXBMYWJlbDogZnVuY3Rpb24oc3RlcE5hbWUsIHN0ZXBIYW5kbGVyTmFtZSkge1xuICAgIGlmIChzdGVwTmFtZSkge1xuICAgICAgc3RlcE5hbWUgPSBcIjxkaXYgY2xhc3M9J2dyYXBoLW5vZGUnPiA8ZGl2IGNsYXNzPSdzdGVwLW5hbWUnPlwiICsgc3RlcE5hbWUgKyBcIjwvZGl2PiA8ZGl2IGNsYXNzPSdzdGVwLWhhbmRsZXItbmFtZSc+XCIgKyBzdGVwSGFuZGxlck5hbWUgKyBcIjwvZGl2PiA8L2Rpdj5cIjtcbiAgICAgIHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKHN0ZXBOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RlcE5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gc3RlcE5hbWU7XG4gIH0sXG4gIGdldFN0ZXBOYW1lOiBmdW5jdGlvbihzdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKSB7XG4gICAgdmFyIGNhY2hlZFN0ZXBOYW1lLCBzdGVwSGFuZGxlck5hbWUsIHN0ZXBOYW1lO1xuICAgIGNhY2hlZFN0ZXBOYW1lID0gY2FjaGVkU3RlcE5hbWVzW3N0ZXAuX2lkXTtcbiAgICBpZiAoY2FjaGVkU3RlcE5hbWUpIHtcbiAgICAgIHJldHVybiBjYWNoZWRTdGVwTmFtZTtcbiAgICB9XG4gICAgc3RlcEhhbmRsZXJOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcEhhbmRsZXJOYW1lKHN0ZXAsIGluc3RhbmNlX2lkKTtcbiAgICBzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBMYWJlbChzdGVwLm5hbWUsIHN0ZXBIYW5kbGVyTmFtZSk7XG4gICAgY2FjaGVkU3RlcE5hbWVzW3N0ZXAuX2lkXSA9IHN0ZXBOYW1lO1xuICAgIHJldHVybiBzdGVwTmFtZTtcbiAgfSxcbiAgZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4OiBmdW5jdGlvbihzdGVwcywgY3VycmVudFN0ZXBJZCwgaXNDb252ZXJ0VG9TdHJpbmcsIGRpcmVjdGlvbiwgaW5zdGFuY2VfaWQpIHtcbiAgICB2YXIgY2FjaGVkU3RlcE5hbWVzLCBncmFwaFN5bnRheCwgbm9kZXM7XG4gICAgbm9kZXMgPSBbXCJncmFwaCBcIiArIGRpcmVjdGlvbl07XG4gICAgY2FjaGVkU3RlcE5hbWVzID0ge307XG4gICAgc3RlcHMuZm9yRWFjaChmdW5jdGlvbihzdGVwKSB7XG4gICAgICB2YXIgbGluZXM7XG4gICAgICBsaW5lcyA9IHN0ZXAubGluZXM7XG4gICAgICBpZiAobGluZXMgIT0gbnVsbCA/IGxpbmVzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgdmFyIHN0ZXBOYW1lLCB0b1N0ZXAsIHRvU3RlcE5hbWU7XG4gICAgICAgICAgaWYgKHN0ZXAubmFtZSkge1xuICAgICAgICAgICAgaWYgKHN0ZXAuc3RlcF90eXBlID09PSBcImNvbmRpdGlvblwiKSB7XG4gICAgICAgICAgICAgIG5vZGVzLnB1c2goXCJcdGNsYXNzIFwiICsgc3RlcC5faWQgKyBcIiBjb25kaXRpb247XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RlcE5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwTmFtZShzdGVwLCBjYWNoZWRTdGVwTmFtZXMsIGluc3RhbmNlX2lkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlcE5hbWUgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b1N0ZXAgPSBzdGVwcy5maW5kUHJvcGVydHlCeVBLKFwiX2lkXCIsIGxpbmUudG9fc3RlcCk7XG4gICAgICAgICAgdG9TdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHRvU3RlcCwgY2FjaGVkU3RlcE5hbWVzLCBpbnN0YW5jZV9pZCk7XG4gICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgc3RlcC5faWQgKyBcIihcXFwiXCIgKyBzdGVwTmFtZSArIFwiXFxcIiktLT5cIiArIGxpbmUudG9fc3RlcCArIFwiKFxcXCJcIiArIHRvU3RlcE5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoY3VycmVudFN0ZXBJZCkge1xuICAgICAgbm9kZXMucHVzaChcIlx0Y2xhc3MgXCIgKyBjdXJyZW50U3RlcElkICsgXCIgY3VycmVudC1zdGVwLW5vZGU7XCIpO1xuICAgIH1cbiAgICBpZiAoaXNDb252ZXJ0VG9TdHJpbmcpIHtcbiAgICAgIGdyYXBoU3ludGF4ID0gbm9kZXMuam9pbihcIlxcblwiKTtcbiAgICAgIHJldHVybiBncmFwaFN5bnRheDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgfSxcbiAgZ2V0QXBwcm92ZUp1ZGdlVGV4dDogZnVuY3Rpb24oanVkZ2UpIHtcbiAgICB2YXIganVkZ2VUZXh0LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIHN3aXRjaCAoanVkZ2UpIHtcbiAgICAgIGNhc2UgJ2FwcHJvdmVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgYXBwcm92ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlamVjdGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGVybWluYXRlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHRlcm1pbmF0ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWFzc2lnbmVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhc3NpZ25lZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlbG9jYXRlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlbG9jYXRlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JldHJpZXZlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHJpZXZlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JldHVybmVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmV0dXJuZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWFkZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWFkZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBqdWRnZVRleHQgPSAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBqdWRnZVRleHQ7XG4gIH0sXG4gIGdldFRyYWNlTmFtZTogZnVuY3Rpb24odHJhY2VOYW1lLCBhcHByb3ZlSGFuZGxlck5hbWUpIHtcbiAgICBpZiAodHJhY2VOYW1lKSB7XG4gICAgICB0cmFjZU5hbWUgPSBcIjxkaXYgY2xhc3M9J2dyYXBoLW5vZGUnPiA8ZGl2IGNsYXNzPSd0cmFjZS1uYW1lJz5cIiArIHRyYWNlTmFtZSArIFwiPC9kaXY+IDxkaXYgY2xhc3M9J3RyYWNlLWhhbmRsZXItbmFtZSc+XCIgKyBhcHByb3ZlSGFuZGxlck5hbWUgKyBcIjwvZGl2PiA8L2Rpdj5cIjtcbiAgICAgIHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbCh0cmFjZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFjZU5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gdHJhY2VOYW1lO1xuICB9LFxuICBnZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZTogZnVuY3Rpb24odHJhY2UpIHtcbiAgICB2YXIgYXBwcm92ZXMsIGNvdW50ZXJzO1xuICAgIGNvdW50ZXJzID0ge307XG4gICAgYXBwcm92ZXMgPSB0cmFjZS5hcHByb3ZlcztcbiAgICBpZiAoIWFwcHJvdmVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihhcHByb3ZlKSB7XG4gICAgICBpZiAoYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWQpIHtcbiAgICAgICAgaWYgKCFjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF0pIHtcbiAgICAgICAgICBjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0pIHtcbiAgICAgICAgICByZXR1cm4gY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0rKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV0gPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvdW50ZXJzO1xuICB9LFxuICBnZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGU6IGZ1bmN0aW9uKHRyYWNlLCB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMpIHtcbiAgICB2YXIgYXBwcm92ZXMsIGNvdW50ZXJzLCBpc0V4cGFuZEFwcHJvdmUsIHRyYWNlTWF4QXBwcm92ZUNvdW50O1xuICAgIGNvdW50ZXJzID0ge307XG4gICAgYXBwcm92ZXMgPSB0cmFjZS5hcHByb3ZlcztcbiAgICBpZiAoIWFwcHJvdmVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdHJhY2VNYXhBcHByb3ZlQ291bnQgPSBGbG93dmVyc2lvbkFQSS50cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICBpc0V4cGFuZEFwcHJvdmUgPSBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmU7XG4gICAgYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbih0b0FwcHJvdmUpIHtcbiAgICAgIHZhciB0b0FwcHJvdmVGcm9tSWQsIHRvQXBwcm92ZUhhbmRsZXJOYW1lLCB0b0FwcHJvdmVUeXBlO1xuICAgICAgdG9BcHByb3ZlVHlwZSA9IHRvQXBwcm92ZS50eXBlO1xuICAgICAgdG9BcHByb3ZlRnJvbUlkID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9pZDtcbiAgICAgIHRvQXBwcm92ZUhhbmRsZXJOYW1lID0gdG9BcHByb3ZlLmhhbmRsZXJfbmFtZTtcbiAgICAgIGlmICghdG9BcHByb3ZlRnJvbUlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGZyb21BcHByb3ZlKSB7XG4gICAgICAgIHZhciBjb3VudGVyLCBjb3VudGVyMiwgY291bnRlckNvbnRlbnQsIHJlZjtcbiAgICAgICAgaWYgKGZyb21BcHByb3ZlLl9pZCA9PT0gdG9BcHByb3ZlRnJvbUlkKSB7XG4gICAgICAgICAgY291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF07XG4gICAgICAgICAgaWYgKCFjb3VudGVyKSB7XG4gICAgICAgICAgICBjb3VudGVyID0gY291bnRlcnNbdG9BcHByb3ZlRnJvbUlkXSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdKSB7XG4gICAgICAgICAgICBjb3VudGVyW3RvQXBwcm92ZS50eXBlXSA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudGVyMiA9IGNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdO1xuICAgICAgICAgIGlmICgocmVmID0gdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzW3RvQXBwcm92ZS5faWRdKSAhPSBudWxsID8gcmVmW3RvQXBwcm92ZVR5cGVdIDogdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY291bnRlcjIucHVzaCh7XG4gICAgICAgICAgICAgIGZyb21fdHlwZTogZnJvbUFwcHJvdmUudHlwZSxcbiAgICAgICAgICAgICAgZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lLFxuICAgICAgICAgICAgICB0b19hcHByb3ZlX2lkOiB0b0FwcHJvdmUuX2lkLFxuICAgICAgICAgICAgICB0b19hcHByb3ZlX2hhbmRsZXJfbmFtZTogdG9BcHByb3ZlLmhhbmRsZXJfbmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ZXJDb250ZW50ID0gaXNFeHBhbmRBcHByb3ZlID8gbnVsbCA6IGNvdW50ZXIyLmZpbmRQcm9wZXJ0eUJ5UEsoXCJpc190b3RhbFwiLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChjb3VudGVyQ29udGVudCkge1xuICAgICAgICAgICAgICBjb3VudGVyQ29udGVudC5jb3VudCsrO1xuICAgICAgICAgICAgICBpZiAoIShjb3VudGVyQ29udGVudC5jb3VudCA+IHRyYWNlTWF4QXBwcm92ZUNvdW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb3VudGVyQ29udGVudC50b19hcHByb3ZlX2hhbmRsZXJfbmFtZXMucHVzaCh0b0FwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvdW50ZXIyLnB1c2goe1xuICAgICAgICAgICAgICAgIGZyb21fdHlwZTogZnJvbUFwcHJvdmUudHlwZSxcbiAgICAgICAgICAgICAgICBmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWUsXG4gICAgICAgICAgICAgICAgdG9fYXBwcm92ZV9pZDogdG9BcHByb3ZlLl9pZCxcbiAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgICB0b19hcHByb3ZlX2hhbmRsZXJfbmFtZXM6IFt0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXSxcbiAgICAgICAgICAgICAgICBpc190b3RhbDogdHJ1ZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3VudGVycztcbiAgfSxcbiAgcHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheDogZnVuY3Rpb24obm9kZXMsIHRyYWNlKSB7XG4gICAgdmFyIGFwcHJvdmVzLCBjdXJyZW50VHJhY2VOYW1lLCBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIsIGZyb21BcHByb3ZlLCBmcm9tQXBwcm92ZUlkLCByZXN1bHRzLCBzcGxpdEluZGV4LCB0ZW1wSGFuZGxlck5hbWVzLCB0b0FwcHJvdmVJZCwgdG9BcHByb3ZlVHlwZSwgdG9BcHByb3ZlcywgdHJhY2VDb3VudGVycywgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzLCB0cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICB0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZSh0cmFjZSk7XG4gICAgdHJhY2VDb3VudGVycyA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlQ291bnRlcnNXaXRoVHlwZSh0cmFjZSwgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzKTtcbiAgICBpZiAoIXRyYWNlQ291bnRlcnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyID0ge307XG4gICAgdHJhY2VNYXhBcHByb3ZlQ291bnQgPSBGbG93dmVyc2lvbkFQSS50cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICBzcGxpdEluZGV4ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VTcGxpdEFwcHJvdmVzSW5kZXg7XG4gICAgY3VycmVudFRyYWNlTmFtZSA9IHRyYWNlLm5hbWU7XG4gICAgZm9yIChmcm9tQXBwcm92ZUlkIGluIHRyYWNlQ291bnRlcnMpIHtcbiAgICAgIGZyb21BcHByb3ZlID0gdHJhY2VDb3VudGVyc1tmcm9tQXBwcm92ZUlkXTtcbiAgICAgIGZvciAodG9BcHByb3ZlVHlwZSBpbiBmcm9tQXBwcm92ZSkge1xuICAgICAgICB0b0FwcHJvdmVzID0gZnJvbUFwcHJvdmVbdG9BcHByb3ZlVHlwZV07XG4gICAgICAgIHRvQXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbih0b0FwcHJvdmUpIHtcbiAgICAgICAgICB2YXIgZXh0cmFDb3VudCwgaXNUeXBlTm9kZSwgc3RyVG9IYW5kbGVyTmFtZXMsIHRvSGFuZGxlck5hbWVzLCB0cmFjZU5hbWUsIHR5cGVOYW1lO1xuICAgICAgICAgIHR5cGVOYW1lID0gXCJcIjtcbiAgICAgICAgICBzd2l0Y2ggKHRvQXBwcm92ZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NjJzpcbiAgICAgICAgICAgICAgdHlwZU5hbWUgPSBcIuS8oOmYhVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZvcndhcmQnOlxuICAgICAgICAgICAgICB0eXBlTmFtZSA9IFwi6L2s5Y+RXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlzdHJpYnV0ZSc6XG4gICAgICAgICAgICAgIHR5cGVOYW1lID0gXCLliIblj5FcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXNUeXBlTm9kZSA9IFtcImNjXCIsIFwiZm9yd2FyZFwiLCBcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZih0b0FwcHJvdmUuZnJvbV90eXBlKSA+PSAwO1xuICAgICAgICAgIGlmIChpc1R5cGVOb2RlKSB7XG4gICAgICAgICAgICB0cmFjZU5hbWUgPSB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lKGN1cnJlbnRUcmFjZU5hbWUsIHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRvQXBwcm92ZS5pc190b3RhbCkge1xuICAgICAgICAgICAgdG9IYW5kbGVyTmFtZXMgPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzO1xuICAgICAgICAgICAgaWYgKHNwbGl0SW5kZXggJiYgdG9BcHByb3ZlLmNvdW50ID4gc3BsaXRJbmRleCkge1xuICAgICAgICAgICAgICB0b0hhbmRsZXJOYW1lcy5zcGxpY2Uoc3BsaXRJbmRleCwgMCwgXCI8YnIvPixcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHJUb0hhbmRsZXJOYW1lcyA9IHRvSGFuZGxlck5hbWVzLmpvaW4oXCIsXCIpLnJlcGxhY2UoXCIsLFwiLCBcIlwiKTtcbiAgICAgICAgICAgIGV4dHJhQ291bnQgPSB0b0FwcHJvdmUuY291bnQgLSB0cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICAgICAgICAgIGlmIChleHRyYUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICBzdHJUb0hhbmRsZXJOYW1lcyArPSBcIuetiVwiICsgdG9BcHByb3ZlLmNvdW50ICsgXCLkurpcIjtcbiAgICAgICAgICAgICAgaWYgKCFleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF0pIHtcbiAgICAgICAgICAgICAgICBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF0gPSB7fTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXJbZnJvbUFwcHJvdmVJZF1bdG9BcHByb3ZlVHlwZV0gPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyVG9IYW5kbGVyTmFtZXMgPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9oYW5kbGVyX25hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc1R5cGVOb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZUlkICsgXCI+XFxcIlwiICsgdHJhY2VOYW1lICsgXCJcXFwiXS0tXCIgKyB0eXBlTmFtZSArIFwiLS0+XCIgKyB0b0FwcHJvdmUudG9fYXBwcm92ZV9pZCArIFwiPlxcXCJcIiArIHN0clRvSGFuZGxlck5hbWVzICsgXCJcXFwiXVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmVJZCArIFwiKFxcXCJcIiArIHRyYWNlTmFtZSArIFwiXFxcIiktLVwiICsgdHlwZU5hbWUgKyBcIi0tPlwiICsgdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWQgKyBcIj5cXFwiXCIgKyBzdHJUb0hhbmRsZXJOYW1lcyArIFwiXFxcIl1cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXBwcm92ZXMgPSB0cmFjZS5hcHByb3ZlcztcbiAgICBpZiAoIV8uaXNFbXB0eShleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIpKSB7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGZyb21BcHByb3ZlSWQgaW4gZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyKSB7XG4gICAgICAgIGZyb21BcHByb3ZlID0gZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdO1xuICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciByZXN1bHRzMTtcbiAgICAgICAgICByZXN1bHRzMSA9IFtdO1xuICAgICAgICAgIGZvciAodG9BcHByb3ZlVHlwZSBpbiBmcm9tQXBwcm92ZSkge1xuICAgICAgICAgICAgdG9BcHByb3ZlSWQgPSBmcm9tQXBwcm92ZVt0b0FwcHJvdmVUeXBlXTtcbiAgICAgICAgICAgIHRlbXBIYW5kbGVyTmFtZXMgPSBbXTtcbiAgICAgICAgICAgIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oYXBwcm92ZSkge1xuICAgICAgICAgICAgICB2YXIgcmVmO1xuICAgICAgICAgICAgICBpZiAoZnJvbUFwcHJvdmVJZCA9PT0gYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoISgocmVmID0gdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzW2FwcHJvdmUuX2lkXSkgIT0gbnVsbCA/IHJlZlt0b0FwcHJvdmVUeXBlXSA6IHZvaWQgMCkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wSGFuZGxlck5hbWVzLnB1c2goYXBwcm92ZS5oYW5kbGVyX25hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHRzMS5wdXNoKG5vZGVzLnB1c2goXCJcdGNsaWNrIFwiICsgdG9BcHByb3ZlSWQgKyBcIiBjYWxsYmFjayBcXFwiXCIgKyAodGVtcEhhbmRsZXJOYW1lcy5qb2luKFwiLFwiKSkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgIH0pKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9LFxuICBnZW5lcmF0ZVRyYWNlc0dyYXBoU3ludGF4OiBmdW5jdGlvbih0cmFjZXMsIGlzQ29udmVydFRvU3RyaW5nLCBkaXJlY3Rpb24pIHtcbiAgICB2YXIgZ3JhcGhTeW50YXgsIGxhc3RBcHByb3ZlcywgbGFzdFRyYWNlLCBub2RlcztcbiAgICBub2RlcyA9IFtcImdyYXBoIFwiICsgZGlyZWN0aW9uXTtcbiAgICBsYXN0VHJhY2UgPSBudWxsO1xuICAgIGxhc3RBcHByb3ZlcyA9IFtdO1xuICAgIHRyYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgICB2YXIgY3VycmVudFRyYWNlTmFtZSwgbGluZXM7XG4gICAgICBsaW5lcyA9IHRyYWNlLnByZXZpb3VzX3RyYWNlX2lkcztcbiAgICAgIGN1cnJlbnRUcmFjZU5hbWUgPSB0cmFjZS5uYW1lO1xuICAgICAgaWYgKGxpbmVzICE9IG51bGwgPyBsaW5lcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRGcm9tVHJhY2VOYW1lLCBmcm9tQXBwcm92ZXMsIGZyb21UcmFjZSwgdG9BcHByb3ZlcztcbiAgICAgICAgICBmcm9tVHJhY2UgPSB0cmFjZXMuZmluZFByb3BlcnR5QnlQSyhcIl9pZFwiLCBsaW5lKTtcbiAgICAgICAgICBjdXJyZW50RnJvbVRyYWNlTmFtZSA9IGZyb21UcmFjZS5uYW1lO1xuICAgICAgICAgIGZyb21BcHByb3ZlcyA9IGZyb21UcmFjZS5hcHByb3ZlcztcbiAgICAgICAgICB0b0FwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgICAgICAgbGFzdFRyYWNlID0gdHJhY2U7XG4gICAgICAgICAgbGFzdEFwcHJvdmVzID0gdG9BcHByb3ZlcztcbiAgICAgICAgICByZXR1cm4gZnJvbUFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgICAgIHZhciBmcm9tQXBwcm92ZUhhbmRsZXJOYW1lLCBmcm9tVHJhY2VOYW1lLCBqdWRnZVRleHQsIHRvVHJhY2VOYW1lO1xuICAgICAgICAgICAgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSA9IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZTtcbiAgICAgICAgICAgIGlmICh0b0FwcHJvdmVzICE9IG51bGwgPyB0b0FwcHJvdmVzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICByZXR1cm4gdG9BcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKHRvQXBwcm92ZSkge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tVHJhY2VOYW1lLCBqdWRnZVRleHQsIHRvVHJhY2VOYW1lO1xuICAgICAgICAgICAgICAgIGlmIChbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLnR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgaWYgKFtcImNjXCIsIFwiZm9yd2FyZFwiLCBcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZihmcm9tQXBwcm92ZS50eXBlKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lKGN1cnJlbnRUcmFjZU5hbWUsIHRvQXBwcm92ZS5oYW5kbGVyX25hbWUpO1xuICAgICAgICAgICAgICAgICAgICBqdWRnZVRleHQgPSBGbG93dmVyc2lvbkFQSS5nZXRBcHByb3ZlSnVkZ2VUZXh0KGZyb21BcHByb3ZlLmp1ZGdlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGp1ZGdlVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS1cIiArIGp1ZGdlVGV4dCArIFwiLS0+XCIgKyB0b0FwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgdG9UcmFjZU5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS0+XCIgKyB0b0FwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgdG9UcmFjZU5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgdG9UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2woY3VycmVudFRyYWNlTmFtZSk7XG4gICAgICAgICAgICAgICAganVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dChmcm9tQXBwcm92ZS5qdWRnZSk7XG4gICAgICAgICAgICAgICAgaWYgKGp1ZGdlVGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgZnJvbVRyYWNlTmFtZSArIFwiXFxcIiktLVwiICsganVkZ2VUZXh0ICsgXCItLT5cIiArIHRyYWNlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgZnJvbVRyYWNlTmFtZSArIFwiXFxcIiktLT5cIiArIHRyYWNlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFjZS5hcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcHJvdmUpIHtcbiAgICAgICAgICB2YXIgdHJhY2VOYW1lO1xuICAgICAgICAgIHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50VHJhY2VOYW1lLCBhcHByb3ZlLmhhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgYXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyB0cmFjZU5hbWUgKyBcIlxcXCIpXCIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBGbG93dmVyc2lvbkFQSS5wdXNoQXBwcm92ZXNXaXRoVHlwZUdyYXBoU3ludGF4KG5vZGVzLCB0cmFjZSk7XG4gICAgfSk7XG4gICAgaWYgKGxhc3RBcHByb3ZlcyAhPSBudWxsKSB7XG4gICAgICBsYXN0QXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihsYXN0QXBwcm92ZSkge1xuICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0Y2xhc3MgXCIgKyBsYXN0QXBwcm92ZS5faWQgKyBcIiBjdXJyZW50LXN0ZXAtbm9kZTtcIik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzQ29udmVydFRvU3RyaW5nKSB7XG4gICAgICBncmFwaFN5bnRheCA9IG5vZGVzLmpvaW4oXCJcXG5cIik7XG4gICAgICByZXR1cm4gZ3JhcGhTeW50YXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gIH0sXG4gIHNlbmRIdG1sUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcSwgcmVzLCB0eXBlKSB7XG4gICAgdmFyIGFsbG93RGlyZWN0aW9ucywgY3VycmVudFN0ZXBJZCwgZGlyZWN0aW9uLCBlcnJvcl9tc2csIGZsb3d2ZXJzaW9uLCBncmFwaFN5bnRheCwgaW5zdGFuY2UsIGluc3RhbmNlX2lkLCBxdWVyeSwgcmVmLCByZWYxLCBzdGVwcywgdGl0bGUsIHRyYWNlcztcbiAgICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgICBpbnN0YW5jZV9pZCA9IHF1ZXJ5Lmluc3RhbmNlX2lkO1xuICAgIGRpcmVjdGlvbiA9IHF1ZXJ5LmRpcmVjdGlvbiB8fCAnVEQnO1xuICAgIGFsbG93RGlyZWN0aW9ucyA9IFsnVEInLCAnQlQnLCAnUkwnLCAnTFInLCAnVEQnXTtcbiAgICBpZiAoIV8uaW5jbHVkZShhbGxvd0RpcmVjdGlvbnMsIGRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCA1MDAsIFwiSW52YWxpZCBkaXJlY3Rpb24uIFRoZSB2YWx1ZSBvZiBkaXJlY3Rpb24gc2hvdWxkIGJlIGluIFsnVEInLCAnQlQnLCAnUkwnLCAnTFInLCAnVEQnXVwiKTtcbiAgICB9XG4gICAgaWYgKCFpbnN0YW5jZV9pZCkge1xuICAgICAgRmxvd3ZlcnNpb25BUEkuc2VuZEludmFsaWRVUkxSZXNwb25zZShyZXMpO1xuICAgIH1cbiAgICB0aXRsZSA9IHF1ZXJ5LnRpdGxlO1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgdGl0bGUgPSBkZWNvZGVVUklDb21wb25lbnQoZGVjb2RlVVJJQ29tcG9uZW50KHRpdGxlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpdGxlID0gXCJXb3JrZmxvdyBDaGFydFwiO1xuICAgIH1cbiAgICBlcnJvcl9tc2cgPSBcIlwiO1xuICAgIGdyYXBoU3ludGF4ID0gXCJcIjtcbiAgICBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSBmYWxzZTtcbiAgICBpZiAodHlwZSA9PT0gXCJ0cmFjZXNfZXhwYW5kXCIpIHtcbiAgICAgIHR5cGUgPSBcInRyYWNlc1wiO1xuICAgICAgRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlID0gdHJ1ZTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICd0cmFjZXMnOlxuICAgICAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKGluc3RhbmNlX2lkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB0cmFjZXM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICB0cmFjZXMgPSBpbnN0YW5jZS50cmFjZXM7XG4gICAgICAgICAgaWYgKHRyYWNlcyAhPSBudWxsID8gdHJhY2VzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgZ3JhcGhTeW50YXggPSB0aGlzLmdlbmVyYXRlVHJhY2VzR3JhcGhTeW50YXgodHJhY2VzLCBmYWxzZSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JfbXNnID0gXCLmsqHmnInmib7liLDlvZPliY3nlLPor7fljZXnmoTmtYHnqIvmraXpqqTmlbDmja5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JfbXNnID0gXCLlvZPliY3nlLPor7fljZXkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoaW5zdGFuY2VfaWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgICB0cmFjZXM6IHtcbiAgICAgICAgICAgICAgJHNsaWNlOiAtMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGN1cnJlbnRTdGVwSWQgPSAocmVmID0gaW5zdGFuY2UudHJhY2VzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMF0pICE9IG51bGwgPyByZWYxLnN0ZXAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgZmxvd3ZlcnNpb24gPSBXb3JrZmxvd01hbmFnZXIuZ2V0SW5zdGFuY2VGbG93VmVyc2lvbihpbnN0YW5jZSk7XG4gICAgICAgICAgc3RlcHMgPSBmbG93dmVyc2lvbiAhPSBudWxsID8gZmxvd3ZlcnNpb24uc3RlcHMgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKHN0ZXBzICE9IG51bGwgPyBzdGVwcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXgoc3RlcHMsIGN1cnJlbnRTdGVwSWQsIGZhbHNlLCBkaXJlY3Rpb24sIGluc3RhbmNlX2lkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JfbXNnID0gXCLmsqHmnInmib7liLDlvZPliY3nlLPor7fljZXnmoTmtYHnqIvmraXpqqTmlbDmja5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JfbXNnID0gXCLlvZPliY3nlLPor7fljZXkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCAyMDAsIFwiPCFET0NUWVBFIGh0bWw+XFxuPGh0bWw+XFxuXHQ8aGVhZD5cXG5cdFx0PG1ldGEgY2hhcnNldD1cXFwidXRmLThcXFwiPlxcblx0XHQ8bWV0YSBuYW1lPVxcXCJ2aWV3cG9ydFxcXCIgY29udGVudD1cXFwid2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSx1c2VyLXNjYWxhYmxlPXllc1xcXCI+XFxuXHRcdDx0aXRsZT5cIiArIHRpdGxlICsgXCI8L3RpdGxlPlxcblx0XHQ8bWV0YSBuYW1lPVxcXCJtb2JpbGUtd2ViLWFwcC1jYXBhYmxlXFxcIiBjb250ZW50PVxcXCJ5ZXNcXFwiPlxcblx0XHQ8bWV0YSBuYW1lPVxcXCJ0aGVtZS1jb2xvclxcXCIgY29udGVudD1cXFwiIzAwMFxcXCI+XFxuXHRcdDxtZXRhIG5hbWU9XFxcImFwcGxpY2F0aW9uLW5hbWVcXFwiPlxcblx0XHQ8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIvdW5wa2cuY29tL2pxdWVyeUAxLjExLjIvZGlzdC9qcXVlcnkubWluLmpzXFxcIj48L3NjcmlwdD5cXG5cdFx0PHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiL3VucGtnLmNvbS9tZXJtYWlkQDkuMS4yL2Rpc3QvbWVybWFpZC5taW4uanNcXFwiPjwvc2NyaXB0Plxcblx0XHQ8c3R5bGU+XFxuXHRcdFx0Ym9keSB7IFxcblx0XHRcdFx0Zm9udC1mYW1pbHk6ICdTb3VyY2UgU2FucyBQcm8nLCAnSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xcblx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG5cdFx0XHR9XFxuXHRcdFx0LmxvYWRpbmd7XFxuXHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXHRcdFx0XHRsZWZ0OiAwcHg7XFxuXHRcdFx0XHRyaWdodDogMHB4O1xcblx0XHRcdFx0dG9wOiA1MCU7XFxuXHRcdFx0XHR6LWluZGV4OiAxMTAwO1xcblx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblx0XHRcdFx0bWFyZ2luLXRvcDogLTMwcHg7XFxuXHRcdFx0XHRmb250LXNpemU6IDM2cHg7XFxuXHRcdFx0XHRjb2xvcjogI2RmZGZkZjtcXG5cdFx0XHR9XFxuXHRcdFx0LmVycm9yLW1zZ3tcXG5cdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cdFx0XHRcdGxlZnQ6IDBweDtcXG5cdFx0XHRcdHJpZ2h0OiAwcHg7XFxuXHRcdFx0XHRib3R0b206IDIwcHg7XFxuXHRcdFx0XHR6LWluZGV4OiAxMTAwO1xcblx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblx0XHRcdFx0Zm9udC1zaXplOiAyMHB4O1xcblx0XHRcdFx0Y29sb3I6ICNhOTQ0NDI7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSByZWN0e1xcblx0XHRcdFx0ZmlsbDogI2NjY2NmZjtcXG5cdFx0XHRcdHN0cm9rZTogcmdiKDE0NCwgMTQ0LCAyNTUpO1xcbiAgICBcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDJweDtcXG5cdFx0XHR9XFxuXHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlLmN1cnJlbnQtc3RlcC1ub2RlIHJlY3R7XFxuXHRcdFx0XHRmaWxsOiAjY2RlNDk4O1xcblx0XHRcdFx0c3Ryb2tlOiAjMTM1NDBjO1xcblx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jb25kaXRpb24gcmVjdHtcXG5cdFx0XHRcdGZpbGw6ICNlY2VjZmY7XFxuXHRcdFx0XHRzdHJva2U6IHJnYigyMDQsIDIwNCwgMjU1KTtcXG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAxcHg7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSAudHJhY2UtaGFuZGxlci1uYW1le1xcblx0XHRcdFx0Y29sb3I6ICM3Nzc7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSAuc3RlcC1oYW5kbGVyLW5hbWV7XFxuXHRcdFx0XHRjb2xvcjogIzc3NztcXG5cdFx0XHR9XFxuXHRcdFx0ZGl2Lm1lcm1haWRUb29sdGlwe1xcblx0XHRcdFx0cG9zaXRpb246IGZpeGVkIWltcG9ydGFudDtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGxlZnQhaW1wb3J0YW50O1xcblx0XHRcdFx0cGFkZGluZzogNHB4IWltcG9ydGFudDtcXG5cdFx0XHRcdGZvbnQtc2l6ZTogMTRweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRtYXgtd2lkdGg6IDUwMHB4IWltcG9ydGFudDtcXG5cdFx0XHRcdGxlZnQ6IGF1dG8haW1wb3J0YW50O1xcblx0XHRcdFx0dG9wOiAxNXB4IWltcG9ydGFudDtcXG5cdFx0XHRcdHJpZ2h0OiAxNXB4O1xcblx0XHRcdH1cXG5cdFx0XHQuYnRuLXpvb217XFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XFxuXHRcdFx0XHRib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xcblx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblx0XHRcdFx0cGFkZGluZzogMnB4IDEwcHg7XFxuXHRcdFx0XHRmb250LXNpemU6IDI2cHg7XFxuXHRcdFx0XHRib3JkZXItcmFkaXVzOiAyMHB4O1xcblx0XHRcdFx0YmFja2dyb3VuZDogI2VlZTtcXG5cdFx0XHRcdGNvbG9yOiAjNzc3O1xcblx0XHRcdFx0cG9zaXRpb246IGZpeGVkO1xcblx0XHRcdFx0Ym90dG9tOiAxNXB4O1xcblx0XHRcdFx0b3V0bGluZTogbm9uZTtcXG5cdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcXG5cdFx0XHRcdHotaW5kZXg6IDk5OTk5O1xcblx0XHRcdFx0LXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG5cdFx0XHRcdC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHQtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHR1c2VyLXNlbGVjdDogbm9uZTtcXG5cdFx0XHRcdGxpbmUtaGVpZ2h0OiAxLjI7XFxuXHRcdFx0fVxcblx0XHRcdEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcblx0XHRcdFx0LmJ0bi16b29te1xcblx0XHRcdFx0XHRkaXNwbGF5Om5vbmU7XFxuXHRcdFx0XHR9XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbTpob3ZlcntcXG5cdFx0XHRcdGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcXG5cdFx0XHR9XFxuXHRcdFx0LmJ0bi16b29tLXVwe1xcblx0XHRcdFx0bGVmdDogMTVweDtcXG5cdFx0XHR9XFxuXHRcdFx0LmJ0bi16b29tLWRvd257XFxuXHRcdFx0XHRsZWZ0OiA2MHB4O1xcblx0XHRcdFx0cGFkZGluZzogMXB4IDEzcHggM3B4IDEzcHg7XFxuXHRcdFx0fVxcblx0XHQ8L3N0eWxlPlxcblx0PC9oZWFkPlxcblx0PGJvZHk+XFxuXHRcdDxkaXYgY2xhc3MgPSBcXFwibG9hZGluZ1xcXCI+TG9hZGluZy4uLjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzID0gXFxcImVycm9yLW1zZ1xcXCI+XCIgKyBlcnJvcl9tc2cgKyBcIjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVxcXCJtZXJtYWlkXFxcIj48L2Rpdj5cXG5cdFx0PHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiPlxcblx0XHRcdG1lcm1haWQuaW5pdGlhbGl6ZSh7XFxuXHRcdFx0XHRzdGFydE9uTG9hZDpmYWxzZVxcblx0XHRcdH0pO1xcblx0XHRcdCQoZnVuY3Rpb24oKXtcXG5cdFx0XHRcdHZhciBncmFwaE5vZGVzID0gXCIgKyAoSlNPTi5zdHJpbmdpZnkoZ3JhcGhTeW50YXgpKSArIFwiO1xcblx0XHRcdFx0Ly/mlrnkvr/liY3pnaLlj6/ku6XpgJrov4fosIPnlKhtZXJtYWlkLmN1cnJlbnROb2Rlc+iwg+W8j++8jOeJueaEj+WinuWKoGN1cnJlbnROb2Rlc+WxnuaAp+OAglxcblx0XHRcdFx0bWVybWFpZC5jdXJyZW50Tm9kZXMgPSBncmFwaE5vZGVzO1xcblx0XHRcdFx0dmFyIGdyYXBoU3ludGF4ID0gZ3JhcGhOb2Rlcy5qb2luKFxcXCJcXFxcblxcXCIpO1xcblx0XHRcdFx0Y29uc29sZS5sb2coZ3JhcGhOb2Rlcyk7XFxuXHRcdFx0XHRjb25zb2xlLmxvZyhncmFwaFN5bnRheCk7XFxuXHRcdFx0XHRjb25zb2xlLmxvZyhcXFwiWW91IGNhbiBhY2Nlc3MgdGhlIGdyYXBoIG5vZGVzIGJ5ICdtZXJtYWlkLmN1cnJlbnROb2RlcycgaW4gdGhlIGNvbnNvbGUgb2YgYnJvd3Nlci5cXFwiKTtcXG5cdFx0XHRcdCQoXFxcIi5sb2FkaW5nXFxcIikucmVtb3ZlKCk7XFxuXFxuXHRcdFx0XHR2YXIgaWQgPSBcXFwiZmxvdy1zdGVwcy1zdmdcXFwiO1xcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSAkKCcubWVybWFpZCcpO1xcblx0XHRcdFx0dmFyIGluc2VydFN2ZyA9IGZ1bmN0aW9uKHN2Z0NvZGUsIGJpbmRGdW5jdGlvbnMpIHtcXG5cdFx0XHRcdFx0ZWxlbWVudC5odG1sKHN2Z0NvZGUpO1xcblx0XHRcdFx0XHRpZih0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKXtcXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhpZCk7XFxuXHRcdFx0XHRcdH1cXG5cdFx0XHRcdFx0YmluZEZ1bmN0aW9ucyhlbGVtZW50WzBdKTtcXG5cdFx0XHRcdH07XFxuXHRcdFx0XHRtZXJtYWlkLnJlbmRlcihpZCwgZ3JhcGhTeW50YXgsIGluc2VydFN2ZywgZWxlbWVudFswXSk7XFxuXFxuXHRcdFx0XHR2YXIgem9vbVNWRyA9IGZ1bmN0aW9uKHpvb20pe1xcblx0XHRcdFx0XHR2YXIgY3VycmVudFdpZHRoID0gJChcXFwic3ZnXFxcIikud2lkdGgoKTtcXG5cdFx0XHRcdFx0dmFyIG5ld1dpZHRoID0gY3VycmVudFdpZHRoICogem9vbTtcXG5cdFx0XHRcdFx0JChcXFwic3ZnXFxcIikuY3NzKFxcXCJtYXhXaWR0aFxcXCIsbmV3V2lkdGggKyBcXFwicHhcXFwiKS53aWR0aChuZXdXaWR0aCk7XFxuXHRcdFx0XHR9XFxuXFxuXHRcdFx0XHQvL+aUr+aMgem8oOagh+a7mui9rue8qeaUvueUu+W4g1xcblx0XHRcdFx0JCh3aW5kb3cpLm9uKFxcXCJtb3VzZXdoZWVsXFxcIixmdW5jdGlvbihldmVudCl7XFxuXHRcdFx0XHRcdGlmKGV2ZW50LmN0cmxLZXkpe1xcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XFxuXHRcdFx0XHRcdFx0dmFyIHpvb20gPSBldmVudC5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPiAwID8gMS4xIDogMC45O1xcblx0XHRcdFx0XHRcdHpvb21TVkcoem9vbSk7XFxuXHRcdFx0XHRcdH1cXG5cdFx0XHRcdH0pO1xcblx0XHRcdFx0JChcXFwiLmJ0bi16b29tXFxcIikub24oXFxcImNsaWNrXFxcIixmdW5jdGlvbigpe1xcblx0XHRcdFx0XHR6b29tU1ZHKCQodGhpcykuYXR0cihcXFwiem9vbVxcXCIpKTtcXG5cdFx0XHRcdH0pO1xcblx0XHRcdH0pO1xcblx0XHQ8L3NjcmlwdD5cXG5cdFx0PGEgY2xhc3M9XFxcImJ0bi16b29tIGJ0bi16b29tLXVwXFxcIiB6b29tPTEuMSB0aXRsZT1cXFwi54K55Ye75pS+5aSnXFxcIj4rPC9hPlxcblx0XHQ8YSBjbGFzcz1cXFwiYnRuLXpvb20gYnRuLXpvb20tZG93blxcXCIgem9vbT0wLjkgdGl0bGU9XFxcIueCueWHu+e8qeWwj1xcXCI+LTwvYT5cXG5cdDwvYm9keT5cXG48L2h0bWw+XCIpO1xuICB9XG59O1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQ/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UocmVxLCByZXMpO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydC90cmFjZXM/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgcmV0dXJuIEZsb3d2ZXJzaW9uQVBJLnNlbmRIdG1sUmVzcG9uc2UocmVxLCByZXMsIFwidHJhY2VzXCIpO1xufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydC90cmFjZXNfZXhwYW5kP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlKHJlcSwgcmVzLCBcInRyYWNlc19leHBhbmRcIik7XG59KTtcbiJdfQ==
