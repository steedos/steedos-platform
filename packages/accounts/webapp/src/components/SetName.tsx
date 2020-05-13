import React, { useState, useEffect} from 'react';
import { FormControl, InputLabel, Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsClient, accountsRest } from '../accounts';
import FormError from './FormError';
import { goInSystem } from '../client/index';

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

const SetName = ({ match, settings, history, location, tenant }: any) => {
    const _fullname = location && location.state ? location.state.fullname : '';
    const classes = useStyles();
    const [error, setError] = useState<string | null>(null);
    const [fullname, setFullname] = useState<string | "">(_fullname);
    const searchParams = new URLSearchParams(location.search);
    let spaceId = searchParams.get("X-Space-Id");
    const [user, setUser] = useState({ spaces: [], name: '' });
    useEffect(() => {
      fetchUser();
    }, []);
  
    const fetchUser = async () => {
      const tokens = await accountsClient.refreshSession();
      if (!tokens) {
        history.push('/login');
        return;
      }
      const data = await accountsRest.authFetch('user', {});
  
      if (!data) {
        history.push('/login');
        return;
      }
      setUser(data);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!fullname.trim()) {
                throw new Error("accounts.nameRequired");
            }

            await accountsRest.authFetch('user', {
                method: "PUT",
                body: JSON.stringify({
                    fullname: fullname
                }),
                credentials: 'include'
            });

            if(user.spaces.length === 1){
                const token: any = await accountsClient.getTokens();
                return goInSystem(history, location, token.accessToken, settings.root_url);
            }

            if(user.spaces.length === 0 && !tenant.enable_create_tenant){
                return history.push('/');
            }

            if(user.spaces.length === 0 && tenant.enable_create_tenant){
                return history.push('/create-tenant' + location.search);
            }
            
            return history.push('/choose-tenant' + location.search);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit} className={classes.formContainer}>
            <FormControl margin="normal">
                <InputLabel htmlFor="verifyCode">
                    <FormattedMessage
                        id='accounts.set_fullname'
                        defaultMessage='Name'
                    />
                </InputLabel>
                <Input
                    id="fullname"
                    value={fullname}
                    onChange={e => setFullname(e.target.value)}
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

export default connect(mapStateToProps)(SetName);
