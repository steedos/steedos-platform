
import { DXGRID_STATE_CHANGE_ACTION } from '../actions/views/dx_grid'
import { TREE_STATE_CHANGE_ACTION } from '../actions/views/tree'
import TreeReducer from './views/tree'
import DXGridReducer from './views/dx_grid'

function updateState(oldState: any, newState: any){
    return Object.assign({}, oldState, newState)
}

function reducer(state: any = {}, action: any){
    const objectName = action.objectName;
    switch (action.type) {
        case DXGRID_STATE_CHANGE_ACTION:
            return updateState(state, {[objectName]: DXGridReducer(state[objectName], action)})
        case TREE_STATE_CHANGE_ACTION:
            return updateState(state, {[objectName]: TreeReducer(state[objectName], action)})
        default:
            break;
    }
    return state;
};

export default reducer;