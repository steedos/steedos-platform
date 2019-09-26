import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

const initialStore = {
    entities: {}
}

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        Object.assign({}, initialStore, preloadedState),
        applyMiddleware(thunkMiddleware)
    )
}