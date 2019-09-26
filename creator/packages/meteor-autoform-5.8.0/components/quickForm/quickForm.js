/* global AutoForm */

Template.quickForm.helpers({
  getTemplateName: function () {
    return AutoForm.getTemplateName('quickForm', this.template);
  },
  innerContext: function quickFormContext() {
    var atts = this;
    var adjustedData = AutoForm.parseData(_.clone(this));
    var simpleSchema = adjustedData._resolvedSchema;
    var sortedSchema = {};
    var fieldGroups = [];
    var grouplessFieldContext;

    // --------------- A. Schema --------------- //

    var fieldList = atts.fields;
    if (fieldList) {
      fieldList = AutoForm.Utility.stringToArray(fieldList, 'AutoForm: fields attribute must be an array or a string containing a comma-delimited list of fields');

      // get the schema object, but sorted into the same order as the field list
      fieldList.forEach(function (fieldName) {
        sortedSchema[fieldName] = simpleSchema.schema(fieldName);
      });
    } else {
      sortedSchema = simpleSchema.schema();
    }

    // --------------- B. Field With No Groups --------------- //

    var grouplessFields = getFieldsWithNoGroup(sortedSchema);
    if (grouplessFields.length > 0) {
      grouplessFieldContext = {
        atts: _.extend({}, atts, {fields: grouplessFields}),
        fields: grouplessFields
      };
    }

    // --------------- C. Field With Groups --------------- //

    // get sorted list of field groups
    var fieldGroupNames = getSortedFieldGroupNames(sortedSchema);

    // Loop through the list and make a field group context for each
    _.each(fieldGroupNames, function (fieldGroupName) {
      var fieldsForGroup = getFieldsForGroup(fieldGroupName, sortedSchema);

      if (fieldsForGroup.length > 0) {
        fieldGroups.push({
          name: fieldGroupName,
          atts: _.extend({}, atts, {fields: fieldsForGroup}),
          fields: fieldsForGroup
        });
      }
    });

    // --------------- D. Context --------------- //

    // Pass along quickForm context to autoForm context, minus a few
    // properties that are specific to quickForms.
    var qfAutoFormContext = _.omit(atts,
                                   'buttonContent',
                                   'buttonClasses',
                                   'fields',
                                   'omitFields',
                                   'id-prefix');

    // Determine whether we want to render a submit button
    var qfShouldRenderButton = (atts.buttonContent !== false && atts.type !== 'readonly' && atts.type !== 'disabled');

    var context = {
      qfAutoFormContext: qfAutoFormContext,
      atts: atts,
      qfShouldRenderButton: qfShouldRenderButton,
      fieldGroups: fieldGroups,
      grouplessFields: grouplessFieldContext
    };
    return context;
  }
});

/* Private Functions */

/**
 * Takes a schema object and returns a sorted array of field group names for it
 *
 * @param   {Object}   schemaObj Like from mySimpleSchema.schema()
 * @returns {String[]} Array of field group names
 */
function getSortedFieldGroupNames(schemaObj) {
  var names = _.map(schemaObj, function (field) {
    return field.autoform && field.autoform.group;
  });

  // Remove undefined
  names = _.compact(names);

  // Remove duplicate names
  names = _.unique(names);

  return names.sort();
}

/**
 * Returns the schema field names that belong in the group.
 *
 * @param   {String}   groupName The group name
 * @param   {Object}   schemaObj Like from mySimpleSchema.schema()
 * @returns {String[]} Array of field names (schema keys)
 */
function getFieldsForGroup(groupName, schemaObj) {
  var fields = _.map(schemaObj, function (field, fieldName) {
    return (fieldName.slice(-2) !== '.$') &&
      field.autoform &&
      field.autoform.group === groupName &&
      fieldName;
  });

  // Remove undefined
  fields = _.compact(fields);

  return fields;
}

/**
 * Returns the schema field names that don't belong to a group
 *
 * @param   {Object}   schemaObj Like from mySimpleSchema.schema()
 * @returns {String[]} Array of field names (schema keys)
 */
function getFieldsWithNoGroup(schemaObj) {
  var fields = _.map(schemaObj, function (field, fieldName) {
    return (fieldName.slice(-2) !== '.$') &&
      (!field.autoform || !field.autoform.group) &&
      fieldName;
  });

  // Remove undefined
  fields = _.compact(fields);

  return fields;
}
