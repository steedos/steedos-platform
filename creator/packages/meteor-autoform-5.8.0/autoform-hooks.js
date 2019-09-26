// Manages all hooks, supporting append/replace, get

Hooks = {
  form: {}
};

// The names of all supported hooks, excluding "before" and "after".
var hookNames = ['formToDoc', 'formToModifier', 'docToForm', 'onSubmit', 'onSuccess', 'onError',
    'beginSubmit', 'endSubmit'];

Hooks.getDefault = function() {
  var hooks = {
    before: {},
    after: {}
  };
  _.each(hookNames, function(hookName) {
    hooks[hookName] = [];
  });
  return hooks;
};

Hooks.global = Hooks.getDefault();

Hooks.addHooksToList = function addHooksToList(hooksList, hooks, replace) {
  // Add before hooks
  hooks.before && _.each(hooks.before, function autoFormBeforeHooksEach(func, type) {
    if (typeof func !== "function") {
      throw new Error("AutoForm before hook must be a function, not " + typeof func);
    }
    hooksList.before[type] = (!replace && hooksList.before[type]) ? hooksList.before[type] : [];
    hooksList.before[type].push(func);
  });

  // Add after hooks
  hooks.after && _.each(hooks.after, function autoFormAfterHooksEach(func, type) {
    if (typeof func !== "function") {
      throw new Error("AutoForm after hook must be a function, not " + typeof func);
    }
    hooksList.after[type] = (!replace && hooksList.after[type]) ? hooksList.after[type] : [];
    hooksList.after[type].push(func);
  });

  // Add all other hooks
  _.each(hookNames, function autoFormHooksEach(name) {
    if (hooks[name]) {
      if (typeof hooks[name] !== "function") {
        throw new Error("AutoForm " + name + " hook must be a function, not " + typeof hooks[name]);
      }

      if(replace) {
          hooksList[name] = [];
      }

      hooksList[name].push(hooks[name]);
    }
  });
};

Hooks.getHooks = function getHooks(formId, type, subtype) {
  var f, g;
  if (subtype) {
    f = Hooks.form[formId] && Hooks.form[formId][type] && Hooks.form[formId][type][subtype] || [];
    g = Hooks.global[type] && Hooks.global[type][subtype] || [];
  } else {
    f = Hooks.form[formId] && Hooks.form[formId][type] || [];
    g = Hooks.global[type] || [];
  }
  return f.concat(g);
};
