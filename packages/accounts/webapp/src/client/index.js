import ClientClass4 from './client4.js';
import { accountsClient, accountsRest } from '../accounts';
import { localizeMessage } from '../utils/utils';
import store from '../stores/redux_store';
import { requests } from '../actions/requests'
const Client4 = new ClientClass4();

const getCookie = (name) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
  }

const Login = async (data, history, tenant, location, action)=>{
    if(tenant._id){
      data.spaceId = tenant._id
    }

    let result = await accountsRest.authFetch( 'password/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
        }),
        credentials: "include"
      });
    await LoginAfter(history, tenant, result, location, action);
};

const LoginAfter = async (history, tenant, result, location, action)=>{
    accountsClient.setTokens(result.tokens);

    if(window.ReactNativeWebView && window.ReactNativeWebView.postMessage){
      //消息参数必须为string
      window.ReactNativeWebView.postMessage(JSON.stringify({
        "X-Auth-Token": getCookie('X-Auth-Token'),
        "X-User-Id": getCookie('X-User-Id'),
        "X-Access-Token": result.tokens.accessToken
      }))
    }

    const user = await accountsRest.authFetch( 'user', {});

    if(tenant.enable_bind_mobile && (!user.mobile || !user.mobile_verified)){
      store.dispatch(requests("no_started"));
      history.push({
        pathname: `/verify-mobile/${result.tokens.accessToken}`,
        search: location.search,
        state: {mobile: user.mobile}
      })
      return
    }

    if(action && (action.endsWith('SignupAccount') || action.endsWith('mobileVerify'))){
      if(!user.name){
        return LoginAfterHistoryPush(history, '/set-name' + location.search);
      }else {
        if(user.spaces.length > 0){
          return LoginAfterHistoryPush(history, '/choose-tenant' + location.search);
        }
      }
    }

    if(user.password_expired){
      return LoginAfterHistoryPush(history, '/update-password' + location.search, {error: localizeMessage('accounts.passwordExpired')});
    }

    if (tenant.enable_create_tenant && user.spaces.length == 0)
    {
      return LoginAfterHistoryPush(history, '/create-tenant' + location.search);
    }

    goInSystem(history, location, result.tokens.accessToken);
}

const LoginAfterHistoryPush = (history, url, state) => {
  store.dispatch(requests("no_started"));
  history.push(url, state);
}

const goInSystem = (history, location, accessToken, root_url, canGoHome)=>{

  const searchParams = new URLSearchParams(location.search);
  let redirect_uri = searchParams.get("redirect_uri");

  if (redirect_uri){
    if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
      redirect_uri = window.location.origin + redirect_uri
    }
    let u = new URL(redirect_uri);
    u.searchParams.append("token", accessToken);
    u.searchParams.append("X-Auth-Token", getCookie('X-Auth-Token'));
    u.searchParams.append("X-User-Id", getCookie('X-User-Id'));
    window.location.href = u.toString();
  }
  else{
    if(canGoHome){
      history.push('/' + window.location.hash.substring(window.location.hash.indexOf("?")));
    }else{
      window.location.href = root_url ? root_url : "/";
    }
  }
}


const ApplyCode = async (data) =>{
    try {
      return await accountsRest.fetch(`code/apply`, {
          method: 'POST',
          body: JSON.stringify(data),
      });
    } catch (error) {
      if(error.message === 'accounts.spaceUnExists'){
        store.dispatch({
          type: "UNEXISTS_TENANT"
        })
      }
      throw error
    }
}

export {
    Client4,
    Login,
    ApplyCode,
    goInSystem
};
