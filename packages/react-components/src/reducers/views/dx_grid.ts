import { DXGRID_STATE_CHANGE_ACTION } from '../../actions/views/dx_grid'

function transformEntityState(state: any, action: any){
    return Object.assign({}, state, {rows: action.partialStateValue.records, totalCount: action.partialStateValue.totalCount});
}

function reducer(state:any = {}, action: any){
    if (action.type === DXGRID_STATE_CHANGE_ACTION) {
        switch (action.partialStateName) {
            case 'loadDataSauce':
                return transformEntityState(state, action);
            default:
                break;
        }
        return Object.assign({}, state, {[action.partialStateName]: action.partialStateValue});
    }
    return state;
}

export default reducer