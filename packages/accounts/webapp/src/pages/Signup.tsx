import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant, getSettingsTenantId } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from '../components/FormError';
import { ApplyCode } from '../client';
import { signUpEvent, signUpEventOnError } from '../client/signup.events';
import Logo from '../components/Logo';

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

const LogInLink = React.forwardRef<Link, any>((props, ref) => {
    return (
        <Link to={{ pathname: "/login", search: props.location.search }} {...props} ref={ref} />
    )
});

const SignupCode = ({ match, settingsTenantId, settings, history, location, tenant }: any) => {
    const _email = location && location.state ? location.state.email : '';
    const classes = useStyles();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | "">(_email);
    const type = match.params.type || 'email';
    const searchParams = new URLSearchParams(location.search);
    const intl = useIntl();

    let spaceId = searchParams.get("X-Space-Id") || settingsTenantId;
    
    signUpEventOnError((err: any)=>{
        setError(err.message);
    })

    let inputLabel = '';
    if (tenant.enable_mobile_code_login && tenant.enable_email_code_login) 
      inputLabel = 'accounts.email_mobile';
    else if (tenant.enable_mobile_code_login) 
      inputLabel = 'accounts.mobile';
    else if (tenant.enable_email_code_login) 
      inputLabel = 'accounts.email';
    
    const goLogin = () => {
        history.push({
            pathname: `/login`,
            search: location.search,
            state: {email: email}
       })
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!email || !email.trim()) {
                if(tenant.enable_bind_mobile){
                    throw new Error("accounts.mobileRequired");
                }else {
                    throw new Error("accounts.emailRequired");
                }
                // if(tenant.enable_bind_mobile && tenant.enable_bind_email){
                //     throw new Error("请输入邮箱或手机号");
                // }else if(tenant.enable_bind_mobile && !tenant.enable_bind_email){
                //     throw new Error("请输入手机号");
                // }else if(!tenant.enable_bind_mobile){
                //     throw new Error("请输入邮箱");
                // }
            }

            if (!tenant.enable_mobile_code_login && email.trim().indexOf("@") == 0) {
                throw new Error("accounts.invalidEmail");
            }

            let action = 'emailSignupAccount';
            if (email.trim().indexOf("@") < 0) {
                action = 'mobileSignupAccount'
            }

            if(!tenant.enable_mobile_code_login && action === 'mobileSignupAccount'){
                throw new Error("accounts.invalidMobile");
            }

            if(!tenant.enable_email_code_login && action === 'emailSignupAccount'){
                throw new Error("accounts.invalidEmail");
            }

            await signUpEvent.emit('inputNext', tenant, history, location, spaceId, email, action);
        } catch (err) {
            setError(err.message);
        }
    };

    document.title = intl.formatMessage({id:'accounts.title.signup'}) + ` | ${tenant.name}`;

    return (
<div className="flex sm:items-center justify-center mx-auto h-full">
    <div className="p-11 sm:shadow-md bg-white w-screen max-w-md">

    <Logo/>
        <h2 className="my-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
          <FormattedMessage
              id='accounts.title.signup'
              defaultMessage='Sign Up'
            />
        </h2>

        <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">

            <div className="rounded-md shadow-sm my-2">
                <div>
                    <input 
                    aria-label={intl.formatMessage({id: inputLabel})}
                    id="email"
                    name="email" 
                    value={email}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
                    placeholder={intl.formatMessage({id: inputLabel})}
                    onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>
        

            {error && <FormError error={error!} />}

            {/* <div className="text-sm leading-5 my-4">
                <FormattedMessage
                        id='accounts.has_account'
                        defaultMessage='Has account?'
                    />
                <button type="button" onClick={goLogin}
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                    <FormattedMessage
                        id='accounts.signin'
                        defaultMessage='Login'
                    />
                </button>
            </div> */}
                
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
</div>
    );
};

function mapStateToProps(state: any) {
    return {
        settings: getSettings(state),
        tenant: getTenant(state),
        settingsTenantId: getSettingsTenantId(state)
    };
}

export default connect(mapStateToProps)(SignupCode);
