"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleSearchCategories = exports.sampleReportCategories = void 0;
var sampleReportCategories = [{
  id: 'reports',
  label: 'Reports',
  items: [{
    id: 'recent_reports',
    label: 'Recent'
  }, {
    id: 'my_reports',
    label: 'Created by Me'
  }, {
    id: 'private_reports',
    label: 'Private Reports'
  }, {
    id: 'public_reports',
    label: 'Public Reports'
  }, {
    id: 'all_reports',
    label: 'All Reports'
  }]
}, {
  id: 'folders',
  label: 'Folders',
  items: [{
    id: 'my_folders',
    label: 'Created by Me',
    url: 'http://www.google.com'
  }, {
    id: 'shared_folders',
    label: 'Shared with Me'
  }, {
    id: 'all_folders',
    label: 'All Folders'
  }]
}];
exports.sampleReportCategories = sampleReportCategories;
var sampleSearchCategories = [{
  id: 'search_results',
  label: 'Search Results',
  items: [{
    id: 'top',
    label: 'Top Results'
  }, {
    id: 'accounts',
    label: 'Accounts'
  }, {
    id: 'contacts',
    label: 'Contacts'
  }, {
    id: 'opportunities',
    label: 'Opportunities'
  }, {
    id: 'leads',
    label: 'Leads'
  }, {
    id: 'groups',
    label: 'Groups'
  }, {
    id: 'files',
    label: 'Files'
  }, {
    id: 'dashboards',
    label: 'Dashboards'
  }, {
    id: 'reports',
    label: 'Reports'
  }, {
    id: 'feeds',
    label: 'Feeds'
  }]
}, {
  id: 'external_results',
  label: 'External Results',
  items: [{
    id: 'app_one',
    label: 'App One'
  }, {
    id: 'app_two',
    label: 'App Two'
  }, {
    id: 'app_three',
    label: 'App Three'
  }]
}];
exports.sampleSearchCategories = sampleSearchCategories;