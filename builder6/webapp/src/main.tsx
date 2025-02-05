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


import { Builder, builder, BuilderComponent } from '@builder6/react';

(window as any)['Builder'] = Builder;

Builder.settings.context = {
  rootUrl: import.meta.env.VITE_B6_ROOT_URL,
  userId: localStorage.getItem('steedos:userId'),
  tenantId: localStorage.getItem('steedos:spaceId'),
  authToken: localStorage.getItem('steedos:token'),
};
Builder.settings.unpkgUrl = 'https://unpkg.steedos.cn';
Builder.settings.assetUrls = ['https://unpkg.steedos.cn/@steedos-widgets/amis-object@v6.3.12-beta.6/dist/assets.json'];

(window as any)['builder'] = builder;


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
