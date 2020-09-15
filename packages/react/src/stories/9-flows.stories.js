import React from 'react';
import styled from 'styled-components'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { Flows } from '../components';

export default {
    title: 'Flows',
};

export const MyFlows = () => (
    <Provider store={store}>
        <Bootstrap>
        <Flows />
        </Bootstrap>
    </Provider>
);