import React, { useState, useEffect} from 'react';
import { FormControl, InputLabel, Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { accountsClient, accountsRest } from '../accounts';
import FormError from './FormError';
import { goInSystem } from '../client/index';
import Logo from './Logo';


const SetName = ({ match, settings, history, location, tenant }: any) => {
    const _fullname = location && location.state ? location.state.fullname : '';
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
<div className="flex md:items-center md:justify-center mx-auto h-full">
    <div className="p-11 sm:shadow-md sm:bg-transparent bg-white w-screen max-w-md">

    <Logo/>
        <form onSubmit={onSubmit} className="mt-4">
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
        tenant: getTenant(state)
    };
}

export default connect(mapStateToProps)(SetName);
