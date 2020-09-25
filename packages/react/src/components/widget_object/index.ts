import { connect } from 'react-redux';
import { viewStateSelector } from '../../selectors';
import WidgetObject from './widget_object'
import { makeNewID } from '../index';

function mapStateToProps() {
    return (state: any, ownProps: any) => {
        ownProps.id = ownProps.id || makeNewID(ownProps)
        let entityState = viewStateSelector(state, ownProps.id) || {};
        return Object.assign({}, entityState, { ...entityState, ...ownProps });
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        init: (options: any) => {
            // dispatch(loadEntitiesData(options))
        }
    });
}
export default connect(mapStateToProps, mapDispatchToProps)(WidgetObject);

