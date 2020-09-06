import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import { accountsRest } from '../accounts';
import * as Utils from '../utils/utils';
import FormError from '../components/FormError';
import { ApplyCode } from '../client';
import { accountsEvent, accountsEventOnError} from '../client/accounts.events'
import Card from '../components/Card';
import Logo from '../components/Logo';
import LocalizedInput from '../components/LocalizedInput';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { login } from '../actions/users';
import {withRouter} from "react-router-dom";
import * as GlobalAction from '../actions/global_actions';

class Login extends React.Component {

  constructor(props, context) {
    super(props, context);

    let loginId = '';
    if ((new URLSearchParams(this.props.location.search)).get('email')) {
        loginId = (new URLSearchParams(this.props.location.search)).get('email');
    }
    let spaceId = '';
    if ((new URLSearchParams(this.props.location.search)).get('X-Space-Id')) {
      spaceId = (new URLSearchParams(this.props.location.search)).get('email');
    } else if (this.props.settingsTenantId) {
      spaceId = this.props.settingsTenantId
    }

    this.state = {
        // ldapEnabled: this.props.isLicensed && this.props.enableLdap,
        usernameSigninEnabled: this.props.enableSignInWithUsername,
        emailSigninEnabled: this.props.enableSignInWithEmail,
        mobileSigninEnabled: this.props.enableSignInWithMobile,
        // samlEnabled: this.props.isLicensed && this.props.enableSaml,
        spaceId,
        loginId,
        password: '',
        showMfa: false,
        loading: false,
        sessionExpired: false,

        loginWithPassword: true,
        loginWithEmailCode: false,
        loginWithMobileCode: false,

        error: ''

        // brandImageError: false,
    };

    this.loginIdInput = React.createRef();
    this.passwordInput = React.createRef();


    window.browserHistory = this.props.history;
    document.title = Utils.localizeMessage('accounts.signin') + ` | ${this.props.tenant.name}`;


}

createLoginPlaceholder = () => {

  let inputLabel = 'accounts.email_mobile';
  if (this.propstenant.enable_password_login)
    inputLabel = 'accounts.email_mobile';
  else if (this.propstenant.enable_mobile_code_login && this.propstenant.enable_email_code_login) 
    inputLabel = 'accounts.email_mobile';
  else if (this.propstenant.enable_mobile_code_login) 
    inputLabel = 'accounts.mobile';
  else if (this.propstenant.enable_email_code_login) 
    inputLabel = 'accounts.email';
  
  return Utils.localizeMessage(inputLabel)
}

handleLoginIdChange = (e) => {
  this.setState({
      loginId: e.target.value,
  });
}

handlePasswordChange = (e) => {
  this.setState({
    password: e.target.value,
  });
}

// onSubmit = async (e) => {
//   e.preventDefault();
//   this.setState({error: null});
  
//   // try {
//   //   // 判断账户是否已存在
//   //   const data = await accountsRest.fetch( `user/exists?id=${this.state.loginId.trim()}`, {});
//   //   if(!data.exists) {
//   //     throw new Error("该账户不存在。");
//   //     return;
//   //   }

//   //   if(this.props.tenant.enable_password_login){
//   //     this.props.history.push({
//   //       pathname: `/login-password/`,
//   //       search: this.props.location.search,
//   //       state: { email: this.state.loginId.trim() }
//   //     })
//   //     return;
//   //   } 

//   //   let action = ''
//   //   if(this.state.loginId.trim().indexOf("@") < 0){
//   //     action = 'mobileLogin'
//   //   } else 
//   //     action = 'emailLogin';

//   //   this.props.history.push({
//   //     pathname: `/verify/${action}`,
//   //     search: this.props.location.search,
//   //     state: { email: this.state.loginId.trim(), spaceId:this.state.spaceId }
//   //   })
    
//   // } catch (err) {
//   //   this.setState({error: err.message});
//   // }
// };


onSubmit = async (e) => {
  e.preventDefault();
  this.setState({error: null});

  if(!this.state.loginId.trim()){
    throw new Error('accounts.usernameOrEmailRequired');
  }

  if(!this.state.password.trim()){
    throw new Error('accounts.passwordRequired');
  }

  this.props.actions.login(this.state.loginId.trim(), this.state.password, '').then(async ({error}) => {
    console.log(error)
    if (error) {
      this.setState({error: error.message});
      return;
    }
    
  });
  this.finishSignin();
};


finishSignin = (team) => {
  const query = new URLSearchParams(this.props.location.search);
  const redirectTo = query.get('redirect_to');

  // Utils.setCSRFFromCookie();

  // Record a successful login to local storage. If an unintentional logout occurs, e.g.
  // via session expiration, this bit won't get reset and we can notify the user as such.
  // LocalStorageStore.setWasLoggedIn(true);
  if (redirectTo && redirectTo.match(/^\/([^/]|$)/)) {
    this.props.history.push(redirectTo);
  // } else if (team) {
  //     browserHistory.push(`/${team.name}`);
  } else {
    GlobalAction.redirectUserToDefaultSpace();
  }
}

goSignup = ()=>{
  let state = {};
  if(this.state.loginId.trim().length > 0){
    state =  { email: this.state.loginId.trim() }
  }
  this.props.history.push({
    pathname: `/signup`,
    search: this.props.location.search,
    state: state
  })
}
render() {

    return (
    <Card>
        <Logo/>
        <h2 className="mt-6 text-left text-2xl leading-9 font-extrabold text-gray-900">
          <FormattedMessage
              id='accounts.signin'
              defaultMessage='Login'
            />
        </h2>

        <form onSubmit={this.onSubmit} className="mt-4" autoCapitalize="none">

          <div className="rounded-md shadow-sm my-2">
            <div>
              <input 
                id="loginId"
                name="loginId" 
                ref={this.loginIdInput}
                value={this.state.loginId}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
                placeholder={this.createLoginPlaceholder}
                onChange={this.handleLoginIdChange}
              />
            </div>

            {this.state.loginWithPassword && (
                <div class="-mt-px">
                  <LocalizedInput 
                    type="password"
                    id="password"
                    name="password" 
                    value={this.state.password}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
                    placeholder={{id: 'accounts.password', defaultMessage: 'Password'}}
                    onChange={this.handlePasswordChange}
                  />
                </div>
            )}

          </div>
          
          {this.state.error && <FormError error={this.state.error} />}

          {this.props.tenant.enable_register &&
          <div className="text-sm leading-5 my-4">
            <FormattedMessage
                  id='accounts.no_account'
                  defaultMessage='No Account?'
              />
            <button type="button" onClick={this.goSignup}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
              <FormattedMessage
                  id='accounts.signup'
                  defaultMessage='Sign Up'
              />
            </button>
          </div>}

          <div className="mt-6 flex justify-end">
            <button type="submit" className="group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
              <FormattedMessage
                id='accounts.next'
                defaultMessage='Next'
              />
            </button>
          </div>
        </form>
      </Card>
    );
  };

}

function mapStateToProps(state) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          login,
      }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
