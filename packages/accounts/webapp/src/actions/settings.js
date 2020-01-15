import { accountsRest } from '../accounts';

import { loadTenant } from './tenant';

export function loadSettings() {
    return (dispatch) => {

        accountsRest.fetch("settings").then((configs) => {
            dispatch({
                type:"RECEIVED_SETTINGS",
                data: configs,
            });
        }).catch((error) => {
            console.warn('Actions - loadSettings - recreived error: ', error)
        }); // eslint-disable-line no-empty-function
    }
}

