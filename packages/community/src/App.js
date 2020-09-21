import React from 'react';

import { Provider } from 'react-redux'
import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';

import { store, IntlProvider } from '@steedos/webapp';
import LoggedIn from '@steedos/webapp/lib/components/LoggedIn';
import Signup from '@steedos/webapp/lib/pages/Signup';
import Login from '@steedos/webapp/lib/pages/Login';
import Logout from '@steedos/webapp/lib/pages/Logout';
import Home from '@steedos/webapp/lib/pages/Home';
import UpdatePassword from '@steedos/webapp/lib/pages/updatePassword';
import CreateTenant from '@steedos/webapp/lib/pages/CreateTenant';
import SelectSpace from '@steedos/webapp/lib/pages/SelectSpace';
import Preference from '@steedos/webapp/lib/pages/Preference';
import VerifyEmail from '@steedos/webapp/lib/pages/VerifyEmail';
import VerifyMobile from '@steedos/webapp/lib/pages/VerifyMobile';


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
)};

function App() {
  return (

    <Provider store={store}>
      <IntlProvider>
        <HashRouter basename="">
          <div className="absolute w-full h-full">
            <Switch>
              <Route path="/logout" component={Logout} />             
              <LoggedInRoute exact path="/" component={Home}/>

              <Route path="/signup" component={Signup} />

              <Route path="/login" component={Login} />
              
              <LoggedInRoute path="/create-space" component={CreateTenant} />
              <LoggedInRoute path="/select-space" component={SelectSpace} />
              <LoggedInRoute exact path="/update-password" component={UpdatePassword} />
              <LoggedInRoute path="/verify/email" component={VerifyEmail} />
              <LoggedInRoute path="/verify/mobile" component={VerifyMobile} />
              {/* <Route path="/login-code" component={LoginCode} /> */}
              <LoggedInRoute path="/preference" component={Preference} />
              {/* <LoggedInRoute path="/verify-mobile/:token" component={VerifyMobile} /> */}
              <LoggedInRoute path="/home/:spaceId" component={Home}/>
            </Switch>
          </div>
        </HashRouter>
      </IntlProvider>
    </Provider>

  );
}

export default App;
