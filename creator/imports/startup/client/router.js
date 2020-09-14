
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
      <Router history={browserHistory}>
        <Switch>
          <Route exact path="/steedos/login" component={Login}/>
        </Switch>
      </Router>
    </IntlProvider>
  </Provider>
);