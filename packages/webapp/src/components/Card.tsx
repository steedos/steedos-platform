import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import Logo from './Logo';

class Card extends React.Component {
  render() {
    return (
<div className="flex sm:items-center justify-center mx-auto overflow-auto md:p-10 h-full">
  <div className="relative rounded p-11 sm:shadow-md bg-white w-screen max-w-md">
    {this.props.children}
  </div>
  <div className="absolute bottom-0 left-0 right-0 text-center m-2 text-gray-500 text-sm">
    <FormattedMessage
      id='accounts.copyright'
      defaultMessage='© 2020 salesforce.com, inc.'
    /> 
    <span className="ml-1 mr-1"> | </span>
    <a className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150"
      href="javascript:void(0)" onClick={this.openPrivacyPage}>
      <FormattedMessage
        id='accounts.privacy'
        defaultMessage='Privacy'
      /> 
    </a>
  </div>
</div>
    )
  }

  openPrivacyPage = async () => {
    const href="https://www.steedos.com/cn/steedos/privacy/";
    if(window && window.AppBrowserOpen){
      // TODO:暂时没效果，等webapp包整合到meteor中再处理
      window.AppBrowserOpen(href, "_blank");
    }
    else{
      window.open(href);
    }
  };
}

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Card);