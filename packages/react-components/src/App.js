import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
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
