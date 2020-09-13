import { GRID_STATE_CHANGE_ACTION } from '../../actions/views/grid'

function reducer(state:any = {}, action: any){
    if (action.type === GRID_STATE_CHANGE_ACTION) {
        const payload = action.payload
        // switch (action.partialStateName) {
        //     case 'loadDataSauce':
        //         return transformEntityState(state, action);
        //     default:
        //         break;
        // }
        return Object.assign({}, state, {[payload.partialStateName]: payload.partialStateValue});
    }
    return state;
}

export default reducer