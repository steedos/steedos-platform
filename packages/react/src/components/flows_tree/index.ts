import { connect } from 'react-redux';
import FlowsTree from './flows_tree'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';
import { loadFlowsTreeEntitiesData, createTreeAction } from '../../actions'

function makeMapStateToProps() {
    return (state: any, ownProps: any) => {
        ownProps.id = ownProps.id || makeNewID(ownProps)
        let entityState = viewStateSelector(state, ownProps.id) || {}
        return Object.assign({}, entityState, {...entityState, ...ownProps});
    };
}
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        loadData: (options)=> dispatch(createTreeAction("setNodes", {nodes: ownProps.nodes}, {id: ownProps.treeId})),
    });
  }
export default connect(makeMapStateToProps, mapDispatchToProps)(FlowsTree);