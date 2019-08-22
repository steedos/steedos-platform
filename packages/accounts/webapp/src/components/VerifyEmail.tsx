import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';

import { accountsRest } from '../accounts';
import FormError from './FormError';

interface RouteMatchProps {
  token: string;
}

const HomeLink = (props: any) => <Link to="/" {...props} />;

const VerifyEmail = ({ match }: RouteComponentProps<RouteMatchProps>) => {
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

  return (
    <div>
      {error && <FormError error={error!} />}
      {success && <Typography>Your email has been verified</Typography>}
      <Button component={HomeLink}>Go Home</Button>
    </div>
  );
};

export default VerifyEmail;
