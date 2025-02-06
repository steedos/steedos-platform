import React from 'react';
import {bindActionCreators} from 'redux';

import { connect } from 'react-redux';
import { getTenant, getSettings } from './selectors';
import { getCurrentUser } from './selectors/entities/users'
import { getCurrentSpaceId } from './selectors/entities/spaces'
import { loadMeAndConfig } from './actions/root';
import LocalStorageStore from './stores/local_storage_store';

import { SteedosRouter } from './router';

class Root extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      configLoaded: false,
    };

    if ((new URLSearchParams(window.location.search)).get('uid')) {
      LocalStorageStore.setUserId((new URLSearchParams(window.location.search)).get('uid'))
    }
  }

  onConfigLoaded = () => {
    this.setState({configLoaded: true});
  }

  componentDidMount() {
    this.props.actions.loadMeAndConfig().then((response) => {
      const tenant = this.props.tenant;

      if(tenant && tenant.favicon_url){
        const faviconLink = document.querySelector('link[rel="shortcut icon"]');
        faviconLink.href = tenant.favicon_url;
      }

      this.onConfigLoaded();
    }).then(() => {
    });
  }

  render() {
    if (!this.state.configLoaded) {
      return <div/>;
    }
    
    return (
        <div className="absolute w-full h-full">
          <SteedosRouter/>
        </div>
    );
  };
}



function mapStateToProps(state) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
    currentUser: getCurrentUser(state),
    currentSpaceId: getCurrentSpaceId(state),
  };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
          loadMeAndConfig,
          //getWarnMetricsStatus,
        }, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);