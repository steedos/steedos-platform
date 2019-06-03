import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import ReportDesigner from './components/report-designer';
import ReportViewer from './components/report-viewer';

import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/:id" component={ReportDesigner} />
      <Route exact path="/designer/:id" component={ReportDesigner} />
      <Route exact path="/viewer/:id" component={ReportViewer} />
    </Switch>
  </BrowserRouter>
);

export default App;
