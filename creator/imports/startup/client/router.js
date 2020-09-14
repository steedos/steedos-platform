
import history from 'history';
import { Router, Route, Switch } from 'react-router';
import {Background} from '@steedos/webapp';

// route components
const browserHistory = history.createBrowserHistory();
window.browserHistory = browserHistory;

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/react" component={Background}/>
    </Switch>
  </Router>
);