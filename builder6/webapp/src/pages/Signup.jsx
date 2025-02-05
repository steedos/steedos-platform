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
import { bindActionCreators } from 'redux';
import { createUser, sendVerificationToken } from '../actions/users';
import * as GlobalAction from '../actions/global_actions';
import { getCurrentUserId } from '../selectors/entities/users';
import { useCountDown } from "../components/countdown";
import { validatePassword } from '../client/password';

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

    <button className={"justify-center col-span-2 -ml-px relative inline-flex items-center px-3 py-3 border border-gray-300 text-sm leading-5 font-medium bg-gray-100 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 transition ease-in-out duration-150 " + textColor}
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


class Signup extends React.Component {

  constructor(props, context) {
    super(props, context);

    let email = '';
    if ((new URLSearchParams(this.props.location.search)).get('email')) {
      email = (new URLSearchParams(this.props.location.search)).get('email');
    }
    let mobile = '';
    if ((new URLSearchParams(this.props.location.search)).get('mobile')) {
      mobile = (new URLSearchParams(this.props.location.search)).get('mobile');
    }
    let invite_token = '';
    if ((new URLSearchParams(this.props.location.search)).get('invite_token')) {
      invite_token = (new URLSearchParams(this.props.location.search)).get('invite_token');
    }

    let spaceId = this.props.settingsTenantId

    this.state = {
      // ldapEnabled: this.props.isLicensed && this.props.enableLdap,
      // samlEnabled: this.props.isLicensed && this.props.enableSaml,
      invite_token,
      spaceId,
      email,
      mobile,
      userId: '',
      password: '',
      verifyCode: '',
      sessionExpired: false,
      loginSuccess: false,

      loginByEmail: false,
      loginByMobile: false,
      loginBy: "mobile",

      loginWithCode: false,
      loginWithPassword: false,

      serverError: '',
      loading: false,
      geetestValidate: '',
      disabledSendVerificationstate: this.props.settings.tenant.enable_open_geetest || false

      // brandImageError: false,
    };



    if (this.props.tenant.enable_mobile_code_login && this.props.tenant.enable_email_code_login) {
      this.state.loginWithCode = true;
      this.state.loginByEmail = true;
      this.state.loginByMobile = true;
      this.state.loginBy = "mobile"
    } else if (this.props.tenant.enable_mobile_code_login) {
      this.state.loginWithCode = true
      this.state.loginByMobile = true;
      this.state.loginByEmail = false;
      this.state.loginBy = "mobile"
    } else if (this.props.tenant.enable_email_code_login) {
      this.state.loginWithCode = true
      this.state.loginByMobile = false;
      this.state.loginByEmail = true;
      this.state.loginBy = "email"
    } else if (this.props.tenant.enable_password_login) {
      this.state.loginWithPassword = true
      this.state.loginByEmail = true;
      this.state.loginByMobile = false;
      this.state.loginBy = "email"
    }

    // this.state.loginWithCode = false
    // this.state.loginWithPassword = true
    // this.state.loginByMobile = true;
    // this.state.loginByEmail = true;
    // this.state.loginBy = "email"

    this.emailInput = React.createRef();
    this.mobileInput = React.createRef();
    this.passwordInput = React.createRef();

    window.browserHistory = this.props.history;
    document.title = Utils.localizeMessage('accounts.signup') + ` | ${this.props.tenant.name}`;


  }

  createLoginPlaceholder = () => {

    let inputLabel = '';
    if (this.state.loginBy == "mobile")
      inputLabel = 'accounts.mobile';
    else if (this.state.loginBy == "email")
      inputLabel = 'accounts.email';

    return Utils.localizeMessage(inputLabel)
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  switchLoginByMobile = (e) => {
    this.setState({
      loginBy: 'mobile',
    });
  }

  switchLoginByEmail = (e) => {
    this.setState({
      loginBy: 'email',
    });
  }

  tabColor = (tab) => {
    if (this.state.loginBy === tab)
      return "text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-300"
    else
      return "text-gray-600 hover:text-gray-500 hover:border-gray-300"
  }

  handleMobileChange = (e) => {
    this.setState({
      mobile: e.target.value,
    });
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

  goLogin = () => {
    let state = {
      email: this.state.email,
      mobile: this.state.mobile,
    };
    this.props.history.push({
      pathname: `/login`,
      search: this.props.location.search,
      state: state
    })
  }

  sendVerificationToken = (e) => {

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
      // if (!userId)
      //   this.setState({
      //       serverError: (
      //           <FormattedMessage
      //               id='accounts.userNotFound'
      //               defaultMessage='User not found.'
      //           />
      //       ),
      //   });
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

    if (!this.state.name || !this.state.name.trim()) {
      this.setState({
        serverError: (
          <FormattedMessage
            id='accounts.nameRequired'
          />
        ),
      });
      return
    }

    // if(!this.state.password.trim()){
    //   throw new Error('accounts.passwordRequired');
    // }

    if (this.state.loginWithCode) {
      if (!this.state.verifyCode.trim()) {
        this.setState({
          serverError: (
            <FormattedMessage
              id='accounts.codeRequired'
            />
          ),
        });
        return
      }
    }

    const user = {
      password: this.state.password ? this.state.password.trim() : this.state.password,
      name: this.state.name.trim(),
      locale: Utils.getBrowserLocale(),
      verifyCode: this.state.verifyCode ? this.state.verifyCode.trim() : this.state.verifyCode,
    }

    if (user.password) {
      try {
        validatePassword(this.props.settings.password, user.password, user.name)
      } catch (error) {
        this.setState({
          serverError: (
            <FormattedMessage
              id={error.message}
            />
          ),
        });
        return
      }
    }

    if (this.state.spaceId) {
      user.spaceId = this.state.spaceId;
    }

    if (this.state.invite_token) {
      user.invite_token = this.state.invite_token
    }

    if (this.state.loginBy === 'mobile') {
      user.mobile = this.state.mobile
    } else if (this.state.loginBy === 'email') {
      user.email = this.state.email
    }
    this.props.actions.createUser(user).then(async ({ error, _next }) => {
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
      this.finishSignin(_next);
    });
  };


  finishSignin = (_next) => {
    if (_next === 'TO_VERIFY_MOBILE') {
      const location = this.props.location;
      // return GlobalAction.redirectUserToVerifyMobile(location)
      return this.props.navigate('/verify/mobile');
    }

    const query = new URLSearchParams(this.props.location.search);
    const redirectTo = query.get('redirect_to');

    // Utils.setCSRFFromCookie();

    // Record a successful login to local storage. If an unintentional logout occurs, e.g.
    // via session expiration, this bit won't get reset and we can notify the user as such.

    if (redirectTo && redirectTo.match(/^\/([^/]|$)/)) {
      this.props.history.push(redirectTo);
      // } else if (team) {
      //     browserHistory.push(`/${team.name}`);
    } else {
      this.state.loginSuccess = true;
      GlobalAction.redirectUserToDefaultSpace(this.props.location);

    }
  }

  goSignup = () => {
    let state = {};
    if (this.state.email.trim().length > 0) {
      state = { email: this.state.email.trim() }
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
    const url = import.meta.env.VITE_B6_ROOT_URL;
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
            <FormattedMessage
              id='accounts.signup'
              defaultMessage='Sign Up'
            />
          </h2>

          <form onSubmit={this.onSubmit} className="mt-4" autoCapitalize="none">
            {/* {this.state.loginByMobile && this.state.loginByEmail && (
          <nav className="flex -mb-px py-2">
            {this.state.loginByMobile && (
              <button
                type='button'
                onClick={this.switchLoginByMobile}
                className={"group inline-flex items-center py-1 px-1 border-b-2 border-transparent font-medium text-sm leading-5 focus:outline-none " + this.tabColor('mobile')}>
                <span>
                  <FormattedMessage
                    id='accounts.mobile'
                    defaultMessage='Mobile'
                  />
                </span>
              </button>
            )}
            {this.state.loginByEmail && (
              <button
                type='button'
                onClick={this.switchLoginByEmail}
                className={"ml-8 group inline-flex items-center py-1 px-1 border-b-2 border-transparent font-medium text-sm leading-5 focus:outline-none " + this.tabColor('email')}>
                <span>
                  <FormattedMessage
                    id='accounts.email'
                    defaultMessage='Email'
                  />
                </span>
              </button>)
            }
          </nav>
          )} */}

            <div className="rounded-md shadow-sm my-2">
              {this.state.loginBy === 'email' && (
                <div>
                  <LocalizedInput
                    id="email"
                    name="email"
                    ref={this.emailInput}
                    value={this.state.email}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                    placeholder={{ id: 'accounts.email_placeholder', defaultMessage: 'Please enter email' }}
                    onChange={this.handleEmailChange}
                  />
                </div>
              )}

              {this.state.loginBy === 'mobile' && (
                <div>
                  <LocalizedInput
                    id="mobile"
                    name="mobile"
                    ref={this.mobileInput}
                    value={this.state.mobile}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                    placeholder={{ id: 'accounts.mobile_placeholder', defaultMessage: 'Please enter mobile' }}
                    onChange={this.handleMobileChange}
                  />
                </div>
              )}

              <div className="-mt-px">
                <LocalizedInput
                  type="password"
                  id="password"
                  name="password"
                  autocomplete="new-password"
                  value={this.state.password}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                  placeholder={{ id: 'accounts.password_create', defaultMessage: 'Set Password' }}
                  onChange={this.handlePasswordChange}
                />
              </div>

              {this.state.loginWithCode && (
                <>
                  <div className="-mt-px grid grid-cols-5">
                    <LocalizedInput
                      id="verifyCode"
                      name="verifyCode"
                      value={this.state.verifyCode}
                      className="col-span-3 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                      placeholder={{ id: 'accounts.verifyCode', defaultMessage: 'Verify Code' }}
                      onChange={this.handleCodeChange}
                    />
                    <ReApplyCodeBtn onClick={this.sendVerificationToken} id="reApplyCodeBtn" loginId={this.state.email + this.state.mobile} disabled={this.state.disabledSendVerificationstate} />

                  </div>
                  <div id='captcha' onClick={this.onClickCaptcha}>
                  </div>
                </>
              )}

              <div className="-mt-px">
                <LocalizedInput
                  id="name"
                  name="name"
                  value={this.state.name}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                  placeholder={{ id: 'accounts.name_placeholder', defaultMessage: 'Name' }}
                  onChange={this.handleNameChange}
                />
              </div>
            </div>

            {this.state.serverError && <FormError error={this.state.serverError} />}

            {this.state.loginByEmail && this.state.loginBy === 'mobile' && (
              <div className="text-sm leading-5 my-4">
                <button type="button" onClick={this.switchLoginByEmail}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                  <FormattedMessage
                    id='accounts.switch_email'
                    defaultMessage='Use email'
                  />
                </button>
              </div>
            )}

            {this.state.loginByMobile && this.state.loginBy === 'email' && (
              <div className="text-sm leading-5 my-4">
                <button type="button" onClick={this.switchLoginByMobile}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                  <FormattedMessage
                    id='accounts.switch_mobile'
                    defaultMessage='Use mobile'
                  />
                </button>
              </div>
            )}


            <div className="mt-6 flex justify-end">
              <button type="submit" className=" group relative w-full justify-center rounded-md py-2 px-4 border border-transparent text-sm leading-5 font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
                <FormattedMessage
                  id='accounts.submit'
                  defaultMessage='Submit'
                />
              </button>
            </div>

            {!(this.props.settings && this.props.settings.serverInitInfo && this.props.settings.serverInitInfo.allow_init) &&
              <div className="text-sm leading-5 mt-6 text-center">
                <FormattedMessage
                  id='accounts.has_account'
                  defaultMessage='Has Account?'
                />
                <button type="button" onClick={this.goLogin}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                  <FormattedMessage
                    id='accounts.signin'
                    defaultMessage='Login'
                  />
                </button>
              </div>
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
    settings: getSettings(state),
    tenant: getTenant(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      createUser,
      sendVerificationToken,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
