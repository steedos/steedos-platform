import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getSettings } from '../selectors';
import { accountsRest } from '../accounts';
import FormError from './FormError';
import { getCookie } from '../utils/utils';

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

const LogInLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{pathname: "/login", search: window.location.hash.substring(window.location.hash.indexOf("?"))}} {...props} ref={ref} />
));

const CreateTenant = ({ settings, history }: any) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | "">("");
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const route = 'api/v4/spaces/register/tenant';
      const fetchOptions = {
        headers: {
          "X-User-Id": getCookie("X-User-Id"),
          "X-Auth-Token": getCookie("X-Auth-Token")
        },
        method: "POST",
        body: JSON.stringify({
          name: tenantName
        })
      };
      const res = await fetch(
        `${settings.root_url}/${route}`,
        fetchOptions
      );
      history.push('/' + window.location.hash.substring(window.location.hash.indexOf("?")));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className={classes.formContainer}>
      <h4 className={classes.title}>
        <FormattedMessage
            id='accounts.create_tenant'
            defaultMessage='Create Company'
        />
      </h4>
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
      <br/>
      <Button variant="contained" color="primary" type="submit">
        <FormattedMessage
            id='accounts.submit'
            defaultMessage='Submit'
        />
      </Button>
      {error && <FormError error={error!} />}
      <br/>
      <Button component={LogInLink}>
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
  };
}

export default connect(mapStateToProps)(CreateTenant);
