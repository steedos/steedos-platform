import { connect } from 'react-redux';
import { visibleAppsSelector } from '../../selectors';
import WidgetApps from './widget_apps'

function mapStateToProps() {
    return (state: any, ownProps: any) => {
        let apps = visibleAppsSelector(state)
        return Object.assign({},{ apps }, { ...ownProps });
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        init: (options: any) => {
        }
    });
}
export default connect(mapStateToProps, mapDispatchToProps)(WidgetApps);

