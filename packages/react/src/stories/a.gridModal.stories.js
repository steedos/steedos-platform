import React from 'react';
import styled from 'styled-components'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { GridModal } from '../components';
import { createGridModalAction } from '../actions'
import _ from 'underscore'

export default {
    title: 'GridModal',
};

const modalId = 'gridModal';
const gridId = 'object_grid';
const objectName = 'flows';
let heading = 'Object Grid';
export const MyFlowsModal = () => {

    var toggleOpen = () => {
        gridProp.objectName = document.getElementById("objectName").value || objectName
        gridProp.id = `${gridProp.objectName}_grid`
        store.dispatch(createGridModalAction('isOpen', true, {id: modalId}))
    };

    var onConfirm = ()=>{
        let selection = store.getState().views.byId[gridId].selection;
        document.getElementById("objectRecordIds").value = _.pluck(selection, '_id')
    }

    var modalProp = {
        id: modalId,
        heading: heading,
        appElement: 'body',
        onConfirm: onConfirm
    }

    var gridProp = {
        id: gridId,
        objectName: objectName,
        enableSearch: true,
        selectRows: 'checkbox',
        columns: [{field: 'name', label: '名称'}],
        keep: true
    }

    return (
        <Provider store={store}>
            <Bootstrap>
                <input id="objectName" defaultValue={objectName}/><br/>
                <textarea id="objectRecordIds" style={{height: "150px", width: '100%'}}/><br/>
                <button onClick={toggleOpen}>显示ObjectModal</button>
                <GridModal {...modalProp} gridProp={gridProp}/>
            </Bootstrap>
        </Provider>
    )
};