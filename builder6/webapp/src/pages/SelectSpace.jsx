import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {FormattedMessage} from 'react-intl';
import { hashHistory } from "../utils/hash_history";
import {Link} from 'react-router-dom';
import Card from '../components/Card';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import {Client4} from '../client';

import { getCurrentUser } from '../selectors/entities/users';
import { getSpaceCount, getCurrentSpace, getSpaces, getMySpaces } from '../selectors/entities/spaces';
import { getTenant } from '../selectors';
import { selectSpace, acceptInvitation, declineInvitation } from '../actions/spaces';
import { useLocation, useNavigate, Navigate } from "react-router";

class SelectSpace extends React.PureComponent {
  static propTypes = {
      currentUserId: PropTypes.string,
      spaceCount: PropTypes.number,
      isMemberOfSpace: PropTypes.bool,
      listableSpaces: PropTypes.array,
      canCreateSpaces: PropTypes.bool,
      history: PropTypes.object,
      // actions: PropTypes.shape({
      //     getSpaces: PropTypes.func.isRequired,
      //     loadRolesIfNeeded: PropTypes.func.isRequired,
      //     addUserToSpace: PropTypes.func.isRequired,
      // }).isRequired,
  };

  constructor(props) {
      super(props);

      this.state = {
          loadingSpaceId: '',
          error: null,
      };
  }

  handleCreateTenant = () => {
    this.props.navigate(`/create-space`);

    // hashHistory.push({
    //   pathname: '/create-space',
    //   search: this.props.location.search
    // })
  }

  handleSpaceClick = async (space) => {
    if(space) {
      try {
        const result = await Client4.validate(space._id);
        this.props.actions.selectSpace(space._id);
        this.props.navigate(`/home/${space._id}`);
        // hashHistory.push({
        //   pathname: `/home/${space._id}`,
        //   search: this.props.location.search
        // })
      } catch (error) {
        console.log(error);
        return {data: false};
      }
    }
  }

  handleAcceptInvitation = (space, email)=>{
    this.props.actions.acceptInvitation(space._id, email).then(()=>{
      this.handleSpaceClick(space)
    })
  }

  handleDeclineInvitation = (space, email)=>{
    this.props.actions.declineInvitation(space._id, email).then(()=>{
      window.location.reload()
    })
  }

  componentDidMount() {
    if(Object.keys(this.props.spaces).length === 0 && this.props.tenant.enable_create_tenant) {
      hashHistory.push({
        pathname: '/create-space',
        search: this.props.location.search
      });
    }
  }

  render() {

    let spaceContent = [] 
    Object.keys(this.props.spaces).forEach((spaceId) => {
      const space = this.props.spaces[spaceId];
      if(space.user_accepted == false && space.invite_state == 'pending'){
        spaceContent.push (
          <li key={spaceId}>
          <a
            space ={space}
            className="w-full text-left border-b border-gray-100 block hover:bg-blue-100 focus:outline-none transition duration-150 ease-in-out">
            <div className="flex items-center sm:px-10 py-4">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0 pr-4 text-gray-600">
                  {/* <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/> */}
                  {/* <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg> */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-lg leading-5 font-medium truncate">{space.name}</div>                
                  </div>
                </div>
              </div>
              <div className="px-1">
               <button type="button" 
                  onClick={e => this.handleAcceptInvitation(space, this.props.currentUser.email)}
                  className="rounded group relative w-full justify-center py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-green-500 hover:bg-green-400 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out">
                  <FormattedMessage
                    id='accounts.accept_invitation'
                    defaultMessage='Accept invitation'
                  />
                </button>
              </div>
              <div>
               <button type="button" 
                  onClick={e => this.handleDeclineInvitation(space, this.props.currentUser.email)}
                  className="rounded group relative w-full justify-center py-1 px-2 border border-transparent text-sm leading-5 font-medium rounded-none text-black bg-slate-300 hover:text-white hover:bg-slate-500 transition duration-150 ease-in-out">
                  <FormattedMessage
                    id='accounts.decline_invitation'
                    defaultMessage='Decline'
                  />
                </button>
              </div>
            </div>
          </a>
        </li>)
      }else{
        spaceContent.push (
          <li key={spaceId}>
          <a
            space ={space}
            onClick={e => this.handleSpaceClick(space)} 
            className="w-full text-left border-b border-gray-100 block hover:bg-blue-100 focus:outline-none transition duration-150 ease-in-out">
            <div className="flex items-center sm:px-10 py-4">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0 pr-4 text-gray-600">
                  {/* <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/> */}
                  {/* <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg> */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-lg leading-5 font-medium truncate">{space.name}</div>                
                  </div>
                </div>
              </div>
              <div>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </a>
        </li>
        )
      }
    });

    return (
    <>
      <Background/>
      <div className="flex sm:items-center justify-center mx-auto overflow-auto p-10">
        <div className="relative rounded sm:shadow bg-white w-screen max-w-md">
          <div className="sm:pt-10 sm:pl-10 sm:pr-10">
            <Logo/>
            <h2 className="mt-6 text-left text-2xl leading-9 font-extrabold text-gray-900">
              {this.props.spaceCount>0 &&(
                <FormattedMessage
                  id='accounts.select_space'
                  defaultMessage='Select Company'
                />
              )}
              {this.props.spaceCount==0 &&(
                <FormattedMessage
                  id='accounts.no_tenant'
                  defaultMessage='No Company'
                />
              )}
            </h2>
          </div>
          <div className="mt-4 bg-white overflow-hidden mb-10">
            <ul className="border-t border-gray-100">
              {spaceContent}
            </ul>

            <div className="mt-6 mx-10 flex justify-end">
              <button type="button" 
                onClick={this.handleCreateTenant}
                className="rounded group relative w-full justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
                <FormattedMessage
                  id='accounts.create_tenant'
                  defaultMessage='Create Company'
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
}


function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    currentSpace: getCurrentSpace(state),
    spaces: getSpaces(state),
    mySpaces: getMySpaces(state),
    spaceCount: getSpaceCount(state),
    tenant: getTenant(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          selectSpace,
          acceptInvitation,
          declineInvitation
      }, dispatch),
  };
}

// A wrapper component to pass location to class component
const withRouter = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return <SelectSpace {...props} location={location} navigate={navigate} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter);