import { request } from '../datasource'
import { createAction } from './base'

export function executeApiRequest(dispatch: any, actionType: string, dataService: string, options: any) {
    return executeApi(dataService, options).then(
        (sauce) => dispatch(executeApiSauce(actionType, sauce, options)),
        (error) => dispatch(executeApiError(actionType, error, options)),
    );
}

export async function executeApi(dataService: string, options: any) {
    let { url, method } = options;
    return await request(dataService + url, {
        method: method ? method : "POST"
    });
}

function executeApiSauce(actionType: string, results: any, options: any) {
    return createAction(actionType, 'executeApiSauce', results, options);
}

function executeApiError(actionType: string, error: any, options: any) {
    return createAction(actionType, 'executeApiError', {error: error}, options);
}