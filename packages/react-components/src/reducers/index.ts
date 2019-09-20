import { combineReducers } from 'redux'

import entitiesReducer from './entities'
import {TREE_STATE_CHANGE_ACTION} from '../actions/views/tree'
import selectUsersReducre from './views/select_users'

const combinedReducer = combineReducers({
    entities: entitiesReducer
})

function crossSliceReducer(state: any, action: any) {
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        switch (action.partialStateName) {
            case 'onClick': {
                return selectUsersReducre(state, action)
            }
            default:
                return state
        }
    }else{
        return state;
    }
}

function rootReducer(state: any, action: any) {
    const intermediateState = combinedReducer(state, action)
    const finalState = crossSliceReducer(intermediateState, action)
    return finalState
}

export default rootReducer