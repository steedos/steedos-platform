/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-30 15:26:08
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-11 17:07:51
 * @Description: 
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import Logo from './Logo';
import { localizeMessage } from '../utils/utils';
import PropTypes from 'prop-types';

class Card extends React.Component<any> {
  static propTypes = {
    settings: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { platform = {} } = (this.props as any).settings;
    return (
<div className="flex sm:items-center justify-center mx-auto overflow-auto md:p-10 h-full">
  <div className="relative rounded p-10 sm:shadow-md bg-white w-screen max-w-md">
    {this.props.children}
  </div>
  { platform.is_oem != true && <div className="absolute bottom-0 left-0 right-0 text-center m-2 text-gray-500 text-sm">
    <FormattedMessage
      id='accounts.copyright'
      defaultMessage='© 2025 Steedos Inc.'
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
  }
  
</div>
    )
  }

  openPrivacyPage = async () => {
    const href=localizeMessage('accounts.privacyURL');
    window.open(href);
  };
}

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
      settings: getSettings(state)
  };
}

export default connect(mapStateToProps)(Card as any);