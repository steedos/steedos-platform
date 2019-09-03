import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsClient, accountsRest, accountsApiHost } from '../accounts';

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

const Home = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
    const res = await fetch( accountsApiHost + '/accounts/user', {
      headers: {
        Authorization: tokens ? 'Bearer ' + tokens.accessToken : '',
      },
    });
  
    const data = await res.json();
    if (!data) {
      history.push('/login');
      return;
    }
    setUser(data);
  };

  const onResendEmail = async () => {
    await accountsRest.sendVerificationEmail(user.emails[0].address);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    history.push('/login');
  };

  const onHome = async () => {
    window.location.href="/"
  };

  if (!user) {
    return null;
  }
  return (
    <div className={classes.formContainer}>
      <h4 className={classes.title}>
        <FormattedMessage
            id='accounts.welcome'
            defaultMessage='Welcome' 
        /> {user.emails[0].address}
      </h4>
      {/* 
      <Typography gutterBottom>You are logged in</Typography>
      <Typography gutterBottom>Email: {user.emails[0].address}</Typography>
      <Typography gutterBottom>
        You email is {user.emails[0].verified ? 'verified' : 'unverified'}
      </Typography>
      {!user.emails[0].verified && (
        <Button onClick={onResendEmail}>Resend verification email</Button>
      )}

      <Link to="two-factor">Set up 2fa</Link> */}
      <br/><br/>
      <Button onClick={onHome} variant="contained" color="primary">
        <FormattedMessage
            id='accounts.home'
            defaultMessage='Home' 
        /> 
      </Button>
      <br/>
      <Button onClick={onLogout}>
        <FormattedMessage
            id='accounts.logout'
            defaultMessage='Logout' 
        /> 
      </Button>
    </div>
  );
};

export default Home;
