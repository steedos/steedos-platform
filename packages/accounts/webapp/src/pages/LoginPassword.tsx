import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';

import { accountsClient, accountsRest, accountsPassword } from '../accounts';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import FormError from '../components/FormError';
import { Login } from '../client'
import { requests } from '../actions/requests'
import { accountsEvent, accountsEventOnError} from '../client/accounts.events'
import Card from '../components/Card';
import Logo from '../components/Logo';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { login } from '../actions/users';

const LoginPassword = ({ actions, history, settings, tenant, location, title, requestLoading, requestUnLoading }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const [enableCode] = useState('');
  const [email, setEmail] = useState(_email || '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(history.location.state ? (history.location.state.error || '') : '');
  const [message, setMessage] = useState<any>(history.location.state ? (history.location.state.message || '') : '');
  const searchParams = new URLSearchParams(location.search);
  const intl = useIntl();

  console.log(actions)
  let spaceId = searchParams.get("X-Space-Id");
  accountsEventOnError((err: any)=>{
    setError(err.message);
  })

  document.title = intl.formatMessage({id:'accounts.title.password'}) + ` | ${tenant.name}`;

  if (!_email){
    return (<Redirect to="/login" />);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {

      if(!email.trim()){
        throw new Error('accounts.usernameOrEmailRequired');
      }

      if(!password.trim()){
        throw new Error('accounts.passwordRequired');
      }

      actions.login(email.trim(), password, '')
      
    } catch (err) {
      setError(err.message);
    }
  };

  const goVerify = ()=>{
    
    let action = ''
    if(email.trim().indexOf("@") < 0){
      action = 'mobileLogin'
    } else 
      action = 'emailLogin';
      
    history.push({
      pathname: `/verify/${action}`,
      search: location.search,
      state: { email: email, spaceId: spaceId }
    })
  }

  return (
<Card>

    <Logo/>

    <button
      className="flex text-sm text-gray-600 hover:text-gray-800 py-2"
      onClick={function() {
        window.history.back();
      }}
      >
        <span className="left-0 inset-y-0 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 pr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {email}
        </span>
    </button>

    <h2 className="my-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
      <FormattedMessage
          id='accounts.title.password'
          defaultMessage='Enter Password'
        />
    </h2>

    <form onSubmit={onSubmit} className="mt-5" autoCapitalize="none">
      <input type="hidden" id="email" value={email} onChange={e => setEmail(e.target.value)}/>

      <div className="rounded-md shadow-sm my-2">
          <div>
            <input 
              aria-label={intl.formatMessage({id: 'accounts.password'})}
              id="password"
              name="password" 
              value={password}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
              placeholder={intl.formatMessage({id: 'accounts.password'})}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

      {error && <FormError error={error!} />}

      {(tenant.enable_email_code_login || tenant.enable_mobile_code_login) &&
        <div className="text-sm leading-5 my-4">
          <button type="button" onClick={goVerify}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
            <FormattedMessage
                id='accounts.loginCode'
                defaultMessage='Forget Password'
            />
          </button>
        </div>}
        
      <div className="mt-6 flex justify-end">
        <button type="submit" className="group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
          <FormattedMessage
            id='accounts.signin'
            defaultMessage='Login'
          />
        </button>
      </div>

    </form>
  </Card>
  );
};


function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state)
  };
}

// const mapDispatchToProps = (dispatch: any, ownProps: any) => {
//   return ({
//     requestLoading: () => dispatch(requests("started")),
//     requestUnLoading: () => dispatch(requests("no_started")),
//   });
// }

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
      actions: bindActionCreators({
          login,
      }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPassword);