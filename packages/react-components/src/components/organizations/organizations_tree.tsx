import * as React from 'react';
import SteedosTree from '../../components/tree'
import PropTypes from 'prop-types';

class OrganizationsTree extends React.Component {
    static defaultProps = {
        valueField: '_id'
    }

    static propTypes = {
        rootNodes: PropTypes.array.isRequired,
        multiple: PropTypes.bool,
        valueField: PropTypes.string, //指定控件返回的值来自记录的那个属性，比如：user 字段，或者 email字段
        onClickFunc: PropTypes.func
    }

    render() {
        //Tree props
        let { rootNodes, onClickFunc } = this.props as any
        let $selectOrg = ['_id', 'name', 'fullname', 'children']
        let getNodes = (node: any)=>{
            if(!node.nodes){
                return []
            }
            let { nodes:stateNodes = {} } = this.props as any
            let nodes: any = []
            node.nodes.forEach((element: any) => {
                if(stateNodes[element]){
                    nodes.push(stateNodes[element])
                }
            });
            return nodes
        }
        return (
            <SteedosTree objectName='organizations' rootNodes={rootNodes} $select={$selectOrg} getNodes={getNodes} onClickFunc={onClickFunc}/>
        )
    }
}
export default OrganizationsTree