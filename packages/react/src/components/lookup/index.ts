import { connect } from 'react-redux';
import Lookup from './salesforce_comboboxes'
import { loadLookupEntitiesData } from '../../actions'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';

function mapStateToProps() {
    return (state: any, ownProps: any) => {
      ownProps.id = ownProps.id || makeNewID(ownProps)
      let entityState = viewStateSelector(state, ownProps.id) || {}
      return Object.assign({}, entityState, {...entityState, ...ownProps});;
    };
  }
  
  const mapDispatchToProps = (dispatch: any, ownProps: any) => {

    const mapDispatch: any= {
      onSearch: (event: any, data: any)=> dispatch(ownProps.onSearch(event, data)),
      init: (options: any) => dispatch(loadLookupEntitiesData(options))
    }
    if(ownProps.onRequestRemoveSelectedOption){
      mapDispatch.onRequestRemoveSelectedOption = (event: any, data: any)=> dispatch(ownProps.onRequestRemoveSelectedOption(event, Object.assign({column: ownProps.column}, data)))
    }
    return mapDispatch;
  }
export default connect(mapStateToProps, mapDispatchToProps)(Lookup);