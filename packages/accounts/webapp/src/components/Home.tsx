import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';

import { accountsClient, accountsRest } from '../accounts';

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

const Home = ({ history, settings, tenant }: any) => {
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCookie = (name: string) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
  }

  const fetchUser = async () => {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
    const data = await accountsRest.authFetch( 'user', {});
  
    if (!data) {
      history.push('/login');
      return;
    }
    setUser(data);
    
    const searchParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf("?")));
    let redirect_uri = searchParams.get("redirect_uri");
    if (redirect_uri){
      if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
        redirect_uri = window.location.origin + redirect_uri
      }
      let u = new URL(redirect_uri);
      u.searchParams.append("token", tokens.accessToken);
      u.searchParams.append("X-Auth-Token", getCookie('X-Auth-Token'));
      u.searchParams.append("X-User-Id", getCookie('X-User-Id'));
      window.location.href = u.toString();
    }
  };

  const onResendEmail = async () => {
    await accountsRest.sendVerificationEmail(user.emails[0].address);
  };

  const onLogout = async () => {
    await accountsClient.logout();
    history.push('/login');
  };

  const onHome = async () => {
    window.location.href = settings.root_url ? settings.root_url : "/";
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
        /> {user.email || user.name}
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

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Home);