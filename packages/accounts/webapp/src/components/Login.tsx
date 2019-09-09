import React, { useState } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsPassword } from '../accounts';
import { getSettings } from '../selectors';
import FormError from './FormError';

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

const Login = ({ history, title }: any) => {
  const classes = useStyles();
  const [enableCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  document.title = "Login | " + title;
  const searchParams = new URLSearchParams(window.location.search);
  let redirect_uri = searchParams.get("redirect_uri");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      let result: any = await accountsPassword.login({
        user: {
          email,
        },
        password,
        code,
      });

      if(result.password_expired){
        return history.push('/update-password' + window.location.search, {error: "密码已过期，请修改密码"});
      }

      if (redirect_uri){
        if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
          redirect_uri = window.location.origin + redirect_uri
        }
        let u = new URL(redirect_uri);
        u.searchParams.append("token", result.tokens.accessToken)
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
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.signin'
            defaultMessage='Sign In'
        />
      </Button>
      <Button component={SignUpLink}>
        <FormattedMessage
            id='accounts.signup'
            defaultMessage='Sign Up'
        />
      </Button>
      <Button component={ResetPasswordLink}>
        <FormattedMessage
            id='accounts.reset_password'
            defaultMessage='Reset Password'
        />
      </Button>
    </form>
  );
};


function mapStateToProps(state: any) {
  return {
      title: getSettings(state).title,
  };
}

export default connect(mapStateToProps)(Login);