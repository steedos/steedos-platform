import { connect } from 'react-redux';
import GridModal from './modal'
import { viewStateSelector } from '../../selectors';
import { makeNewID } from '../index';
import { createGridModalAction } from '../../actions'

function makeMapStateToProps() {
    return (state: any, ownProps: any) => {
        ownProps.id = ownProps.id || makeNewID(ownProps)
        let entityState = viewStateSelector(state, ownProps.id) || {}
        return Object.assign({}, entityState, {...entityState, ...ownProps});
    };
}
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return ({
        closeModal: (modalId)=> dispatch(createGridModalAction('isOpen', false, {id: modalId})),
    });
  }
export default connect(makeMapStateToProps, mapDispatchToProps)(GridModal);