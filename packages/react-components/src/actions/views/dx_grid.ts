import states from '../../states';
import { loadEntitiesDataRequest } from '../data_request'

export const DXGRID_STATE_CHANGE_ACTION = 'DXGRID_STATE_CHANGE';

export function createGridAction(partialStateName: any, partialStateValue: any, objectName: string) {
    if(["currentPage", "pageSize", "filters"].includes(partialStateName)){
        return function(dispatch: any, getState: any){
            let entityState = states.getEntityState(getState(), objectName);
            const service = states.getDataServices(getState())
            let options: any = Object.assign({}, entityState, {[partialStateName]: partialStateValue})
            loadEntitiesDataRequest(dispatch, DXGRID_STATE_CHANGE_ACTION, service, options)
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
    return function (dispatch: any, getState: any) {
        const service = states.getDataServices(getState())
        return loadEntitiesDataRequest(dispatch, DXGRID_STATE_CHANGE_ACTION, service, options)
    };
}