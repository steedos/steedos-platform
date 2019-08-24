import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Logo from './components/Logo';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import TwoFactor from './components/TwoFactor';

const useStyles = makeStyles({
  root: {
    margin: 'auto',
    maxWidth: 380,
    minWidth: 320,
  },
  container: {
    padding: 16,
  },
});

const Router = () => {
  const classes = useStyles();

  return (
    <BrowserRouter basename="/accounts">
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Logo></Logo>
          <Paper className={classes.container}>
            <CssBaseline />
            <Route exact path="/" component={Home} />
            <Route path="/two-factor" component={TwoFactor} />

            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/verify-email/:token" component={VerifyEmail} />
          </Paper>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
};

export default Router;
