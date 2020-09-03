import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import Navbar from './Navbar';

import { accountsClient, accountsRest } from '../accounts';


const Home = ({ history, settings, tenant, location }: any) => {
  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCookie = (name: string) => {
    let pattern = RegExp(name + "=.[^;]*")
    let matched = document.cookie.match(pattern)
    if(matched){
        let cookie = matched[0].split('=')
        return cookie[1]
    }
    return ''
  }

  const fetchUser = async () => {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
    const data = await accountsRest.authFetch( 'user', {});
  
    if (!data) {
      history.push('/login');
      return;
    }
    setUser(data);
    if(!data.spaces || data.spaces.length === 0){
      
    }else{
      const searchParams = new URLSearchParams(location.search);
      let redirect_uri = searchParams.get("redirect_uri");
      if (redirect_uri){
        if(!redirect_uri.startsWith("http://") && !redirect_uri.startsWith("https://")){
          redirect_uri = window.location.origin + redirect_uri
        }
        let u = new URL(redirect_uri);
        u.searchParams.append("token", tokens.accessToken);
        u.searchParams.append("X-Auth-Token", getCookie('X-Auth-Token'));
        u.searchParams.append("X-User-Id", getCookie('X-User-Id'));
        window.location.href = u.toString();
      }
    }
  };

  const onLogout = async () => {
    await accountsClient.logout();
    history.push('/login');
  };

  const onHome = async () => {
    window.location.href = settings.root_url ? settings.root_url : "/";
  };

  if (!user) {
    return null;
  }
  return (
    <div>
      <Navbar user={user}/>
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

      <div className="bg-opacity-75 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                {/* <img className="hidden h-15 w-15 rounded-full sm:block" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80" alt=""/> */}
                <span className="inline-block h-15 w-15 rounded-full overflow-hidden bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <div>
                  <div className="flex items-center">
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-cool-gray-900 sm:leading-9 sm:truncate">
                      欢迎您, {user && user.name}
                    </h1>
                  </div>
                  <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    {/* <dt className="sr-only">Company</dt>
                    <dd className="flex items-center text-sm leading-5 text-cool-gray-500 font-medium capitalize sm:mr-6">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-cool-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
                      </svg>
                      华炎软件
                    </dd> */}
                    <dt className="sr-only">Account status</dt>
                    <dd className="mt-3 flex items-center text-sm leading-5 text-cool-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      手机已验证
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <span className="shadow-sm rounded-md">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:shadow-outline-teal focus:border-teal-700 active:bg-teal-700 transition duration-150 ease-in-out" 
                  onClick={onHome}>
                  进入首页
                </button>
              </span>
              <span className="shadow-sm rounded-md">
                <a href="#/preference" className="inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out">
                  账户设置
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Home);