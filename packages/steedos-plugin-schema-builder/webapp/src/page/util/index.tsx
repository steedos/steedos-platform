// import { styleConfig ,  styleConfigLazy } from '../config'
import { layOutNodes as _layOutNodes, layOutNodesByG6 as _layOutNodesByG6 } from './layout-nodes'

export const layOutNodes = _layOutNodes
export const layOutNodesByG6 = _layOutNodesByG6

const showLable = (node) => {
  // return !node.name || node.name === node.originalKey
  //   ? node.originalKey
  //   : `${node.name} (${node.originalKey})`
  return node.name || node.originalKey
}

const eq = (fun) => {
  return fun()
}

const fields = (node, models) => {
  const list = node.fields.map((field) => {
    // const field = node.fields[k]
    const isForeign = field.typeMeta && field.typeMeta.type === 'Relation'
    const relationModel = eq(() => {
      if (isForeign && field.typeMeta.relationModel) {
        const m = models.find((a) => a.key === field.typeMeta.relationModel)
        // if (m) return m.name || m.originalKey
        return m || { name: field.typeMeta.relationModel }
      }

      return ''
    })
    return {
      ...field,
      key: field.key,
      label: showLable(field),
      type: field.type,
      originalKey: field.originalKey,
      isForeign,
      relationModelKey: relationModel && relationModel.key,
      relationModel: isForeign && relationModel ? relationModel.name || relationModel.originalKey : '',
    }
  })
  return list
}

export const updateLayout = (graph, groups) => {
  const nodes = graph.getNodes().filter((a) => !a.isSys).map((n) => {
    const model = n.getModel()
    return {
      data: model.data,
      config: model.config,
      id: model.id,
    }
  })
  const edges = graph.getEdges().map((edge) => {
    const { source, target, fieldIndex, fieldsLength } = edge.getModel()
    return {
      source,
      target,
      fieldIndex,
      fieldsLength,
    }
  })
  console.log(nodes)
  return layOutNodes(nodes, edges, groups)
}

const createSysNode = () => {

  return  {
    id: 'model-SYS-CENTER-POINT',
    type: 'circle',
    isSys: true,
    isKeySharp: true,
    size:  10,
  }

}

export const getNodes = (models, checkedKeys styleConfig) => {
  // const _key = stateConfig.model_keys.key
  const nodeRes = models
    .filter(
      (model) => (checkedKeys.indexOf('model-' + model.key) >= 0 && !model.delete && model.isShow),
    )
    .map((model, i) => {
      return {
        id: 'model-' + model.key,
        hide: checkedKeys.indexOf('model-' + model.key) === -1,
        // groupId: `module-${model.moduleKey}`,
        config: {
          width: 300,
          headerHeight: 48,
          fieldHeight: 32,
          labelSize: 14 ,
          hide: checkedKeys.indexOf('model-' + model.key) === -1,
          styleConfig,
        },
        data: {
          moduleKey: `module-${model.moduleKey}`,
          label: showLable(model),
          fields: fields(model, models),
          key: model.key,
          name: model.name || model.key,
          tag: 'aggregate',
          aggregateRoot:  model.aggregateRoot,
          aggregateModelKey: model.aggregateModelKey,
          belongAggregate: model.belongAggregate,
          nodeSize:  ((48 +  getLength(model.fields.length) * 48) / 6) *
          6  / 6,
        },
        type: 'console-model-Node',
        isKeySharp: true,
        size:   ((48 +  getLength(model.fields.length) * 48) / 6) *
        6 ,
      }
    })

  return nodeRes.length > 0 ? nodeRes.concat([createSysNode()]) : nodeRes

  // })
}

const getLength  = (length) => {
  return length >= 20 ? length : 20
 }

const noInCheckedKeys = (checkedKeys, sourceModel, targetModel) => {
   return checkedKeys.indexOf(sourceModel) === -1 || checkedKeys.indexOf(targetModel) === -1
 }

 const Relation = {
  ToOne: '1:1',
  ToMany: '1:n',
  lookup:'查找'
}

export const createLinks = (models, nodes, checkedKeys, styleConfig) => {
  const links = models.reduce((pre, model) => {
     if (!nodes.find((a) => a.id === 'model-' + model.key)) return pre
     const { aggregateRoot , aggregateModelKey , belongAggregate  } = model
     const hasArrangeLink = (aggregateModelKey) && (aggregateModelKey !== model.key)
     const arrangeModel = aggregateModelKey
     const arrangeLink = (
       hasArrangeLink &&
       nodes.find((a) => a.id === 'model-' + arrangeModel) &&
       !noInCheckedKeys(checkedKeys, ('model-' + arrangeModel), ('model-' + model.key)))  ? [
       {
        key: 'model-' + model.key + '~' + +'~' + 'model-' + arrangeModel,
        target: 'model-' + model.key,
        source: 'model-' + arrangeModel,
        arrangeLink: true,
        style : {
          lineDash: [18, 20],    // 虚线边
          lineWidth: 3,
        },
      }] : []

     const fieldLinks = Object.keys(model.fields)
      .map((k) => model.fields[k])
      .reduce((fPre, field, i) => {
        const isRelation =   field.typeMeta && field.typeMeta.type === 'Relation'
        const { originalKey } = field
        if (isRelation && !(field.typeMeta.relationModel === 'base_User' && (['createdBy', 'updatedBy'].indexOf(originalKey) >= 0))) {
          const sourceModelNode = null
          const targetModelNode = null
          const sourceModel = sourceModelNode
            ? sourceModelNode.getModel()
            : nodes.find((a) => a.id === 'model-' + model.key)
          const targetModel = targetModelNode
            ? targetModelNode.getModel()
            : nodes.find(
                (a) => a.id === 'model-' + field.typeMeta.relationModel,
              )
          if (!sourceModel || !targetModel) return fPre
          if (
            checkedKeys.indexOf(sourceModel.id) === -1 ||
            checkedKeys.indexOf(targetModel.id) === -1
          )
            return fPre
          const isTo = targetModel.x > sourceModel.x
          const l = Object.keys(model.fields).length
          const sourceAnchor = !isTo ? (i + 2) : (2 + i + l)
          const targetAnchor = (isTo ? 0 : 1)
          return [
            ...fPre,
            {
              key:
                'model-' +
                model.key +
                '~' +
                +'~' +
                'model-' +
                field.typeMeta.relationModel,
              source: 'model-' + model.key,
              target: 'model-' + field.typeMeta.relationModel,
              sourceAnchor,
              // targetAnchor: sourceAnchor,
              // targetAnchor:  model.key === field.typeMeta.relationModel ? (sourceAnchor - 1) : undefined,
               targetAnchor:  model.key === field.typeMeta.relationModel ? (sourceAnchor - 1) : targetAnchor,
               self : model.key === field.typeMeta.relationModel,
              // targetAnchor,
              fieldIndex: i,
              fieldsLength: l,
              // data: field,
              tooltip: `<div>从 <span class='text'>${sourceModel?.data?.label}</span> 到 <span class='text'>${targetModel?.data?.label}</span> ${Relation[field.type]||field.type} 关系</div>`

              type:
                model.key === field.typeMeta.relationModel
                  ? 'loop'
                  :
                  'console-line',
              // color: 'black',
              style: styleConfig.default.edge,
              styleConfig,
              // label: model.key === field.typeMeta.relationModel ? undefined : field.type,
              // labelAutoRotate: true,
              loopCfg: {
                // position: 'top',
                clockwise: true, // dist: 200,
                dist: 100,
              },
            },
          ]
        } else return fPre
      }, [])

     return [
      ...pre,
      ...arrangeLink,
      ...fieldLinks,
    ]
  }, [])
  return links
}
