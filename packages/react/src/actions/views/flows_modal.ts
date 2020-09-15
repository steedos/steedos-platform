import { createAction as baseCreateAction } from '../base'
export var FLOWSMODAL_STATE_CHANGE_ACTION = 'FLOWSMODAL_STATE_CHANGE';

export const createFlowsModalAction = (partialStateName: any, partialStateValue: any, options: any) => {
    return baseCreateAction(FLOWSMODAL_STATE_CHANGE_ACTION, partialStateName, partialStateValue, options);
}