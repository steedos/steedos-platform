import { connect } from 'react-redux';
import OrganizationsTree from './organizations_tree'

function makeMapStateToProps() {
    return (state: any, ownProps: any) => {
        return {
            ...state.entities.organizations
        };
    };
}

export default connect(makeMapStateToProps)(OrganizationsTree);