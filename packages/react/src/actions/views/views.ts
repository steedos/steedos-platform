import { dataServicesSelector } from '../../selectors';
import { loadEntitiesDataRequest } from '../records_request'
import { createAction as baseCreateAction } from '../base'
export var VIEWS_STATE_CHANGE_ACTION = 'VIEWS_STATE_CHANGE';

export const removeViewAction = (viewId) => {
    return baseCreateAction(VIEWS_STATE_CHANGE_ACTION, 'removeView', {}, {id: viewId});
}