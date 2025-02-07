// @ts-nocheck

import 'react-app-polyfill/ie9';
import 'core-js/proposals/url';
import 'core-js/stable';
import { createRoot } from "react-dom/client";

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './root';
import { Provider } from 'react-redux'
import IntlProvider from './components/intl_provider';

import store from './stores/redux_store';

import './index.css'


const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
// React.StrictMode
root.render(
  <> 
    <Provider store={store}>
        <IntlProvider>
            <Router />
        </IntlProvider>
    </Provider>,
  </>
);
