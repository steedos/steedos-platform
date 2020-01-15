import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsClient, accountsRest, accountsPassword } from '../accounts';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import FormError from './FormError';

import { localizeMessage } from '../utils/utils';

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

const SignUpLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{pathname: "/signup", search: window.location.search}} {...props}  ref={ref} />
));
const ResetPasswordLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{pathname: "/reset-password", search: window.location.search}} {...props} ref={ref} />
));

const Login = ({ history, settings, tenant }: any) => {
  const classes = useStyles();
  const [enableCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  document.title = "Login | " + tenant.name;
  const searchParams = new URLSearchParams(window.location.search);
  let redirect_uri = searchParams.get("redirect_uri");
  const getCookie = (name: string) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      let data = {
        user: {
          email: email.trim(),
        },
        password,
        code,
      }
      let result: any = await accountsRest.authFetch( '/password/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
        }),
        credentials: "include"
      });
      accountsClient.setTokens(result.tokens);
      

      const user = await accountsRest.authFetch( '/user', {});

      if(user.password_expired){
        return history.push('/update-password' + window.location.search, {error: localizeMessage('accounts.passwordExpired')});
      }

      if (tenant.enable_create_tenant && user.spaces.length == 0)
      {
        return history.push('/create-tenant' + window.location.search);
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      {error && <FormError error={error!} />}

      <FormControl margin="normal">
        <InputLabel htmlFor="email">
          <FormattedMessage
            id='accounts.username_or_email'
            defaultMessage='Username or Email'
          />
        </InputLabel>
        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">
          <FormattedMessage
            id='accounts.password'
            defaultMessage='Password'
          />
        </InputLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormControl>
      {enableCode && 
      <FormControl margin="normal">
        <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
        <Input id="code" value={code} onChange={e => setCode(e.target.value)} />       
      </FormControl>
      } 
      <br/>
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.signin'
            defaultMessage='Sign In'
        />
      </Button>
      {tenant.enable_register &&
      <Button component={SignUpLink}>
        <FormattedMessage
            id='accounts.signup'
            defaultMessage='Sign Up'
        />
      </Button>
      }
      {tenant.enable_forget_password &&
      <Button component={ResetPasswordLink}>
        <FormattedMessage
            id='accounts.reset_password'
            defaultMessage='Reset Password'
        />
      </Button>
      }
    </form>
  );
};


function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Login);