import * as React from 'react';
import { connect } from 'react-redux';

class Background extends React.Component {
  render() {
    const {color, url} = this.props
    const style = {
      backgroundImage: 'url('+url+')',
      backgroundColor: color
    }
    return (
      <div>
        <div className="absolute justify-center mx-auto h-full w-full" style={style}>
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