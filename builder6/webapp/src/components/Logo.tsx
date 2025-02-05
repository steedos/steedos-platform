import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { Client4 } from '../client';
import { localizeMessage } from '../utils/utils';

interface Props {
  logoUrl?: string;
}

const Logo = ({ tenant, location }: any) => {
  let logoUrl = `${Client4.getUrl()}${localizeMessage('accounts.logoURL')}`;
  if (tenant.logo_url) {
    logoUrl = tenant.logo_url
  }
  return (<div>
    <img src={logoUrl} className='h-10'></img>
    </div>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Logo);