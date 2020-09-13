import { connect } from 'react-redux';
import Dashboard from './bootstrap'
import { loadBootstrapEntitiesData } from '../../actions'
import { entityStateSelector, isRequestStarted } from '../../selectors';


function mapStateToProps() {
    return (state: any, ownProps: any) => {
        let space = entityStateSelector(state, "space") || null;
        return Object.assign({ isBootstrapLoaded: !!space }, { ...ownProps, isRequestStarted: isRequestStarted(state)});
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        // handleChanged: (event: any, data: any) => dispatch(createActionBootstrap('changeSpace', data.spaceId)),
        loadBootstrap: (options: any) => {
            dispatch(loadBootstrapEntitiesData(options))
        }
    });
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

