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
import Navbar from '../components/Navbar';
import { selectSpace } from '../actions/spaces';
import { hashHistory } from "../utils/hash_history";

class GoRootUrl extends React.PureComponent {


  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

    const {currentUser, currentSpace} = this.props;

    if (!currentUser || !currentSpace) {
      return null;
    }

    this.goRootUrl();
    
  }

  goRootUrl = async () => {
    window.location.href = this.props.settings.root_url ? this.props.settings.root_url : "/";
  };

  render() {
    return null
  }
};

function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    currentSpace: getCurrentSpace(state),
    currentSpaceId: getCurrentSpace(state),
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          selectSpace,
      }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(GoRootUrl);