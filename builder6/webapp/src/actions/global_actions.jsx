import { hashHistory } from "../utils/hash_history";
import { logout, loadMe } from "./users";
import store from '../stores/redux_store';
import { getCurrentUser } from "../selectors/entities/users";
import { getMySpaces, getCurrentSpaceId, getSpace } from '../selectors/entities/spaces';
import LocalStorageStore from '../stores/local_storage_store';
import { selectSpace } from '../actions/spaces';
import { redirect } from "react-router";


const dispatch = store.dispatch;
const getState = store.getState;

export function emitUserLoggedOutEvent(redirectToPath, shouldSignalLogout = true, userAction = true) {
    // If the logout was intentional, discard knowledge about having previously been logged in.
    // This bit is otherwise used to detect session expirations on the login page.
    if (userAction) {
    }

    if (!redirectToPath)
        redirectToPath = '/login'

    dispatch(logout()).then(() => {

        redirect(redirectToPath);
    }).catch((e) => {
        console.log(e);
        redirect(redirectToPath);
    });
}


export async function selectDefaultSpace(location) {
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
        redirect('/select-space');
        // hashHistory.push({
        //     pathname: '/select-space',
        //     search: location.search
        // });
    }
}

export async function redirectUserToDefaultSpace(location) {
    const spaceId = await selectDefaultSpace(location);
    hashHistory.push({
        pathname: `/home/${spaceId}`,
        search: location.search
    });
}

// export async function redirectUserToUpdatePassword(location){
//     hashHistory.push({
//         pathname: '/update-password',
//         search: location.search
//     });
// }

// export async function redirectUserToVerifyEmail(location){
//     hashHistory.push({
//         pathname: '/verify/email',
//         search: location.search
//     });
// }

// export async function redirectUserToVerifyMobile(location){
//     hashHistory.push({
//         pathname: '/verify/mobile',
//         search: location.search
//     });
// }

export function redirectTo(redirectTo, location) {
    if (!redirectTo) 
        return;
    if(redirectTo.startsWith("location:")){
        return document.location.href=redirectTo.substr(9)
    }

    if (redirectTo && redirectTo.indexOf('no_redirect=1')<0) {
    //   const userId = LocalStorageStore.getItem('userId');
    //   const authToken =  LocalStorageStore.getItem('token');
    //   const spaceId =  LocalStorageStore.getItem('spaceId');
      
      redirectTo = redirectTo.indexOf("?")>0?redirectTo+'&no_redirect=1':redirectTo+'?no_redirect=1'
    //   if (userId && authToken){
    //     redirectTo = `${redirectTo}&X-Auth-Token=${authToken}&X-User-Id=${userId}&X-Space-Id=${spaceId}`
    //   }

      if (redirectTo.match(/^\/([^/]|$)/)){
          if(location){
            hashHistory.push({
                pathname: redirectTo,
                search: location.search
              })
          }else{
            hashHistory.push(redirectTo);
          }
      }
      else
        document.location.href=redirectTo
    }

}

export function finishSignin(currentUser, tenant, location, navigate){
    let password_expired = currentUser.password_expired;
    if(password_expired){
      //   redirectUserToUpdatePassword(location);
      navigate('/update-password');
      return;
    }
    
    let enable_bind_mobile = tenant.enable_bind_mobile;
    if(enable_bind_mobile && !currentUser.mobile_verified){
        //   redirectUserToVerifyMobile(location);
        navigate('/verify/mobile');
      return;
    }

    let enable_bind_email = tenant.enable_bind_email;
    if(enable_bind_email && !currentUser.email_verified){
      //   redirectUserToVerifyEmail(location);
      navigate('/verify/email');
      return;
    }

    // if(location){
    //     hashHistory.push({
    //         pathname: '/home',
    //         search: location.search
    //       })
    //   }else{
    //     hashHistory.push('/home');
    //   }
    navigate('/home');
    // let redirect_uri = new URLSearchParams(location?location.search:"").get('redirect_uri')
    // if (!redirect_uri)
    //   redirect_uri = '/'
    // redirectTo(redirect_uri, location);
}