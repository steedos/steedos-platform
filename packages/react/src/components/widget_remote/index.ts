import { connect } from 'react-redux';
import WidgetRemote from './widget_remote'

function mapStateToProps() {
    return (state: any, ownProps: any) => {
        return Object.assign({}, { ...ownProps });
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        init: (options: any) => {
        }
    });
}
export default connect(mapStateToProps, mapDispatchToProps)(WidgetRemote);

