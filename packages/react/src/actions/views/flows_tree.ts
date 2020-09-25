import { dataServicesSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { createAction as baseCreateAction } from '../base'
export var FLOWSTREE_STATE_CHANGE_ACTION = 'FLOWSTREE_STATE_CHANGE';

export const createFlowsTreeAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(FLOWSTREE_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}

export function loadFlowsTreeEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        return loadEntitiesDataRequest(dispatch, FLOWSTREE_STATE_CHANGE_ACTION, service, options)
    };
}