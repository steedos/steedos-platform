import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { Client4 } from '../client';
import { localizeMessage } from '../utils/utils';

interface Props {
  logoUrl?: string;
}

const Logo = ({ tenant, settings }: any) => {
  const platform = settings?.platform || {};
  const isOem = platform?.is_oem === true || platform?.is_oem === 'true';
  const tenantConfig = settings?.tenant || {};
  let logoUrl = `${localizeMessage('accounts.logoURL')}`;
  if (isOem && (tenant?.logo_url || tenantConfig?.logo_url)) {
    logoUrl = tenant?.logo_url || tenantConfig?.logo_url;
  } else if (tenant?.logo_url) {
    logoUrl = tenant.logo_url;
  }
  return (<div>
    <img src={logoUrl} className='h-10' alt='logo'></img>
    </div>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
      settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Logo);