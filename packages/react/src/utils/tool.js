import { getBetweenTimeBuiltinValueItem } from "@steedos/filters";
import moment from 'moment';

export const getObjectRecordUrl = (objectName, recordId) => {
    let url = `/app/-/${objectName}/view/${recordId}`;
    return getRelativeUrl(url);
}

export const getObjectUrl = (objectName) => {
    let url = `/app/-/${objectName}`;
    return getRelativeUrl(url);
}

export const getAbsoluteUrl = (url) => {
    if (window.Meteor && !/^http(s?):\/\//.test(url)) {
        return window.Steedos.absoluteUrl(url)
    }
    return url;
}

export const getRelativeUrl = (url) => {
    if (window.Meteor && !/^http(s?):\/\//.test(url)) {
        return window.Creator.getRelativeUrl(url)
    }
    return url;
}

export const isMobile = () => {
    if (window.Steedos && window.Steedos.isMobile()) {
        // Steedos.isMobile中写的是：$(window).width()<767
        return true
    } else {
        return window.outerWidth < 767
    }
}

export const getWidgetReductsConfig = () => {
    // 简化组件时默认的标准配置
    return {
        "instances_pendings": {
            "label": "待审核文件",
            "position": "CENTER_TOP",
            "type": "object",
            "objectName": "instances",
            "filters": [
                [
                    ["inbox_users", "=", "{userId}"], "or", ["cc_users", "=", "{userId}"]
                ]
            ],
            "sort": "modified desc",
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
            "showAllLink": false,
            "illustration": {
                "messageBody": "您没有待审核文件。"
            },
            rowIcon: {
                category: "standard",
                name: "task",
                size: "small"
            }
        },
        "announcements_week": {
            "label": "本周公告",
            "position": "CENTER_TOP",
            "type": "object",
            "objectName": "announcements",
            "filters": [
                [
                    ["owner", "=", "{userId}"],
                    'or',
                    ["members", "=", "{userId}"]
                ],
                ['created', 'between', 'last_7_days']
            ],
            "sort": "created desc",
            "columns": [{
                "field": "name",
                "label": "标题",
                "href": true
            }, {
                "field": "created",
                "label": "发布时间",
                "width": "10rem",
                "type": "datetime"
            }],
            "noHeader": false,
            "unborderedRow": true,
            "showAllLink": true,
            "illustration": {
                "messageBody": "本周没有新公告。"
            },
            rowIcon: {
                category: "standard",
                name: "announcement",
                size: "small"
            }
        },
        "tasks_today": {
            "label": "今日任务",
            "position": "RIGHT",
            "type": "object",
            "objectName": "tasks",
            "filters": [
                ["assignees", "=", "{userId}"],
                ["state", "<>", "complete"],
                ['due_date', 'between', 'last_30_days']
            ],
            "sort": "due_date",
            "columns": [{
                "field": "name",
                "label": "主题",
                "href": true
            }],
            "unborderedRow": true,
            "showAllLink": true,
            "illustration": {
                "messageBody": "您今天没有待办任务。"
            },
            "noHeader": true,
            rowIcon: {
                category: "standard",
                name: "timesheet_entry",
                size: "small"
            }
        },
        "events_today": {
            label: "今日日程",
            position: "RIGHT",
            type: "object",
            objectName: "events",
            filters: function () {
                let Creator = window.Creator;
                let utcOffset = Creator && Creator.USER_CONTEXT.user && Creator.USER_CONTEXT.user.utcOffset;
                if (!utcOffset && utcOffset !== 0) {
                    utcOffset = moment().utcOffset() / 60;
                }
                let today = getBetweenTimeBuiltinValueItem("today", utcOffset);
                let start = today.values[0];
                let end = today.values[1];
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
            }],
            unborderedRow: true,
            showAllLink: true,
            illustration: {
                messageBody: "您今天没有日程。"
            },
            "noHeader": true,
            rowIcon: {
                category: "standard",
                name: "event",
                size: "small"
            }
        }
    };
}