import * as React from 'react';
import { Modal, Button, Settings } from '@steedos/design-system-react';
import SteedosTree from '../../components/tree'
import styled from 'styled-components'
import PropTypes from 'prop-types';

let Counter = styled.div`
    &>.slds-modal__content{
        overflow: hidden;
    }
    .slds-tree_container{
        width: 100%;
        max-width: 100%;
        margin-bottom: 1rem;
    }
	#example-search{
		border-radius: 0 !important;
	}
`

const objectName = "flows";
const columns = [
    {
        field: 'name',
        label: '流程名',
        width: '30%'
    },{
        field: 'category',
        type: 'lookup',
        label: '分类',
        reference_to: 'categories'
    }
]

class FlowsTree extends React.Component {
    
    static propTypes = {
        id: PropTypes.string,
    }

    componentDidMount() {
		if(this.props.loadData){
			this.props.loadData({
                objectName,
                columns
            })
		}
	}
    
    render() {
        let onClick = function(event, data){
            return (dispatch, getState)=>{
                if(data.node.type === 'branch'){
                    dispatch({
                        type: 'TREE_STATE_CHANGE',
                        payload: {
                            partialStateName: 'expandClick',
                            partialStateValue: Object.assign({}, data, {expand: !data.node.expanded}),
                            objectName: 'categories',
                            id: treeId
                        }
                    })
                }
                dispatch({
                    type: 'TREE_STATE_CHANGE',
                    payload: {
                        partialStateName: 'click',
                        partialStateValue: data,
                        objectName: 'categories',
                        id: treeId
                    }
                })
            }
        }

        const {rootNodes, nodes, treeId, searchable} = this.props
        return (
            <Counter>
                <SteedosTree searchable={searchable} objectName={objectName} rootNodes={rootNodes} onClick={onClick} id={treeId}/>
            </Counter>
        )
    }
}
export default FlowsTree