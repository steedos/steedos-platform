
import { connect } from 'react-redux';
import { createTreeAction, removeViewAction } from '../../actions'
import SteedosTree from './salesforce_tree';
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';

function mapStateToProps() {
  return (state: any, ownProps: any) => {
    ownProps.id = ownProps.id || makeNewID(ownProps)
    let entityState = viewStateSelector(state, ownProps.id) || {}
    return entityState;
  };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  let props:any = {
    removeViewAction: (viewId: string)=> dispatch(removeViewAction(viewId)),
    changeNode: (partialStateValue: any ,options: any)=> dispatch(createTreeAction("changeNode", partialStateValue, options)),
    changeNodes: (partialStateValue: any ,options: any)=> dispatch(createTreeAction("changeNodes", partialStateValue, options))
  }

  if(ownProps.init){
    props.init = (options: any) => dispatch(ownProps.init(options))
  }

  if(ownProps.onClick){
    props.onExpandClick = (event: any, data: any) => dispatch(createTreeAction('expandClick', data, ownProps))
    props.onClick = (event: any, data: any) => dispatch(ownProps.onClick(event, data))
  }

  return props;
}

export default connect(mapStateToProps, mapDispatchToProps)(SteedosTree);