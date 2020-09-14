import * as React from 'react';
import { connect } from 'react-redux';
import { Client4 } from '../client';

class Background extends React.Component {
  render() {
    const color = this.props.color?this.props.color:'#f8f8f8';
    const url = this.props.url?this.props.url:Client4.getAbsoluteUrl('/accounts/a/images/background.svg');

    const style = {
      backgroundImage: 'url('+url+')',
      backgroundColor: color
    }
    return (
      <div className="hidden sm:block">
        <div className="fixed justify-center mx-auto h-full w-full" style={style}>
        </div>  
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Background);