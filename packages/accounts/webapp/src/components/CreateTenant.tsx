import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles, FormControl, InputLabel, Input, Button} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from './FormError';
import { getCookie } from '../utils/utils';
import { goInSystem } from '../client/index';
import { accountsClient, accountsRest } from '../accounts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      margin: "0 auto",
    }
  }),
);


const LogInLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{ pathname: "/login", search: window.location.hash.substring(window.location.hash.indexOf("?")) }} {...props} ref={ref} />
));

const CreateTenant = ({ settings, history, tenant, location }: any) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | "">("");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {

      if (!tenantName.trim()) {
        throw new Error('accounts.tenantNameRequired');
      }

      const route = 'api/v4/spaces/register/tenant';
      const fetchOptions: any = {
        headers: {
          "X-User-Id": getCookie("X-User-Id"),
          "X-Auth-Token": getCookie("X-Auth-Token")
        },
        method: "POST",
        body: JSON.stringify({
          name: tenantName
        }),
        credentials: 'include'
      };
      const res: any = await fetch(
        `${settings.root_url}/${route}`,
        fetchOptions
      );
      const token: any = await accountsClient.getTokens();
      if (res) {
        if (res.status >= 400 && res.status < 600) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const resJson = await res.json();
        let spaceId = resJson.value;
        try {
          let result = await accountsRest.authFetch('password/session', {
            method: 'POST',
            body: JSON.stringify({
              spaceId,
              accessToken: token.accessToken
            }),
            credentials: "include"
          });
          localStorage.setItem("spaceId", spaceId);
        } catch (error) {
          console.log(error);
        }
      } else {
        throw new Error('Server did not return a response');
      }
      goInSystem(history, location, token.accessToken, settings.root_url, true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
        <FormControl margin="normal">
          <InputLabel htmlFor="tenantName">
            <FormattedMessage
              id='accounts.tenant_name'
              defaultMessage='Company Name'
            />
          </InputLabel>
          <Input
            id="tenantName"
            value={tenantName}
            onChange={e => setTenantName(e.target.value)}
          />
        </FormControl>
        {error && <FormError error={error!} />}
        <Button variant="contained" color="primary" type="submit">
          <FormattedMessage
            id='accounts.next'
            defaultMessage='Next'
          />
        </Button>
        {/* <Button component={LogInLink}>
          <FormattedMessage
            id='accounts.signin'
            defaultMessage='Sign In'
          />
        </Button> */}
      </form>
  );
};


function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps)(CreateTenant);
