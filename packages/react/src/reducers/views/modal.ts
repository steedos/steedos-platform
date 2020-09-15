import { MODAL_STATE_CHANGE_ACTION } from '../../actions/views/modal'
import _ from 'underscore'

function reducer(state: any = {}, action: any) {
    if (action.type === MODAL_STATE_CHANGE_ACTION) {
        const payload = action.payload
        return Object.assign({}, state, { [payload.partialStateName]: payload.partialStateValue });
    }
    return state;
};

export default reducer