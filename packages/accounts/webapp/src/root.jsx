import React from 'react';
import {bindActionCreators} from 'redux';

import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTenant } from './selectors';
import * as GlobalActions from './actions/global_actions.jsx';
import {loadMeAndConfig} from './actions/root';

import LoggedIn from './components/LoggedIn';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import VerifyEmail from './components/VerifyEmail';
import VerifyMobile from './components/VerifyMobile';
import UpdatePassword from './components/updatePassword';
import CreateTenant from './pages/CreateTenant';
import ChooseTenant from './components/ChooseTenant';
import Preference from './pages/Preference';
import Loading from './components/Loading';


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
      if (document.location.pathname === '/' && response[1] && response[1].data) {
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
      <HashRouter basename="">
          <div className="absolute w-full h-full">
            <Loading></Loading>
            {/* <GlobalMessage></GlobalMessage> */}
                  {/* <Route path="/" component={GoBack}/> */}
                  {/* <Route path="/" component={Title}/> */}
                <Switch>
                  <Route path="/home" component={Home}/>
                  <Route path="/signup" component={Signup} />

                  <Route path="/login" component={Login} />
                  
                  <LoggedInRoute path="/create-tenant" component={CreateTenant} />
                  <LoggedInRoute path="/choose-tenant" component={ChooseTenant} />
                  <LoggedInRoute exact path="/update-password" component={UpdatePassword} />
                  <Route path="/verify-email/:token" component={VerifyEmail} />
                  {/* <Route path="/login-code" component={LoginCode} /> */}
                  <LoggedInRoute path="/preference" component={Preference} />
                  <Route path="/verify-mobile/:token" component={VerifyMobile} />
                  <Redirect
                      to={{
                          ...this.props.location,
                          pathname: '/login',
                      }}
                  />
              </Switch>
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