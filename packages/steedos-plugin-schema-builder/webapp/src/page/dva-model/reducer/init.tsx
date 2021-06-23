import Immer from 'immer'
import { initStyle } from '../style'

// const modules_name = 'modules'
// const models_name = 'models'
// const model_key = 'key'
// const module_key = 'key'

export const init = (ss, {
  models,
  modules,
  currentModel,
  primaryColor,
}) => {
  // tslint:disable-next-line: ban-comma-operator
  return Immer(ss, (s) => {
    s.currentModel = currentModel

    if (models) {
      s.models = models
      s.checkedKeys = models.map((m) => 'model-' + m.key)
    }

    if (modules) {
      s.modules = modules
      s.expandedKeys = ['allmodels', ...modules.map((module) => 'module-' + module.key)]
    }
    if (primaryColor) {
       const { style , colors } = initStyle({primaryColor})
       s.config.style = style
       s.config.colors = colors
    }
  })
}

export const load = (ss, {
  models,
  modules,
  currentModel,
  primaryColor,
}) => {
  // tslint:disable-next-line: ban-comma-operator
  return Immer(ss, (s) => {
    s.currentModel = currentModel

    if (models) {
      s.models = [...s.models, ...models]
      s.checkedKeys = [...models.map((m) => 'model-' + m.key), ...s.checkedKeys]
    }

    if (modules) {
      s.modules = [...s.modules, ...modules]
      s.expandedKeys = [...s.expandedKeys, 'allmodels', ...modules.map((module) => 'module-' + module.key)]
    }
    if (primaryColor) {
       const { style , colors } = initStyle({primaryColor})
       s.config.style = style
       s.config.colors = colors
    }
  })
}
