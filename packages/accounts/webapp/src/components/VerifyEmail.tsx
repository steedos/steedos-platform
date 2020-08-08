import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';

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
    textAlign: "center"
  }
});

interface RouteMatchProps {
  token: string;
}

const VerifyEmail = ({ match, settings, tenant }: any) => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = async () => {
    try {
      await accountsRest.verifyEmail(match.params.token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHome = async () => {
    window.location.href = settings.root_url ? settings.root_url : "/";
  };

  return (
    <div className={classes.formContainer}>
      { 
        error && 
        <h4 className={classes.title}>
          <FormError error={error!} />
        </h4>
      }
      {
        success && 
        <Typography>
          <h4 className={classes.title}>
            <FormattedMessage
              id='accounts.emailVerifiedSuccess'
              defaultMessage='Your email has been verified' 
            />
          </h4>
        </Typography>
      }
      <br/><br/>
      <Button onClick={onHome} variant="contained" color="primary">
        <FormattedMessage
          id='accounts.goHome'
          defaultMessage='Go Home' 
        />
      </Button>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(VerifyEmail);
