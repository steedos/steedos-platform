
import { TREE_STATE_CHANGE_ACTION } from '../../actions/views/tree'
import _ from 'underscore'
import produce from "immer"

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

//TODO: 优化expandClick，click
const reducer = produce((draft: any = {}, action: any)=>{
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        const payload = action.payload
        let value = payload.partialStateValue
        let nodeId: string = value.node ? value.node.id : ""
        switch (payload.partialStateName) {
            case 'expandClick':
                draft.nodes[value.node.id]["expanded"] = value.expand
                break;
            case 'click':
                let selectedNodeIds = draft.selectedNode || []
                if (selectedNodeIds.length > 0) {
                    (draft.nodes[selectedNodeIds[0]] as any).selected = false
                }
                let selected = value.select ? true : value.node.selected
                draft.nodes[nodeId]["selected"] = selected
                if (selected) {
                    draft.selectedNode = [nodeId]
                }
                break;
            case 'loadDataSauce':
                draft.nodes = transformData(payload.partialStateValue.records);
                draft.totalCount = payload.partialStateValue.totalCount ;
                break;
            case 'changeNode':
                draft.nodes[value.node.id] = Object.assign({}, draft.nodes[value.node.id], value.node);
                break;
            case 'changeNodes':
                _.each(value.nodes, function(node:any){
                    draft.nodes[node.id] = Object.assign({}, draft.nodes[node.id], node);
                })
                break;
            case 'setNode':
                draft.nodes[value.node.id] = Object.assign({}, value.node);
                break;
            case 'setNodes':
                draft.nodes = value.nodes;
                break;
            default:
                break;
        }
        draft[payload.partialStateName] = payload.partialStateValue
        // return Object.assign({}, draft, { [payload.partialStateName]: payload.partialStateValue });

    }
    return draft;
});

export default reducer