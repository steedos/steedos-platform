import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsPassword } from '../accounts';
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

const LogInLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{pathname: "/login", search: window.location.hash.substring(window.location.hash.indexOf("?"))}} {...props} ref={ref} />
));

const Signup = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | "">("");
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | "">("");
  const getBrowserLocale = function() {
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
      });
      history.push('/login' + window.location.hash.substring(window.location.hash.indexOf("?")));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      <h4 className={classes.title}>
        <FormattedMessage
            id='accounts.signup'
            defaultMessage='Sign Up'
        />
      </h4>
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
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.signup'
            defaultMessage='Sign Up'
        />
      </Button>
      {error && <FormError error={error!} />}
      <Button component={LogInLink}>
        <FormattedMessage
            id='accounts.signin'
            defaultMessage='Sign In'
        />
      </Button>
    </form>
  );
};

export default Signup;
