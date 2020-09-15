
import history from 'history';
import { Router, Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { store, IntlProvider, Login, Logout, Signup, Home, SelectSpace } from '@steedos/webapp';

// route components
const browserHistory = history.createBrowserHistory();
window.browserHistory = browserHistory;

export const renderRoutes = () => (
  <Provider store={store}>
    <IntlProvider>
      <div className="absolute w-full h-full">
      <Router history={browserHistory}>
        <Switch>
          <Route exact path="/steedos/login" component={Login}/>
        </Switch>
      </Router>
      </div>
    </IntlProvider>
  </Provider>
);