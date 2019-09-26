import * as DataSource from '../datasource'

export function loadEntitiesDataRequest(dispatch: any, actionType: string, dataService: string, options: any) {
    return loadData(dataService, options).then(
        (sauce) => dispatch(loadDataSauce(actionType, sauce, options.objectName)),
        (error) => dispatch(loadDataError(actionType, error, options.objectName)),
    );
}

async function loadData(dataService: string, options: any) {
    return await DataSource.query(dataService, options)
}

function loadDataSauce(actionType: string, results: any, objectName: string) {
    let records = results.value
    let totalCount = results["@odata.count"] || 0
    return createGridAction(actionType, 'loadDataSauce', {records, totalCount}, objectName)
}

function loadDataError(actionType: string, error: any, objectName: string) {
    return createGridAction(actionType, 'loadDataError', {error: error}, objectName)
}

export function createGridAction(actionType: string, partialStateName: any, partialStateValue: any, objectName: string) {
    return {
        type: actionType,
        partialStateName,
        partialStateValue,
        objectName
    }
}