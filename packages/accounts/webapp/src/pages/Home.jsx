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

class Home extends React.PureComponent {


  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params) {
      const spaceId = this.props.match.params.spaceId;
      if (spaceId != this.props.currentSpaceId) {
        this.props.actions.selectSpace(spaceId).then(async (result) => {
          if (result && result.data == false) {
            hashHistory.push('/select-space');
          }
        });
      }
    }
  }

  onHome = async () => {
    window.location.href = this.props.settings.root_url ? this.props.settings.root_url : "/";
  };

  render() {


    const {currentUser, currentSpace} = this.props;

    if (!currentUser || !currentSpace) {
      return null;
    }

    const emailVerified = () => {
      if (currentUser && currentUser.email_verified)
        return (
        <div className="mx-2 flex">
          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>邮箱已验证</span>
        </div>
        )
      else return (
        <div className="mx-2 flex">
          <span>邮箱未验证</span>
        </div>
      )
    }

    const mobileVerified = () => {
      if (currentUser && currentUser.mobile_verified)
        return (
        <div className="mx-2 flex">
          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>手机已验证</span>
        </div>
        )
      else return (
        <div className="mx-2 flex">
          <span>手机未验证</span>
        </div>
      )
    }
    return (
      <div>
        <Navbar user={currentUser}/>
        {/* <h4>
          <FormattedMessage
              id='accounts.welcome'
              defaultMessage='Welcome' 
          /> {user.email || user.name}
        </h4>
        {!(!user.spaces || user.spaces.length === 0) && <Button onClick={onHome} variant="contained" color="primary">
          <FormattedMessage
              id='accounts.home'
              defaultMessage='Home' 
          /> 
        </Button>
        }
        {(!user.spaces || user.spaces.length === 0) && <Typography variant="body2" gutterBottom><FormattedMessage
              id='accounts.notFindSpaces'
              defaultMessage='您没有所属公司，请联系系统管理员' 
            /></Typography>
        }
        <br/>
        <Button onClick={onLogout}>
          <FormattedMessage
              id='accounts.logout'
              defaultMessage='Logout' 
          /> 
        </Button> */}

        <div className="bg-white overflow-hidden sm:shadow sm:rounded-lg sm:px-6 sm:mx-8 sm:my-8 md:max-w-5xl md:mx-auto">
          <div className="px-4 py-5 sm:p-6">
            <div className="py-6 md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {/* <img className="hidden h-15 w-15 rounded-full sm:block" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80" alt=""/> */}
                  <span className="inline-block h-15 w-15 rounded-full overflow-hidden bg-gray-100 text-gray-500">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <div>
                    <div className="flex items-center">
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-cool-gray-900 sm:leading-9 sm:truncate">
                        {this.props.currentSpace && this.props.currentSpace.name}
                      </h1>
                    </div>
                    {/* <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">Company</dt>
                      <dd className="flex items-center text-sm leading-5 text-cool-gray-500 font-medium capitalize sm:mr-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-cool-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        华炎软件
                      </dd>
                      <dt className="sr-only">Account status</dt>
                      <dd className="mt-3 flex items-center text-sm leading-5 text-cool-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                        {emailVerified()}
                        {mobileVerified()}
                      </dd>
                    </dl> */}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                <span className="shadow-sm rounded-md">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:shadow-outline-teal focus:border-teal-700 active:bg-teal-700 transition duration-150 ease-in-out" 
                    onClick={this.onHome}>
                    进入首页
                  </button>
                </span>
                {/* <span className="shadow-sm rounded-md">
                  <a href="#/preference" className="inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out">
                    账户设置
                  </a>
                </span> */}
              </div>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);