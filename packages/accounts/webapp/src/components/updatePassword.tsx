import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { accountsPassword, accountsClient } from '../accounts';
import FormError from './FormError';
import { checkPropTypes } from 'prop-types';

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
  <Link to={{pathname: "/login", search: window.location.search}} {...props} ref={ref} />
));

const UpdatePassword = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(history.location.state ? (history.location.state.error || '') : '');
  const [email, setEmail] = useState<string | undefined>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string | null>('');
  useEffect(()=>{
    checkToken()
  }, [])

  const checkToken = async () => {
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if(oldPassword === newPassword){
      setError('新旧密码不能相同!');
      return;
    }

    if(newPassword != confirmPassword){
        setError('密码不一致!');
        return;
    }
    var reg=/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,}$/;
    if(!reg.test(newPassword || '')){
        setError('密码必须包含字母和数字，且不能少于8位!');
        return;
    }
    try {
      await accountsPassword.changePassword(oldPassword, newPassword);
      await accountsClient.logout();
      history.push('/login' + window.location.search);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      <h4 className={classes.title}>
        <FormattedMessage
            id='accounts.update_password'
            defaultMessage='Sign Up'
        />
      </h4>
      
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
      <InputLabel htmlFor="oldPassword">          
          <FormattedMessage
            id='accounts.oldPassword'
            defaultMessage='Old Password'
          />
        </InputLabel>
        <Input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)} 
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="newPassword">
          <FormattedMessage
            id='accounts.newPassword'
            defaultMessage='newPassword'
          />
        </InputLabel>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)} 
        />
      </FormControl>
      <FormControl margin="normal">
        <InputLabel htmlFor="confirmPassword">
          <FormattedMessage
            id='accounts.confirmPassword'
            defaultMessage='confirmPassword'
          />
        </InputLabel>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)} 
        />
      </FormControl>
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.update_password'
            defaultMessage='Update Password'
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

export default UpdatePassword;
