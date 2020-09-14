import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
import DashboardContainer from '../../ui/containers/DashboardContainer.jsx';
const browserHistory = history.createBrowserHistory();
window.browserHistory = browserHistory;

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/react" component={DashboardContainer}/>
    </Switch>
  </Router>
);