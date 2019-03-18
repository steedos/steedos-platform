import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import ReportDesigner from './components/report-designer';
import ReportViewer from './components/report-viewer';

import './App.css';

const App = () => (
  <Switch>
    <Route exact path="/" component={ReportDesigner} />
    <Route exact path="/home" component={Home} />
    <Route exact path="/designer" component={ReportDesigner} />
    <Route exact path="/viewer" component={ReportViewer} />
  </Switch>
);

export default App;
