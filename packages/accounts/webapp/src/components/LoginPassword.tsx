import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsClient, accountsRest, accountsPassword } from '../accounts';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import FormError from './FormError';
import { Login } from '../client'
import { requests } from '../actions/requests'
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

const ResetPasswordLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{pathname: "/reset-password", search: props.location.search}} {...props} ref={ref} />
));

const LoginPassword = ({ history, settings, tenant, location, title, requestLoading, requestUnLoading }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const classes = useStyles();
  const [enableCode] = useState('');
  const [email, setEmail] = useState(_email || '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id");
  accountsEventOnError((err: any)=>{
    setError(err.message);
})
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

      let data = {
        user: {
          email: email.trim(),
        },
        password,
        code,
      }
      requestLoading();
      await Login(data, history, tenant, location)
    } catch (err) {
      requestUnLoading();
      setError(err.message);
    }
  };

  const goSignup = ()=>{
    let state = {};
    if(email.trim().indexOf("@") > 0){
      state = { email: email }
    }
    accountsEvent.emit('goSignup', tenant, history, location, state)
  }
  
  return (
    <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
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
      {error && <FormError error={error!} />}
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.next'
            defaultMessage='Next'
        />
      </Button>
      {!spaceId && tenant.enable_register &&
      <Button onClick={goSignup}>
        <FormattedMessage
            id='accounts.signup'
            defaultMessage='Sign Up'
        />
      </Button>
      }
      {tenant.enable_forget_password &&
      <Button component={ResetPasswordLink} location={location}>
        <FormattedMessage
            id='accounts.loginCode'
            defaultMessage='Validity Code Login'
        />
      </Button>
      }
    </form>
  );
};


function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state)
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return ({
    requestLoading: () => dispatch(requests("started")),
    requestUnLoading: () => dispatch(requests("no_started")),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPassword);