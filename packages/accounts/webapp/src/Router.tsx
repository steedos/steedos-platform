import React from 'react';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { CssBaseline, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getTenant } from './selectors';

import Logo from './components/Logo';
import Signup from './components/Signup';
import SignupCode from './components/SignupCode';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import TwoFactor from './components/TwoFactor';
import UpdatePassword from './components/updatePassword';
import CreateTenant from './components/CreateTenant';
import ChooseTenant from './components/ChooseTenant';
import Verify from './components/Verify';
import LoginCode from './components/LoginCode';
import LoginMethod from './components/LoginMethod'
import LoginPassword from './components/LoginPassword';
import Title from './components/Title';
import GoBack from './components/GoBack';
import SetName from './components/SetName';
import GlobalMessage from './components/GlobalMessage';
import theme from './theme';


const Router = ({tenant}:any) => {
  let backgroundUrl = require("./assets/background.svg");
  if (tenant.background_url) {
    backgroundUrl = tenant.background_url 
  }

  const useStyles = makeStyles({
    root: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backgroundImage: "url(" + backgroundUrl + ")",
      backgroundSize: "cover",
      height: "100%",
    },
    rootBackgroundFade: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    rootGrid: {
    },
    container: {
      alignItems: 'center'
    },
    paper: {
      padding: 28,
      margin: '0px auto',
      maxWidth: 380,
      minWidth: 320,
      '@media only screen and (max-width: 480px)': {
        borderRadius: 0
      },
      "& [type='submit']": {
        marginTop: 20
      }
    },
  });

  const classes = useStyles();

  let loginComponent = LoginPassword;
  let resetPasswordComponent = LoginCode || ResetPassword;
  if(tenant && tenant.enable_password_login === false){
    loginComponent = LoginCode;
  }

  return (
    <HashRouter basename="">
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <GlobalMessage></GlobalMessage>
          <Grid className={classes.container} container id="container">
            <Grid item xs={12}>
              <Paper className={classes.paper} id="paper">
                <CssBaseline />
                <Route path="/" component={GoBack}/>
                <Logo></Logo>
                <Route path="/" component={Title}/>
                <Route exact path="/" component={Home}/>
                <Route path="/two-factor" component={TwoFactor} />

                {/* <Route path="/signup-password" component={Signup} /> */}
                <Route path="/signup" component={SignupCode} />
                {/* <Route path="/signup/:spaceId" component={Signup} /> */}
                <Route path="/login" component={loginComponent} />
                {/* <Route path="/login/:spaceId" component={loginComponent} /> */}
                <Route path="/login-password" component={LoginPassword} />
                <Route path="/create-tenant" component={CreateTenant} />
                <Route path="/choose-tenant" component={ChooseTenant} />
                <Route exact path="/reset-password" component={resetPasswordComponent} />
                <Route exact path="/update-password" component={UpdatePassword} />
                <Route path="/reset-password/:token" component={resetPasswordComponent} />
                <Route path="/verify-email/:token" component={VerifyEmail} />
                <Route path="/verify/:token" component={Verify} />
                <Route path="/login-code" component={LoginCode} />
                <Route path="/set-name" component={SetName} />
                {/* <Route path="/login-method" component={LoginMethod} /> */}
              </Paper>
            </Grid>
          </Grid>
          <div className={classes.rootBackgroundFade}></div>
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Router);