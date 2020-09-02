import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { ApplyCode } from '../client';
import { accountsEvent, accountsEventOnError} from '../client/accounts.events'

const useStyles = makeStyles({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0 auto",
  }
});

const LoginCode = ({match, settingsTenantId, settings, history, location, tenant }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | "">(_email);
  const [signupDialogState, setSignupDialogState] = useState<boolean>(false);
  const type = match.params.type || 'email';
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id") || settingsTenantId;


  let inputLabel = 'accounts.username';
  if (tenant.enable_password_login)
    inputLabel = 'accounts.email_mobile_username';
  else if (tenant.enable_mobile_code_login && tenant.enable_email_code_login) 
    inputLabel = 'accounts.email_mobile';
  else if (tenant.enable_mobile_code_login) 
    inputLabel = 'accounts.mobile';
  else if (tenant.enable_email_code_login) 
    inputLabel = 'accounts.email';
  
  document.title = useIntl().formatMessage({id:'accounts.title.login'}) + ` | ${tenant.name}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      // 必填
      if(!email.trim()){
        throw new Error("请填写此字段。");
      }

      // 判断账户是否已存在
      const data = await accountsRest.fetch( `user/exists?id=${email.trim()}`, {});
      if(!data.exists) {
        throw new Error("该账户不存在。");
        return;
      }

      if(tenant.enable_password_login){
        history.push({
          pathname: `/login-password/`,
          search: location.search,
          state: { email: email.trim() }
        })
        return;
      } 

      history.push({
        pathname: `/verify/go`,
        search: location.search,
        state: { email: email.trim(), spaceId:spaceId }
      })
      
    } catch (err) {
      setError(err.message);
    }
  };

  const goSignup = ()=>{
    let state = {};
    if(email.trim().length > 0){
      state =  { email: email.trim() }
    }
    history.push({
      pathname: `/signup`,
      search: location.search,
      state: state
    })
  }
  const signupDialogOpen = ()=>{
    setSignupDialogState(true)
  }
  const signupDialogClose = ()=>{
    setSignupDialogState(false)
  }

  return (
    <div>
      <h2 className="mt-6 text-left text-2xl leading-9 font-extrabold text-gray-900">
        <FormattedMessage
            id='accounts.title.login'
            defaultMessage='Login'
          />
      </h2>

      <form onSubmit={onSubmit} className="mt-4" autoCapitalize="none">

        <div className="rounded-md shadow-sm my-2">
          <div>
            <input 
              aria-label={useIntl().formatMessage({id: inputLabel})}
              id="email"
              name="email" 
              value={email}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
              placeholder={useIntl().formatMessage({id: inputLabel})}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        {error && <FormError error={error!} />}

        {tenant.enable_register &&
        <div className="text-sm leading-5 my-4">
          <FormattedMessage
                id='accounts.no_account'
                defaultMessage='No Account?'
            />
          <button type="button" onClick={goSignup}
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
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

export default connect(mapStateToProps)(LoginCode);
