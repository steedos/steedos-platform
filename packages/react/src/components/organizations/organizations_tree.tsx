import * as React from 'react';
import SteedosTree from '../../components/tree'
import { loadOrganizationsEntitiesData } from '../../actions'
import { loadTreeEntitiesData } from '../../actions'
import PropTypes from 'prop-types';
import _ from 'underscore'

class OrganizationsTree extends React.Component {
    static defaultProps = {
        valueField: '_id',
        width: '300px',
        objectName: 'organizations',
        columns: [{field: 'name'},{field: 'fullname'},{field: 'children'}]
    }

    constructor(props) {
        super(props)
        if(_.isEmpty(props.rootNodes)){
            props.dispatch(loadOrganizationsEntitiesData({ id: props.id, objectName: props.objectName, filters: [["parent", "=", null]], columns: props.columns}))
        }
		
    }

    static propTypes = {
        rootNodes: PropTypes.array.isRequired,
        id: PropTypes.string,
        multiple: PropTypes.bool,
        valueField: PropTypes.string, //指定控件返回的值来自记录的那个属性，比如：user 字段，或者 email字段
        onClick: PropTypes.func
    }

    render() {
        //Tree props
        let { rootNodes, onClick, objectName, columns, id } = this.props as any
        let getNodes = (node: any)=>{
            if(!node.nodes){
                return []
            }
            let { nodes:stateNodes = {} } = this.props as any
            let nodes: any = []
            node.nodes.forEach((element: any) => {
                if(_.isString(element)){
                    if(stateNodes[element]){
                        nodes.push(stateNodes[element])
                    }
                }else{
                    if(stateNodes[element.id]){
                        nodes.push(Object.assign({expanded: true}, stateNodes[element.id]))
                    }
                }
            });
            return nodes
        }

        let init = (options: any)=>{
            const newOptions = Object.assign({}, options)
            newOptions.columns = columns
            return loadTreeEntitiesData(newOptions)
        }
        return (
            <SteedosTree objectName={objectName} rootNodes={rootNodes} getNodes={getNodes} onClick={onClick} init={init} id={id}/>
        )
    }
}
export default OrganizationsTree