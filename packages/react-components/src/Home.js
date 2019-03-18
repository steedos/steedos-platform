import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReportDesigner from './components/report-designer';
import { IconSettings, 
  GlobalHeader, GlobalHeaderSearch, GlobalHeaderProfile, 
  BrandBand, 
  GlobalNavigationBar, GlobalNavigationBarRegion, GlobalNavigationBarLink,
  AppLauncher } from '@salesforce/design-system-react';
require("@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css")

class Home extends React.Component {
  render() {
    return (		
        <IconSettings iconPath="/assets/icons">
          <GlobalHeader navigation={
            <GlobalNavigationBar>
              <GlobalNavigationBarRegion region="primary">
                <AppLauncher triggerName="Steedos"/>
              </GlobalNavigationBarRegion>
              <GlobalNavigationBarRegion region="secondary" navigation>
                <GlobalNavigationBarLink label="Home" id="home-link" href="/home"/>
                <GlobalNavigationBarLink label="Report Designer" id="designer-link" href="/designer"/>
                <GlobalNavigationBarLink label="Report Viewer" id="viewer-link" href="/viewer" active/>
              </GlobalNavigationBarRegion>
            </GlobalNavigationBar>
          }>
            <GlobalHeaderSearch placeholder="Search Steedos" options={[]}/>
            <GlobalHeaderProfile avatar="/assets/images/avatar2.jpg"
              id="global-header-profile-example"
              options={[{ label: 'Sign Out' }]}
            />
          </GlobalHeader>
          <div style={{marginTop: 90}}>
            <BrandBand
              id="brand-band-lightning-blue"
              className="slds-p-around_small"
              theme="lightning-blue">
              <ReportDesigner/>
            </BrandBand>
          </div>
        </IconSettings>
    );
  }
}

export default Home;
