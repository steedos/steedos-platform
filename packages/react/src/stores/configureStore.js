import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension';
import 'moment/locale/zh-cn';

const composeEnhancers = composeWithDevTools({ realtime: true});

let steedosService = process.env.REACT_APP_API_BASE_URL;
if(window && window.Meteor){
    steedosService = window.Steedos.absoluteUrl('', true);
}
if (steedosService){
    // 去掉url中的最后一个斜杠
    steedosService = steedosService.replace(/\/$/, "");
}

const initialStore = {
    settings: {
        services: {
            steedos: steedosService
        }
    }
}

const store = createStore(
        rootReducer,
        Object.assign({}, initialStore),
        composeEnhancers(applyMiddleware(thunkMiddleware)),
    );

export function bindActionToRedux(action, ...args) {
    return async () => {
        await action(...args)(store.dispatch, store.getState);
    };
}

// if (process.env.NODE_ENV !== 'production') { //eslint-disable-line no-process-env
    window.store = store;
// }

export default store;
