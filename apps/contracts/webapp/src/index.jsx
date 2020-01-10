import React from 'react';
import { Provider } from 'react-redux';
import { Bootstrap, Dashboard, entityStateSelector, store } from '@steedos/react';

let config = {
    "apps": {
        "label": "应用程序启动器",
        "position": "RIGHT",
        "type": "apps",
        "mobile": true,
        "ignoreApps": ["contracts"]
    },
    "workflow": {
        "label": "待审核文件",
        "position": "CENTER_TOP",
        "type": "object",
        "objectName": "instances",
        "filters": [
            ["space", "=", "{spaceId}"],
            [
                ["inbox_users", "=", "{userId}"], "or", ["cc_users", "=", "{userId}"]
            ]
        ],
        "columns": [{
            "label": "名称",
            "field": "name",
            "href": true
        }, {
            "label": "提交人",
            "field": "submitter_name",
            "width": "10rem"
        }, {
            "label": "修改时间",
            "field": "modified",
            "type": "datetime",
            "width": "10rem"
        }],
        "noHeader": false,
        "unborderedRow": true,
        "showAllLink": true,
        "illustration": {
            "messageBody": "您没有待审核文件",
            "path": "/assets/images/illustrations/empty-state-no-results.svg#no-results"
        },
        rowIcon: {
            category: "standard",
            name: "task",
            size: "small"
        }
    },
    "tasks": {
        "label": "待办任务",
        "position": "CENTER_BOTTOM_LEFT",
        "type": "object",
        "objectName": "tasks",
        "filters": [
            ["assignees", "=", "{userId}"],
            ["state", "<>", "complete"],
            ['created', 'between', 'last_7_days']
        ],
        "sort": "due_date",
        "columns": [{
            "field": "name",
            "label": "主题",
            "href": true
        }, {
            "field": "due_date",
            "label": "截止时间",
            "width": "10rem",
            "type": "datetime"
        }],
        "unborderedRow": true,
        "showAllLink": true,
        "illustration": {
            "messageBody": "您最近7天没有待办任务"
        }
    },
    "calendar": {
        label: "日程",
        position: "CENTER_BOTTOM_RIGHT",
        type: "object",
        objectName: "events",
        filters: function(){
            let utcOffset = entityStateSelector(store.getState(), "user").utcOffset;
            let start = new Date();
            start.setHours(utcOffset);
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);
            let end = new Date();
            end.setHours(23 + utcOffset);
            end.setMinutes(59);
            end.setSeconds(59);
            end.setMilliseconds(0);
            return [[
                ['owner', '=', '{userId}'], 
                'or', 
                ['assignees', '=', '{userId}']
            ], [
                ['end', '>=', start], 
                ['start', '<=', end]
            ]]
        },
        sort: "start desc, end",
        columns: [{
            field: "name",
            label: "主题",
            href: true
        }, {
            "field": "start",
            "label": "开始时间",
            "width": "10rem",
            "type": "datetime"
        }, {
            "field": "end",
            "label": "结束时间",
            "width": "10rem",
            "type": "datetime"
        }],
        unborderedRow: true,
        showAllLink: true,
        illustration:{
            messageBody: "您今天没有日程"
        }
    }
};

const Home = () => (
    <Provider store={store}>
        <Bootstrap>
            <Dashboard config={config} />
        </Bootstrap>
    </Provider>
)
class ContractsAppPlugin {
    initialize(registry, store) {
        registry.registerObjectHomeComponent(
            'contracts_home',
            Home
        );
    }
}

window.registerPlugin('com.steedos.contracts-app', new ContractsAppPlugin());