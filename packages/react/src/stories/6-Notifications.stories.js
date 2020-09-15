import React from 'react';
import styled from 'styled-components';
import Bootstrap from '../components/bootstrap';
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import Notifications from '../components/notifications';

export default {
  title: 'Notifications',
};

const Container = styled.div`
  float: right;
  margin: 1.2rem;
  clear: both;
  @media (max-width: 767px) {
      .slds-popover__body{
        /* stories 案例在手机上高度不够，不方便调式 */
        max-height: 320px;
      }
  }
`;

export const once = () => (
  <Provider store={store}>
    <Bootstrap>
      <Container>
        <Notifications loadDataAfterRender={true}/>
      </Container>
    </Bootstrap>
  </Provider>
);


export const interval = () => (
  <Provider store={store}>
    <Bootstrap>
      <Container>
        <Notifications interval={5} />
      </Container>
    </Bootstrap>
  </Provider>
);
