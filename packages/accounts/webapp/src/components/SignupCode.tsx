import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
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
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!email.trim()) {
                throw new Error("请输入邮箱或手机号");
            }
            if (email.trim().indexOf("@") == 0) {
                throw new Error("无效的邮箱地址");
            }

            let action = 'emailSignupAccount';
            if (email.trim().indexOf("@") < 0) {
                action = 'mobileSignupAccount'
            }
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
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
            <FormControl margin="normal">
                <InputLabel htmlFor="verifyCode">
                    <FormattedMessage
                        id='accounts.signupCode.email_or_mobile'
                        defaultMessage='Email or Phone Number'
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
