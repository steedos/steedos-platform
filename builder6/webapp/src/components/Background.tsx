import * as React from 'react';
import { connect } from 'react-redux';
import { Client4 } from '../client';
import { getTenant } from '../selectors';

const Background = ({ tenant, location }: any) => {
  let backgroundUrl = `./images/background.svg`;
  if (tenant.background_url) {
    backgroundUrl = tenant.background_url 
  }
  let backgroundColor = '#f8f8f8';
  if (tenant.background_color) {
    backgroundColor = tenant.background_color 
  }

  const style = (window.innerWidth > 640)?{
    backgroundImage: 'url('+backgroundUrl+')',
    backgroundColor: backgroundColor
  }:{}

  return (
    <div className="">
      <div className="fixed bg-white justify-center mx-auto h-full w-full" style={style}>
      </div>  
    </div>
  )
};

function mapStateToProps(state) {
  return {
    tenant: getTenant(state),
  };
}
export default connect(mapStateToProps)(Background);