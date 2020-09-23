import React from 'react';
import styled from 'styled-components'
import { Provider } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { FlowsTree,Modal } from '../components';
import { createModalAction } from '../actions'
import _ from 'underscore'
import { Icon } from '@steedos/design-system-react';

export default {
    title: 'Tree',
};
const Container = styled.div`
//   float: right;
//   margin: 2rem;
//   margin-right: 200px;
//   clear: both;
.flow-favorite{
    float: right;
    margin-right: 5rem;
}
`;
const modalId = 'flowsModal';
let colorVariant = "light";
if(Math.ceil(Math.random()*10) > 5){
    colorVariant = "warning";
}
const labelClick = (a,b,c)=>{
    console.log('labelClick', a,b,c);
}
const nodes = {
	0: {
		id: 0,
		nodes: [2],
	},
	2: {
		label: '星标流程',
		type: 'branch',
		id: 2,
		nodes: [5, 6, 8],
	},
	5: {
		assistiveText: '发文',
		label: '发文',
		type: 'item',
		id: 5
	},
	6: {
		assistiveText: '1合同',
		label: <div style={{background: "red"}} >
		<a style={{background: "#03a9f4"}} onClick={(event)=>{console.log('合同。。。。。。。。。');labelClick(event, 8)}}>合同</a>
		<div style={{ float: "right", cursor: 'pointer', marginRight: '3rem' }} onClick={() => {
						console.log('Icon Bare Clicked');
					}}>
						<Icon
							category="utility"
							name="favorite"
							size="x-small"
							colorVariant={colorVariant}
						/>
					</div>
		</div>,
		type: 'item',
		id: 6
	},
	8: {
		label: <div style={{background: "red"}} >
            <button style={{background: "#03a9f4"}} onClick={(event)=>{console.log('收文。。。。。。。。。');labelClick(event, 8)}}>收文</button>
            <button style={{ float: "right", cursor: 'pointer', marginRight: '3rem' }} onClick={() => {
                            console.log('Icon Bare Clicked');
                        }}>
                            <Icon
                                category="utility"
                                name="favorite"
                                size="x-small"
                                colorVariant={colorVariant}
                            />
                        </button>
            </div>,
		type: 'item',
		id: 8,
		assistiveText: '1收文'
	}
};
// let onClick = function(event, data){
//     console.log('logoutAccount click...', event, data);
// }
let treeId = "flowsTree";
let rootNodes = nodes["0"].nodes

export const MyTree = () => {
    var toggleOpen = () => {
        store.dispatch(createModalAction('isOpen', true, {id: modalId}))
    };

    var onConfirm = ()=>{
        let selection = store.getState().views.byId.flowsList.selection;
        document.getElementById("flowIds").value = _.pluck(selection, '_id')
    }
    return (
        <Provider store={store}>
            <Bootstrap>
                <Container>
                <input id="flowIds" type="text" style={{height: 35, width: 350}}/><br/>
                <button onClick={toggleOpen}>显示Modal</button>
                    <Modal heading="流程Tree" id={modalId} appElement="body" onConfirm={onConfirm} align="top" footer={null}>
                        <FlowsTree searchable={true} rootNodes={rootNodes} nodes={nodes} treeId={treeId}/>
                    </Modal>
                </Container>
            </Bootstrap>
        </Provider>
    )
};

const options = {
    id: "chooseFlow",
    modalProp: {
        align: "top",
        size: "small",
        footer: null
    },
    treeProp: {
        searchable: true,
        treeId: 'chooseFlowTree'
    }
}