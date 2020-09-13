import { loadEntitiesDataRequest } from '../records_request'
import { dataServicesSelector } from '../../selectors';
import { createAction as baseCreateAction } from '../base'
export var CATEGORIES_STATE_CHANGE_ACTION = 'CATEGORIES_STATE_CHANGE';

export const createCategoriesAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(CATEGORIES_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}

export function loadCategoriesEntitiesData(options: any = {}) {
    return function (dispatch: any, getState: any) {
        const service = dataServicesSelector(getState())
        return loadEntitiesDataRequest(dispatch, CATEGORIES_STATE_CHANGE_ACTION, service, options)
    };
}
