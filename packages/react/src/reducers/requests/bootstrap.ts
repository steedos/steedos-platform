import { combineReducers } from 'redux'
import { RequestStatusType, GenericActionType } from '../../types'
import { initialRequestState, handleRequest } from './helpers'
import { BOOTSTRAP_STATE_CHANGE_ACTION } from '../../actions/views/bootstrap';
import { BootstrapTypes } from '../../action_types'

function getBootStrap(state: RequestStatusType = initialRequestState(), action: GenericActionType){
    if(action.type === BOOTSTRAP_STATE_CHANGE_ACTION){
        const payload = action.payload
        const partialStateValue = payload.partialStateValue
        const error = partialStateValue.error ? partialStateValue.error.toString() : ''
        const newState = handleRequest(BootstrapTypes.GET_BOOTSTRAP_REQUEST, BootstrapTypes.GET_BOOTSTRAP_SUCCESS, BootstrapTypes.GET_BOOTSTRAP_FAILURE, state, {type: payload.partialStateName, error: error, data: partialStateValue})
        return newState;
    }
    return state;
}

export default combineReducers({
    getBootStrap
});