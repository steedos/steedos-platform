import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSettings, getTenant, getCurrentUser } from '../selectors';

class LoggedIn extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.object,
  }

  render() {
    console.log("Welcome")
    return this.props.children;
  }
}

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(LoggedIn);