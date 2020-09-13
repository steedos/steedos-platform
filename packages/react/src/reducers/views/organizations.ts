
import { ORGANIZATIONS_STATE_CHANGE_ACTION } from '../../actions/views/organizations'
import _ from 'underscore'

function getRootNodes(records: any){
    if(records.length > 0){
        return _.map(records, function(record: any){
            return {
                expanded: true,
                id: record._id,
                label: record.name,
                selected: true,
                type: 'branch',
                nodes: record.children || []
            }
        })
    }
    return _.pluck(records, '_id')
}


function reducer(state: any = {}, action: any) {
    if (action.type === ORGANIZATIONS_STATE_CHANGE_ACTION) {
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