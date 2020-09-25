import { request } from '../datasource'
import { createAction } from './base'
import { getSpaceId } from '../utils'
import { BootstrapTypes } from '../action_types'

export function loadBootstrapDataRequest(dispatch: any, actionType: string, dataService: string, options: any) {
    dispatch(createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_REQUEST, {}, {}))
    return loadBootstrapData(dataService, options).then(
        (sauce) => dispatch(loadBootstrapDataSauce(actionType, sauce, options)),
        (error) => dispatch(loadDataError(actionType, error, options)),
    );
}

export async function loadBootstrapData(dataService: string, options: any) {
    let spaceId = options.spaceId || getSpaceId();
    let url = `${dataService}/api/bootstrap/${spaceId}`;
    return await request(url);
}

function loadBootstrapDataSauce(actionType: string, results: any, options: any) {
    return createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_SUCCESS , results, {objectName: 'bootstrap'})
}

function loadDataError(actionType: string, error: any, options: any) {
    return createAction(actionType, BootstrapTypes.GET_BOOTSTRAP_FAILURE, {error: error}, options)
}