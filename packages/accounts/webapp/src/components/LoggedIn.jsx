import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import * as GlobalActions from '../actions/global_actions';
import Loading from './Loading';

class LoggedIn extends React.PureComponent {

  static propTypes = {
    currentUser: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
  }

  isValidState() {
    return this.props.currentUser != null;
  }
  
  componentDidMount() {
    if (!this.props.currentUser) {
      GlobalActions.emitUserLoggedOutEvent('/login?redirect_to=' + encodeURIComponent(this.props.location.pathname), true, false);
    }
  }
  render() {
    console.log(this.props.currentUser)
    if (!this.isValidState()) {
        return <Loading/>;
    }

    return this.props.children;
  }
}

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(LoggedIn);