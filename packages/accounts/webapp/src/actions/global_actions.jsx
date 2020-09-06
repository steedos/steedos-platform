import { hashHistory } from "../utils/hash_history";
import { logout, loadMe } from "./users";
import store from '../stores/redux_store';
import { getCurrentUser } from "../selectors/entities/users";
import { getSpaceUsers } from "../selectors/entities/spaces"
import * as Utils from '../utils/utils.jsx';

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

        hashHistory.push(redirectTo);
    }).catch(() => {
        hashHistory.push(redirectTo);
    });
}


export async function redirectUserToDefaultSpace() {
    let state = getState();

    // Assume we need to load the user if they don't have any team memberships loaded or the user loaded
    let user = getCurrentUser(state);
    // const shouldLoadUser = Utils.isEmptyObject(getSpaceUsers(state)) || !user;

    // if (shouldLoadUser) {
    //     await dispatch(loadMe());
    //     state = getState();
    //     user = getCurrentUser(state);
    // }
    if (!user) {
        return;
    }

    // const locale = getCurrentLocale(state);
    // const teamId = LocalStorageStore.getPreviousTeamId(user.id);

    // let myTeams = getMyTeams(state);
    // if (myTeams.length === 0) {
    //     browserHistory.push('/select_team');
    //     return;
    // }

    // const team = getTeam(state, teamId);
    // if (team && team.delete_at === 0) {
    //     const channel = await getTeamRedirectChannelIfIsAccesible(user, team);
    //     if (channel) {
    //         dispatch(selectChannel(channel.id));
    //         browserHistory.push(`/${team.name}/channels/${channel.name}`);
    //         return;
    //     }
    // }

    // myTeams = filterAndSortTeamsByDisplayName(myTeams, locale);

    // for (const myTeam of myTeams) {
    //     // This should execute async behavior in a pretty limited set of situations, so shouldn't be a problem
    //     const channel = await getTeamRedirectChannelIfIsAccesible(user, myTeam); // eslint-disable-line no-await-in-loop
    //     if (channel) {
    //         dispatch(selectChannel(channel.id));
    //         browserHistory.push(`/${myTeam.name}/channels/${channel.name}`);
    //         return;
    //     }
    // }

    hashHistory.push('/home');
}
