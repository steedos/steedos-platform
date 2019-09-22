
import { TREE_STATE_CHANGE_ACTION } from '../../actions/views/tree'
import _ from 'underscore'


/**
 * return: {id: {label: ,type: , id}}
 * @param records 待转换的数据
 */
function transformData(records: any) {
    let items: any = {}
    records.forEach((element: any) => {
        let item: any = { id: element._id, label: element.name }
        if (_.isEmpty(element.children)) {
            item.type = 'item'
        } else {
            item.type = 'branch'
            item.nodes = element.children
        }
        items[element._id] = item
    });
    return items;
}


//TODO: 优化onExpandClick，onClick
function reducer(state: any = {}, action: any) {
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        let value = action.partialStateValue
        let nodeId: string = value.node ? value.node.id : ""
        switch (action.partialStateName) {
            case 'onExpandClick':
                state.nodes[value.node.id]["expanded"] = value.expand
                break;
            case 'onClick':
                let selectedNodeIds = state.selectedNode || []
                if (selectedNodeIds.length > 0) {
                    (state.nodes[selectedNodeIds[0]] as any).selected = false
                }
                let selected = value.select ? true : value.node.selected
                state.nodes[nodeId]["selected"] = selected
                if (selected) {
                    state.selectedNode = [nodeId]
                }
                break;
            case 'loadDataSauce':
                return Object.assign({}, state, { nodes: transformData(action.partialStateValue.records), totalCount: action.partialStateValue.totalCount });
            default:
                break;
        }
        return Object.assign({}, state, { [action.partialStateName]: action.partialStateValue });

    }
    return state;
};

export default reducer