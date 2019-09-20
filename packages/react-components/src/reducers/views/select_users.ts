import { DXGRID_STATE_CHANGE_ACTION } from '../../actions/views/dx_grid'
import {TREE_STATE_CHANGE_ACTION} from '../../actions/views/tree'
import { getEntityState } from '../../states/entitys'
import entitiesReducer from '../entities'

function reducer(state:any = {}, action: any){
    if (action.type === TREE_STATE_CHANGE_ACTION) {
        switch (action.partialStateName) {
            case 'onClick': {
                let entityState = getEntityState(state, 'organizations')
                if (entityState.selectedNode.length > 0) {
                    return Object.assign({}, state, {
                        entities: {
                            ...state.entities,
                            space_users: (entitiesReducer(state.entities, {
                                type: DXGRID_STATE_CHANGE_ACTION,
                                partialStateName: "filters",
                                partialStateValue: [{ columnName: "organizations", value: entityState.selectedNode[0], operation: "equals" }],
                                objectName: 'space_users'
                            })).space_users
                        }
                    })
                }
                return state
            }
            default:
                return state
        }
    }

    return state;
}

export default reducer