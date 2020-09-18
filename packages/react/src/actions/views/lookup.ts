import { dataServicesSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { createAction as baseCreateAction } from '../base'
export var LOOKUP_STATE_CHANGE_ACTION = 'LOOKUP_STATE_CHANGE';

export const createLookupAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(LOOKUP_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}

export function loadLookupEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        return loadEntitiesDataRequest(dispatch, LOOKUP_STATE_CHANGE_ACTION, service, options)
    };
}