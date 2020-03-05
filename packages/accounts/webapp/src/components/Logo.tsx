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
      height: 70,
      display: "block",
      margin: "0 auto",
      paddingBottom: 20
    }
  }),
);

const Logo = ({ tenant }: any) => {
  const classes = useStyles();
  let logoUrl = require("../assets/logo-square.png")
  if (tenant.logo_url) {
    logoUrl = tenant.logo_url
  }

  return (
    <img src={logoUrl} className={classes.logo}></img>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Logo);