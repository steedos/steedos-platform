// import { GRID_STATE_CHANGE_ACTION } from '../../actions/views/grid'

function transformEntityState(state: any, payload: any){
    return Object.assign({}, state, { ...payload.partialStateValue });
}

function reducer(state:any = {}, action: any){
    return state;
}

export default reducer