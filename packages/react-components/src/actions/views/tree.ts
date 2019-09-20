import * as DataSource from '../../datasource'

export const TREE_STATE_CHANGE_ACTION = 'TREE_STATE_CHANGE';

export const createGridAction = (partialStateName: any, partialStateValue: any, objectName: string) => ({
    type: TREE_STATE_CHANGE_ACTION,
    partialStateName,
    partialStateValue,
    objectName
});


export function loadEntitiesData(options: any) {
    return function (dispatch: any) {
        return loadData(options).then(
            (sauce) => dispatch(loadDataSauce(sauce, options.objectName)),
            (error) => dispatch(loadDataError(error, options.objectName)),
        );
    };
}

async function loadData(options: any) {
    return await DataSource.query(options)
}

function loadDataSauce(results: any, objectName: string) {
    let records = results.value
    let totalCount = results["@odata.count"] || 0
    return createGridAction('loadDataSauce', {records, totalCount}, objectName)
}

function loadDataError(error: any, objectName: string) {
    return createGridAction('loadDataError', {error: error}, objectName)
}