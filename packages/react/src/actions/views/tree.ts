import { loadEntitiesDataRequest } from '../records_request'
import { dataServicesSelector } from '../../selectors';
import { createAction as baseCreateAction } from '../base'
export var TREE_STATE_CHANGE_ACTION = 'TREE_STATE_CHANGE';

export const createTreeAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(TREE_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}


export function loadTreeEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        return loadEntitiesDataRequest(dispatch, TREE_STATE_CHANGE_ACTION, service, options)
    };
}
