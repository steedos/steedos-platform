import React, { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Input, Button, Typography, InputAdornment, Link , Theme} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { Login, ApplyCode } from '../client'
import { useCountDown } from "./countdown";
import { requests } from '../actions/requests';

const totalSeconds = 60;


const ReApplyCodeBtn = ({ onClick, id, name }: any) => {
  const [restTime, resetCountdown] = useCountDown(name || "cnt1", {
    total: totalSeconds,
    lifecycle: "session"
  });
  let textColor = "text-blue-600 hover:text-blue-600"
  if (restTime > 0) {
    textColor = "text-gray-300 hover:text-gray-300"
  }
  return (
    <div className="text-sm leading-5 my-4">
      <button type="button"
        id={id}
        disabled={restTime > 0}
        onClick={(e:any) => {
          if(e.target && e.target.dataset && e.target.dataset.onlyCountDown === "1"){
            resetCountdown();
          }else{
            resetCountdown();
            if(onClick){
              onClick();
            }
          }
        }}
        className={"font-medium focus:outline-none hover:underline transition ease-in-out duration-150 " + textColor}>
      <FormattedMessage
          id='accounts.reSendCode'
          defaultMessage='Get Verify code' 
        />{restTime > 0 ? ` (${restTime}s)` : null}
      </button>
    </div>

  );
};


const Verify = ({ match, settings, tenant, history, location, setState, requestLoading, requestUnLoading }: any) => {
  const _email = location && location.state ? location.state.email : '';
  const _spaceId = location && location.state ? location.state.spaceId : '';
  // const _token = match.params.token;
  let _token = "";
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | "">("");
  const [code, setCode] = useState<string | "">("");
  const [id, setId] = useState<string | "">("");
  const [action, setAction] = useState<string | "">("");
  const [name, setName] = useState<string | "">("");


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {

      if(!code || !code.trim()){
        throw new Error("accounts.codeRequired");
      }

      console.log(token)
      requestLoading();
      await Login({
        user: {
          id: id
        },
        token: token,
        token_code: code.trim(),
      }, history, tenant, location, action);
      setCode('');
    } catch (err) {
      requestUnLoading();
      setCode('');
      setError(err.message);
    }
  };

  const getCodeId = async (token:any) => {
    try {
      const data = await accountsRest.fetch(`code/id?token=${token}`, {});
      if (data.id) {
        setId(data.id);
      }
      setAction(data.action);
      setName(data.name);
      if (data.expired) {
        setError("accounts.codeExpired");
      }else{
        let reApplyCodeBtn: any = document.getElementById('reApplyCodeBtn')
        if(reApplyCodeBtn){
          reApplyCodeBtn.dataset.onlyCountDown = "1";
          reApplyCodeBtn.click();
          reApplyCodeBtn.dataset.onlyCountDown = "0";
        }
      }
    } catch (err) {
      setError(err.message);
      //history.push('/login')
    }
  }

  const applyCode = async () => {

    if (!_email){
      history.push('/login');
      return (<div/>);
    }
    
    if (token)
      return;

    setError(null);

    let action = '';
    if (tenant.enable_mobile_code_login && tenant.enable_email_code_login) {
      if(_email.trim().indexOf("@") < 0){
        action = 'mobileLogin'
      } else 
        action = 'emailLogin';
    } else if (tenant.enable_mobile_code_login) {
      action = 'mobileLogin'
    } else if (tenant.enable_email_code_login) {
      action = 'emailLogin';
    } else {
      throw new Error("配置错误，请启用密码验证、手机验证或邮箱验证。");
    }

    try {
      const getCode = await ApplyCode({
        name: _email,
        action: action,
        spaceId: _spaceId
      });
      if (getCode.token) {
        setToken(getCode.token);
        getCodeId(getCode.token);
      }
    } catch (err) {
      setError(err.message);
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
        setToken(data.token);
      }
    } catch (err) {
      setError(err.message);
    }
  }


  useEffect(() => {
    applyCode();
  }, []);
  

  document.title = useIntl().formatMessage({id:'accounts.title.verify'}) + ` | ${tenant.name}` ;

  return (
  <div>

    <button
      className="flex text-sm text-gray-600 hover:text-gray-800 py-2"
      onClick={function() {
        history.goBack();
      }}
      >
        <span className="left-0 inset-y-0 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 pr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {name}
        </span>
    </button>

    <h2 className="my-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
      <FormattedMessage
          id='accounts.title.verify'
          defaultMessage='Verify'
        />
    </h2>

    <div className="my-2">
      <FormattedMessage
          id='accounts.verify.info'
          values={{
            name: <b>{name}</b>
          }}
        />
    </div>

    <form onSubmit={onSubmit} className="mt-4" autoCapitalize="none">

      <div className="rounded-md shadow-sm my-2">
        <div>
          <input 
            aria-label={useIntl().formatMessage({id: 'accounts.verifyCode'})}
            id="code"
            name="code" 
            value={code}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
            placeholder={useIntl().formatMessage({id: 'accounts.verifyCode'})}
            onChange={e => setCode(e.target.value)}
          />
        </div>
      </div>

      {error && <FormError error={error!} />}
      
      <ReApplyCodeBtn onClick={reApplyCode} id="reApplyCodeBtn" name={token}/>
    
      <div className="mt-6 flex justify-end">
        <button type="submit" className="group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
          <FormattedMessage
            id='accounts.next'
            defaultMessage='Next'
          />
        </button>
      </div>

    </form>
  </div>
  );
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return ({
    requestLoading: () => dispatch(requests("started")),
    requestUnLoading: () => dispatch(requests("no_started")),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
