import React from 'react';
import {bindActionCreators} from 'redux';

import {  HashRouter, Route, RouteProps } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getTenant } from './selectors';
import * as GlobalActions from './actions/global_actions.jsx';
import {browserHistory} from './utils/browser_history';
import {loadMeAndConfig} from './actions/root';

import LoggedIn from './components/LoggedIn';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import VerifyMobile from './components/VerifyMobile';
import UpdatePassword from './components/updatePassword';
import CreateTenant from './pages/CreateTenant';
import ChooseTenant from './components/ChooseTenant';
import Verify from './pages/Verify';
import LoginPassword from './pages/LoginPassword';
import Preference from './pages/Preference';
import Loading from './components/Loading';
import SignupPassword from './pages/SignupPassword';


const LoggedInRoute = ({component: Component, ...rest}) => {
  if (!Component) return null;
  return (
    <Route
        {...rest}
        render={(props) => (
            <LoggedIn {...props}>
                <Component {...props}/>
            </LoggedIn>
        )}
    />
    )}
;

class Root extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      configLoaded: false,
    };
  }

  onConfigLoaded = () => {
    this.setState({configLoaded: true});
  }

  componentDidMount() {
    this.props.actions.loadMeAndConfig().then((response) => {
      if (document.location.pathname === '/' && response[2] && response[2].data) {
          GlobalActions.redirectUserToDefaultSpace();
      }
      this.onConfigLoaded();
    }).then(() => {
        // if (isCurrentUserSystemAdmin(store.getState())) {
        //     this.props.actions.getWarnMetricsStatus();
        // }
    });
    // trackLoadTime();
  }

  render() {
    if (!this.state.configLoaded) {
        return <div/>;
    }

    return (
      <HashRouter basename="" history={browserHistory}>
          <div className="absolute w-full h-full">
            <Loading></Loading>
            {/* <GlobalMessage></GlobalMessage> */}
                  {/* <Route path="/" component={GoBack}/> */}
                  {/* <Route path="/" component={Title}/> */}
                  <LoggedInRoute exact path="/" component={Home}/>
                  <LoggedInRoute exact path="/home" component={Home}/>
                  <Route path="/signup" component={Signup} />
                  <Route path="/signup-password" component={SignupPassword} />

                  <Route path="/login" component={Login} />
                  <Route path="/login-password" component={LoginPassword} />
                  
                  <Route path="/create-tenant" component={CreateTenant} />
                  <Route path="/choose-tenant" component={ChooseTenant} />
                  <Route exact path="/update-password" component={UpdatePassword} />
                  <Route path="/verify-email/:token" component={VerifyEmail} />
                  <Route path="/verify/:action" component={Verify} />
                  {/* <Route path="/login-code" component={LoginCode} /> */}
                  <LoggedInRoute path="/preference" component={Preference} />
                  <Route path="/verify-mobile/:token" component={VerifyMobile} />
            </div>
      </HashRouter>
    );
  };
}

function mapStateToProps(state) {
  return {
    tenant: getTenant(state),
  };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
          loadMeAndConfig,
          //getWarnMetricsStatus,
        }, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);