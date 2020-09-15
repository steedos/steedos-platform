import React from 'react';
import styled from 'styled-components'
import { Provider } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { Lookup } from '../components';

export default {
    title: 'Lookup',
};

const id = 'testLookup';
const objectName = 'categories';
const selectionLabel = 'name';
const columns = [{
    field: 'name',
    label: '分类'
  }]

const onSelect = (event, data)=>{
    console.log('onSelect', event, data);
}

const action = (name)=>{
    if(name === 'onSelect'){
        return onSelect;
    }
}

export const MyLookup = () => (
    <Provider store={store}>
        <Bootstrap>
            <Lookup optionsHiddenSelected={true} multiple={true} id={id} variant="inline-listbox" objectName={objectName} selectionLabel={selectionLabel} columns={columns} action={action}></Lookup>
            {/* <Lookup id={`a${id}`} objectName={objectName} selectionLabel={selectionLabel} columns={columns} isOpen={true}></Lookup> */}
        </Bootstrap>
    </Provider>
);