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
import { verifyEmail, verifyMobile, sendVerificationToken } from '../actions/users';
import * as GlobalAction from '../actions/global_actions';
import { getCurrentUserId, getCurrentUser } from '../selectors/entities/users';
import { useCountDown } from "../components/countdown";
import { useLocation, useNavigate, Navigate } from "react-router";

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


class VerifyMobile extends React.Component {

    constructor(props, context) {
        super(props, context);

        const verifyBy = 'mobile';
        this.state = {
            verifyBy,
            email: '',
            mobile: '',
            verifyCode: '',
            serverError: '',
            loading: false,
            geetestValidate: '',
            disabledSendVerificationstate: this.props.settings.tenant.enable_open_geetest || false
        };
        window.browserHistory = this.props.history;
        document.title = Utils.localizeMessage(`accounts.verify_${verifyBy}`) + ` | ${this.props.tenant.name}`;
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        });
    }

    handleMobileChange = (e) => {
        this.setState({
            mobile: e.target.value,
        });
    }

    handleCodeChange = (e) => {
        this.setState({
            verifyCode: e.target.value,
        });
    }


    sendVerificationToken = (e) => {
        this.setState({ serverError: null, loading: true });
        if (this.state.verifyBy === 'email' && !this.state.email.trim()) {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='accounts.invalidEmail'
                    />
                ),
            });
            return
        }
        if (this.state.verifyBy === 'mobile' && !this.state.mobile.trim()) {
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
            email: this.state.verifyBy === 'email' ? this.state.email.trim() : '',
            mobile: this.state.verifyBy === 'mobile' ? this.state.mobile.trim() : '',
        }
        if (this.props.settings.tenant.enable_open_geetest === true) {
            this.setState({
                disabledSendVerificationstate: true
            })
        }

        this.props.actions.sendVerificationToken(user,this.state.geetestValidate).then(async (userId) => {
            if (userId && userId !== this.props.currentUserId) {
                if (this.state.verifyBy === 'email') {
                    this.setState({
                        serverError: (
                            <FormattedMessage
                                id='accounts.emailAlreadyExists'
                            />
                        ),
                    });
                }

                if (this.state.verifyBy === 'mobile') {
                    this.setState({
                        serverError: (
                            <FormattedMessage
                                id='accounts.mobileAlreadyExists'
                            />
                        ),
                    });
                }

                return
            }
        });
    }

    onSubmit = async (e) => {
        this.setState({ serverError: null, loading: true });
        e.preventDefault();
        this.setState({ error: null });

        if (this.state.verifyBy === 'email' && !this.state.email.trim()) {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='accounts.invalidEmail'
                    />
                ),
            });
            return
        }

        if (this.state.verifyBy === 'mobile' && !this.state.mobile.trim()) {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='accounts.invalidMobile'
                    />
                ),
            });
            return
        }

        if (!this.state.verifyCode || !this.state.verifyCode.trim()) {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='accounts.accounts.codeRequired'
                    />
                ),
            });
            return
        }

        if (this.state.verifyBy === 'email') {
            this.props.actions.verifyEmail(this.state.email.trim(), this.state.verifyCode.trim()).then(async ({ error }) => {
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
                this.finish();
            });
        }

        if (this.state.verifyBy === 'mobile') {
            this.props.actions.verifyMobile(this.state.mobile.trim(), this.state.verifyCode.trim()).then(async ({ error }) => {
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
                this.finish();
            });
        }
    };


    finish = (team) => {
        const currentUser = this.props.currentUser;
        const tenant = this.props.tenant;
        const location = this.props.location;
        const navigate = this.props.navigate;
        GlobalAction.finishSignin(currentUser, tenant, location, navigate)
    }
    handlerGeetest = (captchaObj) => {
        var div = document.getElementById("captcha");
        if (div) {
            console.log('div存在')
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
                            id={`accounts.verify_${this.state.verifyBy}`}
                            defaultMessage={`verify ${this.state.verifyBy}`}
                        />
                    </h2>

                    <form onSubmit={this.onSubmit} className="mt-4" autoCapitalize="none">
                        <div className="rounded-md shadow-sm my-2">


                            {this.state.verifyBy == 'email' && (
                                <div className="-mt-px">
                                    <LocalizedInput
                                        id="email"
                                        name="email"
                                        value={this.state.email}
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                                        placeholder={{ id: 'accounts.email_placeholder', defaultMessage: 'Email' }}
                                        onChange={this.handleEmailChange}
                                    />
                                </div>
                            )}

                            {this.state.verifyBy == 'mobile' && (
                                <div className="-mt-px">
                                    <LocalizedInput
                                        id="mobile"
                                        name="mobile"
                                        value={this.state.mobile}
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                                        placeholder={{ id: 'accounts.mobile_placeholder', defaultMessage: 'Mobile' }}
                                        onChange={this.handleMobileChange}
                                    />
                                </div>
                            )}

                            <div className="-mt-px grid grid-cols-5">
                                <LocalizedInput
                                    id="verifyCode"
                                    name="verifyCode"
                                    value={this.state.verifyCode}
                                    className="col-span-3 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                                    placeholder={{ id: 'accounts.verifyCode', defaultMessage: 'Verify Code' }}
                                    onChange={this.handleCodeChange}
                                />
                                <ReApplyCodeBtn onClick={this.sendVerificationToken} id="reApplyCodeBtn" loginId={this.state.email + this.state.mobile} disabled={this.state.disabledSendVerificationstate} />
                            </div>
                            <div id='captcha' onClick={this.onClickCaptcha}></div>
                        </div>

                        {this.state.serverError && <FormError error={this.state.serverError} />}

                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="rounded group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
                                <FormattedMessage
                                    id='accounts.submit'
                                    defaultMessage='Submit'
                                />
                            </button>
                        </div>
                    </form>
                </Card>
            </>
        );
    };

}

function mapStateToProps(state) {
    return {
        currentUserId: getCurrentUserId(state),
        currentUser: getCurrentUser(state),
        settings: getSettings(state),
        tenant: getTenant(state),
        settingsTenantId: getSettingsTenantId(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            verifyEmail,
            verifyMobile,
            sendVerificationToken,
        }, dispatch),
    };
}

// A wrapper component to pass location to class component
const withRouter = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <VerifyMobile {...props} location={location} navigate={navigate} />;
  };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter);
  