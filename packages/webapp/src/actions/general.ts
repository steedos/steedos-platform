import { Client4 } from "../client";
import { loadMe } from "./users";
import { GeneralState } from "../types/general";
import { GeneralTypes } from "../action_types";
import {bindClientFunc, forceLogoutIfNecessary, FormattedError} from './helpers';

import {GetStateFunc, DispatchFunc, ActionFunc, batchActions} from '../types/actions';


export function setDeviceToken(token: GeneralState['deviceToken']): ActionFunc {
    return async (dispatch: DispatchFunc) => {
        dispatch({type: GeneralTypes.RECEIVED_APP_DEVICE_TOKEN, data: token});

        return {data: true};
    };
}

// export function setStoreFromLocalData(data: { token: string; url: string }): ActionFunc {
//     return async (dispatch: DispatchFunc, getState) => {
//         Client4.setToken(data.token);
//         Client4.setUrl(data.url);

//         return loadMe()(dispatch, getState);
//     };
// }


export function setUrl(url: string) {
    Client4.setUrl(url);
    return true;
}
