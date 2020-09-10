import { hashHistory } from "../utils/hash_history";
import { logout, loadMe } from "./users";
import store from '../stores/redux_store';
import { getCurrentUser } from "../selectors/entities/users";
import * as Utils from '../utils/utils.jsx';
import { getMySpaces, getCurrentSpaceId, getSpace } from '../selectors/entities/spaces';
import LocalStorageStore from '../stores/local_storage_store';
import { selectSpace } from '../actions/spaces';


const dispatch = store.dispatch;
const getState = store.getState;

export function emitUserLoggedOutEvent(redirectTo = '/', shouldSignalLogout = true, userAction = true) {
    // If the logout was intentional, discard knowledge about having previously been logged in.
    // This bit is otherwise used to detect session expirations on the login page.
    if (userAction) {
        LocalStorageStore.setUserId();
    }

    dispatch(logout()).then(() => {
        // if (shouldSignalLogout) {
        //     BrowserStore.signalLogout();
        // }

        // BrowserStore.clear();
        // stopPeriodicStatusUpdates();
        // WebsocketActions.close();

        // clearUserCookie();

        hashHistory.push(redirectTo);
    }).catch(() => {
        hashHistory.push(redirectTo);
    });
}


export async function selectDefaultSpace() {
    let state = getState();

    // Assume we need to load the user if they don't have any team memberships loaded or the user loaded
    let user = getCurrentUser(state);
    
    if (!user) {
        return;
    }
    
    // const locale = getCurrentLocale(state);
    const spaceId = LocalStorageStore.getPreviousSpaceId(user.id);

    const space = getSpace(state, spaceId);
    if (space) {
        dispatch(selectSpace(space._id));
        return space._id;
    } else {
        hashHistory.push('/select-space');
    }
}

export async function redirectUserToDefaultSpace() {

    const spaceId = await selectDefaultSpace();
    
    hashHistory.push(`/space/${spaceId}`);
}

