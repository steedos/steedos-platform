import * as _ from "underscore";
import { SteedosTranslationPrefixKeys } from "./";
import { _t, exists, addResourceBundle } from "../index";
import { convertObject } from "./index";
import { fallbackKeys } from "../i18n/i18n";
import { cloneDeep } from "lodash";
const crypto = require("crypto");
import { getCacher } from "@steedos/cachers";

const Cacher = getCacher("lru.translations.objects");

function getMD5(data) {
  let md5 = crypto.createHash("md5");
  return md5.update(data).digest("hex");
}

const getCacherKey = function (lng, objectConfig) {
  return `${lng}_${objectConfig.name}_${getMD5(JSON.stringify(objectConfig))}`;
};

const clone = require("clone");

const KEYSEPARATOR: string = ".";

const BASE_OBJECT = "base";
const CORE_OBJECT = "core";

const OBJECT_NS = "translation";

const OBJECT_KEY = "object";
const FIELD_KEY = "field";
const LISTVIEW_KEY = "listview";
const ACTION_KEY = "action";

const translation = function (key, lng) {
  let options: any = { lng: lng, ns: OBJECT_NS };
  if (KEYSEPARATOR === ".") {
    options.keySeparator = false;
  }
  if (exists(key, options)) {
    return _t(key, options);
  }
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

const getPrefix = function (key?) {
  switch (key) {
    case OBJECT_KEY:
      return SteedosTranslationPrefixKeys.Object;
    case FIELD_KEY:
      return SteedosTranslationPrefixKeys.Field;
    case LISTVIEW_KEY:
      return SteedosTranslationPrefixKeys.Listview;
    case ACTION_KEY:
      return SteedosTranslationPrefixKeys.Action;
    default:
      return "CustomLabels";
  }
};

const getObjectcustomLabelKey = function (key) {
  const prefix = getPrefix();
  //objectName,
  return [prefix, key].join(KEYSEPARATOR);
};

const getObjectLabelKey = function (objectName) {
  const prefix = getPrefix(OBJECT_KEY);
  return [prefix, objectName, "label"].join(KEYSEPARATOR);
};

const getObjectDescriptionKey = function (objectName) {
  const prefix = getPrefix(OBJECT_KEY);
  return [prefix, objectName, "description"].join(KEYSEPARATOR);
};

const getFieldLabelKey = function (objectName, name) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  const prefix = getPrefix(FIELD_KEY);
  return [prefix, objectName, name, "label"].join(KEYSEPARATOR);
};

const getFieldHelpKey = function (objectName, name) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  const prefix = getPrefix(FIELD_KEY);
  return [prefix, objectName, name, "help"].join(KEYSEPARATOR);
};
const getFieldDescriptionKey = function (objectName, name) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  const prefix = getPrefix(FIELD_KEY);
  return [prefix, objectName, name, "description"].join(KEYSEPARATOR);
};

const getFieldGroupKey = function (objectName, name) {
  //转小写后，替换掉 % . 空格
  let groupKey = name
    .toLocaleLowerCase()
    .replace(/\%/g, "_")
    .replace(/\./g, "_")
    .replace(/\ /g, "_");
  const prefix = getPrefix(FIELD_KEY);
  return [prefix, objectName, "group", groupKey].join(KEYSEPARATOR);
};

const getFieldOptionsLabelKey = function (objectName, name, value) {
  if (name) {
    name = name.replace(/\./g, "_");
  }
  const prefix = getPrefix(FIELD_KEY);
  return [prefix, objectName, name, "options", value].join(KEYSEPARATOR);
};

const getActionLabelKey = function (objectName, name) {
  const prefix = getPrefix(ACTION_KEY);
  return [prefix, objectName, name].join(KEYSEPARATOR);
};

const getListviewLabelKey = function (objectName, name) {
  const prefix = getPrefix(LISTVIEW_KEY);
  return [prefix, objectName, name].join(KEYSEPARATOR);
};

export const translationObjectLabel = function (lng, name, def) {
  let key = getObjectLabelKey(name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectLabelKey(name);
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  return translation(keys, lng) || def || "";
};

const translationObjectDescription = function (lng, name, def) {
  let key = getObjectDescriptionKey(name);
  return translation(key, lng) || def || "";
};

const translationFieldLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getFieldLabelKey(objectName, name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectFieldLabelKey(objectName, name);
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationFieldLabel(lng, baseObjectName, name, def, datasource);
    }
  }
  return label || def || "";
};

const translationFieldHelp = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getFieldHelpKey(objectName, name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectFieldInlineHelpTextLabelKey(
    objectName,
    name,
  );
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationFieldHelp(lng, baseObjectName, name, def, datasource);
    }
  }
  return label || def || "";
};

const translationFieldDescription = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getFieldDescriptionKey(objectName, name);
  let keys = [key];
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationFieldDescription(
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

const translationFieldGroup = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getFieldGroupKey(objectName, name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectFieldGroupKey(objectName, name);
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);

  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationFieldGroup(lng, baseObjectName, name, def, datasource);
    }
  }

  return label || def || "";
};

const translationFieldOptionsLabel = function (
  lng,
  objectName,
  name,
  value,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getFieldOptionsLabelKey(objectName, name, value);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectFieldOptionsLabelKey(
    objectName,
    name,
    value,
  );
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationFieldOptionsLabel(
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

const translationActionLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getActionLabelKey(objectName, name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectActionLabelKey(objectName, name);
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationActionLabel(
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

const translationListviewLabel = function (
  lng,
  objectName,
  name,
  def,
  datasource?,
  ignoreBase?,
) {
  let key = getListviewLabelKey(objectName, name);
  let keys = [key];
  let fallbackKey = fallbackKeys.getObjectListviewLabelKey(objectName, name);
  if (fallbackKey) {
    keys.push(fallbackKey);
  }
  let label = translation(keys, lng);
  if (ignoreBase != true && !label) {
    let baseObjectName = getBaseObjectName(datasource);
    if (
      baseObjectName &&
      objectName != BASE_OBJECT &&
      objectName != CORE_OBJECT
    ) {
      label = translationListviewLabel(
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

export const translationObject = function (
  lng: string,
  objectName: string,
  object: StringMap,
  convert?: boolean,
  ignoreBase = false,
) {
  const cacheKey = getCacherKey(lng, object);
  const fromCacher = Cacher.get(cacheKey);
  if (fromCacher) {
    return Object.assign(object, cloneDeep(fromCacher));
  }

  if (convert) {
    convertObject(object);
  }
  object.label = translationObjectLabel(lng, objectName, object.label);
  object.description = translationObjectDescription(
    lng,
    objectName,
    object.description,
  );
  _.each(object.fields, function (field, fieldName) {
    field.label = translationFieldLabel(
      lng,
      objectName,
      fieldName,
      field.label,
      object.datasource,
      ignoreBase,
    );
    field.inlineHelpText = translationFieldHelp(
      lng,
      objectName,
      fieldName,
      field.inlineHelpText,
      object.datasource,
      ignoreBase,
    );
    field.description = translationFieldDescription(
      lng,
      objectName,
      fieldName,
      field.description,
      object.datasource,
      ignoreBase,
    );
    if (field.group) {
      field.group = translationFieldGroup(
        lng,
        objectName,
        field.group,
        field.group,
        object.datasource,
        ignoreBase,
      );
    }
    if (field.options) {
      let _options = [];
      _.each(field.options, function (op) {
        if (_.has(op, "value")) {
          let _label = translationFieldOptionsLabel(
            lng,
            objectName,
            fieldName,
            op.value,
            op.label,
            object.datasource,
            ignoreBase,
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
    action.label = translationActionLabel(
      lng,
      objectName,
      actionName,
      action.label,
      object.datasource,
      ignoreBase,
    );
  });

  _.each(object.list_views, function (list_view, viewName) {
    list_view.label = translationListviewLabel(
      lng,
      objectName,
      viewName,
      list_view.label,
      object.datasource,
      ignoreBase,
    );
  });
  Cacher.set(cacheKey, cloneDeep(object));
};

export const translationObjects = function (lng: string, objects: StringMap) {
  _.each(objects, function (object, name) {
    translationObject(lng, name, object);
  });
};

export const getObjectTranslationTemplate = function (
  lng: string,
  objectName: string,
  _object: StringMap,
) {
  let object = clone(_object);
  convertObject(object);
  let template = {};
  template[getObjectLabelKey(objectName)] = translationObjectLabel(
    lng,
    objectName,
    object.label,
  );
  template[getObjectDescriptionKey(objectName)] = translationObjectDescription(
    lng,
    objectName,
    object.description,
  );
  _.each(object.fields, function (field, fieldName) {
    template[getFieldLabelKey(objectName, fieldName)] = translationFieldLabel(
      lng,
      objectName,
      fieldName,
      field.label,
    );
    if (field.inlineHelpText) {
      template[getFieldHelpKey(objectName, fieldName)] = translationFieldHelp(
        lng,
        objectName,
        fieldName,
        field.inlineHelpText,
        object.datasource,
      );
    }
    if (field.description) {
      template[getFieldDescriptionKey(objectName, fieldName)] =
        translationFieldDescription(
          lng,
          objectName,
          fieldName,
          field.description,
          object.datasource,
        );
    }
    if (field.group) {
      template[getFieldGroupKey(objectName, field.group)] =
        translationFieldGroup(
          lng,
          objectName,
          field.group,
          field.group,
          object.datasource,
        );
    }
    if (field.options) {
      _.each(field.options, function (op) {
        if (_.has(op, "value")) {
          template[getFieldOptionsLabelKey(objectName, fieldName, op.value)] =
            translationFieldOptionsLabel(
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
    template[getActionLabelKey(objectName, actionName)] =
      translationActionLabel(lng, objectName, actionName, action.label);
  });

  _.each(object.list_views, function (list_view, viewName) {
    template[getListviewLabelKey(objectName, viewName)] =
      translationListviewLabel(lng, objectName, viewName, list_view.label);
  });

  return template;
};

function convertObjectTranslation(objectTranslation, filePath) {
  let object = clone(objectTranslation);
  convertObject(object);
  let template = {};
  let objectName = object.name;
  if (!objectName) {
    console.error("Error: Invalid objectTranslation:" + filePath);
  }
  template[getObjectLabelKey(objectName)] = object.label;
  template[getObjectDescriptionKey(objectName)] = object.description;
  _.each(object.fields, function (field, fieldName) {
    template[getFieldLabelKey(objectName, fieldName)] = field.label;
    if (field.help) {
      template[getFieldHelpKey(objectName, fieldName)] = field.help;
    }
    if (field.description) {
      template[getFieldDescriptionKey(objectName, fieldName)] =
        field.description;
    }
    if (field.options) {
      _.each(field.options, function (op) {
        if (_.has(op, "value")) {
          template[getFieldOptionsLabelKey(objectName, fieldName, op.value)] =
            op.label;
        }
      });
    }
  });

  _.each(object.groups, function (value, key) {
    template[getFieldGroupKey(objectName, key)] = value;
  });

  _.each(object.actions, function (action, actionName) {
    template[getActionLabelKey(objectName, actionName)] = action.label;
  });

  _.each(object.listviews, function (list_view, viewName) {
    template[getListviewLabelKey(objectName, viewName)] = list_view.label;
  });

  _.each(object.CustomLabels, function (value, key) {
    template[getObjectcustomLabelKey(key)] = value;
  });
  return template;
}

export const addObjectsTranslation = function (i18nArray) {
  _.each(i18nArray, function (item) {
    let translation = convertObjectTranslation(item.data, item.__filename);
    addResourceBundle(item.lng, OBJECT_NS, translation, true, true);
  });
};
