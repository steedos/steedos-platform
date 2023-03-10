
import { GeneralTypes } from "../action_types";

const settings = (state = {}, action) => {
    switch (action.type) {
        case GeneralTypes.RECEIVED_SETTINGS:
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}

export default settings