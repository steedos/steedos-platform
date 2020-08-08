import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles, FormControl, InputAdornment, InputLabel, Input, Button} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from './FormError';
import { getCookie, getRootUrlPathPrefix } from '../utils/utils';
import { accountsClient, accountsRest } from '../accounts';
import { useCountDown } from "./countdown";
const totalSeconds = 60;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      margin: "0 auto",
    }
  }),
);

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
      onClick={async (e:any) => {
        if(e.target && e.target.dataset && e.target.dataset.onlyCountDown === "1"){
          resetCountdown();
        }else{
          let countDownStart = true;
          if(onClick){
            countDownStart = await onClick();
          }
          if(countDownStart){
            resetCountdown();
          }
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

const GenerateLicense = ({ settings, history, tenant, location }: any) => {
  const searchParams = new URLSearchParams(location.search);
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | "">("");
  const [applyName, setApplyName] = useState<string | "">("");
  const [applyMobile, setApplyMobile] = useState<string | "">("");
  const [applyEmail, setApplyEmail] = useState<string | "">("");
  const [verifyCode, setVerifyCode] = useState<string | "">("");
  const [verifyToken, setVerifyToken] = useState<string | "">("");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {

      if (!tenantName.trim()) {
        throw new Error('申请企业名称不能为空');
      }
      
      //TODO 校验格式
      if (!applyName.trim()) {
        throw new Error('申请联系人姓名不能为空');
      }


      //TODO 校验格式
      if (!applyMobile.trim()) {
        throw new Error('申请联系人手机号不能为空');
      }

      //TODO 校验格式
      if (!applyEmail.trim()) {
        throw new Error('申请联系人邮箱不能为空');
      }

      if (!verifyCode.trim()) {
        throw new Error('验证码不能为空');
      }

      if(!verifyToken.trim()){
        throw new Error('程序异常，请刷新页面');
      }

      let body: any = {
        name: tenantName,
        apply_name: applyName,
        apply_mobile: applyMobile,
        apply_email: applyEmail,
        verify_code: verifyCode,
        verify_token: verifyToken
      }

      if(searchParams.get('is_develop')){
        body.is_develop = true
      }else{
        body.is_trial = true
      }

      const route = 'api/license/apply';
      const fetchOptions: any = {
        // headers: {
        //   "X-User-Id": getCookie("X-User-Id"),
        //   "X-Auth-Token": getCookie("X-Auth-Token")
        // },
        method: "POST",
        body: JSON.stringify(body),
        credentials: 'include'
      };
      const res: any = await fetch(`${getRootUrlPathPrefix(settings.root_url)}/${route}`,
        fetchOptions
      );
      if (res) {
        if (res.status >= 400 && res.status < 600) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const resJson = await res.json();
        history.push({
          pathname: `/result-license`,
          state: {data: resJson.data}
        })
      } else {
        throw new Error('Server did not return a response');
      }
    //   goInSystem(history, location, token.accessToken, settings.root_url, true);
    } catch (err) {
      setError(err.message);
    }
  };

  const reApplyCode = async () => {
    setError(null);
    try {
      if(!applyMobile){
        throw new Error('申请联系人手机号不能为空');
      }
      const body = {
        name: applyMobile,
        action: 'mobileApplyLicense',
      }
      const route = 'api/license/code_apply';
      const fetchOptions: any = {
        method: "POST",
        body: JSON.stringify(body),
        credentials: 'include'
      };
      const res: any = await fetch(`${getRootUrlPathPrefix(settings.root_url)}/${route}`,
        fetchOptions
      );
      if (res) {
        if (res.status >= 400 && res.status < 600) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const resJson = await res.json();
        setVerifyToken(resJson.token);
        return true;
      } else {
        throw new Error('Server did not return a response');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
        <FormControl margin="normal">
          <InputLabel htmlFor="tenantName">
            <FormattedMessage
              id='accounts.tenant_name'
              defaultMessage='Company Name'
            />
          </InputLabel>
          <Input
            id="tenantName"
            value={tenantName}
            onChange={e => setTenantName(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="applyName">
            <FormattedMessage
              id='accounts.apply_name'
              defaultMessage='申请联系人姓名'
            />
          </InputLabel>
          <Input
            id="applyName"
            value={applyName}
            onChange={e => setApplyName(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="applyEmail">
            <FormattedMessage
              id='accounts.apply_email'
              defaultMessage='申请联系人邮箱'
            />
          </InputLabel>
          <Input
            id="applyEmail"
            value={applyEmail}
            onChange={e => setApplyEmail(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="applyMobile">
            <FormattedMessage
              id='accounts.apply_mobile'
              defaultMessage='申请联系人手机号'
            />
          </InputLabel>
          <Input
            id="applyMobile"
            value={applyMobile}
            onChange={e => setApplyMobile(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="verifyCode">
            <FormattedMessage
              id='accounts.verifyCode'
              defaultMessage='Verification code'
            />
          </InputLabel>
          <Input
            id="verifyCode"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <ReApplyCodeBtn onClick={reApplyCode} id="reApplyCodeBtn" name="vcode" />
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

export default connect(mapStateToProps)(GenerateLicense);
