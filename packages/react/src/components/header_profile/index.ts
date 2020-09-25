import { connect } from 'react-redux';
import HeaderProfile from './profile'
import { getProfile } from '../../selectors/profile';

function makeMapStateToProps() {
    return (state: any, ownProps: any) => {
        let profileState = {profile: getProfile(state) || {}}
        return Object.assign({}, profileState, {...profileState, ...ownProps});
    };
}

export default connect(makeMapStateToProps)(HeaderProfile);