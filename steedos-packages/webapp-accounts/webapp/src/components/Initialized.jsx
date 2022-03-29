import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSettings } from '../selectors';
import * as GlobalActions from '../actions/global_actions';
import Loading from './Loading';

class Initialized extends React.PureComponent {

  static propTypes = {
    currentUser: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
  }

  isValidState() {
    if (this.props.settings && this.props.settings.serverInitInfo && this.props.settings.serverInitInfo.allow_init) {
      return false
    } else {
      return true;
    }
  }

  componentDidMount() {

    // Tell the desktop app the webapp is ready
    window.postMessage(
      {
        type: 'webapp-ready',
      },
      window.location.origin,
    );

    if (this.props.settings && this.props.settings.serverInitInfo && this.props.settings.serverInitInfo.allow_init) {
      GlobalActions.emitUserLoggedOutEvent('/init?redirect_to=' + encodeURIComponent(this.props.location.pathname), true, false);
    }
  }
  render() {
    if (!this.isValidState()) {
      return <Loading />;
    }

    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Initialized);