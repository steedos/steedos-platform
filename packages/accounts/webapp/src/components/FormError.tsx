import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  formError: {
    color: 'red',
  },
});

interface Props {
  error: string;
}

const FormError = ({ error }: Props) => {
  const classes = useStyles();

  return <Typography className={classes.formError}>{error}</Typography>;
};

export default FormError;
