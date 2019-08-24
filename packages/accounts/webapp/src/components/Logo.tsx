import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface Props {
  logoUrl?: string;
}

const Logo = ({ logoUrl }: Props) => {
  if (!logoUrl) 
    logoUrl = require("../assets/logo.png")
  return (
    <img src={logoUrl} id="logo"></img>
  )
};

export default Logo;
