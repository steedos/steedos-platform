import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

const initialStore = {
    entities: {}
}

function configureStore(rootReducer, initialStore) {
    return createStore(
        rootReducer,
        initialStore,
        applyMiddleware(thunkMiddleware)
    )
}

const store = configureStore(rootReducer, initialStore);

export default store;