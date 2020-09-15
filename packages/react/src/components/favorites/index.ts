import { connect } from 'react-redux';
import Favorites from './favorites'
import { loadFavoritesEntitiesData } from '../../actions'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';

function mapStateToProps() {
  return (state: any, ownProps: any) => {
    ownProps.id = ownProps.id || makeNewID(ownProps)
    let entityState = viewStateSelector(state, ownProps.id) || {}
    return Object.assign({}, entityState, { ...entityState, ...ownProps }, { objectName: "favorites", columns: [{ field: "name" }, { field: "object_name" }, { field: "record_type" }, { field: "record_id" }], sort: "sort_no desc" });
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return ({
    // init: (options: any) => dispatch(loadFavoritesEntitiesData(options))
  });
}
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);