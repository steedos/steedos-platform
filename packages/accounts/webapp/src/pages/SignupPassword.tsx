import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { accountsPassword } from '../accounts';
import FormError from '../components/FormError';

import { loadTranslations } from '../actions/i18n';
import { loadSettings } from '../actions/settings';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import { requests } from '../actions/requests'
import { Login } from '../client'
import Card from '../components/Card';
import Logo from '../components/Logo';


const LogInLink = React.forwardRef<Link, any>((props, ref) => {
  return (
    <Link to={{ pathname: "/login", search: props.location.search}} {...props} ref={ref} />
  )
});

const Signup = ({ match, history, settingsTenantId, location, actions, settings, tenant, requestLoading, requestUnLoading }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | "">("");
  const [email, setEmail] = useState<string | "">(_email || '');
  const [password, setPassword] = useState<string | "">("");
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id") || settingsTenantId;
  const intl = useIntl();

  document.title = intl.formatMessage({id:'accounts.title.setPassword'}) + ` | ${tenant.name}`;

  if (!_email){
    return (<Redirect to="/login" />);
  }

  const getBrowserLocale = function () {
    var l, locale;
    var navigator: any = window.navigator;
    l = navigator.userLanguage || navigator.language || 'en';
    if (l.indexOf("zh") >= 0) {
      locale = "zh-cn";
    } else {
      locale = "en-us";
    }
    return locale;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      
      // if(!name.trim()){
      //   throw new Error('accounts.nameRequired');
      // }

      if(!email.trim()){
        throw new Error('accounts.emailRequired');
      }

      if(!password.trim()){
        throw new Error('accounts.passwordRequired');
      }
      requestLoading();
      await accountsPassword.createUser({
        locale: getBrowserLocale(),
        //name: name,
        email: email,
        password: password,
        spaceId: spaceId
      });
      let data = {
        user: {
          email: email.trim(),
        },
        password
      }
      await Login(data, history, tenant, location, 'passwordSignupAccount')
    } catch (err) {
      requestUnLoading();
      setError(err.message);
    }
  };

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

    <h2 className="mt-6 text-left text-2xl leading-9 font-extrabold text-gray-900">
      <FormattedMessage
          id='accounts.title.setPassword'
          defaultMessage='Set Password'
        />
    </h2>

    <form onSubmit={onSubmit} className="mt-4" autoCapitalize="none">

        <div className="rounded-md shadow-sm my-2">
          <div>
            <input 
              aria-label={intl.formatMessage({id: "accounts.password"})}
              id="password"
              name="password" 
              value={password}
              type="password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
              placeholder={intl.formatMessage({id: "accounts.password"})}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        
        
    {error && <FormError error={error!} />}
    
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

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators({
      loadSettings,
      loadTranslations,
    }, dispatch),
    requestLoading: () => dispatch(requests("started")),
    requestUnLoading: () => dispatch(requests("no_started")),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
