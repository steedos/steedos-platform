import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface Props {
  logoUrl?: string;
}

const useStyles = makeStyles({
  logo: {
    width: "100%",
    height: "auto",
    maxWidth: 320,
    display: "block",
    margin: "0 auto",
    paddingBottom: 10,
  },
});

const Logo = ({ logoUrl }: Props) => {
  const classes = useStyles();
  if (!logoUrl) 
    logoUrl = require("../assets/logo.png")
  return (
    <img src={logoUrl} className={classes.logo}></img>
  )
};

export default Logo;
