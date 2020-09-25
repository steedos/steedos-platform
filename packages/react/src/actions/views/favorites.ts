import { dataServicesSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { createAction as baseCreateAction } from '../base'
import { FavoritesTypes } from '../../action_types'
export var FAVORITES_STATE_CHANGE_ACTION = 'FAVORITES_STATE_CHANGE';

export function loadFavoritesEntitiesData(options: any) {
    return function (dispatch: any, getState: any) {
        dispatch(baseCreateAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.GET_FAVORITES_REQUEST, {}, {}))
        const service = dataServicesSelector(getState())
        return loadEntitiesDataRequest(dispatch, FAVORITES_STATE_CHANGE_ACTION, service, Object.assign({RequestStatus: {
            SUCCESS: FavoritesTypes.GET_FAVORITES_SUCCESS,
            FAILURE: FavoritesTypes.GET_FAVORITES_FAILURE
        }}, options))
    };
}

export function changeActionSelected(actionSelected: boolean, id: string){
    return function(dispatch: any, getState: any){
        dispatch(baseCreateAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ACTIONSELECTED, {actionSelected}, {id}))
    }
}

export function changeActionDisabled(actionDisabled: boolean, id: string){
    return function(dispatch: any, getState: any){
        dispatch(baseCreateAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ACTIONDISABLED, {actionDisabled}, {id}))
    }
}

export function changeRecords(records: any, id: string){
    return function(dispatch: any, getState: any){
        dispatch(baseCreateAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_RECORDS, {records}, {id}))
    }
}

export function changeAssistiveText(assistiveText: any, id: string){
    return function(dispatch: any, getState: any){
        dispatch(baseCreateAction(FAVORITES_STATE_CHANGE_ACTION, FavoritesTypes.CHANGE_FAVORITES_ASSISTIVETEXT, {assistiveText}, {id}))
    }
}