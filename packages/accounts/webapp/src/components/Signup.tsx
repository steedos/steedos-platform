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
  <Link to="/login" {...props} ref={ref} />
));

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await accountsPassword.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      });
      history.push('/login');
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
        <InputLabel htmlFor="firstName">First name</InputLabel>
        <Input
          id="firstName"
          value={user.firstName}
          onChange={e => setUser(prevState => ({ ...prevState, firstName: e.target.value }))}
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="lastName">Last name</InputLabel>
        <Input
          id="lastName"
          value={user.lastName}
          onChange={e => setUser(prevState => ({ ...prevState, lastName: e.target.value }))}
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
          value={user.email}
          onChange={e => setUser(prevState => ({ ...prevState, email: e.target.value }))}
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
          value={user.password}
          onChange={e => setUser(prevState => ({ ...prevState, password: e.target.value }))}
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
