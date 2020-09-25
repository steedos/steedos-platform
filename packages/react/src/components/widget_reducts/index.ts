import WidgetObject from '../widget_object';
import WidgetConnect from './widget_connect';
// import { getBetweenTimeBuiltinValueItem } from "@steedos/filters";
import { getWidgetReductsConfig } from '../../utils';
import { ComponentClass } from 'react';

let config: any = getWidgetReductsConfig();

const dealColumnsLabelAssistiveText = (assistiveText: any, columns: Array<any>) => {
  let assistiveTextColumns = assistiveText.columns;
  if (!assistiveTextColumns) {
    return;
  }
  columns.forEach((column) => {
    let field = column.field;
    let assistiveColumnLabelText = assistiveTextColumns[field];
    if (assistiveColumnLabelText) {
      column.label = assistiveColumnLabelText;
    }
  });
};

export const WidgetInstancesPendings: ComponentClass = WidgetConnect((props: any) => {
  let adapted: any = {};
  if (props.position === "RIGHT") {
    adapted.columns = [{
      "label": "名称",
      "field": "name",
      "href": true
    }];
    adapted.noHeader = true;
  }
  let adaptedConfig = Object.assign({}, config.instances_pendings, adapted);
  let assistiveText = props.assistiveText;
  if (assistiveText) {
    if (assistiveText.label) {
      adaptedConfig.label = assistiveText.label;
    }
    dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
    if (assistiveText.illustrationMessageBody) {
      if (!adaptedConfig.illustration) {
        adaptedConfig.illustration = { messageBody: "" }
      }
      adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
    }
  }
  return Object.assign({}, adaptedConfig, props);
})(WidgetObject);

WidgetInstancesPendings.displayName = "WidgetInstancesPendings";

export const WidgetAnnouncementsWeek: ComponentClass = WidgetConnect((props: any) => {
  let adapted: any = {};
  if (props.position === "RIGHT") {
    adapted.columns = [{
      "field": "name",
      "label": "标题",
      "href": true
    }];
    adapted.noHeader = true;
  }
  let adaptedConfig = Object.assign({}, config.announcements_week, adapted);
  let assistiveText = props.assistiveText;
  if (assistiveText) {
    if (assistiveText.label) {
      adaptedConfig.label = assistiveText.label;
    }
    dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
    if (assistiveText.illustrationMessageBody) {
      if (!adaptedConfig.illustration) {
        adaptedConfig.illustration = { messageBody: "" }
      }
      adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
    }
  }
  return Object.assign({}, adaptedConfig, props);
})(WidgetObject);

WidgetAnnouncementsWeek.displayName = "WidgetAnnouncementsWeek";

export const WidgetTasksToday: ComponentClass = WidgetConnect((props: any) => {
  let adapted: any = {};
  if (props.position !== "RIGHT") {
    adapted.columns = [{
      "field": "name",
      "label": "主题",
      "href": true
    }, {
      "field": "due_date",
      "label": "到期日期",
      "width": "10rem",
      "type": "date"
    }];
    adapted.noHeader = false;
  }
  let adaptedConfig = Object.assign({}, config.tasks_today, adapted);
  let assistiveText = props.assistiveText;
  if (assistiveText) {
    if (assistiveText.label) {
      adaptedConfig.label = assistiveText.label;
    }
    dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
    if (assistiveText.illustrationMessageBody) {
      if (!adaptedConfig.illustration) {
        adaptedConfig.illustration = { messageBody: "" }
      }
      adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
    }
  }
  return Object.assign({}, adaptedConfig, props);
})(WidgetObject);

WidgetTasksToday.displayName = "WidgetTasksToday";

export const WidgetEventsToday: ComponentClass = WidgetConnect((props: any) => {
  let adapted: any = {};
  if (props.position !== "RIGHT") {
    adapted.columns = [{
      field: "name",
      label: "主题",
      href: true
    }, {
      "field": "start",
      "label": "开始时间",
      "width": "10rem",
      "type": "datetime"
    }];
    adapted.noHeader = false;
  }
  let adaptedConfig = Object.assign({}, config.events_today, adapted);
  let assistiveText = props.assistiveText;
  if (assistiveText) {
    if (assistiveText.label) {
      adaptedConfig.label = assistiveText.label;
    }
    dealColumnsLabelAssistiveText(assistiveText, adaptedConfig.columns);
    if (assistiveText.illustrationMessageBody) {
      if (!adaptedConfig.illustration) {
        adaptedConfig.illustration = { messageBody: "" }
      }
      adaptedConfig.illustration.messageBody = assistiveText.illustrationMessageBody;
    }
  }
  return Object.assign({}, adaptedConfig, props);
})(WidgetObject);

WidgetEventsToday.displayName = "WidgetEventsToday";

