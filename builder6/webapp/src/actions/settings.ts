
import { Client4 } from "../client";
import { GeneralTypes } from "../action_types";
import {bindClientFunc, forceLogoutIfNecessary, FormattedError} from './helpers';
import {GetStateFunc, DispatchFunc, ActionFunc, batchActions} from '../types/actions';

export function loadSettings(): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let data;
        try {
            data = await Client4.getSettings();
        } catch (error: any) {
            forceLogoutIfNecessary(error, dispatch, getState);
            return {error};
        }

        Client4.setEnableLogging(data.EnableDeveloper === 'true');
        Client4.setDiagnosticId(data.DiagnosticId);

        Steedos.settings = {
            public: data.public
        };
        
        dispatch({
            type: GeneralTypes.RECEIVED_SETTINGS,
            data: data,
        });

        return {data};
    };
}