import React from 'react';
import Bootstrap from '../components/bootstrap'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore'

import SelectUsers from  '../components/select_users'

export default {
  title: 'SelectUsers',
};

export const select_users = () => (
  <Provider store={store}>
    <Bootstrap>
      <SelectUsers searchMode="omitFilters" multiple={true} gridId="selectUsers"/>
    </Bootstrap>
  </Provider>
)