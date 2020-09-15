import { connect } from 'react-redux';
import Notifications from './notifications'
import { loadNotificationsDataInterval, clearNotificationsInterval, loadNotificationsData, postNotificationsMethod } from '../../actions'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';

function mapStateToProps() {
    return (state: any, ownProps: any) => {
        ownProps.id = ownProps.id || makeNewID(ownProps)
        let entityState = viewStateSelector(state, ownProps.id) || {}
        return Object.assign({}, entityState, {...entityState, ...ownProps});
    };
  }
  
  const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
      init: (options: any) => {
        if(options.interval){
          dispatch(loadNotificationsDataInterval(options))
        }
        else if(options.loadDataAfterRender){
          dispatch(loadNotificationsData(options))
        }
      },
      exist: (options: any) => {
        if(options.interval){
          dispatch(clearNotificationsInterval(options))
        }
      },
      onMarkReadAll: (event: any, data: any)=> {
        let options: any;
        if(ownProps.markReadAllApiUrl){
          options = { url: ownProps.markReadAllApiUrl, methodName: "markReadAll" };
        }
        else{
          options = { methodRecordId: "all", methodName: "markReadAll"};
        }
        dispatch(postNotificationsMethod({...ownProps, ...options}))
      },
    });
  }
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);