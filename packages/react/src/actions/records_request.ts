import { query } from '../datasource'
import { createAction } from './base'
const _ = require('underscore')

export function loadEntitiesDataRequest(dispatch: any, actionType: string, dataService: string, options: any) {
    return loadData(dataService, options).then(
        (sauce) => dispatch(loadDataSauce(actionType, sauce, options)),
        (error) => dispatch(loadDataError(actionType, error, options)),
    );
}

async function loadData(dataService: string, options: any) {
    return await query(dataService, options)
}

function loadDataSauce(actionType: string, results: any, options: any) {
    let records = results.value
    let totalCount = results["@odata.count"] || 0
    records = records.map((item: any)=>{
        item.id = item._id
        return item
    })

    let partialStateName = 'loadDataSauce';

    if(!_.isEmpty(options.RequestStatus) && options.RequestStatus.SUCCESS){
        partialStateName = options.RequestStatus.SUCCESS
    }

    return createAction(actionType, partialStateName, {records, totalCount}, options)
}

function loadDataError(actionType: string, error: any, options: any) {
    let partialStateName = 'loadDataError';

    if(!_.isEmpty(options.RequestStatus) && options.RequestStatus.FAILURE){
        partialStateName = options.RequestStatus.FAILURE
    }
    return createAction(actionType, partialStateName, {error: error}, options)
}