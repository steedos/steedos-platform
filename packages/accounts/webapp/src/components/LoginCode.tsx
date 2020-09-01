import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { ApplyCode } from '../client';
import { accountsEvent, accountsEventOnError} from '../client/accounts.events'

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

const LoginCode = ({match, settingsTenantId, settings, history, location, tenant }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | "">(_email);
  const [signupDialogState, setSignupDialogState] = useState<boolean>(false);
  const type = match.params.type || 'email';
  const searchParams = new URLSearchParams(location.search);
  let spaceId = searchParams.get("X-Space-Id") || settingsTenantId;


  let inputLabel = 'accounts.loginCode.username';
  if (tenant.enable_password_login)
    inputLabel = 'accounts.loginCode.username';
  else if (tenant.enable_mobile_code_login && tenant.enable_email_code_login) 
    inputLabel = 'accounts.loginCode.email_or_mobile';
  else if (tenant.enable_mobile_code_login) 
    inputLabel = 'accounts.loginCode.mobile';
  else if (tenant.enable_email_code_login) 
    inputLabel = 'accounts.loginCode.email';
  


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      // 必填
      if(!email.trim()){
        throw new Error("输入错误！");
      }

      // 判断账户是否已存在
      const data = await accountsRest.fetch( `user/exists?id=${email.trim()}`, {});
      if(!data.exists) {
        signupDialogOpen();
        return;
      }

      if(tenant.enable_password_login){
        history.push({
          pathname: `/password/`,
          search: location.search,
          state: { email: email.trim() }
        })
        return;
      } 

      history.push({
        pathname: `/verify/go`,
        search: location.search,
        state: { email: email.trim(), spaceId:spaceId }
      })
      
    } catch (err) {
      setError(err.message);
    }
  };

  const goSignup = ()=>{
    let state = {};
    if(email.trim().length > 0){
      state =  { email: email.trim() }
    }
    history.push({
      pathname: `/signup`,
      search: location.search,
      state: state
  })
  }
  const signupDialogOpen = ()=>{
    setSignupDialogState(true)
  }
  const signupDialogClose = ()=>{
    setSignupDialogState(false)
  }

  return (
      <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
        <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={signupDialogState}
        onClose={signupDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"提示"}</DialogTitle>
        <DialogContent>
        {tenant.enable_register &&
          <DialogContentText id="alert-dialog-description">
            此账户未注册，请注册后再登录。
          </DialogContentText>
        }
        {!tenant.enable_register &&
          <DialogContentText id="alert-dialog-description">
            未找到此账户，请联系系统管理员。
          </DialogContentText>
        }
        </DialogContent>
        
        {tenant.enable_register &&
        <DialogActions>
          <Button onClick={signupDialogClose} color="primary">
            暂不注册
          </Button>
          <Button onClick={goSignup} variant="contained" color="primary" autoFocus>
            立即注册
          </Button>
          </DialogActions>
        }

        {!tenant.enable_register &&
        <DialogActions>
          <Button onClick={signupDialogClose} color="primary">
            关闭
          </Button>
          </DialogActions>
        }
        
      </Dialog>
        <FormControl margin="normal">
          <InputLabel htmlFor="verifyCode">
            <FormattedMessage
              id={inputLabel}
            />
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
            defaultMessage='Next'
          />
        </Button>
        {tenant.enable_register &&
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
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

export default connect(mapStateToProps)(LoginCode);
