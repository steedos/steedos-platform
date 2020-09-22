import * as React from 'react';
import { connect } from 'react-redux';
import { Client4 } from '../client';

class Background extends React.Component {
  render() {
    const color = this.props.color?this.props.color:'#f8f8f8';
    const url = this.props.url?this.props.url:`${Client4.getUrl()}/images/background.svg`;

    const style = (window.innerWidth > 640)?{
      backgroundImage: 'url('+url+')',
      backgroundColor: color
    }:{}

    return (
      <div className="">
        <div className="fixed bg-white justify-center mx-auto h-full w-full" style={style}>
        </div>  
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default Background;