import { NOTIFICATIONS_STATE_CHANGE_ACTION, NOTIFICATIONS_INTERVAL_CHANGE_ACTION, NOTIFICATIONS_COUNT_CHANGE_ACTION } from '../../actions/views/notifications'

function transformEntityState(state: any, payload: any, options: any){
    return Object.assign({}, state, { rows: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount }, options);
}

function transformEntityStateForCount(state: any, payload: any, options: any){
    return Object.assign({}, state, { unreadCount: payload.partialStateValue.totalCount }, options);
}
function transformEntityStateForMark(state: any, payload: any, options: any){
    return Object.assign({}, state, { rows: payload.partialStateValue.records, unreadCount: 0 }, options);
}

function reducer(state:any = {}, action: any){
    const payload = action.payload;
    const defaultPayLoad = {[payload.partialStateName]: payload.partialStateValue};
    if (action.type === NOTIFICATIONS_STATE_CHANGE_ACTION) {
        switch (payload.partialStateName) {
            case 'loadDataSauce':
                return transformEntityState(state, payload, {loading: false, itemsLoaded: true});
            case 'loadDataError':
                return Object.assign({}, state, defaultPayLoad, {loading: false});
            case 'executeApiSauce':
                return Object.assign({}, state, defaultPayLoad, {methodLoading: false});
            case 'executeApiError':
                return Object.assign({}, state, defaultPayLoad, {methodLoading: false});
            case 'markReadAll':
                return transformEntityStateForMark(state, payload, {});
            default:
                break;
        }
        return Object.assign({}, state, defaultPayLoad);
    }
    else if (action.type === NOTIFICATIONS_COUNT_CHANGE_ACTION) {
        switch (payload.partialStateName) {
            case 'loadDataSauce':
                return transformEntityStateForCount(state, payload, {countLoading: false});
            case 'loadDataError':
                return Object.assign({}, state, defaultPayLoad, {countLoading: false});
            default:
                break;
        }
        return Object.assign({}, state, defaultPayLoad);
    }
    else if (action.type === NOTIFICATIONS_INTERVAL_CHANGE_ACTION) {
        return Object.assign({}, state, { 
            intervalId: payload.partialStateValue.intervalId, 
            intervalCount: payload.partialStateValue.intervalCount, 
            intervalTime: payload.partialStateValue.intervalTime
        });
    }
    return state;
}

export default reducer;