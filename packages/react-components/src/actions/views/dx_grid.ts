import * as DataSource from '../../datasource'
import { getEntityState } from '../../states/entitys';

export const DXGRID_STATE_CHANGE_ACTION = 'DXGRID_STATE_CHANGE';

export function createGridAction(partialStateName: any, partialStateValue: any, objectName: string) {
    if(["currentPage", "pageSize", "filters"].includes(partialStateName)){
        return function(dispatch: any, getState: any){
            let entityState = getEntityState(getState(), objectName);
            let options: any = Object.assign({}, entityState, {[partialStateName]: partialStateValue})
            loadData(options).then(
                (sauce) => dispatch(loadDataSauce(sauce, options.objectName)),
                (error) => dispatch(loadDataError(error, options.objectName)),
            );
            dispatch({
                type: DXGRID_STATE_CHANGE_ACTION,
                partialStateName,
                partialStateValue,
                objectName
            })
        }
    }else{
        return {
            type: DXGRID_STATE_CHANGE_ACTION,
            partialStateName,
            partialStateValue,
            objectName
        }
    }
} 

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