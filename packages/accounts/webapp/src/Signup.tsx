import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { accountsPassword } from './accounts';
import FormError from './components/FormError';

const useStyles = makeStyles({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
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
      <Typography variant="h4" gutterBottom>
        Sign up
      </Typography>
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
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          value={user.email}
          onChange={e => setUser(prevState => ({ ...prevState, email: e.target.value }))}
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          value={user.password}
          onChange={e => setUser(prevState => ({ ...prevState, password: e.target.value }))}
        />
      </FormControl>
      <Button variant="contained" color="primary" type="submit">
        Sign Up
      </Button>
      {error && <FormError error={error!} />}
      <Button component={LogInLink}>Log In</Button>
    </form>
  );
};

export default Signup;
