import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import * as Utils from '../utils/utils';
import FormError from '../components/FormError';
import Card from '../components/Card';
import Logo from '../components/Logo';
import Background from '../components/Background';
import LocalizedInput from '../components/LocalizedInput';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { login, sendVerificationToken } from '../actions/users';
import { withRouter } from "react-router-dom";
import * as GlobalAction from '../actions/global_actions';
import { getCurrentUserId, getCurrentUser } from '../selectors/entities/users';
import { useCountDown } from "../components/countdown";
import LocalStorageStore from '../stores/local_storage_store';
import { isString, each, compact, values } from 'lodash'

import {Tabs,Tab,Paper} from '@material-ui/core';

const totalSeconds = 60;
const ReApplyCodeBtn = ({ onClick, id, loginId, disabled }) => {
  const [restTime, resetCountdown] = useCountDown(loginId || "cnt1", {
    total: totalSeconds,
    lifecycle: "session"
  });
  let textColor = "text-blue-600 hover:text-blue-600"
  if (restTime > 0 || disabled) {
    textColor = "text-gray-300 hover:text-gray-300"
  }
  return (
    <button className={"justify-center col-span-2 -ml-px relative inline-flex items-center px-3 py-3 border border-gray-300 text-sm leading-5 font-medium rounded-br-md bg-gray-100 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 transition ease-in-out duration-150 " + textColor}
      id={id}
      disabled={(restTime > 0 || disabled) ? 'disabled' : ''}
      type="button"
      onClick={(e) => {
        resetCountdown();
        if (onClick) {
          onClick();
        }
      }}>
      <span className="">
        <FormattedMessage
          id='accounts.sendCode'
          defaultMessage='Get Verify code'
        />{restTime > 0 ? ` (${restTime})` : null}
      </span>
    </button>

  );
};

class Login extends React.Component {

  constructor(props, context) {

    super(props, context);
    let inApp = false
    let email = '';
    if ((new URLSearchParams(this.props.location.search)).get('email')) {
      email = (new URLSearchParams(this.props.location.search)).get('email');
    }
    let spaceId = '';
    if ((new URLSearchParams(this.props.location.search)).get('X-Space-Id')) {
      spaceId = (new URLSearchParams(this.props.location.search)).get('email');
    } else if (this.props.settingsTenantId) {
      spaceId = this.props.settingsTenantId
    }

    if (this.props.location.search.indexOf(".meteor.local") > -1) {
      inApp = true;
    }


    this.state = {
      // ldapEnabled: this.props.isLicensed && this.props.enableLdap,
      // samlEnabled: this.props.isLicensed && this.props.enableSaml,
      spaceId,
      email,
      username: '',
      mobile: '',
      loginId: '',
      userId: '',
      password: '',
      verifyCode: '',
      sessionExpired: false,
      loginSuccess: false,

      loginByEmail: true,
      loginByMobile: true,
      loginBy: "mobile",

      loginWith: this.props.tenant.enable_password_login ? 'password' : 'code',
      loginWithCode: this.props.tenant.enable_mobile_code_login || this.props.tenant.enable_email_code_login,
      loginWithPassword: this.props.tenant.enable_password_login,

      serverError: '',
      loading: false,
      MFA: false,
      mobile_verified: false,
      // brandImageError: false,
      inApp: inApp,
      geetestValidate: '',
      disabledSendVerificationstate: this.props.settings.tenant.enable_open_geetest || false,
      tabIndex: 0
    };

    

    // if (this.props.tenant.enable_mobile_code_login || this.props.tenant.enable_email_code_login) {
    //   this.state.loginWithCode = true;
    //   this.state.loginByEmail = true;
    //   this.state.loginByMobile = true;
    //   this.state.loginBy = "mobile"
    // } else if (this.props.tenant.enable_mobile_code_login) {
    //   this.state.loginWithCode = true
    //   this.state.loginByMobile = true;
    //   this.state.loginByEmail = false;
    //   this.state.loginBy = "mobile"
    // } else if (this.props.tenant.enable_email_code_login) {
    //   this.state.loginWithCode = true
    //   this.state.loginByMobile = false;
    //   this.state.loginByEmail = true;
    //   this.state.loginBy = "email"
    // } else if (this.props.tenant.enable_password_login) {
    //   this.state.loginWithPassword = true
    //   this.state.loginByEmail = true;
    //   this.state.loginByMobile = true;
    //   this.state.loginBy = "email"
    // } 

    // this.state.loginWithCode = false
    // this.state.loginWithPassword = true
    // this.state.loginByMobile = true;
    // this.state.loginByEmail = true;
    // this.state.loginBy = "email"

    this.emailInput = React.createRef();
    this.mobileInput = React.createRef();
    this.passwordInput = React.createRef();

    window.browserHistory = this.props.history;
    document.title = Utils.localizeMessage('accounts.signin') + ` | ${this.props.tenant.name}`;


  }

  createLoginPlaceholder = () => {

    let inputLabel = '';
    if (this.state.loginBy == "mobile")
      inputLabel = 'accounts.mobile';
    else if (this.state.loginBy == "email")
      inputLabel = 'accounts.email';

    return Utils.localizeMessage(inputLabel)
  }

  handleLoginIdChange = (e) => {
    const loginId = e.target.value;
    if (this.state.MFA) {
      this.setState({
        loginId,
        mobile: e.target.value,
        username: null,
        email: null,
        loginBy: 'mobile'
      });
      return;
    }
    if (loginId.indexOf('@') > 0) {
      this.setState({
        loginId,
        email: e.target.value,
        username: null,
        mobile: null,
        loginBy: 'email'
      });
    } else {
      if (new RegExp('^[0-9]{11}$').test(e.target.value)) {
        this.setState({
          loginId,
          mobile: e.target.value,
          username: null,
          email: null,
          loginBy: 'mobile'
        });
      } else {
        this.setState({
          loginId,
          username: e.target.value,
          mobile: null,
          email: null,
          loginBy: 'username'
        });
      }
    }
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  handleCodeChange = (e) => {
    this.setState({
      verifyCode: e.target.value,
    });
  }

  handleTabChange = (event, newValue) => {
    this.setState({
      tabIndex: newValue,
      loginWith: newValue === 0 ? 'password' : 'code'
    });
  }

  switchLoginWithCode = (e) => {
    this.setState({
      loginWith: 'code',
    });
  }

  switchLoginWithPassword = (e) => {
    this.setState({
      loginWith: 'password',
    });
  }

  sendVerificationToken = () => {
    this.setState({ serverError: null, loading: true });
    if (this.state.loginBy === 'email' && !this.state.email.trim()) {
      this.setState({
        serverError: (
          <FormattedMessage
            id='accounts.invalidEmail'
          />
        ),
      });
      return
    }
    if (this.state.loginBy === 'mobile' && (!this.state.mobile || !this.state.mobile.trim() || !new RegExp('^[0-9]{11}$').test(this.state.mobile))) {
      this.setState({
        serverError: (
          <FormattedMessage
            id='accounts.invalidMobile'
          />
        ),
      });
      return
    }

    const user = {
      email: this.state.loginBy === 'email' ? this.state.email.trim() : '',
      mobile: this.state.loginBy === 'mobile' ? this.state.mobile.trim() : '',
    }

    if (this.props.settings.tenant.enable_open_geetest === true) {
      this.setState({
        disabledSendVerificationstate: true
      })
    }
    this.props.actions.sendVerificationToken(user, this.state.geetestValidate).then(async (userId) => {
      this.state.userId = userId;
      if (!userId)
        this.setState({
          serverError: (
            <FormattedMessage
              id='accounts.userNotFound'
              defaultMessage='User not found.'
            />
          ),
        });
    });

  }
  onSubmit = async (e) => {
    this.setState({ serverError: null, loading: true });
    e.preventDefault();
    this.setState({ error: null });

    if (this.state.loginBy === 'email' && !this.state.email.trim()) {
      this.setState({
        serverError: (
          <FormattedMessage
            id='accounts.invalidEmail'
          />
        ),
      });
      return
    }
    if (this.state.loginBy === 'mobile' && !this.state.mobile.trim()) {
      this.setState({
        serverError: (
          <FormattedMessage
            id='accounts.invalidMobile'
          />
        ),
      });
      return
    }

    // if(!this.state.password.trim()){
    //   throw new Error('accounts.passwordRequired');
    // }

    const user = {
      email: this.state.loginBy === 'email' ? this.state.email.trim() : '',
      mobile: this.state.loginBy === 'mobile' ? this.state.mobile.trim() : '',
      username: (this.state.loginWith === 'password' && this.state.loginBy === 'username') ? this.state.username.trim() : '',
      spaceId: this.state.spaceId,
    }
    this.props.actions.login(user, this.state.password ? this.state.password.trim() : this.state.password, this.state.verifyCode ? this.state.verifyCode.trim() : this.state.verifyCode).then(async (args) => {
      const { error, mobile_verified, mobile } = args;
      if (error === 'TO_MOBILE_CODE_LOGIN') {

        this.setState({
          loginByEmail: false,

          loginByMobile: true,
          loginBy: "mobile",
          loginWith: 'code',
          MFA: true,
          loginId: mobile,
          mobile: mobile,
          mobile_verified: mobile_verified,
          email: null,
          username: null
        });
        this.initGeetest()
        return ;
      } else if (error === 'TO_VERIFY_MOBILE') {
        const location = this.props.location;
        GlobalAction.redirectUserToVerifyMobile(location)
      }
      if (error) {
        this.setState({
          serverError: (
            <FormattedMessage
              id={error.message}
            />
          ),
        });
        return;
      }
      this.finishSignin();

    });
  };

  finishSignin = (team) => {
    const currentUser = this.props.currentUser;
    const tenant = this.props.tenant;
    const location = this.props.location;
    GlobalAction.finishSignin(currentUser, tenant, location)
  }

  goSignup = () => {
    let state = {};
    if (this.state.email && this.state.email.trim().length > 0) {
      state = { email: this.state.email.trim() }
    }

    if (this.state.mobile && this.state.mobile.trim().length > 0) {
      state = { mobile: this.state.mobile.trim() }
    }
    this.props.history.push({
      pathname: `/signup`,
      search: this.props.location.search,
      state: state
    })
  }
  handlerGeetest = (captchaObj) => {
    var div = document.getElementById("captcha");
    if (div) {
      captchaObj.appendTo("#captcha");
      captchaObj.onReady(() => {
      }).onSuccess(() => {
        var geetestValidate = captchaObj.getValidate();
        this.setState({
          disabledSendVerificationstate: false,
          geetestValidate: geetestValidate
        })
        captchaObj.reset()
      }).onError(() => {
      })
    }
  };
  initGeetest = () => {
    if(this.props.settings.tenant.enable_open_geetest != true){
      return ;
    }
    const url = (process.env.NODE_ENV == 'development' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '';
    fetch(url + "/accounts/geetest/geetest-init", {
      method: 'POST',
    }).then((response) => {
      return response.text()
    }).then((data) => {
      window.initGeetest({
        gt: JSON.parse(data).gt,
        challenge: JSON.parse(data).challenge,
        new_captcha: JSON.parse(data).new_captcha, // 用于宕机时表示是新验证码的宕机
        offline: !JSON.parse(data).success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        product: "float", // 产品形式，包括：float，popup
        width: "100%"
      }, this.handlerGeetest);
    })
  }

  componentDidMount() {
    this.initGeetest()
  }

  render() {
    return (
      <>
        <Background />
        <Card>
          <Logo />
          <h2 className="mt-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
            {this.state.MFA && <FormattedMessage
              id='accounts.signin-MFA'
              defaultMessage='Multi-Factor Authentication'
            />}
            {!this.state.MFA && <FormattedMessage
              id='accounts.signin'
              defaultMessage='Login'
            />}

          </h2>
          { !this.state.MFA && this.state.loginWithCode && this.state.loginWithPassword && <Paper variant='outlined' style={{border:"none"}}>
          <Tabs
            indicatorColor="primary"
            value={this.state.tabIndex}
            textColor="primary"
            onChange={this.handleTabChange}
            centered={true}
            variant='fullWidth'
          >
            <Tab label={<FormattedMessage
                id='accounts.passwordLogin'
                defaultMessage='密码登录'
              />}>
            </Tab>
            <Tab label={<FormattedMessage
                id='accounts.codeLogin'
                defaultMessage='验证码登录'
              />}>
            </Tab>
          </Tabs></Paper>}
          <form onSubmit={this.onSubmit} className="mt-4" autoCapitalize="none">
            <div className="rounded-md shadow-sm my-2">
              <div style={this.state.MFA && this.state.mobile_verified ? { "display": "none" } : {}}>
                <LocalizedInput
                  id="loginId"
                  name="loginId"
                  ref={this.loginIdInput}
                  value={this.state.loginId}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                  placeholder={this.state.MFA ? { id: 'accounts.mobile', defaultMessage: 'Mobile' } : { id: 'accounts.email_mobile', defaultMessage: 'Email or mobile' }}
                  onChange={this.handleLoginIdChange}
                />
              </div>

              {this.state.MFA && this.state.mobile_verified &&
                <div>
                  <LocalizedInput
                    id="loginIdShow"
                    name="loginIdShow"
                    value={isString(this.state.loginId) ? this.state.loginId.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : this.state.loginId}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                    placeholder={this.state.MFA ? { id: 'accounts.mobile', defaultMessage: 'Mobile' } : { id: 'accounts.email_mobile', defaultMessage: 'Email or mobile' }}
                    disabled={true}
                  />
                </div>
              }

              {this.state.loginWith == 'password' && (
                <div className="-mt-px">
                  <LocalizedInput
                    type="password"
                    id="password"
                    name="password"
                    value={this.state.password}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                    placeholder={{ id: 'accounts.password_placeholder', defaultMessage: 'Password' }}
                    onChange={this.handlePasswordChange}
                    autocomplete="new-password"
                  />
                </div>
              )}

              {this.state.loginWith == 'code' && (
                <>
                  <div className="-mt-px grid grid-cols-5">
                    <LocalizedInput
                      id="verifyCode"
                      name="verifyCode"
                      value={this.state.verifyCode}
                      className="col-span-3 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                      placeholder={{ id: 'accounts.verifyCode', defaultMessage: 'Verify Code' }}
                      onChange={this.handleCodeChange}
                    />
                    <ReApplyCodeBtn id="reApplyCodeBtn" onClick={this.sendVerificationToken} loginId={this.state.email + this.state.mobile} disabled={this.state.disabledSendVerificationstate} />
                  </div>
                  <div id='captcha' onClick={this.onClickCaptcha}>
                  </div>
                </>
              )}
            </div>

            {this.state.serverError && <FormError error={this.state.serverError} />}

            <div className="mt-6 flex justify-end">
              <button type="submit" className=" group relative w-full justify-center rounded-md py-2 px-4 border border-transparent text-sm leading-5 font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
                <FormattedMessage
                  id='accounts.submit'
                  defaultMessage='Submit'
                />
              </button>
            </div>

            {!this.state.MFA && this.props.tenant.enable_register && this.props.tenant.disabled_account_register !== true &&
              <div className="text-sm leading-5 mt-6 text-center">
                <FormattedMessage
                  id='accounts.no_account'
                  defaultMessage='No Account?'
                />
                <button type="button" onClick={this.goSignup}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                  <FormattedMessage
                    id='accounts.signup'
                    defaultMessage='Sign Up'
                  />
                </button>
              </div>}

            {this.state.inApp !== true && compact(values(this.props.tenant.sso_providers)).length > 0 && <>
              <div class="mt-6 mb-6 relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm text-slate-700">
                  <span class="px-2 bg-white text-gray-500">
                    使用以下账户
                  </span>
                </div>
              </div>
              <>
                {compact(values(this.props.tenant.sso_providers)).map((provider) => {
                  return <div className="flex">
                    <a href={provider.url} title={provider.label} className="w-full  border border-gray-300 justify-center hover:bg-gray-50 text-gray-800 py-2 px-4 rounded inline-flex items-center">
                      <img className="w-4 h-4 mr-2" src={provider.logo}></img>
                      <span className='text-sm'>{provider.label}</span>
                    </a>
                  </div>
                })}
              </>
            </>
            }

          </form>
        </Card>
      </>
    );
  };

}

function mapStateToProps(state) {

  return {
    getCurrentUserId: getCurrentUserId(state),
    currentUser: getCurrentUser(state),
    settings: getSettings(state),
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      login,
      sendVerificationToken,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
