import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './stores/configureStore'
import SelectUsers from './components/select_users'
import { FlowsModal } from './components'
import DXGrid from './components/dx_grid'
import Grid from './components/grid'
import { IconSettings,Illustration } from '@steedos/design-system-react';
import { dataServicesSelector } from './selectors';
import Bootstrap from './components/bootstrap'

function App() {

  let getRowId = (row) => row._id

  let rootNodes = ["593b97230cda012fa65270f9", "xZXy9x8o6qykf2ZAf"] // , "51aefb658e296a29c9000049"

  let selectionLabel = (item) => {
    return `${item.name}(${item.email})`
  }

  let service = dataServicesSelector(store.getState());
  let iconPath = `/assets/icons`;

  // let company = {
  //   name: 'company',
  //   label: '分部',
  //   fields: {
  //     name: {
  //       label: '公司名称',
  //       cellOnClick: function(){
  //         console.log(111);
  //       }
  //     },
  //     code: {
  //       label: '公司名称'
  //     },
  //     modified_by: {
  //       label: '修改人',
  //       type: 'lookup',
  //       reference_to: 'users',
  //     },
  //     modified: {
  //       label: '修改时间',
  //       type: 'datetime'
  //     }
  //   }
  // }

  let gridObjectName = 'company'
  let gridColumns = [
    {
      field: 'name',
      label: '公司名称',
      hidden: false,
      onClick: function () {
        console.log(111);
      },
      renderCell: function () { }
    },
    {
      field: 'code',
      label: '公司名称',

    },
    {
      field: 'modified_by',
      label: '修改人',
      type: 'lookup'
    },
    {
      field: 'modified',
      label: '修改时间',
      type: 'datetime'
    },
  ]

  let gridColumns2 = [
    {
      field: 'name',
      label: '公司名称'
    },
    {
      field: 'code',
      label: '公司名称',

    },
    {
      field: 'modified_by',
      label: '修改人',
      type: 'lookup'
    },
    {
      field: 'modified',
      label: '修改时间',
      type: 'datetime'
    },
  ]

  return (

    < div className="App">
      <IconSettings iconPath={iconPath} >
        <Provider store={store}>
          <Bootstrap></Bootstrap>
          <FlowsModal></FlowsModal>
            {/* <SelectUsers getRowId={getRowId} searchMode="omitFilters" rootNodes2={rootNodes} multiple={true} valueField2="user" selectionLabel2={selectionLabel} /> */}
            {/* <Grid objectName={gridObjectName} columns={gridColumns} selectRows='checkbox' enableSearch={true}></Grid>
            <div style={{ height: 100 }}></div>
            <Grid objectName={gridObjectName} columns={gridColumns2} selectRows='checkbox' enableSearch={true}></Grid> */}
        </Provider>
      </IconSettings>
    </div>
  );
}

export default App;