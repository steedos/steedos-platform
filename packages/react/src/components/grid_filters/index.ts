import { connect } from 'react-redux';
import Filters from './filters'
import { makeNewID } from '../index';
import { createGridAction } from '../../actions';

// function makeMapStateToProps() {
//     return (state: any, ownProps: any) => {
//         let profileState = {profile: getProfile(state) || {}}
//         return Object.assign({}, profileState, {...profileState, ...ownProps});
//     };
// }

function mapStateToProps() {
    return (state: any, ownProps: any) => {
      ownProps.id = ownProps.id || makeNewID(ownProps)
      return Object.assign({}, ownProps);;
    };
  }
  
  const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        onSelect: (partialStateName: any, partialStateValue: any, options: any) => dispatch(createGridAction(partialStateName, partialStateValue, options))
    });
  }

export default connect(mapStateToProps, mapDispatchToProps)(Filters);