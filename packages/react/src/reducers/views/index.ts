import { combineReducers } from 'redux'
import { GRID_STATE_CHANGE_ACTION } from '../../actions/views/grid'
import { DXGRID_STATE_CHANGE_ACTION } from '../../actions/views/dx_grid'
import { TREE_STATE_CHANGE_ACTION } from '../../actions/views/tree'
import { ORGANIZATIONS_STATE_CHANGE_ACTION } from '../../actions/views/organizations'
import { CATEGORIES_STATE_CHANGE_ACTION } from '../../actions/views/categories'
import { FLOWSMODAL_STATE_CHANGE_ACTION } from '../../actions/views/flows_modal'
import { GRIDMODAL_STATE_CHANGE_ACTION } from '../../actions/views/grid_modal'
import { MODAL_STATE_CHANGE_ACTION } from '../../actions/views/modal'
import { VIEWS_STATE_CHANGE_ACTION } from '../../actions/views/views'
import { LOOKUP_STATE_CHANGE_ACTION } from '../../actions/views/lookup'
import { NOTIFICATIONS_STATE_CHANGE_ACTION, NOTIFICATIONS_INTERVAL_CHANGE_ACTION, NOTIFICATIONS_COUNT_CHANGE_ACTION} from '../../actions/views/notifications'
import { FAVORITES_STATE_CHANGE_ACTION } from '../../actions/views/favorites';
import TreeReducer from './tree'
import DXGridReducer from './dx_grid'
import GridReducer from './grid'
import OrgReducer from './organizations'
import produce from "immer"
import NotificationsReducer from './notifications'
import FavoritesReducer from './favorites'
import CategoriesReducer from './categories'
import FlowsModalReducer from './flows_modal'
import GridModalReducer from './grid_modal'
import LookupReducer from './lookup'
import ModalReducer from './modal'

function changeState(id, draft: any, newState: any) {
    return draft[id] = newState
}

function getState(state, id) {
    return state ? state[id] : { id: id }
}

const byId = produce((draft = {}, action) => {
    let id, viewState
    if (action.payload) {
        id = action.payload.id
        viewState = getState(draft, id)
    }
    switch (action.type) {
        case DXGRID_STATE_CHANGE_ACTION:
            changeState(id, draft, DXGridReducer(viewState, action))
            break;
        case GRID_STATE_CHANGE_ACTION:
            changeState(id, draft, GridReducer(viewState, action))
            break;
        case TREE_STATE_CHANGE_ACTION:
            changeState(id, draft, TreeReducer(viewState, action))
            break;
        case ORGANIZATIONS_STATE_CHANGE_ACTION:
            changeState(id, draft, OrgReducer(viewState, action))
            break;
        case NOTIFICATIONS_STATE_CHANGE_ACTION:
            changeState(id, draft, NotificationsReducer(viewState, action))
            break;
        case NOTIFICATIONS_COUNT_CHANGE_ACTION:
            changeState(id, draft, NotificationsReducer(viewState, action))
            break;
        case NOTIFICATIONS_INTERVAL_CHANGE_ACTION:
            changeState(id, draft, NotificationsReducer(viewState, action))
            break;
        case FAVORITES_STATE_CHANGE_ACTION:
            changeState(id, draft, FavoritesReducer(viewState, action))
            break;
        case CATEGORIES_STATE_CHANGE_ACTION:
            changeState(id, draft, CategoriesReducer(viewState, action))
            break;
        case FLOWSMODAL_STATE_CHANGE_ACTION:
            changeState(id, draft, FlowsModalReducer(viewState, action))
            break;
        case GRIDMODAL_STATE_CHANGE_ACTION:
            changeState(id, draft, GridModalReducer(viewState, action))
            break;
        case LOOKUP_STATE_CHANGE_ACTION:
            changeState(id, draft, LookupReducer(viewState, action));
            break;
        case MODAL_STATE_CHANGE_ACTION:
            changeState(id, draft, ModalReducer(viewState, action));
            break;
        case VIEWS_STATE_CHANGE_ACTION:
            changeState(id, draft, {});
            break;
    }
    return draft;
});

export default combineReducers({
    byId
});