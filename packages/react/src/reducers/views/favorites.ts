import { FAVORITES_STATE_CHANGE_ACTION } from '../../actions/views/favorites';
import { FavoritesTypes } from '../../action_types'

function transformEntityState(state: any, payload: any){
    return Object.assign({}, state, { records: payload.partialStateValue.records, totalCount: payload.partialStateValue.totalCount });
}

function changeActionSelected(state: any, payload: any){
    return Object.assign({}, state, { actionSelected: payload.partialStateValue.actionSelected });
}

function changeActionDisabled(state: any, payload: any){
    return Object.assign({}, state, { actionDisabled: payload.partialStateValue.actionDisabled });
}

function changeRecords(state: any, payload: any){
    return Object.assign({}, state, { records: payload.partialStateValue.records, totalCount: payload.partialStateValue.records.length });
}

function changeAssistiveText(state: any, payload: any){
    return Object.assign({}, state, { assistiveText: payload.partialStateValue.assistiveText});
}


function reducer(state:any = {}, action: any){
    if (action.type === FAVORITES_STATE_CHANGE_ACTION) {
        const payload = action.payload
        switch (payload.partialStateName) {
            case FavoritesTypes.GET_FAVORITES_SUCCESS:
                return transformEntityState(state, payload);
            case FavoritesTypes.CHANGE_FAVORITES_ACTIONSELECTED:
                return changeActionSelected(state, payload)
            case FavoritesTypes.CHANGE_FAVORITES_ACTIONDISABLED:
                return changeActionDisabled(state, payload)
            case FavoritesTypes.CHANGE_FAVORITES_RECORDS:
                return changeRecords(state, payload)
            case FavoritesTypes.CHANGE_FAVORITES_ASSISTIVETEXT:
                return changeAssistiveText(state, payload);
            default:
                break;
        }
        return state;
    }
    return state;
}

export default reducer