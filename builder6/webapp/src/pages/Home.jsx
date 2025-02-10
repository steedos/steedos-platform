import React, { useState, useEffect } from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { getTenant, getSettings, getSettingsTenantId } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import { getCurrentSpace, getCurrentSpaceId } from "../selectors/entities/spaces";
import Navbar from '../components/Navbar';
import { selectSpace, goSpaceHome } from '../actions/spaces';
import { hashHistory } from "../utils/hash_history";
import LocalStorageStore from '../stores/local_storage_store';
import { useLocation, useNavigate, Navigate } from "react-router";
import { t } from 'i18next';

class Home extends React.PureComponent {

  state = {
    navigateTo: null,
  };


  constructor(props, context) {
    super(props, context);
  }

  goHome = async () => {
    this.setState({ navigateTo: '/' });
  };

  render() {

    if (process.env.NODE_ENV == 'production')
      return null;

    if (this.state.navigateTo) {
      return <Navigate to={this.state.navigateTo} />;
    }

    const {currentUser, currentSpace} = this.props;

    if (!currentUser || !currentSpace) {
      return null;
    }

    return (
      <div>
        <Navbar/>
<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 md:flex md:items-center md:justify-between">
  <div className="flex-1 min-w-0">
    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
      {this.props.currentSpace && this.props.currentSpace.name}
    </h2>
  </div>
  <div className="mt-4 flex md:mt-0 md:ml-4">
    {/* <span className="shadow-sm rounded-md">
      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out">
        切换企业
      </button>
    </span> */}
    <span className="shadow-sm rounded-md">
      <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out"
        onClick={this.goHome}>
          {t('Go Home')}
      </button>
    </span>
  </div>
</div>
        
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    currentSpace: getCurrentSpace(state),
    currentSpaceId: getCurrentSpaceId(state),
    tenant: getTenant(state),
    settings: getSettings(state),
    settingsTenantId: getSettingsTenantId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          selectSpace,
          goSpaceHome,
      }, dispatch),
  };
}



// A wrapper component to pass location to class component
const withRouter = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return <Home {...props} location={location} navigate={navigate} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter);
