import { _t, exists, addResourceBundle } from "../index";
const _ = require("underscore");
const clone = require("clone");

const KEYSEPARATOR: string = "_";

const BASE_OBJECT = "base";
const CORE_OBJECT = "core";

//translation 为默认的命名空间
const OBJECT_NS = "translation"; // objects

const objectT = function (key, lng) {
  let options: any = { lng: lng, ns: OBJECT_NS };
  if (KEYSEPARATOR === ".") {
    options.keySeparator = false;
  }
  if (exists(key, options)) {
    return _t(key, options);
  }
};

const getObjectLabelKey = function (objectName) {
  return `${objectName}__object`;
};

const getObjectFieldLabelKey = function (objectName, name) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  return `${objectName}${KEYSEPARATOR}field${KEYSEPARATOR}${name}`;
};

const getObjectFieldInlineHelpTextLabelKey = function (objectName, name) {
  let fieldLabelKey = getObjectFieldLabelKey(objectName, name);
  return `${fieldLabelKey}${KEYSEPARATOR}inlineHelpText`;
};

//TODO ${objectName}_group_${key}
const getObjectFieldGroupKey = function (objectName, name) {
  //转小写后，替换掉 % . 空格
  let groupKey = name
    .toLocaleLowerCase()
    .replace(/\%/g, "_")
    .replace(/\./g, "_")
    .replace(/\ /g, "_");
  return `${objectName}${KEYSEPARATOR}group${KEYSEPARATOR}${groupKey}`;
};

const getObjectFieldOptionsLabelKey = function (objectName, name, value) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  return `${objectName}${KEYSEPARATOR}field${KEYSEPARATOR}${name}${KEYSEPARATOR}options${KEYSEPARATOR}${value}`;
};

const getObjectActionLabelKey = function (objectName, name) {
  return `${objectName}${KEYSEPARATOR}action${KEYSEPARATOR}${name}`;
};

const getObjectListviewLabelKey = function (objectName, name) {
  return `${objectName}${KEYSEPARATOR}listview${KEYSEPARATOR}${name}`;
};

const getBaseObjectName = function (datasource) {
  if (!datasource) {
    return "";
  }
  let baseObjectName = CORE_OBJECT;
  if (datasource === "default" || datasource === "meteor") {
    baseObjectName = BASE_OBJECT;
  }
  return baseObjectName;
};

const getObjectLabel = function (lng, name, def) {
  let key = getObjectLabelKey(name);
  return objectT(key, lng) || def || "";
};

const getObjectFieldLabel = function (lng, objectName, name, def, datasource?) {
  let key = getObjectFieldLabelKey(objectName, name);
  let label = objectT(key, lng);
  if (!label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = getObjectFieldLabel(lng, baseObjectName, name, def, datasource);
    }
  }
  return label || def || "";
};

const getObjectFieldInlineHelpTextLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
) {
  let key = getObjectFieldInlineHelpTextLabelKey(objectName, name);
  let label = objectT(key, lng);
  if (!label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = getObjectFieldInlineHelpTextLabel(
        lng,
        baseObjectName,
        name,
        def,
        datasource,
      );
    }
  }
  return label || def || "";
};

const getObjectFieldGroup = function (lng, objectName, name, def) {
  let key = getObjectFieldGroupKey(objectName, name);
  return objectT(key, lng) || def || "";
};

const getObjectFieldOptionsLabel = function (
  lng,
  objectName,
  name,
  value,
  def,
  datasource?,
) {
  let key = getObjectFieldOptionsLabelKey(objectName, name, value);
  let label = objectT(key, lng);
  if (!label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = getObjectFieldOptionsLabel(
        lng,
        baseObjectName,
        name,
        value,
        def,
        datasource,
      );
    }
  }
  return label || def || "";
};

const getObjectActionLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
) {
  let key = getObjectActionLabelKey(objectName, name);
  let label = objectT(key, lng);
  if (!label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = getObjectActionLabel(lng, baseObjectName, name, def, datasource);
    }
  }
  return label || def || "";
};

const getObjectListviewLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
) {
  let key = getObjectListviewLabelKey(objectName, name);
  let label = objectT(key, lng);
  if (!label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = getObjectListviewLabel(
        lng,
        baseObjectName,
        name,
        def,
        datasource,
      );
    }
  }
  return label || def || "";
};

const getOption = function (option) {
  var foo;
  foo = option.split(":");
  if (foo.length > 1) {
    return {
      label: foo[0],
      value: foo[1],
    };
  } else {
    return {
      label: foo[0],
      value: foo[0],
    };
  }
};

const convertObject = function (object: StringMap) {
  _.forEach(object.fields, function (field, key) {
    let _options = [];
    if (field.options && _.isString(field.options)) {
      try {
        //支持\n或者英文逗号分割,
        _.forEach(field.options.split("\n"), function (option) {
          var options;
          if (option.indexOf(",")) {
            options = option.split(",");
            return _.forEach(options, function (_option) {
              return _options.push(getOption(_option));
            });
          } else {
            return _options.push(getOption(option));
          }
        });
        field.options = _options;
      } catch (error) {
        console.error("convertFieldsOptions error: ", field.options, error);
      }
    } else if (
      field.options &&
      !_.isFunction(field.options) &&
      !_.isArray(field.options) &&
      _.isObject(field.options)
    ) {
      _.each(field.options, function (v, k) {
        return _options.push({
          label: v,
          value: k,
        });
      });
      field.options = _options;
    }
  });
};

//TODO 处理继承字段base, core 的字段
export const translationI18nObject = function (
  lng: string,
  objectName: string,
  object: StringMap,
) {
  object.label = getObjectLabel(lng, objectName, object.label);
  _.each(object.fields, function (field, fieldName) {
    field.label = getObjectFieldLabel(
      lng,
      objectName,
      fieldName,
      field.label,
      object.datasource,
    );
    if (field.inlineHelpText) {
      field.inlineHelpText = getObjectFieldInlineHelpTextLabel(
        lng,
        objectName,
        fieldName,
        field.inlineHelpText,
        object.datasource,
      );
    }
    if (field.group) {
      field.group = getObjectFieldGroup(
        lng,
        objectName,
        field.group,
        field.group,
      );
    }
    if (field.options) {
      let _options = [];
      _.each(field.options, function (op) {
        if (_.has(op, "value")) {
          let _label = getObjectFieldOptionsLabel(
            lng,
            objectName,
            fieldName,
            op.value,
            op.label,
            object.datasource,
          );
          _options.push(_.extend({}, op, { label: _label }));
        } else {
          _options.push(op);
        }
      });
      field.options = _options;
    }
  });

  _.each(object.actions, function (action, actionName) {
    action.label = getObjectActionLabel(
      lng,
      objectName,
      actionName,
      action.label,
      object.datasource,
    );
  });

  _.each(object.list_views, function (list_view, viewName) {
    list_view.label = getObjectListviewLabel(
      lng,
      objectName,
      viewName,
      list_view.label,
      object.datasource,
    );
  });
};

export const addObjectsI18n = function (i18nArray) {
  _.each(i18nArray, function (item) {
    addResourceBundle(item.lng, OBJECT_NS, item.data, true, true);
  });
};

export const translationI18nObjects = function (
  lng: string,
  objects: StringMap,
) {
  _.each(objects, function (object, name) {
    translationI18nObject(lng, name, object);
  });
};

export const getObjectI18nTemplate = function (
  lng: string,
  objectName: string,
  _object: StringMap,
) {
  let object = clone(_object);
  convertObject(object);
  let template = {};
  template[getObjectLabelKey(objectName)] = getObjectLabel(
    lng,
    objectName,
    object.label,
  );
  _.each(object.fields, function (field, fieldName) {
    template[getObjectFieldLabelKey(objectName, fieldName)] =
      getObjectFieldLabel(lng, objectName, fieldName, field.label);
    if (field.inlineHelpText) {
      template[getObjectFieldInlineHelpTextLabelKey(objectName, fieldName)] =
        getObjectFieldInlineHelpTextLabel(
          lng,
          objectName,
          fieldName,
          field.inlineHelpText,
          object.datasource,
        );
    }
    if (field.group) {
      template[getObjectFieldGroupKey(objectName, field.group)] =
        getObjectFieldGroup(lng, objectName, field.group, field.group);
    }
    if (field.options) {
      _.each(field.options, function (op) {
        if (_.has(op, "value")) {
          template[
            getObjectFieldOptionsLabelKey(objectName, fieldName, op.value)
          ] = getObjectFieldOptionsLabel(
            lng,
            objectName,
            fieldName,
            op.value,
            op.label,
          );
        }
      });
    }
  });

  _.each(object.actions, function (action, actionName) {
    template[getObjectActionLabelKey(objectName, actionName)] =
      getObjectActionLabel(lng, objectName, actionName, action.label);
  });

  _.each(object.list_views, function (list_view, viewName) {
    template[getObjectListviewLabelKey(objectName, viewName)] =
      getObjectListviewLabel(lng, objectName, viewName, list_view.label);
  });

  return template;
};

export const fallbackKeys = {
  getObjectLabelKey,
  getObjectFieldLabelKey,
  getObjectFieldInlineHelpTextLabelKey,
  getObjectFieldGroupKey,
  getObjectFieldOptionsLabelKey,
  getObjectActionLabelKey,
  getObjectListviewLabelKey,
};
