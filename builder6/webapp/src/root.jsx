import React from 'react';
import {bindActionCreators} from 'redux';

import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTenant, getSettings } from './selectors';
import { getCurrentUser } from './selectors/entities/users'
import * as GlobalActions from './actions/global_actions';
import {loadMeAndConfig} from './actions/root';

import LoggedIn from './components/LoggedIn';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import UpdatePassword from './pages/updatePassword';
import CreateTenant from './pages/CreateTenant';
import SelectSpace from './pages/SelectSpace';
import Preference from './pages/Preference';
import Loading from './components/Loading';
import VerifyEmail from './pages/VerifyEmail';
import VerifyMobile from './pages/VerifyMobile';
import LocalStorageStore from './stores/local_storage_store';

import { AppLayout } from './components/AppLayout';

import { ObjectListView } from './pages/object/listview';
import { ObjectDetail } from './pages/object/detail';

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
      <BrowserRouter basename="">
        <div className="absolute w-full h-full">
          <Loading></Loading>
          {/* <GlobalMessage></GlobalMessage> */}
          {/* <Route path="/" component={GoBack}/> */}
          {/* <Route path="/" component={Title}/> */}
          <Routes>
            <Route path="/logout" element={(
              <Logout/>
            )}/>

            <Route path="/signup" element={(
              <Signup/>
            )}/>

            <Route path="/login" element={(
              <Login/>
            )}/>

            <Route path="/" element={(
              <LoggedIn>
                <Home/>
              </LoggedIn>
            )}/>

            <Route path="/create-space" element={(
              <LoggedIn>
                <CreateTenant/>
              </LoggedIn>
            )}/>

            <Route path="/select-space" element={(
              <LoggedIn>
                <SelectSpace/>
              </LoggedIn>
            )}/>

            <Route path="/update-password" element={(
              <LoggedIn>
                <UpdatePassword/>
              </LoggedIn>
            )}/>

            <Route path="/verify/email" element={(
              <LoggedIn>
                <VerifyEmail/>
              </LoggedIn>
            )}/>

            <Route path="/verify/mobile" element={(
              <LoggedIn>
                <VerifyMobile/>
              </LoggedIn>
            )}/>

            <Route path="/preference" element={(
              <LoggedIn>
                <Preference/>
              </LoggedIn>
            )}/>

            <Route path="/home" element={(
              <LoggedIn>
                <Home/>
              </LoggedIn>
            )}/>

            <Route path="/home/:spaceId" element={(
              <LoggedIn>
                <Home/>
              </LoggedIn>
            )}/>

            <Route path="/app/:appId/:objectName/grid/:listviewId" element={(
              <LoggedIn>
                <AppLayout>
                  <ObjectListView/>
                </AppLayout>
              </LoggedIn>
            )}/>

            <Route path="/app/:appId/:objectName/view/:recordId" element={(
              <LoggedIn>
                <AppLayout>
                  <ObjectDetail/>
                </AppLayout>
              </LoggedIn>
            )}/>

            {/* <Route
              path="*"
              element={
                <Navigate to="/login" replace />
              }
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    );
  };
}


const routes = [
  {
    path: '/app/:appId/:objectName/grid/:listviewId',
    element: (
        <ObjectListView />
    ),
  },
  {
    path: '/app/:appId/:objectName/view/:recordId',
    element: (
        <ObjectDetail />
    ),
  },
]

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