import { DXGRID_STATE_CHANGE_ACTION } from '../../actions/views/dx_grid'

function transformEntityState(state: any, payload: any){
    return Object.assign({}, state, {rows: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount});
}

function reducer(state:any = {}, action: any){
    if (action.type === DXGRID_STATE_CHANGE_ACTION) {
        const payload = action.payload
        switch (payload.partialStateName) {
            case 'loadDataSauce':
                return transformEntityState(state, payload);
            default:
                break;
        }
        return Object.assign({}, state, {[payload.partialStateName]: payload.partialStateValue});
    }
    return state;
}

export default reducer