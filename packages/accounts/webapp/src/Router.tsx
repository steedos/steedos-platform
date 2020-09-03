import React from 'react';
import {  HashRouter, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getTenant } from './selectors';

import SignupCode from './components/SignupCode';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import VerifyMobile from './components/VerifyMobile';
import UpdatePassword from './components/updatePassword';
import CreateTenant from './components/CreateTenant';
import ChooseTenant from './components/ChooseTenant';
import Verify from './components/Verify';
import LoginCode from './components/LoginCode';
import LoginMethod from './components/LoginMethod'
import LoginPassword from './components/LoginPassword';
import Password from './components/LoginPassword';
import SetName from './components/SetName';
import Loading from './components/Loading';
import theme from './theme';
import Signup from './components/Signup';

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
      height: "100%",
      background: '#f8f8f8',
      '@media only screen and (min-width: 640px)': {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: "url(" + backgroundUrl + ")",
        backgroundSize: "cover",
      }
    },
  });

  const classes = useStyles();

  let loginComponent = LoginCode;
  let resetPasswordComponent = LoginCode || ResetPassword;

  let signupComponent = Signup;
  if(tenant.enable_mobile_code_login || tenant.enable_email_code_login){
    signupComponent = SignupCode;
  }

  return (
    <HashRouter basename="">
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Loading></Loading>
          {/* <GlobalMessage></GlobalMessage> */}
                {/* <Route path="/" component={GoBack}/> */}
                {/* <Route path="/" component={Title}/> */}
                <Route exact path="/" component={Home}/>
                <Route path="/signup" component={signupComponent} />
                <Route path="/signup-password" component={Signup} />

                <Route path="/login" component={loginComponent} />
                <Route path="/login-password" component={LoginPassword} />
                
                <Route path="/create-tenant" component={CreateTenant} />
                <Route path="/choose-tenant" component={ChooseTenant} />
                <Route exact path="/reset-password" component={resetPasswordComponent} />
                <Route exact path="/update-password" component={UpdatePassword} />
                <Route path="/reset-password/:token" component={resetPasswordComponent} />
                <Route path="/verify-email/:token" component={VerifyEmail} />
                <Route path="/verify/:action" component={Verify} />
                {/* <Route path="/login-code" component={LoginCode} /> */}
                <Route path="/set-name" component={SetName} />
                <Route path="/verify-mobile/:token" component={VerifyMobile} />
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