import {UserTypes} from '../../action_types/';
import { GenericAction } from '../../types/actions';
import { IDMappedObjects } from '../../types/utilities';
import { UserProfile } from '../../types/users';
import { combineReducers } from 'redux';

const currentUserId = (state = '', action: GenericAction) => {
    switch (action.type) {
        case UserTypes.RECEIVED_ME: {
            const data = action.data || action.payload;
            return data._id;
        }
        case UserTypes.RECEIVED_VALIDATE: {
            const data = action.data || action.payload;
            return data.userId;
        }

        case UserTypes.LOGIN: { // Used by the mobile app
            const {user} = action.data;

            return user ? user._id : state;
        }
        case UserTypes.LOGOUT_SUCCESS:
            return '';
    }

    return state;
}


const users = (state: IDMappedObjects<UserProfile> = {}, action: GenericAction) => {
    switch (action.type) {
        case UserTypes.RECEIVED_ME:
        case UserTypes.RECEIVED_PROFILE: {
            const data = action.data || action.payload;
            const user = { ...data };

            return {
                ...state,
                [data._id]: user,
            };
        }
        case UserTypes.RECEIVED_VALIDATE: {
            const data = action.data || action.payload;
            const user = { ...data };

            return {
                ...state,
                [data.userId]: user,
            };
        }
        case UserTypes.LOGIN: { // Used by the mobile app
            const { user } = action.data;

            if (user) {
                const nextState = { ...state };
                nextState[user._id] = user;
                return nextState;
            }

            return state;
        }
        case UserTypes.LOGOUT_SUCCESS:
            return {};
        case UserTypes.CHANGEPASSWORD_RECEIVED:{
            const data = action.data || action.payload;
            return {
                ...state,
                [data.userId]: Object.assign({}, state[data.userId], { password_expired: data.password_expired }),
            }
        }
        case UserTypes.VERIFYEMAIL_RECEIVED: {
            const data = action.data || action.payload;
            return {
                ...state,
                [data.userId]: Object.assign({}, state[data.userId], { email_verified: data.email_verified }),
            }
        }
        case UserTypes.VERIFYMOBILE_RECEIVED: {
            const data = action.data || action.payload;
            return {
                ...state,
                [data.userId]: Object.assign({}, state[data.userId], { mobile_verified: data.mobile_verified }),
            }
        }
        default:
            return state;
    }
}



export default combineReducers({
    currentUserId,
    users
})