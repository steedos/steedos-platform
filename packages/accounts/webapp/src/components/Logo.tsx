import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface Props {
  logoUrl?: string;
}

const useStyles = makeStyles({
  logo: {
    width: 80,
    height: 80,
    display: "block",
    margin: "0 auto",
  },
});

const Logo = ({ logoUrl }: Props) => {
  const classes = useStyles();
  if (!logoUrl) 
    logoUrl = require("../assets/logo-square.png")
  return (
    <img src={logoUrl} className={classes.logo}></img>
  )
};

export default Logo;
