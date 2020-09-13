import { connect } from 'react-redux';
import OrganizationsTree from './organizations_tree'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';

function makeMapStateToProps() {
    return (state: any, ownProps: any) => {
        ownProps.id = ownProps.id || makeNewID(ownProps)
        let entityState = viewStateSelector(state, ownProps.id) || {}
        return Object.assign({}, entityState, {...entityState, ...ownProps});
    };
}

export default connect(makeMapStateToProps)<any>(OrganizationsTree);