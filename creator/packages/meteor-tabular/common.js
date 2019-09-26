/* global Tabular:true, Mongo, _, Meteor, Template */

Tabular = {}; //exported

Tabular.tablesByName = {};

if (Meteor.isClient) {
  Template.registerHelper('TabularTables', Tabular.tablesByName);
}

Tabular.Table = function (options) {
  var self = this;

  if (!options) {
    throw new Error('Tabular.Table options argument is required');
  }

  if (!options.name) {
    throw new Error('Tabular.Table options must specify name');
  }
  self.name = options.name;

  if (!(options.collection instanceof Mongo.Collection)) {
    throw new Error('Tabular.Table options must specify collection');
  }
  self.collection = options.collection;

  self.pub = options.pub || 'tabular_genericPub';

  // By default we use core `Meteor.subscribe`, but you can pass
  // a subscription manager like `sub: new SubsManager({cacheLimit: 20, expireIn: 3})`
  self.sub = options.sub || Meteor;

  self.onUnload = options.onUnload;
  self.allow = options.allow;
  self.allowFields = options.allowFields;
  self.changeSelector = options.changeSelector;
  self.throttleRefresh = options.throttleRefresh;
  self.filteredRecordIds = options.filteredRecordIds;

  if (_.isArray(options.extraFields)) {
    var fields = {};
    _.each(options.extraFields, function (fieldName) {
      fields[fieldName] = 1;
    });
    self.extraFields = fields;
  }

  self.selector = options.selector;

  if (!options.columns) {
    throw new Error('Tabular.Table options must specify columns');
  }

  self.options = _.omit(options, 'collection', 'pub', 'sub', 'onUnload', 'allow', 'allowFields', 'extraFields', 'name', 'selector');

  Tabular.tablesByName[self.name] = self;
};
