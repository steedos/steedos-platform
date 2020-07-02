/* global Tabular, Mongo */

// We are creating a named client Collection that we will only modify from server
Tabular.tableRecords = new Mongo.Collection('tabular_records');

Tabular.getRecord = function(name) {
  return Tabular.tableRecords.findOne(name);
};
