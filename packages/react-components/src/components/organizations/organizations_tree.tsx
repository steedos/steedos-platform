import * as React from 'react';
import SteedosTree from '../../components/tree'
import PropTypes from 'prop-types';
import { getEntityState } from '../../states/entitys'
import store from '../../stores/configureStore'

class OrganizationsTree extends React.Component {
    static defaultProps = {
        valueField: '_id'
    }

    static propTypes = {
        rootNodes: PropTypes.array.isRequired,
        multiple: PropTypes.bool,
        valueField: PropTypes.string //指定控件返回的值来自记录的那个属性，比如：user 字段，或者 email字段
    }

    render() {
        //Tree props
        let { rootNodes } = this.props as any
        let $selectOrg = ['_id', 'name', 'fullname', 'children']
        let getNodes = function(node: any){
            if(!node.nodes){
                return []
            }
            let entityState = getEntityState(store.getState(), 'organizations') || {}
            let nodes: any = []
            let stateNodes = entityState.nodes || []
            node.nodes.forEach((element: any) => {
                if(stateNodes[element]){
                    nodes.push(stateNodes[element])
                }
            });
            return nodes
        }
        return (
            <SteedosTree objectName='organizations' rootNodes={rootNodes} $select={$selectOrg} getNodes={getNodes}/>
        )
    }
}
export default OrganizationsTree