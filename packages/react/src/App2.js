import React from 'react';
import './App.css';
import { Provider  } from 'react-redux';
import store from './stores/configureStore'
import Dashboard from './components/dashboard'
import Bootstrap from './components/bootstrap'
import { IconSettings, Card, DataTable, DataTableColumn } from '@steedos/design-system-react';
import WidgetApps from './components/widget_apps';


const sampleItems = [
  { id: '1', name: 'Cloudhub' },
  { id: '2', name: 'Cloudhub + Anypoint Connectors' },
  { id: '3', name: 'Cloud City' },
];

const config = {
  workflow: {
    label: "待审批",
    position: "CENTER_TOP",
    type: "object",
    objectName: "instances",
    filters: [
      ['space', '=', '{spaceId}'],
      [
        ['inbox_users', '=', '{userId}'], 'or', ['cc_users', '=', '{userId}']
      ]
    ],
    columns: [{
      label: "名称",
      field: "name",
      href: true
    }, {
      label: "修改时间",
      field: "modified",
      type: 'datetime'
    }]
  },
  pending_tasks: {
    label: '待办任务',
    position: 'CENTER_TOP',
    type: 'object',
    objectName: 'tasks',
    filters: [
      ['assignees', '=', '{userId}'],
      ['state', '<>', 'complete'],
      ['due_date', 'between', 'this_year']
    ],
    columns: [{
      label: "名称",
      field: 'name',
      href: true
    }, {
      label: "优先级",
      field: 'priority'
    }]
  },
  apps: {
    label: "应用程序启动器",
    position: "CENTER_TOP",
    type: "apps",
  },
  testReact: {
    label: "Test React Component",
    position: "CENTER_TOP",
    type: "react",
    component: function (options){
      // return <div>ssss</div>
      const AppLauncherExpandableSection = require('@steedos/design-system-react').AppLauncherExpandableSection;
      return (
        <AppLauncherExpandableSection title={options.label}>
        </AppLauncherExpandableSection>
      );
    }
  },
  testReact2: {
    label: "Test React Component2",
    position: "CENTER_TOP",
    type: "react",
    component: function (options) {
      class ShoppingList extends React.Component {
        render() {
          return (
            <div className="shopping-list">
              <h1>Shopping List for {this.props.name}</h1>
              <ul>
                <li>Instagram</li>
                <li>WhatsApp</li>
                <li>Oculus</li>
              </ul>
            </div>
          );
        }
      }
      return <ShoppingList name={options.label} />;
    }
  },
  testReact3: {
    label: "右侧Card",
    position: "RIGHT",
    type: "react",
    component: function (options) {
      const styled = require('styled-components').default;
      let CustomStyledComponent = styled.div`
        color: green;
        .slds-card{
          background: #eee;
        }
      `;
      return (
        <CustomStyledComponent className="styled-component">
          <Card
            heading={options.label}
          >
            <DataTable items={sampleItems}>
              <DataTableColumn
                label="Opportunity Name"
                property="name"
                truncate
              />
            </DataTable>
          </Card>
        </CustomStyledComponent>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <IconSettings iconPath="/assets/icons" >
        <Provider store={store}>
          <Bootstrap>
            <Dashboard
              config={config}
              centerTopSection={(
                <div>
                  <Card
                    id="ExampleCard"
                    heading="今日事件"
                  >
                    <DataTable items={sampleItems} id="DataTableExample-1">
                      <DataTableColumn
                        label="Opportunity Name"
                        property="name"
                        truncate
                      />
                    </DataTable>
                  </Card>
                  <WidgetApps />
                </div>
              )}
              centerBottomLeftSection={(
                <Card
                  id="ExampleCard"
                  heading="左下1"
                >
                  <DataTable items={sampleItems} id="DataTableExample-1">
                    <DataTableColumn
                      label="Opportunity Name"
                      property="name"
                      truncate
                    />
                  </DataTable>
                </Card>
              )}
              centerBottomRightSection={(
                <Card
                  id="ExampleCard"
                  heading="左下2"
                >
                  <DataTable items={sampleItems} id="DataTableExample-1">
                    <DataTableColumn
                      label="Opportunity Name"
                      property="name"
                      truncate
                    />
                  </DataTable>
                </Card>
              )}
              rightSection={(
                <Card
                  id="ExampleCard"
                  heading="右侧Card"
                >
                  <DataTable items={sampleItems} id="DataTableExample-1">
                    <DataTableColumn
                      label="Opportunity Name"
                      property="name"
                      truncate
                    />
                  </DataTable>
                </Card>
              )}
            />
          </Bootstrap>
        </Provider>
      </IconSettings>
    </div>
  );
}

export default App;