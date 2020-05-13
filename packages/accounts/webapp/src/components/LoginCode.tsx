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
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if(!email.trim()){
        if(tenant.enable_bind_mobile){
          throw new Error("请输入手机号");
        }else{
            throw new Error("请输入邮箱");
        }
      }
      if(email.trim().indexOf("@") == 0){
        throw new Error("无效的邮箱地址");
      }
      
      let action = 'emailLogin';
      if(email.trim().indexOf("@") < 0){
        action = 'mobileLogin'
      }
      if(!tenant.enable_bind_mobile && action === 'mobileLogin'){
          throw new Error("无效的邮箱地址");
      }

      const data = await accountsRest.fetch( `user/exists?id=${email.trim()}`, {});
      if(data.exists){
          const data = await ApplyCode({
              name: email,
              action: action,
              spaceId: spaceId
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
    let state = {};
    if(email.trim().indexOf("@") > 0){
      state =  { email: email }
    }
    history.push({
      pathname: `/signup`,
      search: location.search,
      state: state
  })
  }
  return (
      <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
        <FormControl margin="normal">
          <InputLabel htmlFor="verifyCode">
            {tenant.enable_bind_mobile &&
                <FormattedMessage
                id='accounts.loginCode.email_or_mobile'
                defaultMessage='Email or Phone Number'
              />
            }
            {!tenant.enable_bind_mobile &&
                <FormattedMessage
                id='accounts.loginCode.email'
                defaultMessage='Email'
              />
            }
          </InputLabel>
          <Input
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>
        {error && <FormError error={error!} />}
        <Button variant="contained" color="primary" type="submit">
          <FormattedMessage
            id='accounts.next'
            defaultMessage='下一步'
          />
        </Button>
        {!spaceId && tenant.enable_register && tenant.enable_password_login === false &&
        <Button onClick={goSignup}>
          <FormattedMessage
              id='accounts.signup'
              defaultMessage='Sign Up'
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
