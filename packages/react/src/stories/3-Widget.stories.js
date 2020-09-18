import React from 'react';
import Bootstrap from '../components/bootstrap';
import { Provider  } from 'react-redux';
import store from '../stores/configureStore';
import WidgetApps from '../components/widget_apps';
import WidgetObject from '../components/widget_object';

export default {
  title: 'Widgets',
};

export const widgetApps = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetApps />
      <WidgetApps showAllItems={true} label="showAllItems模式的应用程序启动器" />
      <WidgetApps ignoreApps={['admin']} label="忽略部分应用" />
      <WidgetApps label="onTileClick" onTileClick={(event, app, tile, index)=>{
        if(index < 3){
          event.preventDefault();
        }
        alert(`触发了onTileClick事件，点击的APP是:${app.name}，且前3个应用preventDefault了，不会跳转`);
      }}/>
      <WidgetApps mobile={true} label="Mobile模式的应用程序启动器" />
    </Bootstrap>
  </Provider>
);

export const widgetPendingTasks = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetObject label="待办任务" objectName="tasks" filters={() => {
        return [
          ['assignees', '=', '{userId}'],
          ['state', '<>', 'complete'],
          ['due_date', 'between', 'this_year']
        ]}}
        columns={[{
            label: "名称",
            field: 'name',
            href: true
          }, {
            label: "状态",
            field: 'state'
          }, {
            label: "分派给",
            field: 'assignees'
          }
        ]} 
        noHeader
        unborderedRow
        rowIcon={{
          category: "standard",
          name: "account",
          size: "small"
        }}
      />
    </Bootstrap>
  </Provider>
);

export const widgetInstances = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetObject label="待审批" objectName="instances" filters={[
          ['space', '=', '{spaceId}'],
          [
            ['inbox_users', '=', '{userId}'], 'or', ['cc_users', '=', '{userId}']
          ]
        ]}
        columns={[{
            label: "名称",
            field: "name",
            href: true
          }, {
            label: "提交人",
            field: "submitter_name",
            width: "10rem"
          }, {
            label: "修改时间",
            field: "modified",
            type: 'datetime',
            width: "14rem"
          }
        ]}
        hrefTarget="_blank"
      />
    </Bootstrap>
  </Provider>
);

export const widgetObjectEmpty = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetObject label="日程" objectName="events" filters={()=>{
          return [
            ['created', '>=', '{now}']
          ]
        }}
        columns={[{
          label: "名称",
          field: 'name',
          href: true
        }]}
        illustration={{
          path: "/assets/images/illustrations/empty-state-no-results.svg#no-results",
          heading: "没有找到日历事件"
        }}
        showAllLink={true}
      />
    </Bootstrap>
  </Provider>
);


export const widgetObjectMaxRows10 = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetObject label="待审批（top 10）" objectName="instances" filters={[
          ['space', '=', '{spaceId}'],
          [
            ['inbox_users', '=', '{userId}'], 'or', ['cc_users', '=', '{userId}']
          ]
        ]}
        columns={[{
            label: "名称",
            field: "name",
            href: true
          }, {
            label: "提交人",
            field: "submitter_name",
            width: "10rem"
          }, {
            label: "修改时间",
            field: "modified",
            type: 'datetime',
            width: "14rem"
          }
        ]}
        hrefTarget="_blank"
        maxRows={10}
      />
    </Bootstrap>
  </Provider>
);

export const widgetObjectMaxRowsAll = () => (
  <Provider store={store}>
    <Bootstrap>
      <WidgetObject label="待审批(all)" objectName="instances" filters={[
          ['space', '=', '{spaceId}'],
          [
            ['inbox_users', '=', '{userId}'], 'or', ['cc_users', '=', '{userId}']
          ]
        ]}
        columns={[{
            label: "名称",
            field: "name",
            href: true
          }, {
            label: "提交人",
            field: "submitter_name",
            width: "10rem"
          }, {
            label: "修改时间",
            field: "modified",
            type: 'datetime',
            width: "14rem"
          }
        ]}
        hrefTarget="_blank"
        maxRows={"all"}
      />
    </Bootstrap>
  </Provider>
);