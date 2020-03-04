import ClientClass4 from './client4.js';
import { accountsClient, accountsRest } from '../accounts';
import { localizeMessage } from '../utils/utils';
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

const Login = async (data, history, tenant, location)=>{

    const searchParams = new URLSearchParams(location.search);
    let redirect_uri = searchParams.get("redirect_uri");

    let result = await accountsRest.authFetch( 'password/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
        }),
        credentials: "include"
      });
    await LoginAfter(history, tenant, result, redirect_uri);
};

const LoginAfter = async (history, tenant, result, redirect_uri, location)=>{
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

    if(user.password_expired){
      return history.push('/update-password' + location.search, {error: localizeMessage('accounts.passwordExpired')});
    }

    if (tenant.enable_create_tenant && user.spaces.length == 0)
    {
      return history.push('/create-tenant' + location.search);
    }

    if (redirect_uri){
      if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
        redirect_uri = window.location.origin + redirect_uri
      }
      let u = new URL(redirect_uri);
      u.searchParams.append("token", result.tokens.accessToken)
      u.searchParams.append("X-Auth-Token", getCookie('X-Auth-Token'));
      u.searchParams.append("X-User-Id", getCookie('X-User-Id'));
      window.location.href = u.toString();
    }
    else
      history.push('/');
}

const ApplyCode = async (data) =>{
    return await accountsRest.fetch(`code/apply`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export {
    Client4,
    Login,
    ApplyCode
};
