import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import LocalizedInput from '../components/LocalizedInput';
import { createSpace, selectSpace, } from '../actions/spaces';
import Logo from '../components/Logo';
import Card from '../components/Card';
import * as GlobalAction from '../actions/global_actions';
import { getCurrentUser } from '../selectors/entities/users';
import { useLocation, useNavigate, Navigate } from "react-router";

class CreateTenant extends React.PureComponent {


  constructor(props, context) {
    super(props, context);

    this.state = {
      name: ''
    };
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  }

  onSubmit = async (e) => {
    this.setState({serverError: null, loading: true});
    e.preventDefault();
    this.props.actions.createSpace(this.state.name).then(async ({data}) => {
      console.log(data)
      // if (error) {
      //   this.setState({
      //       serverError: (
      //           <FormattedMessage
      //               id={error.message}
      //           />
      //       ),
      //   });
      //   return;
      // }
      
      if (data)
        this.selectSpace(data)
    });


  };

  selectSpace = (space) => {
    if(space && space._id) {
      this.props.actions.selectSpace(space._id);
      const currentUser = this.props.currentUser;
      const tenant = this.props.tenant;
      const location = this.props.location;
      const navigate = this.props.navigate;
      GlobalAction.finishSignin(currentUser, tenant, location, navigate)
    }
  }

  render() {

  return (
<Card>

    <Logo/>
  
    <h2 className="my-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
      <FormattedMessage
          id='accounts.title.createTenant'
          defaultMessage='Create Team'
        />
    </h2>
    <div class="mt-2 max-w-xl text-sm leading-5 text-gray-500">
      <p>
      <FormattedMessage
          id='accounts.create_tenant_description'
          defaultMessage='Create a new team and invite your colleagues to join.'
        />
      </p>
    </div>
    
    <form onSubmit={this.onSubmit} className="mt-4">


        <div className="rounded-md shadow-sm my-2">
          <div>
            <LocalizedInput 
              id="name"
              name="name" 
              value={this.state.name}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
              placeholder={{id: 'accounts.tenant_name', defaultMessage: 'Team Name'}}
              onChange={this.handleNameChange}
            />
          </div>
        </div>
        
        {/* {error && <FormError error={error!} />} */}

        <div className="mt-6 flex justify-end">
          <button type="submit" className="group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
            <FormattedMessage
              id='accounts.submit'
              defaultMessage='Submit'
            />
          </button>
        </div>
      </form>
  </Card>
  )};
};


function mapStateToProps(state) {
  return {
    currentUser: getCurrentUser(state),
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          createSpace,
          selectSpace,
      }, dispatch),
  };
}


// A wrapper component to pass location to class component
const withRouter = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return <CreateTenant {...props} location={location} navigate={navigate} />;
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter);
