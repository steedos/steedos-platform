import { DXGRID_STATE_CHANGE_ACTION, loadEntitiesData } from '../../actions/views/dx_grid'
import store from '../../stores/configureStore';

function transformEntityState(state: any, action: any){
    return Object.assign({}, state, {rows: action.partialStateValue.records, totalCount: action.partialStateValue.totalCount});
}

function reducer(state:any = {}, action: any){
    if (action.type === DXGRID_STATE_CHANGE_ACTION) {
        switch (action.partialStateName) {
            case 'loadDataSauce':
                return transformEntityState(state, action);
            case 'filters': //TODO 优化此处代码，当filters发生编号时，如何抓取数据
               store.dispatch(loadEntitiesData(Object.assign({}, {...state, objectName: action.objectName, currentPage: state.currentPage, pageSize: state.pageSize, filters: action.partialStateValue })));
               break;
            default:
                break;
        }
        return Object.assign({}, state, {[action.partialStateName]: action.partialStateValue});
    }
    return state;
}

export default reducer