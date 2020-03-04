import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
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

const LoginCode = ({match, settings, history, location, tenant }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | "">(_email);
  const type = match.params.type || 'email';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if(!email.trim()){
        throw new Error("请输入邮箱");
      }
      const data = await accountsRest.fetch( `user/email/exists?email=${email.trim()}`, {});
      if(data.exists){
          const data = await ApplyCode({
              name: email,
              action: 'emailLogin',
          });
          if (data.token) {
              history.push({
                pathname: `/verify/${data.token}`,
                search: location.search,
                state: { email: email.trim() }
            })
          }
      }else{
        throw new Error("未找到您的账户，请先注册");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const goSignup = ()=>{
    history.push({
      pathname: `/signup`,
      search: location.search,
      state: { email: email }
  })
  }

  const back = function(){
      history.push({
          pathname: `/login`,
          search: location.search,
          state: { email: email }
      })
  }
  return (
      <form onSubmit={onSubmit} className={classes.formContainer}>
        {/* <h4 className={classes.title}>
          <FormattedMessage
            id='accounts.login'
            defaultMessage='登录'
          />
        </h4> */}
        <FormControl margin="normal">
          <InputLabel htmlFor="verifyCode">
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
        <br />
        <Button variant="contained" color="primary" type="submit">
          <FormattedMessage
            id='accounts.next'
            defaultMessage='下一步'
          />
        </Button>
        {error && <FormError error={error!} />}
        {tenant.enable_register && tenant.enable_password_login === false &&
        <Button onClick={goSignup}>
          <FormattedMessage
              id='accounts.signup'
              defaultMessage='Sign Up'
          />
        </Button>
        }
        {tenant.enable_password_login != false && 
                    <Button onClick={back}>
                    <FormattedMessage
                        id='accounts.back'
                        defaultMessage='返回'
                    />
                </Button>
        }
      </form>
  );
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps)(LoginCode);
