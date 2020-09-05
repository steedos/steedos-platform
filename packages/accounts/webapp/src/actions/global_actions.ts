import { browserHistory } from "../utils/browser_history";
import { logout } from "./users";
import store from '../stores/redux_store';

const dispatch = store.dispatch;
const getState = store.getState;

export function emitUserLoggedOutEvent(redirectTo = '/', shouldSignalLogout = true, userAction = true) {
    // If the logout was intentional, discard knowledge about having previously been logged in.
    // This bit is otherwise used to detect session expirations on the login page.
    // if (userAction) {
    //     LocalStorageStore.setWasLoggedIn(false);
    // }

    dispatch(logout()).then(() => {
        // if (shouldSignalLogout) {
        //     BrowserStore.signalLogout();
        // }

        // BrowserStore.clear();
        // stopPeriodicStatusUpdates();
        // WebsocketActions.close();

        // clearUserCookie();

        browserHistory.push(redirectTo);
    }).catch(() => {
        browserHistory.push(redirectTo);
    });
}
