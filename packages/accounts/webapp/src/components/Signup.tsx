import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { accountsPassword } from '../accounts';
import FormError from './FormError';

import { loadTranslations } from '../actions/i18n';
import { loadSettings } from '../actions/settings';
import { loadTenant } from '../actions/tenant';
import { getSettings, getTenant } from '../selectors';
import { ApplyCode } from '../client'

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

const LogInLink = React.forwardRef<Link, any>((props, ref) => {
  return (
    <Link to={{ pathname: "/login", search: props.location.search}} {...props} ref={ref} />
  )
});

const Signup = ({ match, history, location, actions, tenant }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | "">("");
  const [email, setEmail] = useState<string | undefined>(_email);
  const [password, setPassword] = useState<string | "">("");
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id");
  // useEffect(() => {
  //   if(spaceId){
  //     actions.loadTenant(spaceId);
  //   }
  // }, []);

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
      await accountsPassword.createUser({
        locale: getBrowserLocale(),
        name: name,
        email: email,
        password: password,
        spaceId: spaceId
      });
      if(tenant.enable_password_login === false){
        const data = await ApplyCode({
          name: email,
          action: 'emailSignupAccount',
          spaceId: spaceId
        });
        if (data.token) {
            history.push({
                pathname: `/verify/${data.token}`,
                search: location.search,
                state: { email: email }
            })
        }
      }else{
        history.push({
          pathname: `/login`,
          search: location.search
        })
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if(tenant.exists === false){
      history.replace('/signup');
    }
  }, [tenant]);

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
    <FormControl margin="normal">
      <InputLabel htmlFor="name">
        <FormattedMessage
          id='accounts.name'
          defaultMessage='Name'
        />
      </InputLabel>
      <Input
        id="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
    </FormControl>
    <FormControl margin="normal">
      <InputLabel htmlFor="email">
        <FormattedMessage
          id='accounts.email'
          defaultMessage='Email'
        />
      </InputLabel>
      <Input
        id="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </FormControl>
    {tenant.enable_password_login != false &&
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
    }
    {error && <FormError error={error!} />}
    <Button variant="contained" color="primary" type="submit">
      <FormattedMessage
        id='accounts.next'
        defaultMessage='Next'
      />
    </Button>
    <Button component={LogInLink} location={location}>
      <FormattedMessage
        id='accounts.signin'
        defaultMessage='Sign In'
      />
    </Button>
  </form>
  );
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}
function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators({
      loadTenant,
      loadSettings,
      loadTranslations,
    }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
