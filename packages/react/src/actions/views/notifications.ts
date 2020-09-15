import { dataServicesSelector, viewStateSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { executeApiRequest } from '../api_request'
import { createAction as baseCreateAction } from '../base'

export var NOTIFICATIONS_STATE_CHANGE_ACTION = 'NOTIFICATIONS_STATE_CHANGE';
export var NOTIFICATIONS_COUNT_CHANGE_ACTION = 'NOTIFICATIONS_COUNT_CHANGE';
export var NOTIFICATIONS_INTERVAL_CHANGE_ACTION = 'NOTIFICATIONS_INTERVAL_CHANGE';

export function loadNotificationsData(options: any) {
    options = Object.assign({}, options, {
        objectName: "notifications",
        columns: [
            { field: "name" },
            { field: "body" },
            { field: "related_to" },
            { field: "related_name" },
            { field: "url" },
            { field: "owner" },
            { field: "is_read" },
            { field: "from" },
            { field: "created" }
        ]
    });
    if(!options.pageSize){
        options.pageSize = 10;
    }
    if(!options.filters){
        // 默认过滤当前用户收到的工作区范围所有通知
        options.filters = [
            ['owner', '=', '{userId}']
        ];
    }
    if(!options.sort){
        options.sort = "created desc, name";
    }
    return function (dispatch: any, getState: any) {
        dispatch(loadNotificationsItems(options));
        dispatch(loadNotificationsCount(options));
    };
}

export function loadNotificationsItems(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState());
        dispatch(baseCreateAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "loading", true, options));
        loadEntitiesDataRequest(dispatch, NOTIFICATIONS_STATE_CHANGE_ACTION, service, options);
    };
}

export function loadNotificationsCount(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState());
        // options.count = true;
        options = { ...options, count: true, pageSize: 0 };
        options.filters = [...options.filters];
        // 只显示未读数量
        options.filters.push([['is_read', '=', null], 'or', ['is_read', '=', false]]);
        dispatch(baseCreateAction(NOTIFICATIONS_COUNT_CHANGE_ACTION, "countLoading", true, options));
        loadEntitiesDataRequest(dispatch, NOTIFICATIONS_COUNT_CHANGE_ACTION, service, options);
    };
}

export function loadNotificationsDataInterval(options: any) {
    return function (dispatch: any, getState: any) {
        let interval = options.interval ? options.interval : 5 * 60;
        let intervalCount = 1;
        let entityState = viewStateSelector(getState(), options.id);
        if(entityState && entityState.intervalId){
            intervalCount = entityState.intervalCount + 1;
            clearTimeout(entityState.intervalId);
        }
        const intervalId = setTimeout(()=>{
            dispatch(loadNotificationsDataInterval(options));
        }, interval * 1000);
        const intervalTime = new Date();
        dispatch(baseCreateAction(NOTIFICATIONS_INTERVAL_CHANGE_ACTION, 'startInterval', {intervalId, intervalCount, intervalTime}, options));
        if(entityState && entityState.loading){
            // 如果当前正在请求数据，说明网络可能有问题或者options.interval值太小执行间隔太短不执行请求。
            return;
        }
        dispatch(loadNotificationsData(options));
    };
}

export function clearNotificationsInterval(options: any) {
    return function (dispatch: any, getState: any) {
        let entityState = viewStateSelector(getState(), options.id);
        if(entityState){
            clearTimeout(entityState.intervalId);
        }
        dispatch(baseCreateAction(NOTIFICATIONS_INTERVAL_CHANGE_ACTION, 'clearInterval', { intervalId: null, intervalCount: 0, intervalTime: null }, options));
    };
}

export function postNotificationsMethod(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState());
        dispatch(baseCreateAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "methodLoading", true, options));
        if(!options.url){
            options.url = `/api/v4/notifications/${options.methodRecordId}/${options.methodName}`;
        }
        return executeApiRequest(dispatch, NOTIFICATIONS_STATE_CHANGE_ACTION, service, options).then(
            (sauce) => {
                let entityState = viewStateSelector(getState(), options.id);
                let partialStateName = sauce.payload.partialStateName;
                let partialStateValue = sauce.payload.partialStateValue;
                if(partialStateName === "executeApiSauce" && partialStateValue.success){
                    if(options.methodName === "markReadAll"){
                        // 如果全部标记为已读成功，则自动设置store中所有通知记录为已读状态
                        let records = [...entityState.rows];
                        records = records.map((item) => {
                            let re = {...item};
                            re.is_read = true;
                            return re;
                        });
                        dispatch(baseCreateAction(NOTIFICATIONS_STATE_CHANGE_ACTION, options.methodName, { records }, options));
                    }
                }
                else if(partialStateName === "executeApiError" || !partialStateValue.success){
                    dispatch(baseCreateAction(NOTIFICATIONS_STATE_CHANGE_ACTION, "executeApiError", partialStateValue, options));
                } 
            }
        );
    };
}