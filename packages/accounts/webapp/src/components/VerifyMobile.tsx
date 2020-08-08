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

const VerifyMobile = ({ match, settings, history, location, tenant }: any) => {
    const _mobile = location && location.state ? location.state.mobile : '';
    const accessToken = match.params.token;
    const classes = useStyles();
    const [error, setError] = useState<string | null>(null);
    const [mobile, setMobile] = useState<string | "">(_mobile);
    const searchParams = new URLSearchParams(location.search);
    let spaceId = searchParams.get("X-Space-Id");
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!mobile.trim()) {
                throw new Error("accounts.mobileRequired");
            }

            let action = 'mobileVerify';

            const data = await ApplyCode({
                name: mobile,
                action: action,
                spaceId: spaceId,
                accessToken: accessToken
            });
            if (data.token) {
                history.push({
                    pathname: `/verify/${data.token}`,
                    search: location.search,
                    state: { mobile: mobile.trim() }
                })
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className={classes.formContainer} autoCapitalize="none">
            <FormControl margin="normal">
                <InputLabel htmlFor="mobile">
                <FormattedMessage
                            id='accounts.mobile'
                            defaultMessage='Phone Number'
                        />
                </InputLabel>
                <Input
                    id="mobile"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
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

export default connect(mapStateToProps)(VerifyMobile);
