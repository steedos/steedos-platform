import React, { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Input, Button, Typography, InputAdornment, Link , Theme} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { Login, ApplyCode } from '../client'
import { useCountDown } from "./countdown";
const totalSeconds = 60;

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0 auto",
    marginBottom: 16
  },
  back: {
    marginTop: theme.spacing(1)
  }
}));

const reApplyCodeBtnStyles = makeStyles({
  btn: {
    padding: 0
  },
  text: {
    textAlign: "right",
    whiteSpace: "nowrap"
  }
});

const ReApplyCodeBtn = ({ onClick, id, name }: any) => {
  const classes:any = reApplyCodeBtnStyles();
  const [restTime, resetCountdown] = useCountDown(name || "cnt1", {
    total: totalSeconds,
    lifecycle: "session"
  });
  return (
    <Button
    id={id}
    className={classes.btn}
      disabled={restTime > 0}
      onClick={() => {
        resetCountdown();
        if(onClick){
          onClick();
        }
      }}
    >
      <span className={classes.text}>
      <FormattedMessage
          id='accounts.reSendCode'
          defaultMessage='获取验证码' 
        />{restTime > 0 ? ` (${restTime}s)` : null}
        </span>
    </Button>
  );
};


const Verify = ({ match, settings, tenant, history, location, setState }: any) => {
  // const email = location && location.state ? location.state.email : '';
  const _token = match.params.token;
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | "">("");
  const [id, setId] = useState<string | "">("");
  const [token, setToken] = useState<string | "">(_token);
  const [action, setAction] = useState<string | "">("");
  const [name, setName] = useState<string | "">("");
  const [actionLabel, setActionLabel] = useState<string | "">("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {

      if(!code.trim()){
        throw new Error("请输入验证码");
      }

      const data = {
        user: {
          id: id
        },
        token: token,
        token_code: code.trim(),
      }
      await Login(data, history, tenant, location, action);
      setCode('');
    } catch (err) {
      setCode('');
      setError(err.message);
    }
  };

  const getCodeId = async () => {
    try {
      const data = await accountsRest.fetch(`code/id?token=${token}`, {});
      if (data.id) {
        setId(data.id);
      }
      setAction(data.action);
      setName(data.name);
      if (data.expired) {
        setError("验证码已失效");
      }else{
        // let reApplyCodeBtn: any = document.getElementById('reApplyCodeBtn')
        // if(reApplyCodeBtn){
        //   reApplyCodeBtn.click();
        // }
      }
    } catch (err) {
      setError(err.message);
      history.push('/login')
    }
  }

  const reApplyCode = async () => {
    setError(null);
    try {
      const data = await ApplyCode({
        token: token,
        action: action,
      });
      if (data.token) {
        setToken(data.token)
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getCodeId();
  }, []);

  useEffect(() => {

    if(action.startsWith("email")){
      setActionLabel('邮箱');
    }

    if(action.startsWith("mobile")){
      setActionLabel('手机号');
    }
    
  }, [action,name]);

  return (
    <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
      <h4 className={classes.title}>
        <FormattedMessage
          id="accounts.verify"
        />{actionLabel}
      </h4>
      <Typography variant="body2" gutterBottom>请输入发送至 <b>{name}</b> 的 6 位验证码，有效期十分钟。如未收到，请重新获取验证码。</Typography>
      <FormControl margin="normal">
        <InputLabel htmlFor="verifyCode">
          <FormattedMessage
            id='accounts.verifyCode'
            defaultMessage='Verification code'
          />
        </InputLabel>
        <Input
          id="code"
          value={code}
          onChange={e => setCode(e.target.value)}
          endAdornment={ id && 
            <InputAdornment position="end">
              <ReApplyCodeBtn onClick={reApplyCode} id="reApplyCodeBtn" name={_token}/>
            </InputAdornment>
          }
        />
      </FormControl>
      {error && <FormError error={error!} />}
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
          id='accounts.next'
          defaultMessage='Next'
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

export default connect(mapStateToProps)(Verify);
