import * as React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';

interface Props {
  logoUrl?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      width: "auto",
      height: 40,
      display: "block",
      //marginBottom: 20,
      //margin: "0 auto"
    }
  }),
);

const Logo = ({ tenant, location }: any) => {
  const classes = useStyles();
  let logoUrl = "/images/logo_platform.png"
  if (tenant.logo_url) {
    logoUrl = tenant.logo_url
  }
  return (<div>
    <img src={logoUrl} className={classes.logo}></img>
    </div>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Logo);