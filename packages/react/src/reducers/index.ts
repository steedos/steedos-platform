import { combineReducers } from 'redux'
import entitiesReducer from './entities'
import settingsReducer from './settings'
import viewsReducer from './views'
import pluginReducer from './plugins'
import requests from './requests';
import {TREE_STATE_CHANGE_ACTION} from '../actions/views/tree'

const combinedReducer = combineReducers({
    entities: entitiesReducer,
    settings: settingsReducer,
    views: viewsReducer,
    plugins: pluginReducer,
    requests
})

// function updateState(oldState: any, newState: any){
//     return Object.assign({}, oldState, newState)
// }

function crossSliceReducer(state: any, action: any) {
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        switch (action.partialStateName) {
            default:
                return state
        }
    }
    else{
        return state;
    }
}

export function rootReducer(state: any, action: any) {
    const intermediateState = combinedReducer(state, action)
    const finalState = crossSliceReducer(intermediateState, action)
    return finalState
}