import { createAction as baseCreateAction } from '../base'
export var MODAL_STATE_CHANGE_ACTION = 'MODAL_STATE_CHANGE';

export const createModalAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(MODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}