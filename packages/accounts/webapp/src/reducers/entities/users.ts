import {UserTypes} from '../../action_types/';
import { GenericAction } from '../../types/actions';
import { IDMappedObjects } from '../../types/utilities';
import { UserProfile } from '../../types/users';
import { combineReducers } from 'redux';

const currentUserId = (state = '', action: GenericAction) => {
    switch (action.type) {
        case UserTypes.RECEIVED_ME: {
            const data = action.data || action.payload;
            return data.id;
        }

        case UserTypes.LOGIN: { // Used by the mobile app
            const {user} = action.data;

            return user ? user.id : state;
        }
        case UserTypes.LOGOUT_SUCCESS:
            return '';
    }

    return state;
}


const profiles = (state: IDMappedObjects<UserProfile> = {}, action: GenericAction) => {
    switch (action.type) {
    case UserTypes.RECEIVED_ME:
    case UserTypes.RECEIVED_PROFILE: {
        const data = action.data || action.payload;
        const user = {...data};

        return {
            ...state,
            [data.id]: user,
        };
    }

    case UserTypes.LOGIN: { // Used by the mobile app
        const {user} = action.data;

        if (user) {
            const nextState = {...state};
            nextState[user.id] = user;
            return nextState;
        }

        return state;
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}



export default combineReducers({
    currentUserId,
    profiles
})