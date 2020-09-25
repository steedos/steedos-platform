import _ from 'underscore';
import { RequestStatusOption } from '../constants'

export function creatorAppsSelector(state: any) {
    let apps = state.entities ? state.entities.apps : {};
    let assigned_apps = state.entities ? state.entities.assigned_apps : [];
    let adminApp: any, sortedApps: any;

    _.each(apps, function (app: any, key: string) {
        if (!app._id) {
            app._id = key;
        }
        if (app.is_creator) {
            // 不需要isSpaceAdmin逻辑
            // if (isSpaceAdmin) {
            //     app.visible = true;
            // }
        } else {
            // 非creator应该一律不显示
            app.visible = false;
        }
    });

    sortedApps = _.sortBy(_.values(apps), 'sort');

    let creatorApps: any = {};

    adminApp = {};
    // 按钮sort排序次序设置Creator.Apps值
    _.each(sortedApps, function (n: any) {
        if (n._id === "admin") {
            return adminApp = n;
        } else {
            return creatorApps[n._id] = n;
        }
    });

    // admin菜单显示在最后
    creatorApps.admin = adminApp;

    if (assigned_apps.length) {
        _.each(creatorApps, function (app: any, key: string) {
            if (assigned_apps.indexOf(key) > -1) {
                app.visible = app.is_creator;
            } else {
                app.visible = false;
            }
        });
    }
    return creatorApps;
}

export function visibleAppsSelector(state: any, includeAdmin: boolean = true){
    let creatorApps = creatorAppsSelector(state);
    var apps: any = [];
    _.each(creatorApps, function (v: any, k: string) {
        if ((v.visible !== false && v._id !== "admin") || (includeAdmin && v._id === "admin")) {
            apps.push(v);
        }
    });
    return apps;
}

export function isRequestStarted(state: any){
    return state.requests.bootStrap.getBootStrap.status === RequestStatusOption.STARTED
}

export function isRequestSuccess(state: any){
    return state.requests.bootStrap.getBootStrap.status === RequestStatusOption.SUCCESS
}

export function isRequestFailure(state: any){
    return state.requests.bootStrap.getBootStrap.status === RequestStatusOption.FAILURE
}

export function getRequestStatus(state: any){
    return state.requests.bootStrap.getBootStrap.status
}

export function getRequestError(state: any){
    return state.requests.bootStrap.getBootStrap.error
}

export function getBootstrapData(state: any){
    return state.entities
}