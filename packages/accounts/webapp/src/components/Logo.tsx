import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getSettings } from '../selectors';

interface Props {
  logoUrl?: string;
}

const useStyles = makeStyles({
  logo: {
    width: "auto",
    height: 70,
    display: "block",
    margin: "0 auto",
    paddingBottom: 20
  },
});

const Logo = ({ settings }: any) => {
  const classes = useStyles();
  let logoUrl = require("../assets/logo-square.png")
  if (settings.tenant.logo) {
    logoUrl = settings.tenant.logo
  }
  return (
    <img src={logoUrl} className={classes.logo}></img>
  )
};


function mapStateToProps(state: any) {
  return {
      settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(Logo);