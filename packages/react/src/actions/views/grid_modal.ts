import { createAction as baseCreateAction } from '../base'
export var GRIDMODAL_STATE_CHANGE_ACTION = 'GRIDMODAL_STATE_CHANGE';

export const createGridModalAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(GRIDMODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}