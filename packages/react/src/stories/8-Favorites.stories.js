import React from 'react';
import styled from 'styled-components'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import Bootstrap from '../components/bootstrap'
import { Favorites } from '../components';

export default {
    title: 'Favorites',
};
const Container = styled.div`
  float: right;
  margin: 2rem;
  margin-right: 200px;
  clear: both;
`;

export const MyFavorites = () => (
    <Provider store={store}>
        <Bootstrap>
            <Container>
                <Favorites id="header-favorites-popover-id"/>
            </Container>
        </Bootstrap>
    </Provider>
);