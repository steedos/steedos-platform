
import {  arrangeShow, init, load , modelEdit, modelReducers, onExpand  } from './reducer'
import { initStyle } from './style'
export interface IDict<T> {
  [name: string]: T
}

const fieldMap = (m) => ({
  key: m.key,
  name: m.name,
  moduleKey: m.moduleKey,
  fields: Object.entries(m.fields).map(([k, v]: [string, any]) => ({
    type: v.type,
    key: v.key,
    name: v.name,
    originalKey: v.originalKey,
    required: v.required,

    typeMeta: v.typeMeta && {
      type: v.typeMeta.type,
      relationModel: v.typeMeta.relationModel,
    },
  })),
  originalKey: m.originalKey,
  aggregateRoot: m.aggregateRoot,
  belongAggregate: m.belongAggregate,
  // aggregateRoot:  m.aggregateRoot,
  aggregateModelKey: m.aggregateModelKey,
  type: m.type,
})

export default (({
  namespace,
}) => {
  const { style, colors } = initStyle({primaryColor: 'black'})
  const state = {
     modules: [],
     models: [],
     showModel: null,
     lockMinZoom: false,
     showInsertModel: null,
     currentModel: null,
     expandedKeys: [],
     checkedKeys: [],
     centerModel: null,
     search: null,
     layouting : false,
     isArrangeLayout: false,
     fieldMap,
     showNameOrLabel: false,
     config : {
      style,
      namespace: 'erd',
      topHeight: 48,
      colors,
     },
    }
  return {
    namespace,
    state,
    reducers: {
      onExpand,
      modelEdit,
      ...modelReducers,
      arrangeShow,
      init,
      load,
    },
  }
})
