import { connect } from 'react-redux';
import Dashboard from './slds_dashboard'

function mapStateToProps() {
    return (state: any, ownProps: any) => {
        return Object.assign({ }, { ...ownProps });
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        init: (options: any) => {
        }
    });
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

