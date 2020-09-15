import { CATEGORIES_STATE_CHANGE_ACTION } from '../../actions/views/categories'
import _ from 'underscore'

function getRootNodes(records: any){
    return _.pluck(records, '_id')
}


function reducer(state: any = {}, action: any) {
    if (action.type === CATEGORIES_STATE_CHANGE_ACTION) {
        const payload = action.payload
        switch (payload.partialStateName) {
            case 'loadDataSauce':
                return Object.assign({}, state, { rootNodes: getRootNodes(payload.partialStateValue.records)});
            default:
                break;
        }
        return Object.assign({}, state, { [payload.partialStateName]: payload.partialStateValue });
    }
    return state;
};

export default reducer