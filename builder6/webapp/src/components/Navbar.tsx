import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { Transition } from '@tailwindui/react'
import { useState } from 'react'
import * as GlobalActions from '../actions/global_actions';
import Logo from './Logo';
import {  useNavigate } from "react-router";

const Navbar = ({ tenant, user }: any) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  const onLogout = async () => {
    navigate('/logout');
  };

  // document.onclick=() => {if (menuOpen) setMenuOpen(false)}

  return (
<div>
  <nav className="bg-white shadow border-gray-200">
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-15">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <a href="/">
              <Logo/>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
            {/* <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 focus:outline-none hover:bg-gray-200 focus:text-gray-700">Home</a>
            
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Team</a>

              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Projects</a>

              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Calendar</a>

              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Reports</a> */}
            </div>
          </div>
        </div>
        <div className="md:block">
          <div className="ml-4 flex items-center md:ml-6">
            <a href="https://www.steedos.com/help/" target="_blank" className="p-1 text-cool-gray-400 rounded-full hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500" aria-label="Notifications">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>

            <div className="ml-3 relative">
              {/* <div>
                <button className="p-1 border-2 border-transparent text-gray-700 rounded-full hover:text-blue-500 focus:outline-none transition duration-150 ease-in-out flex items-center" id="user-menu" aria-label="User menu" aria-haspopup="true"
                 onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="mr-1">{user && user.name &&(user.name)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div> */}
              <div>
                <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:bg-cool-gray-100 lg:p-2 lg:rounded-md lg:hover:bg-cool-gray-100" id="user-menu" aria-label="User menu" aria-haspopup="true"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <p className="hidden ml-3 text-cool-gray-700 text-sm leading-5 font-medium lg:block">{user && user.name &&(user.name)}</p>
                  <svg className="hidden flex-shrink-0 ml-1 h-5 w-5 text-cool-gray-400 lg:block" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <Transition
                show={menuOpen}
                >
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                  <div className="py-1 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a> */}
                    <a href="/select-space" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">选择企业</a>

                    {/* <a href="#/preference" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">账户设置</a> */}

                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={onLogout}>注销</a>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>

  </nav>

  {/* <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        Dashboard
      </h1>
    </div>
  </header> */}
  {/* <main>
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
      </div>
    </div>
  </main> */}
</div>
  
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Navbar);