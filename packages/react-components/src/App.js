import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import StaticRouter from 'react-router-dom/StaticRouter';
import BrowserRouter from 'react-router-dom/StaticRouter';
import ReportDesigner from './components/report-designer';
import ReportViewer from './components/report-viewer';

import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ReportDesigner} />
      <Route exact path="/designer" component={ReportDesigner} />
      <Route exact path="/viewer" component={ReportViewer} />
    </Switch>
  </BrowserRouter>
);

export default App;
