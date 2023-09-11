/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-05-16 17:00:38
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-11 17:44:01
 */
var buttonTriggerHistoryPathsChange;

let historyPathsStoreKey = "history_paths";

// 切换应用、对象、列表视图时清除本地存储中的过滤条件
function clearHistoryFilters(context, lastPath, paths) {
    const path = context.path;
    const params = context.params || {};
    if (!lastPath || lastPath.params.app_id != params.app_id || lastPath.params.object_name != params.object_name || lastPath.params.list_view_id != params.list_view_id) {
        let listViewPropsStoreKey;
        if (lastPath) {
            if(lastPath.params.record_id){
                // 是从记录详细界面直接切换到其他对象列表或其他应用时，进一步往上找，找到对象列表的path作为lastPath来清除对应的本地存储
                for(let i = paths.length - 1;i >= 0;i--){
                    let tempPath = paths[i];
                    // if(!tempPath.params.record_id && tempPath.params.list_view_id){
                    // 不可以判断list_view_id表示对象列表，因为有可以从应用程序微页面进入记录详细页面，需要清除应用程序微页面中的对象表格或对象列表组件中本地存储中保存的过滤条件
                    if(!tempPath.params.record_id){
                        // record_id不存在，list_view_id存在表示对象列表页面
                        lastPath = tempPath;
                        break;
                    }
                }
            }
            listViewPropsStoreKey = lastPath.path + "/crud";
        }
        else {
            listViewPropsStoreKey = path + "/crud";
        }
        sessionStorage.removeItem(listViewPropsStoreKey);
    }
}

/**
 * 移除最后一个path，并且返回要返回的上一个path
 * 如果是从推送通知中点开进入记录详细页面，则返回当前记录所属对象的列表页面
 */
function popHistoryPath() {
    var paths = getHistoryPaths() || [];
    let lastPath = paths && paths[paths.length - 1];
    paths.pop();
    setHistoryPaths(paths);
    let prevPath = paths && paths[paths.length - 1];
    if(!prevPath && lastPath){
        // 如果是从推送通知中点开进入记录详细页面，在paths.pop()前的paths肯定只有当前记录详细页面的path
        // 此时lastPath肯定是记录详细页面，值如以下格式：
        /**{
            "path": "/app/projects/project_program/view/6465c790f85da77bbccefbe6",
            "params": {
                "app_id": "projects",
                "object_name": "project_program",
                "record_id": "6465c790f85da77bbccefbe6"
            }
        }**/
        prevPath = {
            path: `/app/${lastPath.params.app_id || "-"}/${lastPath.params.object_name}`,
            params: {
                app_id: lastPath.params.app_id,
                object_name: lastPath.params.object_name
            }
        }
    }
    return prevPath;
}

function pushHistoryPath(path, params) {
    let paths = getHistoryPaths() || [];
    let lastPath = paths && paths[paths.length - 1];
    if(lastPath && lastPath.path === path){
        // 点返回按钮执行goBack函数触发FlowRouter.triggers.enter从而进入该函数，此时lastPath肯定跟传入的path值一样，正好排除掉不重复加入paths
        return;
    }
    paths.push({ path, params });
    setHistoryPaths(paths);
}

function resetHistoryPath(path, params) {
    setHistoryPaths([{ path, params }]);
}

function getHistoryPaths() {
    if (!window.historyPaths) {
        var paths = sessionStorage.getItem(historyPathsStoreKey);
        if (paths) {
            window.historyPaths = JSON.parse(paths);
        }else{
            window.historyPaths = [];
        }
    }
    return window.historyPaths;
}

function setHistoryPaths(paths) {
    window.historyPaths = paths;
    sessionStorage.setItem(historyPathsStoreKey, JSON.stringify(paths));
}

function triggerBroadcastHistoryPathsChanged(button) {
    if (button) {
        button.props.dispatchEvent('click', {});
    }
}

function debounce(fn, delay) {
    let time = null;
    return function (...args) {
        if (time) {
            clearTimeout(time);
        }
        time = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    }
}

function getOpenerLevel(opener, level) {
    if (level > 3) {
        return level + 1;
    }
    if (!!opener['opener']) {
        return getOpenerLevel(opener['opener'], level + 1);
    } else {
        return level;
    }
}


function goBack(){
    let prevPath = popHistoryPath();
    if(prevPath && prevPath.path){
        FlowRouter.go(prevPath.path);
    }
}

window.goBack = goBack;

; (function () {
    try {
        Meteor.startup(function () {
            Object.assign(Steedos, {
                goBack
            });
            var rootId = "steedosHistoryPathsRoot";
            var modalRoot = document.getElementById(rootId);
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                $("body")[0].appendChild(modalRoot);
            }
            const page = {
                name: "pageSteedosHistoryPaths",
                render_engine: "amis",
                schema: {
                    name: "serviceSteedosHistoryPaths",
                    id: "serviceSteedosHistoryPaths",
                    type: "service",
                    className: "service-steedos-history-paths",
                    body: [{
                        "type": "button",
                        "label": "触发@history_paths.changed",
                        "name": "buttonTriggerHistoryPathsChange",
                        "className": "button-trigger-history-paths-change hidden",
                        "onEvent": {
                            "click": {
                                "actions": [
                                    {
                                        "actionType": "broadcast",
                                        "args": {
                                            "eventName": "@history_paths.changed"
                                        }
                                    }
                                ]
                            }
                        }
                    }]
                }
            };
            const root = $("#" + rootId)[0];
            Tracker.autorun(function (c) {
                if (Creator.steedosInit.get() && Creator.validated.get()) {
                    Steedos.Page.render(root, page, {});
                    const findVars = (obj, vars) => {
                        try {
                            return vars.length === vars.filter(function (item) {
                                return item.split(".").reduce(function (sum, n) {
                                    return sum[n];
                                }, obj) !== undefined;
                            }).length;
                        }
                        catch (ex) {
                            return false;
                        }
                    }
                    Promise.all([
                        waitForThing(window, 'SteedosUI'),
                    ]).then(() => {
                        const waittingVars = ["SteedosUI.refs.serviceSteedosHistoryPaths.getComponentByName"];
                        Promise.all([
                            waitForThing(window, waittingVars, findVars)
                        ]).then(() => {
                            var scope = SteedosUI.refs["serviceSteedosHistoryPaths"];
                            buttonTriggerHistoryPathsChange = scope.getComponentByName("serviceSteedosHistoryPaths.buttonTriggerHistoryPathsChange");
                        });
                    });
                }
            });
        });

    } catch (error) {
        console.error(error)
    };
})();


// 使用debounce防抖动函数，连续多次自动触发enter事件时，只需要捕获最后一次
FlowRouter.triggers.enter(debounce(function (context, redirect, stop) {
    if(!!window.opener){
        // 记录详细页面点击右上角查看审批单等打开新窗口情况下，新窗口的history path继承了opener页面的history path，所以需要区别出来，否则会报错
        historyPathsStoreKey = "history_paths_opener_level" + getOpenerLevel(window,0);
    }
    const path = context.path;
    const params = context.params || {};
    // const pathDef = context.route.pathDef;
    const recordId = params.record_id;
    var paths = getHistoryPaths() || [];
    let lastPath = paths && paths[paths.length - 1];
    if (recordId) {
        //判断当前路由与记录的路由是否相同，为解决从设计器微页面返回重复记录的问题#4978
        var top0 = null;
        if(lastPath && lastPath.path && lastPath.path.split){
            top0 = lastPath.path.split('?')[0]
        }
        if(path.split('?')[0] != top0){
            // 触发广播事件前，把当前path和params累加存入amis变量historyPaths中
            pushHistoryPath(path, params);
        } 
    }
    else {
        clearHistoryFilters(context, lastPath, paths);
        // 触发广播事件前重置amis变量historyPaths值为空数组，并把当前path和params存入amis变量historyPaths中
        resetHistoryPath(path, params);
    }
    triggerBroadcastHistoryPathsChanged(buttonTriggerHistoryPathsChange);
}, 200));
