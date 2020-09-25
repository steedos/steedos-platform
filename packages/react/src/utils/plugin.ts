import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import PropTypes from 'prop-types';
import * as ReactDesignSystem from '@steedos/design-system-react';
import styled from 'styled-components';
import * as ReduxThunk from 'redux-thunk';
import * as Immer from 'immer';
import * as TSODataClient from 'ts-odata-client';
import * as NodeFetch from 'node-fetch';
import * as SteedosFilters from '@steedos/filters';

import * as ReactSteedos from '../export';
import store from "../stores/configureStore";
import { receivePluginInstance, receivePluginComponent } from '../actions';
import { ObjectHomeIFrame, generateIFrame } from "../components/object_home_iframe";
const _ = require('underscore')

/**
* Register a plugin to window
*/
export const registerPlugin = ( pluginName, pluginInstance ) => {
    // 保存到 store 中。
    // 调用 pluginInstance.initialize() 函数
    store.dispatch(receivePluginInstance(pluginName, pluginInstance))
    const registry = new PluginRegistry(pluginName);
    pluginInstance.initialize(registry, store);
}


export const registerWindowLibraries = () => {
    window["React"] = React;
    window["PropTypes"] = PropTypes;
    window["ReactDom"] = ReactDom;
    window["Redux"] = Redux;
    window["ReactRedux"] = ReactRedux;
    window["ReactDesignSystem"] = ReactDesignSystem;
    window["ReactSteedos"] = ReactSteedos;
    window["StyledComponents"] = styled;
    window["ReduxThunk"] = ReduxThunk;
    window["Immer"] = Immer;
    window["TSODataClient"] = TSODataClient;
    window["NodeFetch"] = NodeFetch;
    window["SteedosFilters"] = SteedosFilters;
    
    window["registerPlugin"] = registerPlugin;
}

function dispatchPluginComponentAction(name: string, pluginId: string, component: any, id: string = "") {
    if(!id){
        id = generateId();
    }
    store.dispatch(receivePluginComponent(name, {
        id,
        pluginId,
        component
    }))

    return id;
}

export function generateId() {
    // implementation taken from http://stackoverflow.com/a/2117523
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    id = id.replace(/[xy]/g, (c) => {
        var r = Math.floor(Math.random() * 16);

        var v;
        if (c === 'x') {
            v = r;
        } else {
            v = (r & 0x3) | 0x8;
        }

        return v.toString(16);
    });

    return id;
}
export class PluginRegistry {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    /**
    * Register a component that show a dashboard to the object home
    */
    registerObjectHomeComponent = ( objectName: string, componentClass: any ) => {
        // 保存到 store 中。
        dispatchPluginComponentAction("ObjectHome", this.id, componentClass, objectName)
    }

    /**
    * Register a component that show a iframe as the dashboard to the object home
    */
    registerObjectIFrameHomeComponent = ( objectName: string, url: string|Function, componentClass?: any ) => {
        if(componentClass){
            componentClass = generateIFrame(url)(componentClass);
        }
        else{
            componentClass = generateIFrame(url)(ObjectHomeIFrame);
        }
        // 保存到 store 中。
        dispatchPluginComponentAction("ObjectHome", this.id, componentClass, objectName)
    }

    /**
    * Register a component that show a dashboard to the app
    */
   registerDashboardComponent = ( appNames: string|string[], componentClass: any ) => {
        // 保存到 store 中。
        if(!_.isArray(appNames)){
            appNames = (<string>appNames).split(",");
        }
        (<string[]>appNames).forEach((item)=>{
            dispatchPluginComponentAction("Dashboard", this.id, componentClass, item)
        });
    }

    /**
    * Register a component that show a iframe as the dashboard to the app
    */
   registerDashboardIFrameComponent = ( appNames: string|string[], url: string|Function, componentClass?: any ) => {
        if(componentClass){
            componentClass = generateIFrame(url)(componentClass);
        }
        else{
            componentClass = generateIFrame(url)(ObjectHomeIFrame);
        }
        // 保存到 store 中。
        if(!_.isArray(appNames)){
            appNames = (<string>appNames).split(",");
        }
        (<string[]>appNames).forEach((item)=>{
            dispatchPluginComponentAction("Dashboard", this.id, componentClass, item)
        });
    }

    /**
    * Register a component that show a dashboard
    */
    registerNotificationsComponent = ( name: string, componentClass: any ) => {
        // 保存到 store 中。
        dispatchPluginComponentAction("Notifications", this.id, componentClass, name)
    }

}
