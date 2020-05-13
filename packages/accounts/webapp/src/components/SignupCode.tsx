import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { ApplyCode } from '../client';
import { signUpEvent, signUpEventOnError } from '../client/signup.events';

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

const SignupCode = ({ match, settings, history, location, tenant }: any) => {
    const _email = location && location.state ? location.state.email : '';
    const classes = useStyles();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | "">(_email);
    const type = match.params.type || 'email';
    const searchParams = new URLSearchParams(location.search);
    let spaceId = searchParams.get("X-Space-Id");
    
    signUpEventOnError((err: any)=>{
        setError(err.message);
    })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!email.trim()) {
                if(tenant.enable_bind_mobile){
                    throw new Error("请输入手机号");
                }else {
                    throw new Error("请输入邮箱");
                }
                // if(tenant.enable_bind_mobile && tenant.enable_bind_email){
                //     throw new Error("请输入邮箱或手机号");
                // }else if(tenant.enable_bind_mobile && !tenant.enable_bind_email){
                //     throw new Error("请输入手机号");
                // }else if(!tenant.enable_bind_mobile){
                //     throw new Error("请输入邮箱");
                // }
            }

            if (!tenant.enable_bind_mobile && email.trim().indexOf("@") == 0) {
                throw new Error("请输入有效的邮箱地址");
            }

            let action = 'emailSignupAccount';
            if (email.trim().indexOf("@") < 0) {
                action = 'mobileSignupAccount'
            }

            if(tenant.enable_bind_mobile && action === 'emailSignupAccount'){
                throw new Error("请输入有效的手机号");
            }

            if(!tenant.enable_bind_mobile && action === 'mobileSignupAccount'){
                throw new Error("请输入有效的邮箱地址");
            }

            await signUpEvent.emit('inputNext', tenant, history, location, spaceId, email, action);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
            <FormControl margin="normal">
                <InputLabel htmlFor="verifyCode">
                    {/* {tenant.enable_bind_mobile && tenant.enable_bind_email &&
                        <FormattedMessage
                            id='accounts.signupCode.email_or_mobile'
                            defaultMessage='Email or Phone Number'
                        />
                    } */}
                    {tenant.enable_bind_mobile &&
                        <FormattedMessage
                            id='accounts.signupCode.mobile'
                            defaultMessage='Phone Number'
                        />
                    }
                    {!tenant.enable_bind_mobile &&
                        <FormattedMessage
                            id='accounts.signupCode.email'
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
            <Button component={LogInLink} location={location}>
                <FormattedMessage
                    id='accounts.signin'
                    defaultMessage='Sign In'
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

export default connect(mapStateToProps)(SignupCode);
