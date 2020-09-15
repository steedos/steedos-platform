import { dataServicesSelector } from '../../selectors';
import { loadBootstrapDataRequest } from '../bootstrap_request'
import { createAction as baseCreateAction } from '../base'
export var BOOTSTRAP_STATE_CHANGE_ACTION = 'BOOTSTRAP_STATE_CHANGE';

export function createBootstrapAction(partialStateName: any, partialStateValue: any) {
    return baseCreateAction(BOOTSTRAP_STATE_CHANGE_ACTION, partialStateName, partialStateValue, {})
} 

export function loadBootstrapEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        return loadBootstrapDataRequest(dispatch, BOOTSTRAP_STATE_CHANGE_ACTION, service, options)
    };
}