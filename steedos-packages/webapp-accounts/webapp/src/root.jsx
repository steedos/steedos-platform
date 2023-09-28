import React from 'react';
import {bindActionCreators} from 'redux';

import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTenant, getSettings } from './selectors';
import { getCurrentUser } from './selectors/entities/users'
import * as GlobalActions from './actions/global_actions';
import {loadMeAndConfig} from './actions/root';

import Initialized from './components/Initialized';
import LoggedIn from './components/LoggedIn';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Link from './pages/Link';
import Init from './pages/Init';
import UpdatePassword from './pages/updatePassword';
import CreateTenant from './pages/CreateTenant';
import SelectSpace from './pages/SelectSpace';
import Preference from './pages/Preference';
import Loading from './components/Loading';
import VerifyEmail from './pages/VerifyEmail';
import VerifyMobile from './pages/VerifyMobile';
import LocalStorageStore from './stores/local_storage_store';

const InitializedRouter = ({ component: Component, ...rest }) => {

  if (!Component) return null;
  return (
    <Route
      {...rest}
      render={(props) => (
        <Initialized {...props}>
          <Component {...props} />
        </Initialized>
      )}
    />
  )
}
  ;

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


const loadJs = (url, callback)=>{
  let scriptTag = document.createElement("script");
  scriptTag.type = "text/javascript";
  scriptTag.src = url;
  scriptTag.async = false;
  document.getElementsByTagName("head")[0].appendChild(scriptTag);
  scriptTag.onload = function(script){
      if(callback){
          callback(script)
      }
  }
}

class Root extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      configLoaded: false,
    };

    if ((new URLSearchParams(window.location.search)).get('uid')) {
      LocalStorageStore.setUserId((new URLSearchParams(window.location.search)).get('uid'))
    }
  }

  onConfigLoaded = () => {
    this.setState({configLoaded: true});
    const { public: _public } = this.props.settings;
    try {
      if( _public?.vconsole?.url ){
          loadJs(_public.vconsole.url, ()=>{
            window.vConsole = new window.VConsole();
          });
      }
    } catch (error) {
      console.error(error)
    }
    try {
      if( _public?.sentry?.enabled == 'true' || _public?.sentry?.enabled == true ){
        loadJs(`/sentry/sentry.min.js`, (script)=>{
          const nodeEnv = _public.NODE_ENV || 'development';
          const DEFAULT_DSN_JS = {
              'development': 'https://7c2b864b83bf4361a030a7df9d2ace0c@sentry.steedos.cn/7',
              'production': 'https://8f3f63d02e8140718a6123b10d49ae2f@sentry.steedos.cn/6'
          } 
          var dsn = _public.sentry.dsn || DEFAULT_DSN_JS[nodeEnv];
          window.Sentry.init({
              dsn: dsn
          });
      });
      }
    } catch (error) {
      console.error(error)
    }
    try {
      if( _public?.analytics?.enabled == 'true' || _public?.analytics?.enabled == true ){
        try {
          loadJs('/analytics/index.js');
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    
    this.props.actions.loadMeAndConfig().then((response) => {
      const tenant = this.props.tenant;

      if(tenant && tenant.favicon_url){
        const faviconLink = document.querySelector('link[rel="shortcut icon"]');
        faviconLink.href = tenant.favicon_url;
      }

      // let password_expired = false;
      // if(this.props.currentUser){
      //   GlobalActions.finishSignin(this.props.currentUser, this.props.tenant, this.props.location);
      // } else{
      //   GlobalActions.selectDefaultSpace();
      //   if (document.location.pathname === '/' && document.location.hash === '#/' && response[1] && response[1].data) {
      //       GlobalActions.redirectUserToDefaultSpace();
      //   }
      // }
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
            <Route path="/browsers.html" exact />
            <Route path="/logout" component={Logout} />
            <LoggedInRoute exact path="/" component={Home} />

            <Route path="/init" component={Init} />
            <Route path="/signup" component={Signup} />

            <InitializedRouter path="/login" component={Login} />

            <LoggedInRoute path="/create-space" component={CreateTenant} />
            <LoggedInRoute path="/select-space" component={SelectSpace} />
            <LoggedInRoute exact path="/update-password" component={UpdatePassword} />
            <LoggedInRoute path="/verify/email" component={VerifyEmail} />
            <LoggedInRoute path="/verify/mobile" component={VerifyMobile} />
            {/* <Route path="/login-code" component={LoginCode} /> */}
            <LoggedInRoute path="/preference" component={Preference} />
            {/* <LoggedInRoute path="/verify-mobile/:token" component={VerifyMobile} /> */}
            <LoggedInRoute path="/home" component={Home} />
            <LoggedInRoute path="/home/:spaceId" component={Home} />
            <LoggedInRoute path="/link" component={Link} />

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
    settings: getSettings(state),
    currentUser: getCurrentUser(state),
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