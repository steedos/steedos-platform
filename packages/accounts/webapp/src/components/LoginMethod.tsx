import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings } from '../selectors';
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

const LoginMethod = ({ match, settings, history, location }: any) => {
    const email = location && location.state ? location.state.email : '';
    if(!email){
        history.push('/login');
    }
    const classes = useStyles();
    const [error, setError] = useState<string | null>(null);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await ApplyCode({
                name: email,
                action: 'emailLogin',
            });
            if (data.token) {
                history.push({
                    pathname: `/verify/${data.token}`,
                    // search: '?search=query',
                    state: { email: email }
                })
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
            {error && <FormError error={error!} />}
            <Button variant="contained" color="primary" type="submit">
                <FormattedMessage
                    id='accounts.loginWithCode'
                    defaultMessage='使用验证码登录'
                />
            </Button>
            <Button variant="contained" onClick={e => {
                history.push({
                    pathname: `/login-password`,
                    state: { email: email }
                });
            }}>
                <FormattedMessage
                    id='accounts.loginWithPassword'
                    defaultMessage='使用密码登录'
                />
            </Button>
        </form>
    );
};


function mapStateToProps(state: any, ownProps: any) {
    return {
        settings: getSettings(state),
    };
}

export default connect(mapStateToProps)(LoginMethod);
