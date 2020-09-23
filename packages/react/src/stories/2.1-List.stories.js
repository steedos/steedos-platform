import React from 'react';
import Bootstrap from '../components/bootstrap'
import { Provider  } from 'react-redux';
import store from '../stores/configureStore'
import { Icon, Button } from '@steedos/design-system-react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { createGridAction } from '../actions'
import List from '../components/list'

export default {
  title: 'List',
};


export const base = () => (
      <Provider store={store}>
        <Bootstrap>
          <List objectName={'instances'} 
            columns={[
              {
                field: 'name',
                label: '名称'
              },
              {
                field: 'applicant_name',
                label: '申请人',
                type: 'text'
              },
              {
                field: 'flow_name',
                label: '流程名称',
                type: 'text'
              },
              {
                field: 'modified',
                label: '修改时间',
                type: 'datetime'
              },
            ]} 
            sort="name, modified desc"
            pageSize={5}>
          </List>
        </Bootstrap>
      </Provider>
)

export const ManyColumnsList = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'instances'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'applicant_name',
            label: '申请人',
            type: 'text'
          },
          {
            field: 'flow_name',
            label: '流程名称',
            type: 'text'
          },
          {
            field: 'applicant_organization_name',
            label: '组织名称',
            type: 'text'
          },
          {
            field: 'current_step_name',
            label: '当前步骤',
            type: 'text'
          },
          {
            field: 'modified',
            label: '修改时间',
            type: 'datetime'
          },
        ]} 
        sort="name, modified desc"
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const ManyColumnsWithWideFieldList = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'instances'} 
        columns={[
          {
            field: 'name',
            label: '名称',
            is_wide: true
          },
          {
            field: 'flow_name',
            label: '流程名称',
            type: 'text'
          },
          {
            field: 'applicant_organization_name',
            label: '组织名称',
            type: 'text'
          },
          {
            field: 'current_step_name',
            label: '当前步骤',
            type: 'text'
          },
          {
            field: 'modified',
            label: '修改时间',
            type: 'datetime'
          },
        ]} 
        sort="name, modified desc"
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const rowIcon = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'email',
            label: '邮件',
            type: 'text'
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
        ]} 
        sort="name, modified desc"
        rowIcon={{
          category:"standard",
          name:"account"
        }}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const DotFieldNameColumns = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'cfs_files_filerecord'} 
        columns={[
          {
            field: 'original.name',
            type: 'text',
            label: '名称'
          },
          {
            field: 'metadata.owner_name',
            label: '上传者',
            type: 'text'
          },
          {
            field: 'uploadedAt',
            label: '上传时间',
            type: 'datetime'
          },
          {
            field: 'original.size',
            label: '文件大小',
            type: 'filesize'
          },
        ]} 
        sort="uploadedAt"
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

const CustomListItemExample = (props) => (
	<div>
		<Icon
			category="action"
			name={props.item.content.status === 'Contacted' ? 'check' : 'call'}
			size="x-small"
		/>
		<span className="slds-text-heading_small slds-m-left_medium">
			{props.item.content.name}
		</span>
	</div>
);

CustomListItemExample.propsTypes = {
	item: PropTypes.shape({
		content: PropTypes.object
	}),
};

CustomListItemExample.displayName = 'CustomListItemExample';

export const CustomListItem = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'tasks'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          }
        ]} 
        sort="name"
        listItem={CustomListItemExample}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const CustomListItemHref = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'email',
            label: '邮件',
            type: 'text'
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
        ]} 
        sort="name"
        listItemHref={(item) => {
          return `xxx/app/-/tasks/view/${item.content._id}`;
        }}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const MoreLink = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'email',
            label: '邮件',
            type: 'text'
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
        ]} 
        sort="name"
        showMoreLink={true}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const CustomMorLinkHref = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          },
          {
            field: 'email',
            label: '邮件',
            type: 'text'
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
        ]} 
        sort="name"
        showMoreLink={true}
        moreLinkHref={(props) => {
          return `xxx/app/-/${props.objectName}`;
        }}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

const ListContainer = styled.div`
  height: 100%;
  .pullable-container{
    background-color: #efeff4;
    .pullable-body{
      background-color: #fff;
    }
	}
`

export const InfiniteScrollList = () => (
  <Provider store={store}>
    <Bootstrap>
      <ListContainer>
        <List objectName={'space_users'} 
          columns={[
            {
              field: 'name',
              label: '名称'
            },
            {
              field: 'email',
              label: '邮件',
              type: 'text'
            },
            {
              field: 'username',
              label: '用户名',
              type: 'text'
            },
            {
              field: 'modified',
              label: '修改时间',
              type: 'datetime'
            },
          ]} 
          sort="name"
          pager={true}
          pageSize={5}>
        </List>
      </ListContainer>
    </Bootstrap>
  </Provider>
)

const onFiltering = (options)=>{
  store.dispatch(createGridAction('filteringText', "以下为过滤后结果", {id: "testListWithFilteringBar"}));
  let filters = ["email", "contains", "a"];
  let ownProps = getListProps(options);
  let newOptions = {};
  if(ownProps.pager || ownProps.showMoreLink){
    newOptions.count = true;
  }
  store.dispatch(createGridAction('filters', filters, Object.assign({}, ownProps, newOptions)));
}
const onResetFiltering = (options)=>{
  console.log("cumtom resetFiltering function running");
  let ownProps = getListProps(options);
  let newOptions = {};
  if(ownProps.pager || ownProps.showMoreLink){
    newOptions.count = true;
  }
  store.dispatch(createGridAction('filters', null, Object.assign({}, ownProps, newOptions)));
}

const getListProps = (options)=>{
  return ({
    id: "testListWithFilteringBar",
    objectName: 'space_users',
    columns:[
      {
        field: 'name',
        label: '名称'
      },
      {
        field: 'email',
        label: '邮件',
        type: 'text'
      },
      {
        field: 'username',
        label: '用户名',
        type: 'text'
      },
      {
        field: 'modified',
        label: '修改时间',
        type: 'datetime'
      },
    ],
    sort: "name",
    resetFiltering: ()=>{
      onResetFiltering(options)
    },
    pageSize: 25,
    ...options
  });
};

const ListContainerWithFilteringBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 3rem;
  bottom: 0;
  border: solid 1px #ddd;
  .pullable-container{
    background-color: #efeff4;
    .pullable-body{
      background-color: #fff;
    }
	}
`

export const ListWithFilteringBar = () => (
  <Provider store={store}>
    <Bootstrap>
      <Button className="btn-filtering"
        onClick={()=>{
          onFiltering();
        }}
      >设置过滤条件</Button>
      <ListContainerWithFilteringBar>
        <List {...getListProps()}>
        </List>
      </ListContainerWithFilteringBar>
    </Bootstrap>
  </Provider>
)

export const InfiniteScrollListWithFilteringBar = () => (
  <Provider store={store}>
    <Bootstrap>
      <Button className="btn-filtering"
        onClick={()=>{
          onFiltering({pager: true});
        }}
      >设置过滤条件</Button>
      <ListContainerWithFilteringBar>
        <List {...getListProps({pager: true})}>
        </List>
      </ListContainerWithFilteringBar>
    </Bootstrap>
  </Provider>
)

export const showIllustration = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          }
        ]} 
        filters={[['space', '=', 'xyz']]}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)

export const notShowIllustration = () => (
  <Provider store={store}>
    <Bootstrap>
      <List objectName={'space_users'} 
        columns={[
          {
            field: 'name',
            label: '名称'
          }
        ]} 
        filters={[['space', '=', 'xyz']]}
        showIllustration={false}
        pageSize={5}>
      </List>
    </Bootstrap>
  </Provider>
)
