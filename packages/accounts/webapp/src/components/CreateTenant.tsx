import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { FormControl, InputLabel, Input, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';

import { accountsRest } from '../accounts';
import FormError from './FormError';

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
  <Link to={{pathname: "/login", search: window.location.search}} {...props} ref={ref} />
));

const CreateTenant = ({ history }: RouteComponentProps<{}>) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | "">("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setError(null);
    try {
      
      // refresh the session to get a new accessToken if expired
      const res = await accountsRest.authFetch( '/tenant', {
        method: "POST",
        body: JSON.stringify({
          name: tenantName
        })
      });
      history.push('/' + window.location.search);
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

export default CreateTenant;
