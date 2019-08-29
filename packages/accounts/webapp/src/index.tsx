import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';
import { Provider } from 'react-redux'
import IntlProvider from './components/intl_provider';

import store from './stores/redux_store';

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider>
            <Router />
        </IntlProvider>
    </Provider>,
    document.getElementById('root') as HTMLElement);
