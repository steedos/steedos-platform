import React, { useState, useEffect } from 'react';
import {bindActionCreators} from 'redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import { getCurrentSpace, currentSpaceId } from "../selectors/entities/spaces";
import { logout } from '../actions/users';
import { hashHistory } from "../utils/hash_history";
import * as GlobalAction from '../actions/global_actions';

class Logout extends React.PureComponent {


  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let redirect_uri = new URLSearchParams(this.props.location.search).get('redirect_uri')
    if (!redirect_uri)
      redirect_uri = '/login'
    if(this.props.tenant.page_logout){
      // TODO 给 page logout 拼接 redirect url?
      redirect_uri = `location:${this.props.tenant.page_logout}`;
    }
    GlobalAction.emitUserLoggedOutEvent(redirect_uri);
  }

  render() {
    return null
  }
};

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    settings: getSettings(state),
    tenant: getTenant(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
        logout,
      }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout);