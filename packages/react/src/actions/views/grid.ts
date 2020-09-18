import { dataServicesSelector, viewStateSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { createAction as baseCreateAction } from '../base'
export var GRID_STATE_CHANGE_ACTION = 'GRID_STATE_CHANGE';
export function createGridAction(partialStateName: any, partialStateValue: any, options: any) {
    if(["currentPage", "pageSize", "filters", "search"].includes(partialStateName)){
        return function(dispatch: any, getState: any){
            let entityState = viewStateSelector(getState(), options.id);
            const service = dataServicesSelector(getState())
            let newOptions: any = Object.assign({}, options, entityState, {[partialStateName]: partialStateValue})
            if(["filters", "search"].includes(partialStateName)){
                newOptions = Object.assign({}, newOptions, {"currentPage": 0});
            }
            dispatch(createGridAction("loading", true, options));
            loadEntitiesDataRequest(dispatch, GRID_STATE_CHANGE_ACTION, service, newOptions)
            dispatch(baseCreateAction(GRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options))
        }
    }else{
        return baseCreateAction(GRID_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options)
    }
} 

export function loadGridEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        dispatch(createGridAction("loading", true, options));
        return loadEntitiesDataRequest(dispatch, GRID_STATE_CHANGE_ACTION, service, options)
    };
}