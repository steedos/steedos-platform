import React from 'react';
import styled from 'styled-components'
import { action } from '@storybook/addon-actions';
import Dashboard from '../components/dashboard'
import Bootstrap from '../components/bootstrap'
import { Provider } from 'react-redux';
import store from '../stores/configureStore';
import { getRelativeUrl } from '../utils';
import clone from 'clone';

export default {
  title: 'Dashboard'
};

let CenterDiv = styled.div`
  text-align: center;
  height: 230px;
  background: #fff;
  border: solid 1px #eee;
`;

export const sections = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard
          centerTopSection={(
            <CenterDiv>
              Center Top Section
            </CenterDiv>
          )}
          centerBottomLeftSection={(
            <CenterDiv>
              Center Bottom Left Section
            </CenterDiv>
          )}
          centerBottomRightSection={(
            <CenterDiv>
              Center Bottom Right Section
            </CenterDiv>
          )}
          rightSection={(
            <CenterDiv>
              Right Section
            </CenterDiv>
          )}
        />
      </Bootstrap>
    </Provider>
  </div>
);

const config1 = {
  sectionCT1: {
    label: "Center Top Section 1",
    position: "CENTER_TOP",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCT2: {
    label: "Center Top Section 2",
    position: "CENTER_TOP",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCBL1: {
    label: "Bottom Left Section 1",
    position: "CENTER_BOTTOM_LEFT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCBL2: {
    label: "Bottom Left Section 2",
    position: "CENTER_BOTTOM_LEFT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCBL3: {
    label: "Bottom Left Section 3",
    position: "CENTER_BOTTOM_LEFT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCBR1: {
    label: "Bottom Right Section 1",
    position: "CENTER_BOTTOM_RIGHT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionCBR2: {
    label: "Bottom Right Section 2",
    position: "CENTER_BOTTOM_RIGHT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionR1: {
    label: "Right Section 1",
    position: "RIGHT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  },
  sectionR2: {
    label: "Right Section 2",
    position: "RIGHT",
    type: "react",
    component: function (options) {
      return <CenterDiv>{options.label}</CenterDiv>
    }
  }
}

export const configPosition = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config1} />
      </Bootstrap>
    </Provider>
  </div>
)

const config2 = {
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
      label: "提交人",
      field: "submitter_name",
      width: "16rem"
    }, {
      label: "修改时间",
      field: "modified",
      type: 'datetime',
      width: "14rem"
    }],
    showAllLink: true,
    hrefTarget: "_blank",
    unborderedRow: true,
    sort: "modified desc, name",
    rowIcon: {
      category: "standard",
      name: "account",
      size: "small"
    }
  },
  pending_tasks: {
    label: '待办任务1',
    position: 'CENTER_BOTTOM_LEFT',
    type: 'object',
    objectName: 'tasks',
    filters: () => {
      return [
        ['due_date', '<=', '{now}']
      ]
    },
    columns: [{
      label: "名称",
      field: 'name',
      href: true,
      format: (children, data, options) => {
        let objectName = options.objectName;
        let url = getRelativeUrl(`/app/-/${objectName}/view/${data.id}`);

        return (
          <a target="_blank" href={url} title={children}>
            {children}
          </a>
        )
      }
    }, {
      label: "状态",
      field: 'state',
      width: "10rem"
    }, {
      label: "截止时间",
      field: 'due_date',
      width: "10rem",
      type: "datetime"
    }],
    sort: [["due_date", "desc"], ["state"]],
    noHeader: true,
    footer: (options) => {
      let objectName = options.objectName;
      return (
        <a href={`/app/-/${objectName}`} target="_blank">
          查看全部任务
        </a>
      )
    }
  },
  bottomLeftTask: {
    label: '待办任务2',
    position: 'CENTER_BOTTOM_RIGHT',
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
    }],
    noHeader: true,
    unborderedRow: true
  },
  bottomLeftTask3: {
    label: '待办任务3',
    position: 'CENTER_BOTTOM_LEFT',
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
    }],
    noHeader: true,
    unborderedRow: true
  },
  bottomLeftTask4: {
    label: '待办任务 all',
    position: 'CENTER_BOTTOM_RIGHT',
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
    }],
    noHeader: true,
    unborderedRow: true,
    maxRows: "all"
  },
  bottomRightApps: {
    label: '应用',
    position: 'RIGHT',
    type: 'apps',
    mobile: true
  },
  bottomLeftTask5: {
    label: '待办任务5',
    position: 'RIGHT',
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
    }],
    noHeader: true,
    unborderedRow: true
  }
}

export const configTypeObject = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config2} />
      </Bootstrap>
    </Provider>
  </div>
)

const config3 = {
  apps: {
    label: "应用程序启动器(前3个应用preventDefault不会跳转)",
    position: "CENTER_TOP",
    type: "apps",
    showAllItems: false,
    onTileClick: (event, app, tile, index) => {
      if (index < 3) {
        event.preventDefault();
      }
      alert(`触发了onTileClick事件，点击的APP是:${app.name}，且前3个应用preventDefault了，不会跳转`);
    }
  },
  apps_mobile: {
    label: '应用列表(忽略了设置)',
    position: 'RIGHT',
    type: 'apps',
    mobile: true,
    ignoreApps: ['admin']
  },
  apps_mini: {
    label: 'Mini',
    position: 'CENTER_TOP',
    type: 'apps',
    mini: true,
    ignoreApps: ['admin']
  },
  apps_mini_right: {
    label: 'Mini',
    position: 'RIGHT',
    type: 'apps',
    mini: true,
    ignoreApps: ['admin']
  }
}

export const configTypeApps = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config3} />
      </Bootstrap>
    </Provider>
  </div>
)

const config4 = {
  testReact1: {
    label: "Test React Component Simple",
    position: "CENTER_TOP",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
        border: solid 1px #eee;
        border-radius: 4px;
        margin-bottom: 12px;
      `;
      return <CenterDiv2 className="testReact1">{options.label}</CenterDiv2>;
    }
  },
  testReact2: {
    label: "Test React Component require",
    position: "CENTER_TOP",
    type: "react",
    component: function (options) {
      const Card = require('@steedos/design-system-react').Card;
      const AppLauncherExpandableSection = require('@steedos/design-system-react').AppLauncherExpandableSection;
      const AppLauncherTile = require('@steedos/design-system-react').AppLauncherTile;
      const styled = require('styled-components').default;
      let AppLauncherDesktopInternal = styled.div`
          padding: 0px 1rem;
          .slds-section.slds-is-open{
              .slds-section__content{
                  padding-top: 0px;
              }
          }
      `;
      return (
        <Card
          heading={options.label}
        >
          <AppLauncherDesktopInternal className="slds-app-launcher__content">
            <AppLauncherExpandableSection title="Tile Section">
              <AppLauncherTile
                description="The primary internal Salesforce org. Used to run our online sales business and manage accounts."
                iconText="SC"
                title="Sales Cloud"
                href="/a"
              />
              <AppLauncherTile
                description="Salesforce Marketing Cloud lets businesses of any size engage with their customers through multiple channels of messaging."
                iconBackgroundColor="#e0cf76"
                iconText="MC"
                title="Marketing Cloud"
                href="/b"
              />
            </AppLauncherExpandableSection>
          </AppLauncherDesktopInternal>
        </Card>
      );
    }
  },
  testReact3: {
    label: "Test React Component Styled",
    position: "RIGHT",
    type: "react",
    component: function (options) {
      const Card = require('@steedos/design-system-react').Card;
      const DataTable = require('@steedos/design-system-react').DataTable;
      const DataTableColumn = require('@steedos/design-system-react').DataTableColumn;
      const styled = require('styled-components').default;
      let CustomStyledComponent = styled.div`
        color: green;
        .slds-card{
          background: #eee;
        }
      `;
      const sampleItems = [
        { id: '1', name: 'Cloudhub' },
        { id: '2', name: 'Cloudhub + Anypoint Connectors' },
        { id: '3', name: 'Cloud City' },
      ];
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
  },
  testReact4: {
    label: "Test React ComponentUrl",
    position: "CENTER_TOP",
    type: "react",
    component: "/dashboard_type_react_url.js"
  }
}

export const configTypeReact = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config4} />
      </Bootstrap>
    </Provider>
  </div>
)

const config4_1 = [{
  position: "CENTER_TOP",
  type: "tabs",
  panels: [{
    label: "横向tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "待审核",
    type: "instances_pendings",
    noHeader: true
  }, {
    label: "本周公告",
    type: "announcements_week",
    noHeader: true
  }]
}, {
  position: "CENTER_TOP",
  type: "tabs",
  vertical: true,
  panels: [{
    label: "纵向tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "待审核",
    type: "instances_pendings",
    noHeader: true
  }, {
    label: "本周公告",
    type: "announcements_week",
    noHeader: true
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}, {
  position: "CENTER_TOP",
  type: "tabs",
  variant: "scoped",
  panels: [{
    label: "横向scoped tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "待审核",
    type: "instances_pendings",
    noHeader: true
  }, {
    label: "本周公告",
    type: "announcements_week",
    noHeader: true
  }]
}, {
  position: "CENTER_TOP",
  type: "tabs",
  variant: "scoped",
  vertical: true,
  panels: [{
    label: "纵向scoped tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "待审核",
    type: "instances_pendings",
    noHeader: true
  }, {
    label: "本周公告",
    type: "announcements_week",
    noHeader: true
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}, {
  position: "RIGHT",
  type: "tabs",
  triggerByHover: true,
  panels: [{
    label: "横向tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}, {
  position: "RIGHT",
  type: "tabs",
  triggerByHover: true,
  vertical: true,
  panels: [{
    label: "纵向tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}, {
  position: "RIGHT",
  type: "tabs",
  triggerByHover: true,
  variant: "scoped",
  panels: [{
    label: "横向scoped tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}, {
  position: "RIGHT",
  type: "tabs",
  triggerByHover: true,
  variant: "scoped",
  vertical: true,
  panels: [{
    label: "纵向scoped tabs",
    type: "react",
    component: function (options) {
      let CenterDiv2 = styled.div`
        text-align: center;
        height: 230px;
        background: #fff;
      `;
      return <CenterDiv2 className="testReact1">Test Tabs Component Simple</CenterDiv2>;
    }
  }, {
    label: "今日任务",
    type: "tasks_today",
    noHeader: true
  }, {
    label: "今日日程",
    type: "events_today",
    noHeader: true
  }]
}]

export const configTypeTabs = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config4_1} />
      </Bootstrap>
    </Provider>
  </div>
)

const config5 = [{
  label: "Test Dashboard config some reduced widgets as an array",
  position: "CENTER_TOP",
  type: "react",
  component: function (options) {
    let CenterDiv2 = styled.div`
      text-align: center;
      height: 230px;
      margin-bottom: 1rem;
      position: relative;
      padding: 0;
      background: #fff;
      border: 1px solid #dddbda;
      border-radius: .25rem;
      background-clip: padding-box;
      -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
    `;
    return <CenterDiv2 className="testReact1">{options.label}</CenterDiv2>;
  }
}, {
  position: "CENTER_TOP",
  type: "instances_pendings"
}, {
  position: "CENTER_TOP",
  type: "apps"
}, {
  position: "CENTER_TOP",
  type: "announcements_week"
}, {
  position: "RIGHT",
  type: "tasks_today"
}, {
  position: "RIGHT",
  type: "events_today"
}]

export const widgetReducts = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config5} />
      </Bootstrap>
    </Provider>
  </div>
)

const config6 = [{
  label: "Test Dashboard config some reduced widgets as an array, and reverse left to right",
  position: "CENTER_TOP",
  type: "react",
  component: function (options) {
    let CenterDiv2 = styled.div`
      text-align: center;
      height: 230px;
      margin-bottom: 1rem;
      position: relative;
      padding: 0;
      background: #fff;
      border: 1px solid #dddbda;
      border-radius: .25rem;
      background-clip: padding-box;
      -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
    `;
    return <CenterDiv2 className="testReact1">{options.label}</CenterDiv2>;
  }
}, {
  label: "自定义HTML1",
  position: "CENTER_TOP",
  type: "html",
  html: '<style>a.test-html-link{color:red;}</style><a class="test-html-link">左侧带Label效果，自定义样式为红色链接</a>'
}, {
  position: "CENTER_TOP",
  type: "html",
  html: '<a>左侧不带Label效果</a>'
}, {
  label: "自定义HTML2",
  position: "RIGHT",
  type: "html",
  html: '<a>右侧带Label效果</a>'
}, {
  position: "RIGHT",
  type: "html",
  html: '<a>右侧不带Label效果</a>'
}, {
  position: "RIGHT",
  type: "instances_pendings"
}, {
  position: "RIGHT",
  type: "apps"
}, {
  position: "RIGHT",
  type: "announcements_week"
}, {
  position: "CENTER_BOTTOM_LEFT",
  type: "tasks_today"
}, {
  position: "CENTER_BOTTOM_RIGHT",
  type: "events_today"
}]

export const widgetReductsReverse = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config6} />
      </Bootstrap>
    </Provider>
  </div>
)

const assistiveText = {
  widgets: {
    apps: {
      label: "Apps"
    },
    object: {
      label: "Widget Object",
      allLinkLabel: "View All",
      illustrationMessageBody: "There are no items to display."
    },
    instances_pendings: {
      label: "Requests Inbox",
      columns: {
        name: "Name",
        submitter_name: "Submitter Name",
        modified: "Modified Date"
      },
      illustrationMessageBody: "You have no requests."
    },
    announcements_week: {
      label: "Announcements This Week",
      columns: {
        name: "Name",
        created: "Created Date"
      },
      illustrationMessageBody: "There were no new announcements this week."
    },
    tasks_today: {
      label: "Tasks Today",
      columns: {
        name: "Name",
        due_date: "Due Date"
      },
      illustrationMessageBody: "You don't have any tasks today."
    },
    events_today: {
      label: "Events today",
      columns: {
        name: "Name",
        start: "Start Date"
      },
      illustrationMessageBody: "You don't have any events today."
    }
  }
}

let config7 = clone(config5);

config7.push({
  position: "CENTER_TOP",
  type: "tabs",
  panels: [{
    type: "instances_pendings",
    noHeader: false
  }, {
    type: "announcements_week",
    noHeader: false
  }]
});

export const assistiveTextI18n = () => (
  <div className="App">
    <Provider store={store}>
      <Bootstrap>
        <Dashboard config={config7} assistiveText={assistiveText} />
      </Bootstrap>
    </Provider>
  </div>
)