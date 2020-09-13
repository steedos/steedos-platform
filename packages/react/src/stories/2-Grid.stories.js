import React from 'react';
import Bootstrap from '../components/bootstrap'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore'

import Grid from '../components/grid'

export default {
  title: 'Grid',
};


export const company = () => (
      <Provider store={store}>
        <Bootstrap>
          <Grid objectName={'company'} 
            columns={[
              {
                field: 'name',
                label: '公司名称'
              },
              {
                field: 'modified_by',
                label: '修改人',
                type: 'lookup',
                width: "14rem"
              },
              {
                field: 'modified',
                label: '修改时间',
                type: 'datetime',
                width: "14rem"
              },
            ]} 
            unborderedRow={true}
            noHeader={true}
            sort="name, modified desc"
            rowIcon={{
              category:"standard",
              name:"account",
              size:"small"
            }}
            enableSearch={true}>
          </Grid>
        </Bootstrap>
      </Provider>
)


export const space_users = () => (
    <Provider store={store}>
      <Bootstrap>
          <Grid objectName={'space_users'} 
            columns={[
              {
                field: 'name',
                label: '姓名',
              },
              {
                field: 'username',
                label: '用户名'
              },
              {
                field: 'organization',
                label: '主部门',
                type: 'lookup',
                reference_to: "organizations",
                enableFilter: false
              },
              {
                field: 'organizations_parents',
                label: '所属部门(含上级)',
                type: 'lookup',
                hidden: true,
                reference_to: "organizations",
                enableFilter: false
              },
            ]} 
            enableSearch={true}></Grid>
      </Bootstrap>
    </Provider>
)

export const cms_files = () => (
  <Provider store={store}>
    <Bootstrap>
      <Grid objectName={'cms_files'}
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'size',
            label: '文件大小',
            type: 'filesize',
            width: '10rem'
          },
          {
            field: 'owner',
            label: '所有者',
            type: 'lookup',
            width: '10rem'
          },
          {
            field: 'created',
            label: '创建时间',
            type: 'datetime',
            width: '10rem'
          },
        ]}
        filters={[['space', '=', '{spaceId}']]}
        pageSize={10}
        sort={[["created", "desc"], ["name"]]}
        enableSearch={true}></Grid>
    </Bootstrap>
  </Provider>
)

export const pager = () => (
  <Provider store={store}>
    <Bootstrap>
        <Grid objectName={'space_users'} 
          columns={[
            {
              field: 'name',
              label: '姓名',
            },
            {
              field: 'username',
              label: '用户名'
            },
            {
              field: 'organization',
              label: '主部门',
              type: 'lookup',
              reference_to: "organizations",
              enableFilter: false
            },
            {
              field: 'organizations_parents',
              label: '所属部门(含上级)',
              type: 'lookup',
              hidden: true,
              reference_to: "organizations",
              enableFilter: false
            },
          ]} 
          pageSize = {5}
          pager={true}
          enableSearch={true}></Grid>
    </Bootstrap>
  </Provider>
)