import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

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

const LogInLink = (props: any) => <Link to={{pathname: "/login", search: window.location.hash.substring(window.location.hash.indexOf("?"))}} {...props} />;

interface RouteMatchProps {
  token: string;
}

const ResetPassword = ({ match }: any) => {
  const classes = useStyles({});
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSnackbarMessage(null);
    const token = match.params.token;
    try {
      // If no tokens send email to user
      // if (!token) {
      //   await accountsRest.sendResetPasswordEmail(email);
      //   // Email sent
      //   setSnackbarMessage(localizeMessage('accounts.emailSent'));
      // } else {
      //   // If token try to change user password
      //   await accountsRest.resetPassword(token, newPassword);
      //   // Your password has been reset successfully
      //   setSnackbarMessage(localizeMessage('accounts.passwordResetSuccessfully'));
      // }
    } catch (err: any) {
      setError(err.message);
      setSnackbarMessage(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
      {!match.params.token && (
        <FormControl margin="normal">
          <InputLabel htmlFor="email">
            <FormattedMessage
              id='accounts.email'
              defaultMessage='Email'
            />
          </InputLabel>
          <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </FormControl>
      )}
      {match.params.token && (
        <FormControl margin="normal">
          <InputLabel htmlFor="new-password">
            <FormattedMessage
              id='accounts.newPassword'
              defaultMessage='New Password'
            />
          </InputLabel>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </FormControl>
      )}
      {error && <FormError error={error!} />}
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.next'
            defaultMessage='Next'
        />
      </Button>
      <Button component={LogInLink}>
        <FormattedMessage
            id='accounts.signin'
            defaultMessage='Sign In'
        />
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        message={<span>{snackbarMessage}</span>}
      />
    </form>
  );
};

export default ResetPassword;
