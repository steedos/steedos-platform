import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { devToolsEnhancer } from 'redux-devtools-extension';

const initialStore = {
    settings: {
        title: "Steedos"
    }
}

const store = createStore(rootReducer, initialStore, devToolsEnhancer({}));

ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>,
    document.getElementById('root') as HTMLElement);
