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
var getHandlersManager = Package['steedos:workflow'].getHandlersManager;
var permissionManager = Package['steedos:workflow'].permissionManager;
var workflowTemplate = Package['steedos:workflow'].workflowTemplate;
var approveManager = Package['steedos:workflow'].approveManager;
var stepManager = Package['steedos:workflow'].stepManager;
var flowManager = Package['steedos:workflow'].flowManager;
var formManager = Package['steedos:workflow'].formManager;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
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
  getStepHandlerName: function (step) {
    var approverNames, stepHandlerName;

    switch (step.deal_type) {
      case 'specifyUser':
        approverNames = step.approver_users.map(function (userId) {
          var user;
          user = db.users.findOne(userId);

          if (user) {
            return user.name;
          } else {
            return "";
          }
        });
        stepHandlerName = approverNames.join(",");
        break;

      case 'applicantRole':
        approverNames = step.approver_roles.map(function (roleId) {
          var role;
          role = db.flow_roles.findOne(roleId);

          if (role) {
            return role.name;
          } else {
            return "";
          }
        });
        stepHandlerName = approverNames.join(",");
        break;

      default:
        stepHandlerName = '';
        break;
    }

    return stepHandlerName;
  },
  getStepName: function (stepName, stepHandlerName) {
    if (stepName) {
      stepName = "<div class='graph-node'> <div class='step-name'>" + stepName + "</div> <div class='step-handler-name'>" + stepHandlerName + "</div> </div>";
      stepName = FlowversionAPI.replaceErrorSymbol(stepName);
    } else {
      stepName = "";
    }

    return stepName;
  },
  generateStepsGraphSyntax: function (steps, currentStepId, isConvertToString) {
    var graphSyntax, nodes;
    nodes = ["graph TB"];
    steps.forEach(function (step) {
      var lines;
      lines = step.lines;

      if (lines != null ? lines.length : void 0) {
        return lines.forEach(function (line) {
          var stepHandlerName, stepName, toStepName;

          if (step.name) {
            if (step.step_type === "condition") {
              nodes.push("	class " + step._id + " condition;");
            }

            stepHandlerName = FlowversionAPI.getStepHandlerName(step);
            stepName = FlowversionAPI.getStepName(step.name, stepHandlerName);
          } else {
            stepName = "";
          }

          toStepName = steps.findPropertyByPK("_id", line.to_step).name;
          toStepName = FlowversionAPI.getStepName(toStepName, "");
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
  generateTracesGraphSyntax: function (traces, isConvertToString) {
    var graphSyntax, lastApproves, lastTrace, nodes;
    nodes = ["graph LR"];
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
    var currentStepId, error_msg, flowversion, graphSyntax, instance, instance_id, query, ref, ref1, steps, traces;
    query = req.query;
    instance_id = query.instance_id;

    if (!instance_id) {
      FlowversionAPI.sendInvalidURLResponse(res);
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
            graphSyntax = this.generateTracesGraphSyntax(traces);
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
            graphSyntax = this.generateStepsGraphSyntax(steps, currentStepId);
          } else {
            error_msg = "没有找到当前申请单的流程步骤数据";
          }
        } else {
          error_msg = "当前申请单不存在或已被删除";
        }

        break;
    }

    return this.writeResponse(res, 200, "<!DOCTYPE html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\">\n		<title>Workflow Chart</title>\n		<link rel=\"stylesheet\" href=\"/packages/steedos_workflow-chart/assets/mermaid/dist/mermaid.css\"/>\n		<script type=\"text/javascript\" src=\"/lib/jquery/jquery-1.11.2.min.js\"></script>\n		<script type=\"text/javascript\" src=\"/packages/steedos_workflow-chart/assets/mermaid/dist/mermaid.min.js\"></script>\n		<style>\n			body { \n				font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n				text-align: center;\n				background-color: #fff;\n			}\n			.loading{\n				position: absolute;\n				left: 0px;\n				right: 0px;\n				top: 50%;\n				z-index: 1100;\n				text-align: center;\n				margin-top: -30px;\n				font-size: 36px;\n				color: #dfdfdf;\n			}\n			.error-msg{\n				position: absolute;\n				left: 0px;\n				right: 0px;\n				bottom: 20px;\n				z-index: 1100;\n				text-align: center;\n				font-size: 20px;\n				color: #a94442;\n			}\n			#flow-steps-svg .node rect{\n				fill: #ccccff;\n				stroke: rgb(144, 144, 255);\n    						stroke-width: 2px;\n			}\n			#flow-steps-svg .node.current-step-node rect{\n				fill: #cde498;\n				stroke: #13540c;\n				stroke-width: 2px;\n			}\n			#flow-steps-svg .node.condition rect{\n				fill: #ececff;\n				stroke: rgb(204, 204, 255);\n    						stroke-width: 1px;\n			}\n			#flow-steps-svg .node .trace-handler-name{\n				color: #777;\n			}\n			#flow-steps-svg .node .step-handler-name{\n				color: #777;\n			}\n			div.mermaidTooltip{\n				position: fixed!important;\n				text-align: left!important;\n				padding: 4px!important;\n				font-size: 14px!important;\n				max-width: 500px!important;\n				left: auto!important;\n				top: 15px!important;\n				right: 15px;\n			}\n			.btn-zoom{\n				background: rgba(0, 0, 0, 0.1);\n				border-color: transparent;\n				display: inline-block;\n				padding: 2px 10px;\n				font-size: 26px;\n				border-radius: 20px;\n				background: #eee;\n				color: #777;\n				position: fixed;\n				bottom: 15px;\n				outline: none;\n				cursor: pointer;\n				z-index: 99999;\n				-webkit-user-select: none;\n				-moz-user-select: none;\n				-ms-user-select: none;\n				user-select: none;\n				line-height: 1.2;\n			}\n			@media (max-width: 768px) {\n				.btn-zoom{\n					display:none;\n				}\n			}\n			.btn-zoom:hover{\n				background: rgba(0, 0, 0, 0.2);\n			}\n			.btn-zoom-up{\n				left: 15px;\n			}\n			.btn-zoom-down{\n				left: 60px;\n				padding: 1px 13px 3px 13px;\n			}\n		</style>\n	</head>\n	<body>\n		<div class = \"loading\">Loading...</div>\n		<div class = \"error-msg\">" + error_msg + "</div>\n		<div class=\"mermaid\"></div>\n		<script type=\"text/javascript\">\n			mermaid.initialize({\n				startOnLoad:false\n			});\n			$(function(){\n				var graphNodes = " + JSON.stringify(graphSyntax) + ";\n				//方便前面可以通过调用mermaid.currentNodes调式，特意增加currentNodes属性。\n				mermaid.currentNodes = graphNodes;\n				var graphSyntax = graphNodes.join(\"\\n\");\n				console.log(graphNodes);\n				console.log(graphSyntax);\n				console.log(\"You can access the graph nodes by 'mermaid.currentNodes' in the console of browser.\");\n				$(\".loading\").remove();\n\n				var id = \"flow-steps-svg\";\n				var element = $('.mermaid');\n				var insertSvg = function(svgCode, bindFunctions) {\n					element.html(svgCode);\n					if(typeof callback !== 'undefined'){\n						callback(id);\n					}\n					bindFunctions(element[0]);\n				};\n				mermaid.render(id, graphSyntax, insertSvg, element[0]);\n\n				var zoomSVG = function(zoom){\n					var currentWidth = $(\"svg\").width();\n					var newWidth = currentWidth * zoom;\n					$(\"svg\").css(\"maxWidth\",newWidth + \"px\").width(newWidth);\n				}\n\n				//支持鼠标滚轮缩放画布\n				$(window).on(\"mousewheel\",function(event){\n					if(event.ctrlKey){\n						event.preventDefault();\n						var zoom = event.originalEvent.wheelDelta > 0 ? 1.1 : 0.9;\n						zoomSVG(zoom);\n					}\n				});\n				$(\".btn-zoom\").on(\"click\",function(){\n					zoomSVG($(this).attr(\"zoom\"));\n				});\n			});\n		</script>\n		<a class=\"btn-zoom btn-zoom-up\" zoom=1.1 title=\"点击放大\">+</a>\n		<a class=\"btn-zoom btn-zoom-down\" zoom=0.9 title=\"点击缩小\">-</a>\n	</body>\n</html>");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC9yb3V0ZXMvY2hhcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvY2hhcnQuY29mZmVlIl0sIm5hbWVzIjpbIkZsb3d2ZXJzaW9uQVBJIiwidHJhY2VNYXhBcHByb3ZlQ291bnQiLCJ0cmFjZVNwbGl0QXBwcm92ZXNJbmRleCIsImlzRXhwYW5kQXBwcm92ZSIsIndyaXRlUmVzcG9uc2UiLCJyZXMiLCJodHRwQ29kZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwiZW5kIiwic2VuZEludmFsaWRVUkxSZXNwb25zZSIsInNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2UiLCJyZXBsYWNlRXJyb3JTeW1ib2wiLCJzdHIiLCJyZXBsYWNlIiwiZ2V0U3RlcEhhbmRsZXJOYW1lIiwic3RlcCIsImFwcHJvdmVyTmFtZXMiLCJzdGVwSGFuZGxlck5hbWUiLCJkZWFsX3R5cGUiLCJhcHByb3Zlcl91c2VycyIsIm1hcCIsInVzZXJJZCIsInVzZXIiLCJkYiIsInVzZXJzIiwiZmluZE9uZSIsIm5hbWUiLCJqb2luIiwiYXBwcm92ZXJfcm9sZXMiLCJyb2xlSWQiLCJyb2xlIiwiZmxvd19yb2xlcyIsImdldFN0ZXBOYW1lIiwic3RlcE5hbWUiLCJnZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXgiLCJzdGVwcyIsImN1cnJlbnRTdGVwSWQiLCJpc0NvbnZlcnRUb1N0cmluZyIsImdyYXBoU3ludGF4Iiwibm9kZXMiLCJmb3JFYWNoIiwibGluZXMiLCJsZW5ndGgiLCJsaW5lIiwidG9TdGVwTmFtZSIsInN0ZXBfdHlwZSIsInB1c2giLCJfaWQiLCJmaW5kUHJvcGVydHlCeVBLIiwidG9fc3RlcCIsImdldEFwcHJvdmVKdWRnZVRleHQiLCJqdWRnZSIsImp1ZGdlVGV4dCIsImxvY2FsZSIsIlRBUGkxOG4iLCJfXyIsImdldFRyYWNlTmFtZSIsInRyYWNlTmFtZSIsImFwcHJvdmVIYW5kbGVyTmFtZSIsImdldFRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1dpdGhUeXBlIiwidHJhY2UiLCJhcHByb3ZlcyIsImNvdW50ZXJzIiwiYXBwcm92ZSIsImZyb21fYXBwcm92ZV9pZCIsInR5cGUiLCJnZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGUiLCJ0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMiLCJ0b0FwcHJvdmUiLCJ0b0FwcHJvdmVGcm9tSWQiLCJ0b0FwcHJvdmVIYW5kbGVyTmFtZSIsInRvQXBwcm92ZVR5cGUiLCJoYW5kbGVyX25hbWUiLCJmcm9tQXBwcm92ZSIsImNvdW50ZXIiLCJjb3VudGVyMiIsImNvdW50ZXJDb250ZW50IiwicmVmIiwiZnJvbV90eXBlIiwiZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZSIsInRvX2FwcHJvdmVfaWQiLCJ0b19hcHByb3ZlX2hhbmRsZXJfbmFtZSIsImNvdW50IiwidG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzIiwiaXNfdG90YWwiLCJwdXNoQXBwcm92ZXNXaXRoVHlwZUdyYXBoU3ludGF4IiwiY3VycmVudFRyYWNlTmFtZSIsImV4dHJhSGFuZGxlck5hbWVzQ291bnRlciIsImZyb21BcHByb3ZlSWQiLCJyZXN1bHRzIiwic3BsaXRJbmRleCIsInRlbXBIYW5kbGVyTmFtZXMiLCJ0b0FwcHJvdmVJZCIsInRvQXBwcm92ZXMiLCJ0cmFjZUNvdW50ZXJzIiwiZXh0cmFDb3VudCIsImlzVHlwZU5vZGUiLCJzdHJUb0hhbmRsZXJOYW1lcyIsInRvSGFuZGxlck5hbWVzIiwidHlwZU5hbWUiLCJpbmRleE9mIiwic3BsaWNlIiwiXyIsImlzRW1wdHkiLCJyZXN1bHRzMSIsImdlbmVyYXRlVHJhY2VzR3JhcGhTeW50YXgiLCJ0cmFjZXMiLCJsYXN0QXBwcm92ZXMiLCJsYXN0VHJhY2UiLCJwcmV2aW91c190cmFjZV9pZHMiLCJjdXJyZW50RnJvbVRyYWNlTmFtZSIsImZyb21BcHByb3ZlcyIsImZyb21UcmFjZSIsImZyb21BcHByb3ZlSGFuZGxlck5hbWUiLCJmcm9tVHJhY2VOYW1lIiwidG9UcmFjZU5hbWUiLCJsYXN0QXBwcm92ZSIsInNlbmRIdG1sUmVzcG9uc2UiLCJyZXEiLCJlcnJvcl9tc2ciLCJmbG93dmVyc2lvbiIsImluc3RhbmNlIiwiaW5zdGFuY2VfaWQiLCJxdWVyeSIsInJlZjEiLCJpbnN0YW5jZXMiLCJmaWVsZHMiLCJmbG93X3ZlcnNpb24iLCJmbG93IiwiJHNsaWNlIiwiV29ya2Zsb3dNYW5hZ2VyIiwiZ2V0SW5zdGFuY2VGbG93VmVyc2lvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJKc29uUm91dGVzIiwiYWRkIiwibmV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsY0FBQTtBQUFBQSxpQkFFQztBQUFBQyx3QkFBc0IsRUFBdEI7QUFDQUMsMkJBQXlCLENBRHpCO0FBRUFDLG1CQUFpQixLQUZqQjtBQUlBQyxpQkFBZSxVQUFDQyxHQUFELEVBQU1DLFFBQU4sRUFBZ0JDLElBQWhCO0FBQ2RGLFFBQUlHLFVBQUosR0FBaUJGLFFBQWpCO0FDQ0UsV0RBRkQsSUFBSUksR0FBSixDQUFRRixJQUFSLENDQUU7QUROSDtBQVFBRywwQkFBd0IsVUFBQ0wsR0FBRDtBQUN2QixXQUFPLEtBQUNELGFBQUQsQ0FBZUMsR0FBZixFQUFvQixHQUFwQixFQUF5QixxQ0FBekIsQ0FBUDtBQVREO0FBV0FNLGdDQUE4QixVQUFDTixHQUFEO0FBQzdCLFdBQU8sS0FBQ0QsYUFBRCxDQUFlQyxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLDZCQUF6QixDQUFQO0FBWkQ7QUFjQU8sc0JBQW9CLFVBQUNDLEdBQUQ7QUFDbkIsV0FBT0EsSUFBSUMsT0FBSixDQUFZLEtBQVosRUFBa0IsUUFBbEIsRUFBNEJBLE9BQTVCLENBQW9DLEtBQXBDLEVBQTBDLE9BQTFDLENBQVA7QUFmRDtBQWlCQUMsc0JBQW9CLFVBQUNDLElBQUQ7QUFDbkIsUUFBQUMsYUFBQSxFQUFBQyxlQUFBOztB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QyxTQUFMLENBQWUvRixXQUFmLENBbEhRLEdBa0hvQix1MkNBbEg3QyxDQUFQO0FBallEO0FBQUEsQ0FGRDtBQWtpQkFnRyxXQUFXQyxHQUFYLENBQWUsS0FBZixFQUFzQiw4Q0FBdEIsRUFBc0UsVUFBQ2pCLEdBQUQsRUFBTWxILEdBQU4sRUFBV29JLElBQVg7QUM5R3BFLFNEZ0hEekksZUFBZXNILGdCQUFmLENBQWdDQyxHQUFoQyxFQUFxQ2xILEdBQXJDLENDaEhDO0FEOEdGO0FBSUFrSSxXQUFXQyxHQUFYLENBQWUsS0FBZixFQUFzQixxREFBdEIsRUFBNkUsVUFBQ2pCLEdBQUQsRUFBTWxILEdBQU4sRUFBV29JLElBQVg7QUM5RzNFLFNEZ0hEekksZUFBZXNILGdCQUFmLENBQWdDQyxHQUFoQyxFQUFxQ2xILEdBQXJDLEVBQTBDLFFBQTFDLENDaEhDO0FEOEdGO0FBSUFrSSxXQUFXQyxHQUFYLENBQWUsS0FBZixFQUFzQiw0REFBdEIsRUFBb0YsVUFBQ2pCLEdBQUQsRUFBTWxILEdBQU4sRUFBV29JLElBQVg7QUM5R2xGLFNEZ0hEekksZUFBZXNILGdCQUFmLENBQWdDQyxHQUFoQyxFQUFxQ2xILEdBQXJDLEVBQTBDLGVBQTFDLENDaEhDO0FEOEdGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfd29ya2Zsb3ctY2hhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJGbG93dmVyc2lvbkFQSSA9XG5cblx0dHJhY2VNYXhBcHByb3ZlQ291bnQ6IDEwXG5cdHRyYWNlU3BsaXRBcHByb3Zlc0luZGV4OiA1XG5cdGlzRXhwYW5kQXBwcm92ZTogZmFsc2VcblxuXHR3cml0ZVJlc3BvbnNlOiAocmVzLCBodHRwQ29kZSwgYm9keSktPlxuXHRcdHJlcy5zdGF0dXNDb2RlID0gaHR0cENvZGU7XG5cdFx0cmVzLmVuZChib2R5KTtcblx0XHRcblx0c2VuZEludmFsaWRVUkxSZXNwb25zZTogKHJlcyktPlxuXHRcdHJldHVybiBAd3JpdGVSZXNwb25zZShyZXMsIDQwNCwgXCJ1cmwgbXVzdCBoYXMgcXVlcnlzIGFzIGluc3RhbmNlX2lkLlwiKTtcblx0XHRcblx0c2VuZEF1dGhUb2tlbkV4cGlyZWRSZXNwb25zZTogKHJlcyktPlxuXHRcdHJldHVybiBAd3JpdGVSZXNwb25zZShyZXMsIDQwMSwgXCJ0aGUgYXV0aF90b2tlbiBoYXMgZXhwaXJlZC5cIik7XG5cblx0cmVwbGFjZUVycm9yU3ltYm9sOiAoc3RyKS0+XG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9cXFwiL2csXCImcXVvdDtcIikucmVwbGFjZSgvXFxuL2csXCI8YnIvPlwiKVxuXG5cdGdldFN0ZXBIYW5kbGVyTmFtZTogKHN0ZXApLT5cblx0XHRzd2l0Y2ggc3RlcC5kZWFsX3R5cGVcblx0XHRcdHdoZW4gJ3NwZWNpZnlVc2VyJ1xuXHRcdFx0XHRhcHByb3Zlck5hbWVzID0gc3RlcC5hcHByb3Zlcl91c2Vycy5tYXAgKHVzZXJJZCktPlxuXHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZClcblx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlci5uYW1lXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0d2hlbiAnYXBwbGljYW50Um9sZSdcblx0XHRcdFx0YXBwcm92ZXJOYW1lcyA9IHN0ZXAuYXBwcm92ZXJfcm9sZXMubWFwIChyb2xlSWQpLT5cblx0XHRcdFx0XHRyb2xlID0gZGIuZmxvd19yb2xlcy5maW5kT25lKHJvbGVJZClcblx0XHRcdFx0XHRpZiByb2xlXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9sZS5uYW1lXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiXCJcblx0XHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gYXBwcm92ZXJOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzdGVwSGFuZGxlck5hbWUgPSAnJ1xuXHRcdFx0XHRicmVha1xuXHRcdHJldHVybiBzdGVwSGFuZGxlck5hbWVcblxuXHRnZXRTdGVwTmFtZTogKHN0ZXBOYW1lLCBzdGVwSGFuZGxlck5hbWUpLT5cblx0XHQjIOi/lOWbnnN0ZXDoioLngrnlkI3np7Bcblx0XHRpZiBzdGVwTmFtZVxuXHRcdFx0c3RlcE5hbWUgPSBcIjxkaXYgY2xhc3M9J2dyYXBoLW5vZGUnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPSdzdGVwLW5hbWUnPiN7c3RlcE5hbWV9PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9J3N0ZXAtaGFuZGxlci1uYW1lJz4je3N0ZXBIYW5kbGVyTmFtZX08L2Rpdj5cblx0XHRcdDwvZGl2PlwiXG5cdFx0XHQjIOaKiueJueauiuWtl+espua4heepuuaIluabv+aNou+8jOS7pemBv+WFjW1lcm1haWRBUEnlh7rnjrDlvILluLhcblx0XHRcdHN0ZXBOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKHN0ZXBOYW1lKVxuXHRcdGVsc2Vcblx0XHRcdHN0ZXBOYW1lID0gXCJcIlxuXHRcdHJldHVybiBzdGVwTmFtZVxuXG5cdGdlbmVyYXRlU3RlcHNHcmFwaFN5bnRheDogKHN0ZXBzLCBjdXJyZW50U3RlcElkLCBpc0NvbnZlcnRUb1N0cmluZyktPlxuXHRcdCMg6K+l5Ye95pWw6L+U5Zue5Lul5LiL5qC85byP55qEZ3JhcGjohJrmnKxcblx0XHQjIGdyYXBoU3ludGF4ID0gJycnXG5cdFx0IyBcdGdyYXBoIExSXG5cdFx0IyBcdFx0QS0tPkJcblx0XHQjIFx0XHRBLS0+Q1xuXHRcdCMgXHRcdEItLT5DXG5cdFx0IyBcdFx0Qy0tPkFcblx0XHQjIFx0XHRELS0+Q1xuXHRcdCMgXHQnJydcblx0XHRub2RlcyA9IFtcImdyYXBoIFRCXCJdXG5cdFx0c3RlcHMuZm9yRWFjaCAoc3RlcCktPlxuXHRcdFx0bGluZXMgPSBzdGVwLmxpbmVzXG5cdFx0XHRpZiBsaW5lcz8ubGVuZ3RoXG5cdFx0XHRcdGxpbmVzLmZvckVhY2ggKGxpbmUpLT5cblx0XHRcdFx0XHRpZiBzdGVwLm5hbWVcblx0XHRcdFx0XHRcdCMg5qCH6K6w5p2h5Lu26IqC54K5XG5cdFx0XHRcdFx0XHRpZiBzdGVwLnN0ZXBfdHlwZSA9PSBcImNvbmRpdGlvblwiXG5cdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdGNsYXNzICN7c3RlcC5faWR9IGNvbmRpdGlvbjtcIlxuXHRcdFx0XHRcdFx0c3RlcEhhbmRsZXJOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0U3RlcEhhbmRsZXJOYW1lKHN0ZXApXG5cdFx0XHRcdFx0XHRzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHN0ZXAubmFtZSwgc3RlcEhhbmRsZXJOYW1lKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHN0ZXBOYW1lID0gXCJcIlxuXHRcdFx0XHRcdHRvU3RlcE5hbWUgPSBzdGVwcy5maW5kUHJvcGVydHlCeVBLKFwiX2lkXCIsbGluZS50b19zdGVwKS5uYW1lXG5cdFx0XHRcdFx0dG9TdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHRvU3RlcE5hbWUsIFwiXCIpXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3tzdGVwLl9pZH0oXFxcIiN7c3RlcE5hbWV9XFxcIiktLT4je2xpbmUudG9fc3RlcH0oXFxcIiN7dG9TdGVwTmFtZX1cXFwiKVwiXG5cblx0XHRpZiBjdXJyZW50U3RlcElkXG5cdFx0XHRub2Rlcy5wdXNoIFwiXHRjbGFzcyAje2N1cnJlbnRTdGVwSWR9IGN1cnJlbnQtc3RlcC1ub2RlO1wiXG5cdFx0aWYgaXNDb252ZXJ0VG9TdHJpbmdcblx0XHRcdGdyYXBoU3ludGF4ID0gbm9kZXMuam9pbiBcIlxcblwiXG5cdFx0XHRyZXR1cm4gZ3JhcGhTeW50YXhcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gbm9kZXNcblxuXHRnZXRBcHByb3ZlSnVkZ2VUZXh0OiAoanVkZ2UpLT5cblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRzd2l0Y2gganVkZ2Vcblx0XHRcdHdoZW4gJ2FwcHJvdmVkJ1xuXHRcdFx0XHQjIOW3suaguOWHhlxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSBhcHByb3ZlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZWplY3RlZCdcblx0XHRcdFx0IyDlt7LpqbPlm55cblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVqZWN0ZWQnLCB7fSwgbG9jYWxlKVxuXHRcdFx0d2hlbiAndGVybWluYXRlZCdcblx0XHRcdFx0IyDlt7Llj5bmtohcblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgdGVybWluYXRlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZWFzc2lnbmVkJ1xuXHRcdFx0XHQjIOi9rOetvuaguFxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWFzc2lnbmVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JlbG9jYXRlZCdcblx0XHRcdFx0IyDph43lrprkvY1cblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVsb2NhdGVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JldHJpZXZlZCdcblx0XHRcdFx0IyDlt7Llj5blm55cblx0XHRcdFx0anVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmV0cmlldmVkJywge30sIGxvY2FsZSlcblx0XHRcdHdoZW4gJ3JldHVybmVkJ1xuXHRcdFx0XHQjIOW3sumAgOWbnlxuXHRcdFx0XHRqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZXR1cm5lZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHR3aGVuICdyZWFkZWQnXG5cdFx0XHRcdCMg5bey6ZiFXG5cdFx0XHRcdGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlYWRlZCcsIHt9LCBsb2NhbGUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGp1ZGdlVGV4dCA9ICcnXG5cdFx0XHRcdGJyZWFrXG5cdFx0cmV0dXJuIGp1ZGdlVGV4dFxuXG5cdGdldFRyYWNlTmFtZTogKHRyYWNlTmFtZSwgYXBwcm92ZUhhbmRsZXJOYW1lKS0+XG5cdFx0IyDov5Tlm550cmFjZeiKgueCueWQjeensFxuXHRcdGlmIHRyYWNlTmFtZVxuXHRcdFx0IyDmiornibnmrorlrZfnrKbmuIXnqbrmiJbmm7/mjaLvvIzku6Xpgb/lhY1tZXJtYWlkQVBJ5Ye6546w5byC5bi4XG5cdFx0XHR0cmFjZU5hbWUgPSBcIjxkaXYgY2xhc3M9J2dyYXBoLW5vZGUnPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPSd0cmFjZS1uYW1lJz4je3RyYWNlTmFtZX08L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz0ndHJhY2UtaGFuZGxlci1uYW1lJz4je2FwcHJvdmVIYW5kbGVyTmFtZX08L2Rpdj5cblx0XHRcdDwvZGl2PlwiXG5cdFx0XHR0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2wodHJhY2VOYW1lKVxuXHRcdGVsc2Vcblx0XHRcdHRyYWNlTmFtZSA9IFwiXCJcblx0XHRyZXR1cm4gdHJhY2VOYW1lXG5cdFxuXHRnZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZTogKHRyYWNlKS0+XG5cdFx0IyDor6Xlh73mlbDnlJ/miJBqc29u57uT5p6E77yM6KGo546w5Ye65omA5pyJ5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R6IqC54K55pyJ5pyJ5ZCO57ut5a2Q6IqC54K555qE6K6h5pWw5oOF5Ya177yM5YW257uT5p6E5Li677yaXG5cdFx0IyBjb3VudGVycyA9IHtcblx0XHQjIFx0W2Zyb21BcHByb3ZlSWQo5p2l5rqQ6IqC54K5SUQpXTp7XG5cdFx0IyBcdFx0W3RvQXBwcm92ZVR5cGUo55uu5qCH57uT54K557G75Z6LKV0655uu5qCH6IqC54K55Zyo5oyH5a6a57G75Z6L5LiL55qE5ZCO57ut6IqC54K55Liq5pWwXG5cdFx0IyBcdH1cblx0XHQjIH1cblx0XHRjb3VudGVycyA9IHt9XG5cdFx0YXBwcm92ZXMgPSB0cmFjZS5hcHByb3Zlc1xuXHRcdHVubGVzcyBhcHByb3Zlc1xuXHRcdFx0cmV0dXJuIG51bGxcblx0XHRhcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRpZiBhcHByb3ZlLmZyb21fYXBwcm92ZV9pZFxuXHRcdFx0XHR1bmxlc3MgY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdXG5cdFx0XHRcdFx0Y291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdID0ge31cblx0XHRcdFx0aWYgY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdW2FwcHJvdmUudHlwZV1cblx0XHRcdFx0XHRjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXSsrXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjb3VudGVyc1thcHByb3ZlLmZyb21fYXBwcm92ZV9pZF1bYXBwcm92ZS50eXBlXSA9IDFcblx0XHRyZXR1cm4gY291bnRlcnNcblxuXHRnZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGU6ICh0cmFjZSwgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzKS0+XG5cdFx0IyDor6Xlh73mlbDnlJ/miJBqc29u57uT5p6E77yM6KGo546w5Ye65omA5pyJ5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R55qE6IqC54K55rWB5ZCR77yM5YW257uT5p6E5Li677yaXG5cdFx0IyBjb3VudGVycyA9IHtcblx0XHQjIFx0W2Zyb21BcHByb3ZlSWQo5p2l5rqQ6IqC54K5SUQpXTp7XG5cdFx0IyBcdFx0W3RvQXBwcm92ZVR5cGUo55uu5qCH57uT54K557G75Z6LKV06W3tcblx0XHQjIFx0XHRcdGZyb21fdHlwZTog5p2l5rqQ6IqC54K557G75Z6LXG5cdFx0IyBcdFx0XHRmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiDmnaXmupDoioLngrnlpITnkIbkurpcblx0XHQjIFx0XHRcdHRvX2FwcHJvdmVfaWQ6IOebruagh+iKgueCuUlEXG5cdFx0IyBcdFx0XHR0b19hcHByb3ZlX2hhbmRsZXJfbmFtZXM6IFvlpJrkuKrnm67moIfoioLngrnmsYfmgLvlpITnkIbkurrpm4blkIhdXG5cdFx0IyBcdFx0XHRpc190b3RhbDogdHJ1ZS9mYWxzZe+8jOaYr+WQpuaxh+aAu+iKgueCuVxuXHRcdCMgXHRcdH0sLi4uXVxuXHRcdCMgXHR9XG5cdFx0IyB9XG5cdFx0IyDkuIrov7Dnm67moIfnu5PngrnlhoXlrrnkuK3mnInkuIDkuKrlsZ7mgKdpc190b3RhbOihqOekuuaYr+WQpuaxh+aAu+iKgueCue+8jOWmguaenOaYr++8jOWImeaKiuWkmuS4quiKgueCueaxh+aAu+WQiOW5tuaIkOS4gOS4qu+8jFxuXHRcdCMg5L2G5piv5pys6Lqr5pyJ5ZCO57ut5a2Q6IqC54K555qE6IqC54K55LiN5Y+C5LiO5rGH5oC75Y+K6K6h5pWw44CCXG5cdFx0Y291bnRlcnMgPSB7fVxuXHRcdGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHR1bmxlc3MgYXBwcm92ZXNcblx0XHRcdHJldHVybiBudWxsXG5cdFx0dHJhY2VNYXhBcHByb3ZlQ291bnQgPSBGbG93dmVyc2lvbkFQSS50cmFjZU1heEFwcHJvdmVDb3VudFxuXHRcdGlzRXhwYW5kQXBwcm92ZSA9IEZsb3d2ZXJzaW9uQVBJLmlzRXhwYW5kQXBwcm92ZVxuXG5cdFx0YXBwcm92ZXMuZm9yRWFjaCAodG9BcHByb3ZlKS0+XG5cdFx0XHR0b0FwcHJvdmVUeXBlID0gdG9BcHByb3ZlLnR5cGVcblx0XHRcdHRvQXBwcm92ZUZyb21JZCA9IHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRcblx0XHRcdHRvQXBwcm92ZUhhbmRsZXJOYW1lID0gdG9BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0dW5sZXNzIHRvQXBwcm92ZUZyb21JZFxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGFwcHJvdmVzLmZvckVhY2ggKGZyb21BcHByb3ZlKS0+XG5cdFx0XHRcdGlmIGZyb21BcHByb3ZlLl9pZCA9PSB0b0FwcHJvdmVGcm9tSWRcblx0XHRcdFx0XHRjb3VudGVyID0gY291bnRlcnNbdG9BcHByb3ZlRnJvbUlkXVxuXHRcdFx0XHRcdHVubGVzcyBjb3VudGVyXG5cdFx0XHRcdFx0XHRjb3VudGVyID0gY291bnRlcnNbdG9BcHByb3ZlRnJvbUlkXSA9IHt9XG5cdFx0XHRcdFx0dW5sZXNzIGNvdW50ZXJbdG9BcHByb3ZlLnR5cGVdXG5cdFx0XHRcdFx0XHRjb3VudGVyW3RvQXBwcm92ZS50eXBlXSA9IFtdXG5cdFx0XHRcdFx0Y291bnRlcjIgPSBjb3VudGVyW3RvQXBwcm92ZS50eXBlXVxuXHRcdFx0XHRcdGlmIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1t0b0FwcHJvdmUuX2lkXT9bdG9BcHByb3ZlVHlwZV1cblx0XHRcdFx0XHRcdCMg5pyJ5ZCO57ut5a2Q6IqC54K577yM5YiZ5LiN5Y+C5LiO5rGH5oC75Y+K6K6h5pWwXG5cdFx0XHRcdFx0XHRjb3VudGVyMi5wdXNoXG5cdFx0XHRcdFx0XHRcdGZyb21fdHlwZTogZnJvbUFwcHJvdmUudHlwZVxuXHRcdFx0XHRcdFx0XHRmcm9tX2FwcHJvdmVfaGFuZGxlcl9uYW1lOiBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdFx0dG9fYXBwcm92ZV9pZDogdG9BcHByb3ZlLl9pZFxuXHRcdFx0XHRcdFx0XHR0b19hcHByb3ZlX2hhbmRsZXJfbmFtZTogdG9BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0Y291bnRlckNvbnRlbnQgPSBpZiBpc0V4cGFuZEFwcHJvdmUgdGhlbiBudWxsIGVsc2UgY291bnRlcjIuZmluZFByb3BlcnR5QnlQSyhcImlzX3RvdGFsXCIsIHRydWUpXG5cdFx0XHRcdFx0XHQjIGNvdW50ZXJDb250ZW50ID0gY291bnRlcjIuZmluZFByb3BlcnR5QnlQSyhcImlzX3RvdGFsXCIsIHRydWUpXG5cdFx0XHRcdFx0XHQjIOWmguaenOW8uuWItuimgeaxguWxleW8gOaJgOacieiKgueCue+8jOWImeS4jeWBmuaxh+aAu+WkhOeQhlxuXHRcdFx0XHRcdFx0aWYgY291bnRlckNvbnRlbnRcblx0XHRcdFx0XHRcdFx0Y291bnRlckNvbnRlbnQuY291bnQrK1xuXHRcdFx0XHRcdFx0XHR1bmxlc3MgY291bnRlckNvbnRlbnQuY291bnQgPiB0cmFjZU1heEFwcHJvdmVDb3VudFxuXHRcdFx0XHRcdFx0XHRcdGNvdW50ZXJDb250ZW50LnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcy5wdXNoIHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0Y291bnRlcjIucHVzaFxuXHRcdFx0XHRcdFx0XHRcdGZyb21fdHlwZTogZnJvbUFwcHJvdmUudHlwZVxuXHRcdFx0XHRcdFx0XHRcdGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdFx0XHRcdHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWRcblx0XHRcdFx0XHRcdFx0XHRjb3VudDogMVxuXHRcdFx0XHRcdFx0XHRcdHRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lczogW3RvQXBwcm92ZS5oYW5kbGVyX25hbWVdXG5cdFx0XHRcdFx0XHRcdFx0aXNfdG90YWw6IHRydWVcblxuXHRcdHJldHVybiBjb3VudGVyc1xuXG5cdHB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXg6IChub2RlcywgdHJhY2UpLT5cblx0XHR0cmFjZUZyb21BcHByb3ZlQ291bnRlcnMgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZUZyb21BcHByb3ZlQ291bnRlcnNXaXRoVHlwZSB0cmFjZVxuXHRcdHRyYWNlQ291bnRlcnMgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGUgdHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1xuXHRcdHVubGVzcyB0cmFjZUNvdW50ZXJzXG5cdFx0XHRyZXR1cm5cblx0XHRleHRyYUhhbmRsZXJOYW1lc0NvdW50ZXIgPSB7fSAj6K6w5b2V6ZyA6KaB6aKd5aSW55Sf5oiQ5omA5pyJ5aSE55CG5Lq65aeT5ZCN55qE6KKr5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R6IqC54K5XG5cdFx0dHJhY2VNYXhBcHByb3ZlQ291bnQgPSBGbG93dmVyc2lvbkFQSS50cmFjZU1heEFwcHJvdmVDb3VudFxuXHRcdHNwbGl0SW5kZXggPSBGbG93dmVyc2lvbkFQSS50cmFjZVNwbGl0QXBwcm92ZXNJbmRleFxuXHRcdGN1cnJlbnRUcmFjZU5hbWUgPSB0cmFjZS5uYW1lXG5cdFx0Zm9yIGZyb21BcHByb3ZlSWQsZnJvbUFwcHJvdmUgb2YgdHJhY2VDb3VudGVyc1xuXHRcdFx0Zm9yIHRvQXBwcm92ZVR5cGUsdG9BcHByb3ZlcyBvZiBmcm9tQXBwcm92ZVxuXHRcdFx0XHR0b0FwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0XHRcdHR5cGVOYW1lID0gXCJcIlxuXHRcdFx0XHRcdHN3aXRjaCB0b0FwcHJvdmVUeXBlXG5cdFx0XHRcdFx0XHR3aGVuICdjYydcblx0XHRcdFx0XHRcdFx0dHlwZU5hbWUgPSBcIuS8oOmYhVwiXG5cdFx0XHRcdFx0XHR3aGVuICdmb3J3YXJkJ1xuXHRcdFx0XHRcdFx0XHR0eXBlTmFtZSA9IFwi6L2s5Y+RXCJcblx0XHRcdFx0XHRcdHdoZW4gJ2Rpc3RyaWJ1dGUnXG5cdFx0XHRcdFx0XHRcdHR5cGVOYW1lID0gXCLliIblj5FcIlxuXHRcdFx0XHRcdGlzVHlwZU5vZGUgPSBbXCJjY1wiLFwiZm9yd2FyZFwiLFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKHRvQXBwcm92ZS5mcm9tX3R5cGUpID49IDBcblx0XHRcdFx0XHRpZiBpc1R5cGVOb2RlXG5cdFx0XHRcdFx0XHR0cmFjZU5hbWUgPSB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdGlmIHRvQXBwcm92ZS5pc190b3RhbFxuXHRcdFx0XHRcdFx0dG9IYW5kbGVyTmFtZXMgPSB0b0FwcHJvdmUudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzXG5cdFx0XHRcdFx0XHRpZiBzcGxpdEluZGV4IGFuZCB0b0FwcHJvdmUuY291bnQgPiBzcGxpdEluZGV4XG5cdFx0XHRcdFx0XHRcdCMg5Zyo5aeT5ZCN6ZuG5ZCI5Lit5o+S5YWl5Zue6L2m56ym5Y+35o2i6KGMXG5cdFx0XHRcdFx0XHRcdHRvSGFuZGxlck5hbWVzLnNwbGljZShzcGxpdEluZGV4LDAsXCI8YnIvPixcIilcblx0XHRcdFx0XHRcdHN0clRvSGFuZGxlck5hbWVzID0gdG9IYW5kbGVyTmFtZXMuam9pbihcIixcIikucmVwbGFjZShcIiwsXCIsXCJcIilcblx0XHRcdFx0XHRcdGV4dHJhQ291bnQgPSB0b0FwcHJvdmUuY291bnQgLSB0cmFjZU1heEFwcHJvdmVDb3VudFxuXHRcdFx0XHRcdFx0aWYgZXh0cmFDb3VudCA+IDBcblx0XHRcdFx0XHRcdFx0c3RyVG9IYW5kbGVyTmFtZXMgKz0gXCLnrYkje3RvQXBwcm92ZS5jb3VudH3kurpcIlxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdXG5cdFx0XHRcdFx0XHRcdFx0ZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdID0ge31cblx0XHRcdFx0XHRcdFx0ZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdW3RvQXBwcm92ZVR5cGVdID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdHJUb0hhbmRsZXJOYW1lcyA9IHRvQXBwcm92ZS50b19hcHByb3ZlX2hhbmRsZXJfbmFtZVxuXHRcdFx0XHRcdGlmIGlzVHlwZU5vZGVcblx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmVJZH0+XFxcIiN7dHJhY2VOYW1lfVxcXCJdLS0je3R5cGVOYW1lfS0tPiN7dG9BcHByb3ZlLnRvX2FwcHJvdmVfaWR9PlxcXCIje3N0clRvSGFuZGxlck5hbWVzfVxcXCJdXCJcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlSWR9KFxcXCIje3RyYWNlTmFtZX1cXFwiKS0tI3t0eXBlTmFtZX0tLT4je3RvQXBwcm92ZS50b19hcHByb3ZlX2lkfT5cXFwiI3tzdHJUb0hhbmRsZXJOYW1lc31cXFwiXVwiXG5cblx0XHQjIOS4uumcgOimgemineWklueUn+aIkOaJgOacieWkhOeQhuS6uuWnk+WQjeeahOiiq+S8oOmYheOAgeWIhuWPkeOAgei9rOWPkeiKgueCue+8jOWinuWKoOm8oOagh+W8ueWHuuivpue7huWxguS6i+S7tlxuXHRcdCMgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVy55qE57uT5p6E5Li677yaXG5cdFx0IyBjb3VudGVycyA9IHtcblx0XHQjIFx0W2Zyb21BcHByb3ZlSWQo5p2l5rqQ6IqC54K5SUQpXTp7XG5cdFx0IyBcdFx0W3RvQXBwcm92ZVR5cGUo55uu5qCH57uT54K557G75Z6LKV0655uu5qCH57uT54K5SURcblx0XHQjIFx0fVxuXHRcdCMgfVxuXHRcdGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHR1bmxlc3MgXy5pc0VtcHR5KGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcilcblx0XHRcdGZvciBmcm9tQXBwcm92ZUlkLGZyb21BcHByb3ZlIG9mIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlclxuXHRcdFx0XHRmb3IgdG9BcHByb3ZlVHlwZSx0b0FwcHJvdmVJZCBvZiBmcm9tQXBwcm92ZVxuXHRcdFx0XHRcdHRlbXBIYW5kbGVyTmFtZXMgPSBbXVxuXHRcdFx0XHRcdGFwcHJvdmVzLmZvckVhY2ggKGFwcHJvdmUpLT5cblx0XHRcdFx0XHRcdGlmIGZyb21BcHByb3ZlSWQgPT0gYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRcblx0XHRcdFx0XHRcdFx0dW5sZXNzIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1thcHByb3ZlLl9pZF0/W3RvQXBwcm92ZVR5cGVdXG5cdFx0XHRcdFx0XHRcdFx0IyDmnInlkI7nu63lrZDoioLngrnvvIzliJnkuI3lj4LkuI7msYfmgLvlj4rorqHmlbBcblx0XHRcdFx0XHRcdFx0XHR0ZW1wSGFuZGxlck5hbWVzLnB1c2ggYXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHRjbGljayAje3RvQXBwcm92ZUlkfSBjYWxsYmFjayBcXFwiI3t0ZW1wSGFuZGxlck5hbWVzLmpvaW4oXCIsXCIpfVxcXCJcIlxuXG5cdGdlbmVyYXRlVHJhY2VzR3JhcGhTeW50YXg6ICh0cmFjZXMsIGlzQ29udmVydFRvU3RyaW5nKS0+XG5cdFx0IyDor6Xlh73mlbDov5Tlm57ku6XkuIvmoLzlvI/nmoRncmFwaOiEmuacrFxuXHRcdCMgZ3JhcGhTeW50YXggPSAnJydcblx0XHQjIFx0Z3JhcGggTFJcblx0XHQjIFx0XHRBLS0+QlxuXHRcdCMgXHRcdEEtLT5DXG5cdFx0IyBcdFx0Qi0tPkNcblx0XHQjIFx0XHRDLS0+QVxuXHRcdCMgXHRcdEQtLT5DXG5cdFx0IyBcdCcnJ1xuXHRcdG5vZGVzID0gW1wiZ3JhcGggTFJcIl1cblx0XHRsYXN0VHJhY2UgPSBudWxsXG5cdFx0bGFzdEFwcHJvdmVzID0gW11cblx0XHR0cmFjZXMuZm9yRWFjaCAodHJhY2UpLT5cblx0XHRcdGxpbmVzID0gdHJhY2UucHJldmlvdXNfdHJhY2VfaWRzXG5cdFx0XHRjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZVxuXHRcdFx0aWYgbGluZXM/Lmxlbmd0aFxuXHRcdFx0XHRsaW5lcy5mb3JFYWNoIChsaW5lKS0+XG5cdFx0XHRcdFx0ZnJvbVRyYWNlID0gdHJhY2VzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIixsaW5lKVxuXHRcdFx0XHRcdGN1cnJlbnRGcm9tVHJhY2VOYW1lID0gZnJvbVRyYWNlLm5hbWVcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMgPSBmcm9tVHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHR0b0FwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXNcblx0XHRcdFx0XHRsYXN0VHJhY2UgPSB0cmFjZVxuXHRcdFx0XHRcdGxhc3RBcHByb3ZlcyA9IHRvQXBwcm92ZXNcblx0XHRcdFx0XHRmcm9tQXBwcm92ZXMuZm9yRWFjaCAoZnJvbUFwcHJvdmUpLT5cblx0XHRcdFx0XHRcdGZyb21BcHByb3ZlSGFuZGxlck5hbWUgPSBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWVcblx0XHRcdFx0XHRcdGlmIHRvQXBwcm92ZXM/Lmxlbmd0aFxuXHRcdFx0XHRcdFx0XHR0b0FwcHJvdmVzLmZvckVhY2ggKHRvQXBwcm92ZSktPlxuXHRcdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLnR5cGUpIDwgMFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgW1wiY2NcIixcImZvcndhcmRcIixcImRpc3RyaWJ1dGVcIl0uaW5kZXhPZihmcm9tQXBwcm92ZS50eXBlKSA8IDBcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCMg5LiN5piv5Lyg6ZiF44CB5YiG5Y+R44CB6L2s5Y+R77yM5YiZ6L+e5o6l5Yiw5LiL5LiA5LiqdHJhY2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0anVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dCBmcm9tQXBwcm92ZS5qdWRnZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tI3tqdWRnZVRleHR9LS0+I3t0b0FwcHJvdmUuX2lkfShcXFwiI3t0b1RyYWNlTmFtZX1cXFwiKVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub2Rlcy5wdXNoIFwiXHQje2Zyb21BcHByb3ZlLl9pZH0oXFxcIiN7ZnJvbVRyYWNlTmFtZX1cXFwiKS0tPiN7dG9BcHByb3ZlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQjIOacgOWQjuS4gOS4quatpemqpOeahHRyYWNlXG5cdFx0XHRcdFx0XHRcdGlmIFtcImNjXCIsXCJmb3J3YXJkXCIsXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbVRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZSBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZVxuXHRcdFx0XHRcdFx0XHRcdHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKGN1cnJlbnRUcmFjZU5hbWUpXG5cdFx0XHRcdFx0XHRcdFx0IyDkuI3mmK/kvKDpmIXjgIHliIblj5HjgIHovazlj5HvvIzliJnov57mjqXliLDkuIvkuIDkuKp0cmFjZVxuXHRcdFx0XHRcdFx0XHRcdGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQgZnJvbUFwcHJvdmUuanVkZ2Vcblx0XHRcdFx0XHRcdFx0XHRpZiBqdWRnZVRleHRcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0je2p1ZGdlVGV4dH0tLT4je3RyYWNlLl9pZH0oXFxcIiN7dG9UcmFjZU5hbWV9XFxcIilcIlxuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdG5vZGVzLnB1c2ggXCJcdCN7ZnJvbUFwcHJvdmUuX2lkfShcXFwiI3tmcm9tVHJhY2VOYW1lfVxcXCIpLS0+I3t0cmFjZS5faWR9KFxcXCIje3RvVHJhY2VOYW1lfVxcXCIpXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDnrKzkuIDkuKp0cmFjZe+8jOWboHRyYWNlc+WPr+iDveWPquacieS4gOS4qu+8jOi/meaXtumcgOimgeWNleeLrOaYvuekuuWHuuadpVxuXHRcdFx0XHR0cmFjZS5hcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRcdFx0dHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VOYW1lIGN1cnJlbnRUcmFjZU5hbWUsIGFwcHJvdmUuaGFuZGxlcl9uYW1lXG5cdFx0XHRcdFx0bm9kZXMucHVzaCBcIlx0I3thcHByb3ZlLl9pZH0oXFxcIiN7dHJhY2VOYW1lfVxcXCIpXCJcblxuXHRcdFx0Rmxvd3ZlcnNpb25BUEkucHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheCBub2RlcywgdHJhY2VcblxuXHRcdCMg562+5om55Y6G56iL5Lit5pyA5ZCO55qEYXBwcm92ZXPpq5jkuq7mmL7npLrvvIznu5PmnZ/mraXpqqTnmoR0cmFjZeS4reaYr+ayoeaciWFwcHJvdmVz55qE77yM5omA5Lul57uT5p2f5q2l6aqk5LiN6auY5Lqu5pi+56S6XG5cdFx0bGFzdEFwcHJvdmVzPy5mb3JFYWNoIChsYXN0QXBwcm92ZSktPlxuXHRcdFx0bm9kZXMucHVzaCBcIlx0Y2xhc3MgI3tsYXN0QXBwcm92ZS5faWR9IGN1cnJlbnQtc3RlcC1ub2RlO1wiXG5cblx0XHRpZiBpc0NvbnZlcnRUb1N0cmluZ1xuXHRcdFx0Z3JhcGhTeW50YXggPSBub2Rlcy5qb2luIFwiXFxuXCJcblx0XHRcdHJldHVybiBncmFwaFN5bnRheFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBub2Rlc1xuXG5cdHNlbmRIdG1sUmVzcG9uc2U6IChyZXEsIHJlcywgdHlwZSktPlxuXHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdFx0aW5zdGFuY2VfaWQgPSBxdWVyeS5pbnN0YW5jZV9pZFxuXG5cdFx0dW5sZXNzIGluc3RhbmNlX2lkXG5cdFx0XHRGbG93dmVyc2lvbkFQSS5zZW5kSW52YWxpZFVSTFJlc3BvbnNlIHJlcyBcblxuXHRcdGVycm9yX21zZyA9IFwiXCJcblx0XHRncmFwaFN5bnRheCA9IFwiXCJcblx0XHRGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSBmYWxzZVxuXHRcdGlmIHR5cGUgPT0gXCJ0cmFjZXNfZXhwYW5kXCJcblx0XHRcdHR5cGUgPSBcInRyYWNlc1wiXG5cdFx0XHRGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSB0cnVlXG5cdFx0c3dpdGNoIHR5cGVcblx0XHRcdHdoZW4gJ3RyYWNlcydcblx0XHRcdFx0aW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSBpbnN0YW5jZV9pZCx7ZmllbGRzOnt0cmFjZXM6IDF9fVxuXHRcdFx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0XHRcdHRyYWNlcyA9IGluc3RhbmNlLnRyYWNlc1xuXHRcdFx0XHRcdGlmIHRyYWNlcz8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheCB0cmFjZXNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUgaW5zdGFuY2VfaWQse2ZpZWxkczp7Zmxvd192ZXJzaW9uOjEsZmxvdzoxLHRyYWNlczogeyRzbGljZTogLTF9fX1cblx0XHRcdFx0aWYgaW5zdGFuY2Vcblx0XHRcdFx0XHRjdXJyZW50U3RlcElkID0gaW5zdGFuY2UudHJhY2VzP1swXT8uc3RlcFxuXHRcdFx0XHRcdGZsb3d2ZXJzaW9uID0gV29ya2Zsb3dNYW5hZ2VyLmdldEluc3RhbmNlRmxvd1ZlcnNpb24oaW5zdGFuY2UpXG5cdFx0XHRcdFx0c3RlcHMgPSBmbG93dmVyc2lvbj8uc3RlcHNcblx0XHRcdFx0XHRpZiBzdGVwcz8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRncmFwaFN5bnRheCA9IHRoaXMuZ2VuZXJhdGVTdGVwc0dyYXBoU3ludGF4IHN0ZXBzLGN1cnJlbnRTdGVwSWRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiXG5cdFx0XHRcdGJyZWFrXG5cblx0XHRyZXR1cm4gQHdyaXRlUmVzcG9uc2UgcmVzLCAyMDAsIFwiXCJcIlxuXHRcdFx0PCFET0NUWVBFIGh0bWw+XG5cdFx0XHQ8aHRtbD5cblx0XHRcdFx0PGhlYWQ+XG5cdFx0XHRcdFx0PG1ldGEgY2hhcnNldD1cInV0Zi04XCI+XG5cdFx0XHRcdFx0PG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLCBtYXhpbXVtLXNjYWxlPTEsIHVzZXItc2NhbGFibGU9bm9cIj5cblx0XHRcdFx0XHQ8dGl0bGU+V29ya2Zsb3cgQ2hhcnQ8L3RpdGxlPlxuXHRcdFx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiL3BhY2thZ2VzL3N0ZWVkb3Nfd29ya2Zsb3ctY2hhcnQvYXNzZXRzL21lcm1haWQvZGlzdC9tZXJtYWlkLmNzc1wiLz5cblx0XHRcdFx0XHQ8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCIvbGliL2pxdWVyeS9qcXVlcnktMS4xMS4yLm1pbi5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0XHRcdDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiIHNyYz1cIi9wYWNrYWdlcy9zdGVlZG9zX3dvcmtmbG93LWNoYXJ0L2Fzc2V0cy9tZXJtYWlkL2Rpc3QvbWVybWFpZC5taW4uanNcIj48L3NjcmlwdD5cblx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRib2R5IHsgXG5cdFx0XHRcdFx0XHRcdGZvbnQtZmFtaWx5OiAnU291cmNlIFNhbnMgUHJvJywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcblx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0LmxvYWRpbmd7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdFx0XHRcdFx0bGVmdDogMHB4O1xuXHRcdFx0XHRcdFx0XHRyaWdodDogMHB4O1xuXHRcdFx0XHRcdFx0XHR0b3A6IDUwJTtcblx0XHRcdFx0XHRcdFx0ei1pbmRleDogMTEwMDtcblx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAtMzBweDtcblx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAzNnB4O1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogI2RmZGZkZjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5lcnJvci1tc2d7XG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdFx0XHRcdFx0bGVmdDogMHB4O1xuXHRcdFx0XHRcdFx0XHRyaWdodDogMHB4O1xuXHRcdFx0XHRcdFx0XHRib3R0b206IDIwcHg7XG5cdFx0XHRcdFx0XHRcdHotaW5kZXg6IDExMDA7XG5cdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAyMHB4O1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogI2E5NDQ0Mjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSByZWN0e1xuXHRcdFx0XHRcdFx0XHRmaWxsOiAjY2NjY2ZmO1xuXHRcdFx0XHRcdFx0XHRzdHJva2U6IHJnYigxNDQsIDE0NCwgMjU1KTtcbiAgICBcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDJweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jdXJyZW50LXN0ZXAtbm9kZSByZWN0e1xuXHRcdFx0XHRcdFx0XHRmaWxsOiAjY2RlNDk4O1xuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICMxMzU0MGM7XG5cdFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMnB4O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0I2Zsb3ctc3RlcHMtc3ZnIC5ub2RlLmNvbmRpdGlvbiByZWN0e1xuXHRcdFx0XHRcdFx0XHRmaWxsOiAjZWNlY2ZmO1xuXHRcdFx0XHRcdFx0XHRzdHJva2U6IHJnYigyMDQsIDIwNCwgMjU1KTtcbiAgICBcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg6IDFweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSAudHJhY2UtaGFuZGxlci1uYW1le1xuXHRcdFx0XHRcdFx0XHRjb2xvcjogIzc3Nztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZSAuc3RlcC1oYW5kbGVyLW5hbWV7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAjNzc3O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGl2Lm1lcm1haWRUb29sdGlwe1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogZml4ZWQhaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBsZWZ0IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0cGFkZGluZzogNHB4IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAxNHB4IWltcG9ydGFudDtcblx0XHRcdFx0XHRcdFx0bWF4LXdpZHRoOiA1MDBweCFpbXBvcnRhbnQ7XG5cdFx0XHRcdFx0XHRcdGxlZnQ6IGF1dG8haW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHR0b3A6IDE1cHghaW1wb3J0YW50O1xuXHRcdFx0XHRcdFx0XHRyaWdodDogMTVweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5idG4tem9vbXtcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xuXHRcdFx0XHRcdFx0XHRib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDJweCAxMHB4O1xuXHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDI2cHg7XG5cdFx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDIwcHg7XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6ICNlZWU7XG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAjNzc3O1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogZml4ZWQ7XG5cdFx0XHRcdFx0XHRcdGJvdHRvbTogMTVweDtcblx0XHRcdFx0XHRcdFx0b3V0bGluZTogbm9uZTtcblx0XHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdFx0XHR6LWluZGV4OiA5OTk5OTtcblx0XHRcdFx0XHRcdFx0LXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHRcdFx0LW1vei11c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHRcdFx0LW1zLXVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdFx0XHR1c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHRcdFx0bGluZS1oZWlnaHQ6IDEuMjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuXHRcdFx0XHRcdFx0XHQuYnRuLXpvb217XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTpub25lO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQuYnRuLXpvb206aG92ZXJ7XG5cdFx0XHRcdFx0XHRcdGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5idG4tem9vbS11cHtcblx0XHRcdFx0XHRcdFx0bGVmdDogMTVweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC5idG4tem9vbS1kb3due1xuXHRcdFx0XHRcdFx0XHRsZWZ0OiA2MHB4O1xuXHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAxcHggMTNweCAzcHggMTNweDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8L2hlYWQ+XG5cdFx0XHRcdDxib2R5PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3MgPSBcImxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcyA9IFwiZXJyb3ItbXNnXCI+I3tlcnJvcl9tc2d9PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1lcm1haWRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIj5cblx0XHRcdFx0XHRcdG1lcm1haWQuaW5pdGlhbGl6ZSh7XG5cdFx0XHRcdFx0XHRcdHN0YXJ0T25Mb2FkOmZhbHNlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdCQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0dmFyIGdyYXBoTm9kZXMgPSAje0pTT04uc3RyaW5naWZ5KGdyYXBoU3ludGF4KX07XG5cdFx0XHRcdFx0XHRcdC8v5pa55L6/5YmN6Z2i5Y+v5Lul6YCa6L+H6LCD55SobWVybWFpZC5jdXJyZW50Tm9kZXPosIPlvI/vvIznibnmhI/lop7liqBjdXJyZW50Tm9kZXPlsZ7mgKfjgIJcblx0XHRcdFx0XHRcdFx0bWVybWFpZC5jdXJyZW50Tm9kZXMgPSBncmFwaE5vZGVzO1xuXHRcdFx0XHRcdFx0XHR2YXIgZ3JhcGhTeW50YXggPSBncmFwaE5vZGVzLmpvaW4oXCJcXFxcblwiKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coZ3JhcGhOb2Rlcyk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoU3ludGF4KTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJZb3UgY2FuIGFjY2VzcyB0aGUgZ3JhcGggbm9kZXMgYnkgJ21lcm1haWQuY3VycmVudE5vZGVzJyBpbiB0aGUgY29uc29sZSBvZiBicm93c2VyLlwiKTtcblx0XHRcdFx0XHRcdFx0JChcIi5sb2FkaW5nXCIpLnJlbW92ZSgpO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBpZCA9IFwiZmxvdy1zdGVwcy1zdmdcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGVsZW1lbnQgPSAkKCcubWVybWFpZCcpO1xuXHRcdFx0XHRcdFx0XHR2YXIgaW5zZXJ0U3ZnID0gZnVuY3Rpb24oc3ZnQ29kZSwgYmluZEZ1bmN0aW9ucykge1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQuaHRtbChzdmdDb2RlKTtcblx0XHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGlkKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YmluZEZ1bmN0aW9ucyhlbGVtZW50WzBdKTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0bWVybWFpZC5yZW5kZXIoaWQsIGdyYXBoU3ludGF4LCBpbnNlcnRTdmcsIGVsZW1lbnRbMF0pO1xuXG5cdFx0XHRcdFx0XHRcdHZhciB6b29tU1ZHID0gZnVuY3Rpb24oem9vbSl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGN1cnJlbnRXaWR0aCA9ICQoXCJzdmdcIikud2lkdGgoKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3V2lkdGggPSBjdXJyZW50V2lkdGggKiB6b29tO1xuXHRcdFx0XHRcdFx0XHRcdCQoXCJzdmdcIikuY3NzKFwibWF4V2lkdGhcIixuZXdXaWR0aCArIFwicHhcIikud2lkdGgobmV3V2lkdGgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly/mlK/mjIHpvKDmoIfmu5rova7nvKnmlL7nlLvluINcblx0XHRcdFx0XHRcdFx0JCh3aW5kb3cpLm9uKFwibW91c2V3aGVlbFwiLGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XHRcdFx0XHRpZihldmVudC5jdHJsS2V5KXtcblx0XHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgem9vbSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA+IDAgPyAxLjEgOiAwLjk7XG5cdFx0XHRcdFx0XHRcdFx0XHR6b29tU1ZHKHpvb20pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdCQoXCIuYnRuLXpvb21cIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0em9vbVNWRygkKHRoaXMpLmF0dHIoXCJ6b29tXCIpKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQ8L3NjcmlwdD5cblx0XHRcdFx0XHQ8YSBjbGFzcz1cImJ0bi16b29tIGJ0bi16b29tLXVwXCIgem9vbT0xLjEgdGl0bGU9XCLngrnlh7vmlL7lpKdcIj4rPC9hPlxuXHRcdFx0XHRcdDxhIGNsYXNzPVwiYnRuLXpvb20gYnRuLXpvb20tZG93blwiIHpvb209MC45IHRpdGxlPVwi54K55Ye757yp5bCPXCI+LTwvYT5cblx0XHRcdFx0PC9ib2R5PlxuXHRcdFx0PC9odG1sPlxuXHRcdFwiXCJcIlxuXG5Kc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQ/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHQjIOa1geeoi+WbvlxuXHRGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlIHJlcSwgcmVzXG5cbkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydC90cmFjZXM/aW5zdGFuY2VfaWQ9Omluc3RhbmNlX2lkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHQjIOaxh+aAu+etvuaJueWOhueoi+WbvlxuXHRGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlIHJlcSwgcmVzLCBcInRyYWNlc1wiXG5cbkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS93b3JrZmxvdy9jaGFydC90cmFjZXNfZXhwYW5kP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0IyDlsZXlvIDmiYDmnInoioLngrnnmoTnrb7mibnljobnqIvlm75cblx0Rmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZSByZXEsIHJlcywgXCJ0cmFjZXNfZXhwYW5kXCJcblxuIiwidmFyIEZsb3d2ZXJzaW9uQVBJO1xuXG5GbG93dmVyc2lvbkFQSSA9IHtcbiAgdHJhY2VNYXhBcHByb3ZlQ291bnQ6IDEwLFxuICB0cmFjZVNwbGl0QXBwcm92ZXNJbmRleDogNSxcbiAgaXNFeHBhbmRBcHByb3ZlOiBmYWxzZSxcbiAgd3JpdGVSZXNwb25zZTogZnVuY3Rpb24ocmVzLCBodHRwQ29kZSwgYm9keSkge1xuICAgIHJlcy5zdGF0dXNDb2RlID0gaHR0cENvZGU7XG4gICAgcmV0dXJuIHJlcy5lbmQoYm9keSk7XG4gIH0sXG4gIHNlbmRJbnZhbGlkVVJMUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcykge1xuICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCA0MDQsIFwidXJsIG11c3QgaGFzIHF1ZXJ5cyBhcyBpbnN0YW5jZV9pZC5cIik7XG4gIH0sXG4gIHNlbmRBdXRoVG9rZW5FeHBpcmVkUmVzcG9uc2U6IGZ1bmN0aW9uKHJlcykge1xuICAgIHJldHVybiB0aGlzLndyaXRlUmVzcG9uc2UocmVzLCA0MDEsIFwidGhlIGF1dGhfdG9rZW4gaGFzIGV4cGlyZWQuXCIpO1xuICB9LFxuICByZXBsYWNlRXJyb3JTeW1ib2w6IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcIi9nLCBcIiZxdW90O1wiKS5yZXBsYWNlKC9cXG4vZywgXCI8YnIvPlwiKTtcbiAgfSxcbiAgZ2V0U3RlcEhhbmRsZXJOYW1lOiBmdW5jdGlvbihzdGVwKSB7XG4gICAgdmFyIGFwcHJvdmVyTmFtZXMsIHN0ZXBIYW5kbGVyTmFtZTtcbiAgICBzd2l0Y2ggKHN0ZXAuZGVhbF90eXBlKSB7XG4gICAgICBjYXNlICdzcGVjaWZ5VXNlcic6XG4gICAgICAgIGFwcHJvdmVyTmFtZXMgPSBzdGVwLmFwcHJvdmVyX3VzZXJzLm1hcChmdW5jdGlvbih1c2VySWQpIHtcbiAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQpO1xuICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FwcGxpY2FudFJvbGUnOlxuICAgICAgICBhcHByb3Zlck5hbWVzID0gc3RlcC5hcHByb3Zlcl9yb2xlcy5tYXAoZnVuY3Rpb24ocm9sZUlkKSB7XG4gICAgICAgICAgdmFyIHJvbGU7XG4gICAgICAgICAgcm9sZSA9IGRiLmZsb3dfcm9sZXMuZmluZE9uZShyb2xlSWQpO1xuICAgICAgICAgIGlmIChyb2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9sZS5uYW1lO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGVwSGFuZGxlck5hbWUgPSBhcHByb3Zlck5hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN0ZXBIYW5kbGVyTmFtZSA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHN0ZXBIYW5kbGVyTmFtZTtcbiAgfSxcbiAgZ2V0U3RlcE5hbWU6IGZ1bmN0aW9uKHN0ZXBOYW1lLCBzdGVwSGFuZGxlck5hbWUpIHtcbiAgICBpZiAoc3RlcE5hbWUpIHtcbiAgICAgIHN0ZXBOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz4gPGRpdiBjbGFzcz0nc3RlcC1uYW1lJz5cIiArIHN0ZXBOYW1lICsgXCI8L2Rpdj4gPGRpdiBjbGFzcz0nc3RlcC1oYW5kbGVyLW5hbWUnPlwiICsgc3RlcEhhbmRsZXJOYW1lICsgXCI8L2Rpdj4gPC9kaXY+XCI7XG4gICAgICBzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLnJlcGxhY2VFcnJvclN5bWJvbChzdGVwTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ZXBOYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIHN0ZXBOYW1lO1xuICB9LFxuICBnZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXg6IGZ1bmN0aW9uKHN0ZXBzLCBjdXJyZW50U3RlcElkLCBpc0NvbnZlcnRUb1N0cmluZykge1xuICAgIHZhciBncmFwaFN5bnRheCwgbm9kZXM7XG4gICAgbm9kZXMgPSBbXCJncmFwaCBUQlwiXTtcbiAgICBzdGVwcy5mb3JFYWNoKGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgIHZhciBsaW5lcztcbiAgICAgIGxpbmVzID0gc3RlcC5saW5lcztcbiAgICAgIGlmIChsaW5lcyAhPSBudWxsID8gbGluZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICB2YXIgc3RlcEhhbmRsZXJOYW1lLCBzdGVwTmFtZSwgdG9TdGVwTmFtZTtcbiAgICAgICAgICBpZiAoc3RlcC5uYW1lKSB7XG4gICAgICAgICAgICBpZiAoc3RlcC5zdGVwX3R5cGUgPT09IFwiY29uZGl0aW9uXCIpIHtcbiAgICAgICAgICAgICAgbm9kZXMucHVzaChcIlx0Y2xhc3MgXCIgKyBzdGVwLl9pZCArIFwiIGNvbmRpdGlvbjtcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGVwSGFuZGxlck5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRTdGVwSGFuZGxlck5hbWUoc3RlcCk7XG4gICAgICAgICAgICBzdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHN0ZXAubmFtZSwgc3RlcEhhbmRsZXJOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlcE5hbWUgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b1N0ZXBOYW1lID0gc3RlcHMuZmluZFByb3BlcnR5QnlQSyhcIl9pZFwiLCBsaW5lLnRvX3N0ZXApLm5hbWU7XG4gICAgICAgICAgdG9TdGVwTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFN0ZXBOYW1lKHRvU3RlcE5hbWUsIFwiXCIpO1xuICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIHN0ZXAuX2lkICsgXCIoXFxcIlwiICsgc3RlcE5hbWUgKyBcIlxcXCIpLS0+XCIgKyBsaW5lLnRvX3N0ZXAgKyBcIihcXFwiXCIgKyB0b1N0ZXBOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGN1cnJlbnRTdGVwSWQpIHtcbiAgICAgIG5vZGVzLnB1c2goXCJcdGNsYXNzIFwiICsgY3VycmVudFN0ZXBJZCArIFwiIGN1cnJlbnQtc3RlcC1ub2RlO1wiKTtcbiAgICB9XG4gICAgaWYgKGlzQ29udmVydFRvU3RyaW5nKSB7XG4gICAgICBncmFwaFN5bnRheCA9IG5vZGVzLmpvaW4oXCJcXG5cIik7XG4gICAgICByZXR1cm4gZ3JhcGhTeW50YXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gIH0sXG4gIGdldEFwcHJvdmVKdWRnZVRleHQ6IGZ1bmN0aW9uKGp1ZGdlKSB7XG4gICAgdmFyIGp1ZGdlVGV4dCwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICBzd2l0Y2ggKGp1ZGdlKSB7XG4gICAgICBjYXNlICdhcHByb3ZlZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIGFwcHJvdmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWplY3RlZCcsIHt9LCBsb2NhbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Rlcm1pbmF0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSB0ZXJtaW5hdGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhc3NpZ25lZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJlYXNzaWduZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWxvY2F0ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZWxvY2F0ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXRyaWV2ZWQnOlxuICAgICAgICBqdWRnZVRleHQgPSBUQVBpMThuLl9fKCdJbnN0YW5jZSBTdGF0ZSByZXRyaWV2ZWQnLCB7fSwgbG9jYWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXR1cm5lZCc6XG4gICAgICAgIGp1ZGdlVGV4dCA9IFRBUGkxOG4uX18oJ0luc3RhbmNlIFN0YXRlIHJldHVybmVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZGVkJzpcbiAgICAgICAganVkZ2VUZXh0ID0gVEFQaTE4bi5fXygnSW5zdGFuY2UgU3RhdGUgcmVhZGVkJywge30sIGxvY2FsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAganVkZ2VUZXh0ID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4ganVkZ2VUZXh0O1xuICB9LFxuICBnZXRUcmFjZU5hbWU6IGZ1bmN0aW9uKHRyYWNlTmFtZSwgYXBwcm92ZUhhbmRsZXJOYW1lKSB7XG4gICAgaWYgKHRyYWNlTmFtZSkge1xuICAgICAgdHJhY2VOYW1lID0gXCI8ZGl2IGNsYXNzPSdncmFwaC1ub2RlJz4gPGRpdiBjbGFzcz0ndHJhY2UtbmFtZSc+XCIgKyB0cmFjZU5hbWUgKyBcIjwvZGl2PiA8ZGl2IGNsYXNzPSd0cmFjZS1oYW5kbGVyLW5hbWUnPlwiICsgYXBwcm92ZUhhbmRsZXJOYW1lICsgXCI8L2Rpdj4gPC9kaXY+XCI7XG4gICAgICB0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5yZXBsYWNlRXJyb3JTeW1ib2wodHJhY2VOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2VOYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWNlTmFtZTtcbiAgfSxcbiAgZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGU6IGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgdmFyIGFwcHJvdmVzLCBjb3VudGVycztcbiAgICBjb3VudGVycyA9IHt9O1xuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFhcHByb3Zlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oYXBwcm92ZSkge1xuICAgICAgaWYgKGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkKSB7XG4gICAgICAgIGlmICghY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdKSB7XG4gICAgICAgICAgY291bnRlcnNbYXBwcm92ZS5mcm9tX2FwcHJvdmVfaWRdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdKSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNvdW50ZXJzW2FwcHJvdmUuZnJvbV9hcHByb3ZlX2lkXVthcHByb3ZlLnR5cGVdID0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjb3VudGVycztcbiAgfSxcbiAgZ2V0VHJhY2VDb3VudGVyc1dpdGhUeXBlOiBmdW5jdGlvbih0cmFjZSwgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzKSB7XG4gICAgdmFyIGFwcHJvdmVzLCBjb3VudGVycywgaXNFeHBhbmRBcHByb3ZlLCB0cmFjZU1heEFwcHJvdmVDb3VudDtcbiAgICBjb3VudGVycyA9IHt9O1xuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFhcHByb3Zlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgaXNFeHBhbmRBcHByb3ZlID0gRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlO1xuICAgIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24odG9BcHByb3ZlKSB7XG4gICAgICB2YXIgdG9BcHByb3ZlRnJvbUlkLCB0b0FwcHJvdmVIYW5kbGVyTmFtZSwgdG9BcHByb3ZlVHlwZTtcbiAgICAgIHRvQXBwcm92ZVR5cGUgPSB0b0FwcHJvdmUudHlwZTtcbiAgICAgIHRvQXBwcm92ZUZyb21JZCA9IHRvQXBwcm92ZS5mcm9tX2FwcHJvdmVfaWQ7XG4gICAgICB0b0FwcHJvdmVIYW5kbGVyTmFtZSA9IHRvQXBwcm92ZS5oYW5kbGVyX25hbWU7XG4gICAgICBpZiAoIXRvQXBwcm92ZUZyb21JZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihmcm9tQXBwcm92ZSkge1xuICAgICAgICB2YXIgY291bnRlciwgY291bnRlcjIsIGNvdW50ZXJDb250ZW50LCByZWY7XG4gICAgICAgIGlmIChmcm9tQXBwcm92ZS5faWQgPT09IHRvQXBwcm92ZUZyb21JZCkge1xuICAgICAgICAgIGNvdW50ZXIgPSBjb3VudGVyc1t0b0FwcHJvdmVGcm9tSWRdO1xuICAgICAgICAgIGlmICghY291bnRlcikge1xuICAgICAgICAgICAgY291bnRlciA9IGNvdW50ZXJzW3RvQXBwcm92ZUZyb21JZF0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFjb3VudGVyW3RvQXBwcm92ZS50eXBlXSkge1xuICAgICAgICAgICAgY291bnRlclt0b0FwcHJvdmUudHlwZV0gPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY291bnRlcjIgPSBjb3VudGVyW3RvQXBwcm92ZS50eXBlXTtcbiAgICAgICAgICBpZiAoKHJlZiA9IHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1t0b0FwcHJvdmUuX2lkXSkgIT0gbnVsbCA/IHJlZlt0b0FwcHJvdmVUeXBlXSA6IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvdW50ZXIyLnB1c2goe1xuICAgICAgICAgICAgICBmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGUsXG4gICAgICAgICAgICAgIGZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU6IGZyb21BcHByb3ZlLmhhbmRsZXJfbmFtZSxcbiAgICAgICAgICAgICAgdG9fYXBwcm92ZV9pZDogdG9BcHByb3ZlLl9pZCxcbiAgICAgICAgICAgICAgdG9fYXBwcm92ZV9oYW5kbGVyX25hbWU6IHRvQXBwcm92ZS5oYW5kbGVyX25hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyQ29udGVudCA9IGlzRXhwYW5kQXBwcm92ZSA/IG51bGwgOiBjb3VudGVyMi5maW5kUHJvcGVydHlCeVBLKFwiaXNfdG90YWxcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoY291bnRlckNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgY291bnRlckNvbnRlbnQuY291bnQrKztcbiAgICAgICAgICAgICAgaWYgKCEoY291bnRlckNvbnRlbnQuY291bnQgPiB0cmFjZU1heEFwcHJvdmVDb3VudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY291bnRlckNvbnRlbnQudG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzLnB1c2godG9BcHByb3ZlLmhhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb3VudGVyMi5wdXNoKHtcbiAgICAgICAgICAgICAgICBmcm9tX3R5cGU6IGZyb21BcHByb3ZlLnR5cGUsXG4gICAgICAgICAgICAgICAgZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZTogZnJvbUFwcHJvdmUuaGFuZGxlcl9uYW1lLFxuICAgICAgICAgICAgICAgIHRvX2FwcHJvdmVfaWQ6IHRvQXBwcm92ZS5faWQsXG4gICAgICAgICAgICAgICAgY291bnQ6IDEsXG4gICAgICAgICAgICAgICAgdG9fYXBwcm92ZV9oYW5kbGVyX25hbWVzOiBbdG9BcHByb3ZlLmhhbmRsZXJfbmFtZV0sXG4gICAgICAgICAgICAgICAgaXNfdG90YWw6IHRydWVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gY291bnRlcnM7XG4gIH0sXG4gIHB1c2hBcHByb3Zlc1dpdGhUeXBlR3JhcGhTeW50YXg6IGZ1bmN0aW9uKG5vZGVzLCB0cmFjZSkge1xuICAgIHZhciBhcHByb3ZlcywgY3VycmVudFRyYWNlTmFtZSwgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyLCBmcm9tQXBwcm92ZSwgZnJvbUFwcHJvdmVJZCwgcmVzdWx0cywgc3BsaXRJbmRleCwgdGVtcEhhbmRsZXJOYW1lcywgdG9BcHByb3ZlSWQsIHRvQXBwcm92ZVR5cGUsIHRvQXBwcm92ZXMsIHRyYWNlQ291bnRlcnMsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycywgdHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgdHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzID0gRmxvd3ZlcnNpb25BUEkuZ2V0VHJhY2VGcm9tQXBwcm92ZUNvdW50ZXJzV2l0aFR5cGUodHJhY2UpO1xuICAgIHRyYWNlQ291bnRlcnMgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZUNvdW50ZXJzV2l0aFR5cGUodHJhY2UsIHRyYWNlRnJvbUFwcHJvdmVDb3VudGVycyk7XG4gICAgaWYgKCF0cmFjZUNvdW50ZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlciA9IHt9O1xuICAgIHRyYWNlTWF4QXBwcm92ZUNvdW50ID0gRmxvd3ZlcnNpb25BUEkudHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgc3BsaXRJbmRleCA9IEZsb3d2ZXJzaW9uQVBJLnRyYWNlU3BsaXRBcHByb3Zlc0luZGV4O1xuICAgIGN1cnJlbnRUcmFjZU5hbWUgPSB0cmFjZS5uYW1lO1xuICAgIGZvciAoZnJvbUFwcHJvdmVJZCBpbiB0cmFjZUNvdW50ZXJzKSB7XG4gICAgICBmcm9tQXBwcm92ZSA9IHRyYWNlQ291bnRlcnNbZnJvbUFwcHJvdmVJZF07XG4gICAgICBmb3IgKHRvQXBwcm92ZVR5cGUgaW4gZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgdG9BcHByb3ZlcyA9IGZyb21BcHByb3ZlW3RvQXBwcm92ZVR5cGVdO1xuICAgICAgICB0b0FwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24odG9BcHByb3ZlKSB7XG4gICAgICAgICAgdmFyIGV4dHJhQ291bnQsIGlzVHlwZU5vZGUsIHN0clRvSGFuZGxlck5hbWVzLCB0b0hhbmRsZXJOYW1lcywgdHJhY2VOYW1lLCB0eXBlTmFtZTtcbiAgICAgICAgICB0eXBlTmFtZSA9IFwiXCI7XG4gICAgICAgICAgc3dpdGNoICh0b0FwcHJvdmVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdjYyc6XG4gICAgICAgICAgICAgIHR5cGVOYW1lID0gXCLkvKDpmIVcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb3J3YXJkJzpcbiAgICAgICAgICAgICAgdHlwZU5hbWUgPSBcIui9rOWPkVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Rpc3RyaWJ1dGUnOlxuICAgICAgICAgICAgICB0eXBlTmFtZSA9IFwi5YiG5Y+RXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlzVHlwZU5vZGUgPSBbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YodG9BcHByb3ZlLmZyb21fdHlwZSkgPj0gMDtcbiAgICAgICAgICBpZiAoaXNUeXBlTm9kZSkge1xuICAgICAgICAgICAgdHJhY2VOYW1lID0gdG9BcHByb3ZlLmZyb21fYXBwcm92ZV9oYW5kbGVyX25hbWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuZnJvbV9hcHByb3ZlX2hhbmRsZXJfbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0b0FwcHJvdmUuaXNfdG90YWwpIHtcbiAgICAgICAgICAgIHRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lcztcbiAgICAgICAgICAgIGlmIChzcGxpdEluZGV4ICYmIHRvQXBwcm92ZS5jb3VudCA+IHNwbGl0SW5kZXgpIHtcbiAgICAgICAgICAgICAgdG9IYW5kbGVyTmFtZXMuc3BsaWNlKHNwbGl0SW5kZXgsIDAsIFwiPGJyLz4sXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyVG9IYW5kbGVyTmFtZXMgPSB0b0hhbmRsZXJOYW1lcy5qb2luKFwiLFwiKS5yZXBsYWNlKFwiLCxcIiwgXCJcIik7XG4gICAgICAgICAgICBleHRyYUNvdW50ID0gdG9BcHByb3ZlLmNvdW50IC0gdHJhY2VNYXhBcHByb3ZlQ291bnQ7XG4gICAgICAgICAgICBpZiAoZXh0cmFDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgc3RyVG9IYW5kbGVyTmFtZXMgKz0gXCLnrYlcIiArIHRvQXBwcm92ZS5jb3VudCArIFwi5Lq6XCI7XG4gICAgICAgICAgICAgIGlmICghZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdID0ge307XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyW2Zyb21BcHByb3ZlSWRdW3RvQXBwcm92ZVR5cGVdID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0clRvSGFuZGxlck5hbWVzID0gdG9BcHByb3ZlLnRvX2FwcHJvdmVfaGFuZGxlcl9uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNUeXBlTm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdFwiICsgZnJvbUFwcHJvdmVJZCArIFwiPlxcXCJcIiArIHRyYWNlTmFtZSArIFwiXFxcIl0tLVwiICsgdHlwZU5hbWUgKyBcIi0tPlwiICsgdG9BcHByb3ZlLnRvX2FwcHJvdmVfaWQgKyBcIj5cXFwiXCIgKyBzdHJUb0hhbmRsZXJOYW1lcyArIFwiXFxcIl1cIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlSWQgKyBcIihcXFwiXCIgKyB0cmFjZU5hbWUgKyBcIlxcXCIpLS1cIiArIHR5cGVOYW1lICsgXCItLT5cIiArIHRvQXBwcm92ZS50b19hcHByb3ZlX2lkICsgXCI+XFxcIlwiICsgc3RyVG9IYW5kbGVyTmFtZXMgKyBcIlxcXCJdXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFwcHJvdmVzID0gdHJhY2UuYXBwcm92ZXM7XG4gICAgaWYgKCFfLmlzRW1wdHkoZXh0cmFIYW5kbGVyTmFtZXNDb3VudGVyKSkge1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChmcm9tQXBwcm92ZUlkIGluIGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcikge1xuICAgICAgICBmcm9tQXBwcm92ZSA9IGV4dHJhSGFuZGxlck5hbWVzQ291bnRlcltmcm9tQXBwcm92ZUlkXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0czE7XG4gICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKHRvQXBwcm92ZVR5cGUgaW4gZnJvbUFwcHJvdmUpIHtcbiAgICAgICAgICAgIHRvQXBwcm92ZUlkID0gZnJvbUFwcHJvdmVbdG9BcHByb3ZlVHlwZV07XG4gICAgICAgICAgICB0ZW1wSGFuZGxlck5hbWVzID0gW107XG4gICAgICAgICAgICBhcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcHJvdmUpIHtcbiAgICAgICAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgICAgICAgaWYgKGZyb21BcHByb3ZlSWQgPT09IGFwcHJvdmUuZnJvbV9hcHByb3ZlX2lkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoKHJlZiA9IHRyYWNlRnJvbUFwcHJvdmVDb3VudGVyc1thcHByb3ZlLl9pZF0pICE9IG51bGwgPyByZWZbdG9BcHByb3ZlVHlwZV0gOiB2b2lkIDApKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcEhhbmRsZXJOYW1lcy5wdXNoKGFwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0czEucHVzaChub2Rlcy5wdXNoKFwiXHRjbGljayBcIiArIHRvQXBwcm92ZUlkICsgXCIgY2FsbGJhY2sgXFxcIlwiICsgKHRlbXBIYW5kbGVyTmFtZXMuam9pbihcIixcIikpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHMxO1xuICAgICAgICB9KSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbiAgfSxcbiAgZ2VuZXJhdGVUcmFjZXNHcmFwaFN5bnRheDogZnVuY3Rpb24odHJhY2VzLCBpc0NvbnZlcnRUb1N0cmluZykge1xuICAgIHZhciBncmFwaFN5bnRheCwgbGFzdEFwcHJvdmVzLCBsYXN0VHJhY2UsIG5vZGVzO1xuICAgIG5vZGVzID0gW1wiZ3JhcGggTFJcIl07XG4gICAgbGFzdFRyYWNlID0gbnVsbDtcbiAgICBsYXN0QXBwcm92ZXMgPSBbXTtcbiAgICB0cmFjZXMuZm9yRWFjaChmdW5jdGlvbih0cmFjZSkge1xuICAgICAgdmFyIGN1cnJlbnRUcmFjZU5hbWUsIGxpbmVzO1xuICAgICAgbGluZXMgPSB0cmFjZS5wcmV2aW91c190cmFjZV9pZHM7XG4gICAgICBjdXJyZW50VHJhY2VOYW1lID0gdHJhY2UubmFtZTtcbiAgICAgIGlmIChsaW5lcyAhPSBudWxsID8gbGluZXMubGVuZ3RoIDogdm9pZCAwKSB7XG4gICAgICAgIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgIHZhciBjdXJyZW50RnJvbVRyYWNlTmFtZSwgZnJvbUFwcHJvdmVzLCBmcm9tVHJhY2UsIHRvQXBwcm92ZXM7XG4gICAgICAgICAgZnJvbVRyYWNlID0gdHJhY2VzLmZpbmRQcm9wZXJ0eUJ5UEsoXCJfaWRcIiwgbGluZSk7XG4gICAgICAgICAgY3VycmVudEZyb21UcmFjZU5hbWUgPSBmcm9tVHJhY2UubmFtZTtcbiAgICAgICAgICBmcm9tQXBwcm92ZXMgPSBmcm9tVHJhY2UuYXBwcm92ZXM7XG4gICAgICAgICAgdG9BcHByb3ZlcyA9IHRyYWNlLmFwcHJvdmVzO1xuICAgICAgICAgIGxhc3RUcmFjZSA9IHRyYWNlO1xuICAgICAgICAgIGxhc3RBcHByb3ZlcyA9IHRvQXBwcm92ZXM7XG4gICAgICAgICAgcmV0dXJuIGZyb21BcHByb3Zlcy5mb3JFYWNoKGZ1bmN0aW9uKGZyb21BcHByb3ZlKSB7XG4gICAgICAgICAgICB2YXIgZnJvbUFwcHJvdmVIYW5kbGVyTmFtZSwgZnJvbVRyYWNlTmFtZSwganVkZ2VUZXh0LCB0b1RyYWNlTmFtZTtcbiAgICAgICAgICAgIGZyb21BcHByb3ZlSGFuZGxlck5hbWUgPSBmcm9tQXBwcm92ZS5oYW5kbGVyX25hbWU7XG4gICAgICAgICAgICBpZiAodG9BcHByb3ZlcyAhPSBudWxsID8gdG9BcHByb3Zlcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRvQXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbih0b0FwcHJvdmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJvbVRyYWNlTmFtZSwganVkZ2VUZXh0LCB0b1RyYWNlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKHRvQXBwcm92ZS50eXBlKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGlmIChbXCJjY1wiLCBcImZvcndhcmRcIiwgXCJkaXN0cmlidXRlXCJdLmluZGV4T2YoZnJvbUFwcHJvdmUudHlwZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0b1RyYWNlTmFtZSA9IEZsb3d2ZXJzaW9uQVBJLmdldFRyYWNlTmFtZShjdXJyZW50VHJhY2VOYW1lLCB0b0FwcHJvdmUuaGFuZGxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAganVkZ2VUZXh0ID0gRmxvd3ZlcnNpb25BUEkuZ2V0QXBwcm92ZUp1ZGdlVGV4dChmcm9tQXBwcm92ZS5qdWRnZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqdWRnZVRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tXCIgKyBqdWRnZVRleHQgKyBcIi0tPlwiICsgdG9BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZXMucHVzaChcIlx0XCIgKyBmcm9tQXBwcm92ZS5faWQgKyBcIihcXFwiXCIgKyBmcm9tVHJhY2VOYW1lICsgXCJcXFwiKS0tPlwiICsgdG9BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIHRvVHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoW1wiY2NcIiwgXCJmb3J3YXJkXCIsIFwiZGlzdHJpYnV0ZVwiXS5pbmRleE9mKGZyb21BcHByb3ZlLnR5cGUpIDwgMCkge1xuICAgICAgICAgICAgICAgIGZyb21UcmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudEZyb21UcmFjZU5hbWUsIGZyb21BcHByb3ZlSGFuZGxlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRvVHJhY2VOYW1lID0gRmxvd3ZlcnNpb25BUEkucmVwbGFjZUVycm9yU3ltYm9sKGN1cnJlbnRUcmFjZU5hbWUpO1xuICAgICAgICAgICAgICAgIGp1ZGdlVGV4dCA9IEZsb3d2ZXJzaW9uQVBJLmdldEFwcHJvdmVKdWRnZVRleHQoZnJvbUFwcHJvdmUuanVkZ2UpO1xuICAgICAgICAgICAgICAgIGlmIChqdWRnZVRleHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS1cIiArIGp1ZGdlVGV4dCArIFwiLS0+XCIgKyB0cmFjZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGZyb21BcHByb3ZlLl9pZCArIFwiKFxcXCJcIiArIGZyb21UcmFjZU5hbWUgKyBcIlxcXCIpLS0+XCIgKyB0cmFjZS5faWQgKyBcIihcXFwiXCIgKyB0b1RyYWNlTmFtZSArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2UuYXBwcm92ZXMuZm9yRWFjaChmdW5jdGlvbihhcHByb3ZlKSB7XG4gICAgICAgICAgdmFyIHRyYWNlTmFtZTtcbiAgICAgICAgICB0cmFjZU5hbWUgPSBGbG93dmVyc2lvbkFQSS5nZXRUcmFjZU5hbWUoY3VycmVudFRyYWNlTmFtZSwgYXBwcm92ZS5oYW5kbGVyX25hbWUpO1xuICAgICAgICAgIHJldHVybiBub2Rlcy5wdXNoKFwiXHRcIiArIGFwcHJvdmUuX2lkICsgXCIoXFxcIlwiICsgdHJhY2VOYW1lICsgXCJcXFwiKVwiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRmxvd3ZlcnNpb25BUEkucHVzaEFwcHJvdmVzV2l0aFR5cGVHcmFwaFN5bnRheChub2RlcywgdHJhY2UpO1xuICAgIH0pO1xuICAgIGlmIChsYXN0QXBwcm92ZXMgIT0gbnVsbCkge1xuICAgICAgbGFzdEFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24obGFzdEFwcHJvdmUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzLnB1c2goXCJcdGNsYXNzIFwiICsgbGFzdEFwcHJvdmUuX2lkICsgXCIgY3VycmVudC1zdGVwLW5vZGU7XCIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc0NvbnZlcnRUb1N0cmluZykge1xuICAgICAgZ3JhcGhTeW50YXggPSBub2Rlcy5qb2luKFwiXFxuXCIpO1xuICAgICAgcmV0dXJuIGdyYXBoU3ludGF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICB9LFxuICBzZW5kSHRtbFJlc3BvbnNlOiBmdW5jdGlvbihyZXEsIHJlcywgdHlwZSkge1xuICAgIHZhciBjdXJyZW50U3RlcElkLCBlcnJvcl9tc2csIGZsb3d2ZXJzaW9uLCBncmFwaFN5bnRheCwgaW5zdGFuY2UsIGluc3RhbmNlX2lkLCBxdWVyeSwgcmVmLCByZWYxLCBzdGVwcywgdHJhY2VzO1xuICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgIGluc3RhbmNlX2lkID0gcXVlcnkuaW5zdGFuY2VfaWQ7XG4gICAgaWYgKCFpbnN0YW5jZV9pZCkge1xuICAgICAgRmxvd3ZlcnNpb25BUEkuc2VuZEludmFsaWRVUkxSZXNwb25zZShyZXMpO1xuICAgIH1cbiAgICBlcnJvcl9tc2cgPSBcIlwiO1xuICAgIGdyYXBoU3ludGF4ID0gXCJcIjtcbiAgICBGbG93dmVyc2lvbkFQSS5pc0V4cGFuZEFwcHJvdmUgPSBmYWxzZTtcbiAgICBpZiAodHlwZSA9PT0gXCJ0cmFjZXNfZXhwYW5kXCIpIHtcbiAgICAgIHR5cGUgPSBcInRyYWNlc1wiO1xuICAgICAgRmxvd3ZlcnNpb25BUEkuaXNFeHBhbmRBcHByb3ZlID0gdHJ1ZTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICd0cmFjZXMnOlxuICAgICAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKGluc3RhbmNlX2lkLCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB0cmFjZXM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICB0cmFjZXMgPSBpbnN0YW5jZS50cmFjZXM7XG4gICAgICAgICAgaWYgKHRyYWNlcyAhPSBudWxsID8gdHJhY2VzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgZ3JhcGhTeW50YXggPSB0aGlzLmdlbmVyYXRlVHJhY2VzR3JhcGhTeW50YXgodHJhY2VzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JfbXNnID0gXCLmsqHmnInmib7liLDlvZPliY3nlLPor7fljZXnmoTmtYHnqIvmraXpqqTmlbDmja5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JfbXNnID0gXCLlvZPliY3nlLPor7fljZXkuI3lrZjlnKjmiJblt7LooqvliKDpmaRcIjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoaW5zdGFuY2VfaWQsIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIGZsb3dfdmVyc2lvbjogMSxcbiAgICAgICAgICAgIGZsb3c6IDEsXG4gICAgICAgICAgICB0cmFjZXM6IHtcbiAgICAgICAgICAgICAgJHNsaWNlOiAtMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgIGN1cnJlbnRTdGVwSWQgPSAocmVmID0gaW5zdGFuY2UudHJhY2VzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMF0pICE9IG51bGwgPyByZWYxLnN0ZXAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgZmxvd3ZlcnNpb24gPSBXb3JrZmxvd01hbmFnZXIuZ2V0SW5zdGFuY2VGbG93VmVyc2lvbihpbnN0YW5jZSk7XG4gICAgICAgICAgc3RlcHMgPSBmbG93dmVyc2lvbiAhPSBudWxsID8gZmxvd3ZlcnNpb24uc3RlcHMgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKHN0ZXBzICE9IG51bGwgPyBzdGVwcy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIGdyYXBoU3ludGF4ID0gdGhpcy5nZW5lcmF0ZVN0ZXBzR3JhcGhTeW50YXgoc3RlcHMsIGN1cnJlbnRTdGVwSWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcl9tc2cgPSBcIuayoeacieaJvuWIsOW9k+WJjeeUs+ivt+WNleeahOa1geeoi+atpemqpOaVsOaNrlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvcl9tc2cgPSBcIuW9k+WJjeeUs+ivt+WNleS4jeWtmOWcqOaIluW3suiiq+WIoOmZpFwiO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy53cml0ZVJlc3BvbnNlKHJlcywgMjAwLCBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblx0PGhlYWQ+XFxuXHRcdDxtZXRhIGNoYXJzZXQ9XFxcInV0Zi04XFxcIj5cXG5cdFx0PG1ldGEgbmFtZT1cXFwidmlld3BvcnRcXFwiIGNvbnRlbnQ9XFxcIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLCBtYXhpbXVtLXNjYWxlPTEsIHVzZXItc2NhbGFibGU9bm9cXFwiPlxcblx0XHQ8dGl0bGU+V29ya2Zsb3cgQ2hhcnQ8L3RpdGxlPlxcblx0XHQ8bGluayByZWw9XFxcInN0eWxlc2hlZXRcXFwiIGhyZWY9XFxcIi9wYWNrYWdlcy9zdGVlZG9zX3dvcmtmbG93LWNoYXJ0L2Fzc2V0cy9tZXJtYWlkL2Rpc3QvbWVybWFpZC5jc3NcXFwiLz5cXG5cdFx0PHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiL2xpYi9qcXVlcnkvanF1ZXJ5LTEuMTEuMi5taW4uanNcXFwiPjwvc2NyaXB0Plxcblx0XHQ8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIvcGFja2FnZXMvc3RlZWRvc193b3JrZmxvdy1jaGFydC9hc3NldHMvbWVybWFpZC9kaXN0L21lcm1haWQubWluLmpzXFxcIj48L3NjcmlwdD5cXG5cdFx0PHN0eWxlPlxcblx0XHRcdGJvZHkgeyBcXG5cdFx0XHRcdGZvbnQtZmFtaWx5OiAnU291cmNlIFNhbnMgUHJvJywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuXHRcdFx0fVxcblx0XHRcdC5sb2FkaW5ne1xcblx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xcblx0XHRcdFx0bGVmdDogMHB4O1xcblx0XHRcdFx0cmlnaHQ6IDBweDtcXG5cdFx0XHRcdHRvcDogNTAlO1xcblx0XHRcdFx0ei1pbmRleDogMTEwMDtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdG1hcmdpbi10b3A6IC0zMHB4O1xcblx0XHRcdFx0Zm9udC1zaXplOiAzNnB4O1xcblx0XHRcdFx0Y29sb3I6ICNkZmRmZGY7XFxuXHRcdFx0fVxcblx0XHRcdC5lcnJvci1tc2d7XFxuXHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXHRcdFx0XHRsZWZ0OiAwcHg7XFxuXHRcdFx0XHRyaWdodDogMHB4O1xcblx0XHRcdFx0Ym90dG9tOiAyMHB4O1xcblx0XHRcdFx0ei1pbmRleDogMTEwMDtcXG5cdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cdFx0XHRcdGZvbnQtc2l6ZTogMjBweDtcXG5cdFx0XHRcdGNvbG9yOiAjYTk0NDQyO1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgcmVjdHtcXG5cdFx0XHRcdGZpbGw6ICNjY2NjZmY7XFxuXHRcdFx0XHRzdHJva2U6IHJnYigxNDQsIDE0NCwgMjU1KTtcXG4gICAgXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoOiAycHg7XFxuXHRcdFx0fVxcblx0XHRcdCNmbG93LXN0ZXBzLXN2ZyAubm9kZS5jdXJyZW50LXN0ZXAtbm9kZSByZWN0e1xcblx0XHRcdFx0ZmlsbDogI2NkZTQ5ODtcXG5cdFx0XHRcdHN0cm9rZTogIzEzNTQwYztcXG5cdFx0XHRcdHN0cm9rZS13aWR0aDogMnB4O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUuY29uZGl0aW9uIHJlY3R7XFxuXHRcdFx0XHRmaWxsOiAjZWNlY2ZmO1xcblx0XHRcdFx0c3Ryb2tlOiByZ2IoMjA0LCAyMDQsIDI1NSk7XFxuICAgIFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aDogMXB4O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnRyYWNlLWhhbmRsZXItbmFtZXtcXG5cdFx0XHRcdGNvbG9yOiAjNzc3O1xcblx0XHRcdH1cXG5cdFx0XHQjZmxvdy1zdGVwcy1zdmcgLm5vZGUgLnN0ZXAtaGFuZGxlci1uYW1le1xcblx0XHRcdFx0Y29sb3I6ICM3Nzc7XFxuXHRcdFx0fVxcblx0XHRcdGRpdi5tZXJtYWlkVG9vbHRpcHtcXG5cdFx0XHRcdHBvc2l0aW9uOiBmaXhlZCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHR0ZXh0LWFsaWduOiBsZWZ0IWltcG9ydGFudDtcXG5cdFx0XHRcdHBhZGRpbmc6IDRweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRmb250LXNpemU6IDE0cHghaW1wb3J0YW50O1xcblx0XHRcdFx0bWF4LXdpZHRoOiA1MDBweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRsZWZ0OiBhdXRvIWltcG9ydGFudDtcXG5cdFx0XHRcdHRvcDogMTVweCFpbXBvcnRhbnQ7XFxuXHRcdFx0XHRyaWdodDogMTVweDtcXG5cdFx0XHR9XFxuXHRcdFx0LmJ0bi16b29te1xcblx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xcblx0XHRcdFx0Ym9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cdFx0XHRcdHBhZGRpbmc6IDJweCAxMHB4O1xcblx0XHRcdFx0Zm9udC1zaXplOiAyNnB4O1xcblx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMjBweDtcXG5cdFx0XHRcdGJhY2tncm91bmQ6ICNlZWU7XFxuXHRcdFx0XHRjb2xvcjogIzc3NztcXG5cdFx0XHRcdHBvc2l0aW9uOiBmaXhlZDtcXG5cdFx0XHRcdGJvdHRvbTogMTVweDtcXG5cdFx0XHRcdG91dGxpbmU6IG5vbmU7XFxuXHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XFxuXHRcdFx0XHR6LWluZGV4OiA5OTk5OTtcXG5cdFx0XHRcdC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHQtbW96LXVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0LW1zLXVzZXItc2VsZWN0OiBub25lO1xcblx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XFxuXHRcdFx0XHRsaW5lLWhlaWdodDogMS4yO1xcblx0XHRcdH1cXG5cdFx0XHRAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG5cdFx0XHRcdC5idG4tem9vbXtcXG5cdFx0XHRcdFx0ZGlzcGxheTpub25lO1xcblx0XHRcdFx0fVxcblx0XHRcdH1cXG5cdFx0XHQuYnRuLXpvb206aG92ZXJ7XFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbS11cHtcXG5cdFx0XHRcdGxlZnQ6IDE1cHg7XFxuXHRcdFx0fVxcblx0XHRcdC5idG4tem9vbS1kb3due1xcblx0XHRcdFx0bGVmdDogNjBweDtcXG5cdFx0XHRcdHBhZGRpbmc6IDFweCAxM3B4IDNweCAxM3B4O1xcblx0XHRcdH1cXG5cdFx0PC9zdHlsZT5cXG5cdDwvaGVhZD5cXG5cdDxib2R5Plxcblx0XHQ8ZGl2IGNsYXNzID0gXFxcImxvYWRpbmdcXFwiPkxvYWRpbmcuLi48L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcyA9IFxcXCJlcnJvci1tc2dcXFwiPlwiICsgZXJyb3JfbXNnICsgXCI8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cXFwibWVybWFpZFxcXCI+PC9kaXY+XFxuXHRcdDxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj5cXG5cdFx0XHRtZXJtYWlkLmluaXRpYWxpemUoe1xcblx0XHRcdFx0c3RhcnRPbkxvYWQ6ZmFsc2VcXG5cdFx0XHR9KTtcXG5cdFx0XHQkKGZ1bmN0aW9uKCl7XFxuXHRcdFx0XHR2YXIgZ3JhcGhOb2RlcyA9IFwiICsgKEpTT04uc3RyaW5naWZ5KGdyYXBoU3ludGF4KSkgKyBcIjtcXG5cdFx0XHRcdC8v5pa55L6/5YmN6Z2i5Y+v5Lul6YCa6L+H6LCD55SobWVybWFpZC5jdXJyZW50Tm9kZXPosIPlvI/vvIznibnmhI/lop7liqBjdXJyZW50Tm9kZXPlsZ7mgKfjgIJcXG5cdFx0XHRcdG1lcm1haWQuY3VycmVudE5vZGVzID0gZ3JhcGhOb2RlcztcXG5cdFx0XHRcdHZhciBncmFwaFN5bnRheCA9IGdyYXBoTm9kZXMuam9pbihcXFwiXFxcXG5cXFwiKTtcXG5cdFx0XHRcdGNvbnNvbGUubG9nKGdyYXBoTm9kZXMpO1xcblx0XHRcdFx0Y29uc29sZS5sb2coZ3JhcGhTeW50YXgpO1xcblx0XHRcdFx0Y29uc29sZS5sb2coXFxcIllvdSBjYW4gYWNjZXNzIHRoZSBncmFwaCBub2RlcyBieSAnbWVybWFpZC5jdXJyZW50Tm9kZXMnIGluIHRoZSBjb25zb2xlIG9mIGJyb3dzZXIuXFxcIik7XFxuXHRcdFx0XHQkKFxcXCIubG9hZGluZ1xcXCIpLnJlbW92ZSgpO1xcblxcblx0XHRcdFx0dmFyIGlkID0gXFxcImZsb3ctc3RlcHMtc3ZnXFxcIjtcXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gJCgnLm1lcm1haWQnKTtcXG5cdFx0XHRcdHZhciBpbnNlcnRTdmcgPSBmdW5jdGlvbihzdmdDb2RlLCBiaW5kRnVuY3Rpb25zKSB7XFxuXHRcdFx0XHRcdGVsZW1lbnQuaHRtbChzdmdDb2RlKTtcXG5cdFx0XHRcdFx0aWYodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJyl7XFxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soaWQpO1xcblx0XHRcdFx0XHR9XFxuXHRcdFx0XHRcdGJpbmRGdW5jdGlvbnMoZWxlbWVudFswXSk7XFxuXHRcdFx0XHR9O1xcblx0XHRcdFx0bWVybWFpZC5yZW5kZXIoaWQsIGdyYXBoU3ludGF4LCBpbnNlcnRTdmcsIGVsZW1lbnRbMF0pO1xcblxcblx0XHRcdFx0dmFyIHpvb21TVkcgPSBmdW5jdGlvbih6b29tKXtcXG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRXaWR0aCA9ICQoXFxcInN2Z1xcXCIpLndpZHRoKCk7XFxuXHRcdFx0XHRcdHZhciBuZXdXaWR0aCA9IGN1cnJlbnRXaWR0aCAqIHpvb207XFxuXHRcdFx0XHRcdCQoXFxcInN2Z1xcXCIpLmNzcyhcXFwibWF4V2lkdGhcXFwiLG5ld1dpZHRoICsgXFxcInB4XFxcIikud2lkdGgobmV3V2lkdGgpO1xcblx0XHRcdFx0fVxcblxcblx0XHRcdFx0Ly/mlK/mjIHpvKDmoIfmu5rova7nvKnmlL7nlLvluINcXG5cdFx0XHRcdCQod2luZG93KS5vbihcXFwibW91c2V3aGVlbFxcXCIsZnVuY3Rpb24oZXZlbnQpe1xcblx0XHRcdFx0XHRpZihldmVudC5jdHJsS2V5KXtcXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xcblx0XHRcdFx0XHRcdHZhciB6b29tID0gZXZlbnQub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCA/IDEuMSA6IDAuOTtcXG5cdFx0XHRcdFx0XHR6b29tU1ZHKHpvb20pO1xcblx0XHRcdFx0XHR9XFxuXHRcdFx0XHR9KTtcXG5cdFx0XHRcdCQoXFxcIi5idG4tem9vbVxcXCIpLm9uKFxcXCJjbGlja1xcXCIsZnVuY3Rpb24oKXtcXG5cdFx0XHRcdFx0em9vbVNWRygkKHRoaXMpLmF0dHIoXFxcInpvb21cXFwiKSk7XFxuXHRcdFx0XHR9KTtcXG5cdFx0XHR9KTtcXG5cdFx0PC9zY3JpcHQ+XFxuXHRcdDxhIGNsYXNzPVxcXCJidG4tem9vbSBidG4tem9vbS11cFxcXCIgem9vbT0xLjEgdGl0bGU9XFxcIueCueWHu+aUvuWkp1xcXCI+KzwvYT5cXG5cdFx0PGEgY2xhc3M9XFxcImJ0bi16b29tIGJ0bi16b29tLWRvd25cXFwiIHpvb209MC45IHRpdGxlPVxcXCLngrnlh7vnvKnlsI9cXFwiPi08L2E+XFxuXHQ8L2JvZHk+XFxuPC9odG1sPlwiKTtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL3dvcmtmbG93L2NoYXJ0P2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlKHJlcSwgcmVzKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzP2luc3RhbmNlX2lkPTppbnN0YW5jZV9pZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHJldHVybiBGbG93dmVyc2lvbkFQSS5zZW5kSHRtbFJlc3BvbnNlKHJlcSwgcmVzLCBcInRyYWNlc1wiKTtcbn0pO1xuXG5Kc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvd29ya2Zsb3cvY2hhcnQvdHJhY2VzX2V4cGFuZD9pbnN0YW5jZV9pZD06aW5zdGFuY2VfaWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICByZXR1cm4gRmxvd3ZlcnNpb25BUEkuc2VuZEh0bWxSZXNwb25zZShyZXEsIHJlcywgXCJ0cmFjZXNfZXhwYW5kXCIpO1xufSk7XG4iXX0=
