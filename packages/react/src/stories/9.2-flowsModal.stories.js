import React from 'react';
import styled from 'styled-components'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { FlowsModal } from '../components';
import { createFlowsModalAction } from '../actions'
import _ from 'underscore'
import { Icon,Button,ButtonIcon,ButtonStateful } from '@steedos/design-system-react';

export default {
    title: 'FlowsModal',
};

const modalId = 'flowsModal';

export const MyFlowsModal_disabledSelectRows = () => {

    var toggleOpen = () => {
        store.dispatch(createFlowsModalAction('isOpen', true, {id: modalId}))
    };

    var onConfirm = ()=>{
        let selection = store.getState().views.byId.flowsList.selection;
        document.getElementById("flowIds").value = _.pluck(selection, '_id')
    }

    var gridProp = {
        enableFilters: true,
        columns: [
            {
                field: 'name',
                label: '流程名',
                width: '30%'
            },{
                field: 'category',
                type: 'lookup',
                label: '分类',
                reference_to: 'categories',
                enableFilter: true,
                hidden: true,
                // rows: [{
                //     id: "favorites",
                //     name: "收藏"
                // }]
            },{
                field: '',
                label: '',
                format: (children, item, options) =>{
                    // console.log("children", children);
                    // console.log("item", item);
                    // console.log("options", options);
                    let colorVariant = "light";
                    if(Math.ceil(Math.random()*10) > 5){
                        colorVariant = "warning";
                    }
                    return (<div style={{ textAlign: 'right', cursor: 'pointer', marginRight: '1.5rem' }}>
                        <a onClick={() => {
                            console.log('Icon Bare Clicked', item);
                        }}>
                            <Icon
                                category="utility"
                                name="favorite"
                                size="x-small"
                                colorVariant={colorVariant}
                            />
                        </a>
                    </div>)
                }
            }
        ]
    }

    return (
        <Provider store={store}>
            <Bootstrap>
                <input id="flowIds" type="text" style={{height: 35, width: 350}}/><br/>
                <button onClick={toggleOpen}>显示FlowsModal</button>
                <FlowsModal id={modalId} appElement="body" disabledSelectRows={true} onConfirm={onConfirm} gridId="flowsList" multiple={false} spaceId="" gridProp={gridProp}/>
            </Bootstrap>
        </Provider>
    )
};